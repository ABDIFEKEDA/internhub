"use client";

import { useState } from "react";
import ApplyInternshipDialog from "../../../../components/popup/ApplicationPopup";
import { UniversitySidebar } from "@/components/sidebar/UniversitySideBar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Users, 
  CheckCircle, 
  XCircle, 
  Clock,
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
  Download,
  Eye
} from "lucide-react";
import type { Application } from "../../../types/Application";

export default function ApplicationsPage() {
  const [applications, setApplications] = useState<Application[]>([
    {
      id: 1,
      student: "John Smith",
      company: "Tech Corp Inc.",
      status: "Pending",
      fieldOfStudy: "Computer Science",
      year: "2024",
      github: "https://github.com/john",
      linkedin: "https://linkedin.com/in/john",
      cv: new File([], "john_cv.pdf"),
    },
    {
      id: 2,
      student: "Sarah Johnson",
      company: "Data Systems Ltd",
      status: "Pending",
      fieldOfStudy: "Data Science",
      year: "2024",
      github: "https://github.com/sarah",
      linkedin: "https://linkedin.com/in/sarah",
      cv: new File([], "sarah_cv.pdf"),
    },
    {
      id: 3,
      student: "Mike Chen",
      company: "Web Solutions",
      status: "Rejected",
      fieldOfStudy: "Software Engineering",
      year: "2023",
      github: "https://github.com/mike",
      linkedin: "https://linkedin.com/in/mike",
      cv: new File([], "mike_cv.pdf"),
    },
  ]);

  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const itemsPerPage = 5;

  // Add new application from popup
  function addApplication(application: Application) {
    setApplications((prev) => [...prev, application]);
  }

  // Badge color variant
  function badgeVariant(status: Application["status"]): "default" | "destructive" | "secondary" {
    if (status === "Pending") return "default";
    if (status === "Rejected") return "destructive";
    return "secondary";
  }

  // Statistics
  const totalApplications = applications.length;
  const acceptedApplications = applications.filter(app => app.status === "Accepted").length;
  const rejectedApplications = applications.filter(app => app.status === "Rejected").length;
  const pendingApplications = applications.filter(app => app.status === "Pending").length;

  // Filtering
  const filteredApplications = applications.filter(app => {
    const matchesStatus = statusFilter === "all" || app.status === statusFilter;
    const matchesSearch = app.student.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          app.company.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  // Pagination
  const totalPages = Math.ceil(filteredApplications.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedApplications = filteredApplications.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="flex">
      {/* Sidebar */}
      <UniversitySidebar />

      {/* Main Content */}
      <div className="flex-1 p-6 space-y-6">
       
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800 bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent">
              Student Applications
            </h1>
            <p className="text-gray-600">Manage and review internship applications</p>
          </div>
          <ApplyInternshipDialog onSubmit={addApplication} />
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="border-2 border-blue-100 bg-gradient-to-br from-blue-50 to-white">
            <CardContent className="p-6 flex justify-between items-center">
              <div>
                <p className="text-sm text-gray-600">Total Applications</p>
                <p className="text-2xl font-bold text-gray-800">{totalApplications}</p>
              </div>
              <div className="p-3 rounded-xl bg-gradient-to-r from-blue-100 to-blue-200">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 border-green-100 bg-gradient-to-br from-green-50 to-white">
            <CardContent className="p-6 flex justify-between items-center">
              <div>
                <p className="text-sm text-gray-600">Accepted</p>
                <p className="text-2xl font-bold text-gray-800">{acceptedApplications}</p>
              </div>
              <div className="p-3 rounded-xl bg-gradient-to-r from-green-100 to-green-200">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 border-red-100 bg-gradient-to-br from-red-50 to-white">
            <CardContent className="p-6 flex justify-between items-center">
              <div>
                <p className="text-sm text-gray-600">Rejected</p>
                <p className="text-2xl font-bold text-gray-800">{rejectedApplications}</p>
              </div>
              <div className="p-3 rounded-xl bg-gradient-to-r from-red-100 to-red-200">
                <XCircle className="h-6 w-6 text-red-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 border-orange-100 bg-gradient-to-br from-orange-50 to-white">
            <CardContent className="p-6 flex justify-between items-center">
              <div>
                <p className="text-sm text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-gray-800">{pendingApplications}</p>
              </div>
              <div className="p-3 rounded-xl bg-gradient-to-r from-orange-100 to-orange-200">
                <Clock className="h-6 w-6 text-orange-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="border-2 border-gray-100">
          <CardContent className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search students or companies..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                />
              </div>
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-gray-500" />
                <select 
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                >
                  <option value="all">All Status</option>
                  <option value="Pending">Pending</option>
                  <option value="Accepted">Accepted</option>
                  <option value="Rejected">Rejected</option>
                </select>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button variant="outline" className="border-gray-300">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
              <span className="text-sm text-gray-600">
                Showing {filteredApplications.length} of {applications.length} applications
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Table */}
        <Card className="border-2 border-gray-100 overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-gradient-to-r from-gray-50 to-gray-100">
                <TableHead>Student</TableHead>
                <TableHead>Company</TableHead>
                <TableHead>Field of Study</TableHead>
                <TableHead>Year</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {paginatedApplications.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-12">
                    <div className="flex flex-col items-center justify-center">
                      <Users className="h-12 w-12 text-gray-300 mb-4" />
                      <p className="text-gray-500 text-lg">No applications found</p>
                      <p className="text-gray-400">Try adjusting your search or filters</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                paginatedApplications.map((app) => (
                  <TableRow key={app.id} className="hover:bg-orange-50/30">
                    <TableCell>
                      <div className="font-medium text-gray-800">{app.student}</div>
                      <div className="text-sm text-gray-500">ID: {app.id}</div>
                    </TableCell>
                    <TableCell className="font-medium text-gray-700">{app.company}</TableCell>
                    <TableCell className="text-gray-600">{app.fieldOfStudy}</TableCell>
                    <TableCell>
                      <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                        Year {app.year}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={badgeVariant(app.status)}
                        className={`font-semibold px-3 py-1 ${
                          app.status === "Pending" 
                            ? "bg-gradient-to-r from-green-500 to-emerald-600" 
                            : app.status === "Rejected"
                            ? "bg-gradient-to-r from-red-500 to-rose-600"
                            : "bg-gradient-to-r from-orange-500 to-amber-600"
                        }`}
                      >
                        {app.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button size="sm" variant="outline" className="border-orange-200 hover:bg-orange-50">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </Card>

        {/* Pagination */}
        {filteredApplications.length > 0 && (
          <Card className="border-2 border-gray-100">
            <CardContent className="p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="text-sm text-gray-600">
                Showing <span className="font-semibold">{startIndex + 1}</span> to{" "}
                <span className="font-semibold">
                  {Math.min(startIndex + itemsPerPage, filteredApplications.length)}
                </span>{" "}
                of <span className="font-semibold">{filteredApplications.length}</span> applications
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="border-gray-300"
                >
                  <ChevronLeft className="h-4 w-4" />
                  Previous
                </Button>

                <div className="flex items-center gap-1">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum;
                    if (totalPages <= 5) pageNum = i + 1;
                    else if (currentPage <= 3) pageNum = i + 1;
                    else if (currentPage >= totalPages - 2) pageNum = totalPages - 4 + i;
                    else pageNum = currentPage - 2 + i;

                    return (
                      <Button
                        key={pageNum}
                        variant={currentPage === pageNum ? "default" : "outline"}
                        size="sm"
                        onClick={() => setCurrentPage(pageNum)}
                        className={`min-w-[40px] ${
                          currentPage === pageNum 
                            ? "bg-gradient-to-r from-orange-500 to-orange-600" 
                            : "border-gray-300"
                        }`}
                      >
                        {pageNum}
                      </Button>
                    );
                  })}
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="border-gray-300"
                >
                  Next
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
