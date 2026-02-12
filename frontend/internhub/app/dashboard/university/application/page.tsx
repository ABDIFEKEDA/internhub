"use client";

import { useState, useEffect } from "react";
import ApplyInternshipDialog from "../../../../components/popup/ApplicationPopup";
import { UniversitySidebar } from "@/components/sidebar/UniversitySideBar";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import {
  Users, CheckCircle, XCircle, Clock, Search, Filter,
  ChevronLeft, ChevronRight, Eye, Mail, GraduationCap,
  Github, Linkedin, FileText, Download, Calendar,
  Building2, UserCircle, Loader2, AlertCircle
} from "lucide-react";
import type { Application } from "../../../types/Application";

interface BackendApplication {
  id: string; first_name: string; last_name: string; department: string;
  academic_year: string; email: string; github_link: string; linkedin_link: string;
  cv_url: string; resume_url: string; company_id: string; status: string;
  created_at: string; university_id: string;
}

export default function ApplicationsPage() {
  const [apps, setApps] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [totalPages, setTotalPages] = useState(1);
  const [totalApps, setTotalApps] = useState(0);
  const [selectedApp, setSelectedApp] = useState<Application | null>(null);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const limit = 5;

  useEffect(() => { fetchApps(); }, [page, statusFilter, search]);

  const fetchApps = async () => {
    try {
      setLoading(true); setError(null);
      const token = localStorage.getItem('accessToken') || localStorage.getItem('token') || localStorage.getItem('authToken');
      if (!token) { setError("Authentication required"); setLoading(false); return; }

      const params = new URLSearchParams({ page: page.toString(), limit: limit.toString() });
      if (statusFilter !== "all") params.append('status', statusFilter.toUpperCase());
      if (search) params.append('search', search);

      const res = await fetch(`http://localhost:5000/api/applications/university?${params}`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });

      if (!res.ok) throw new Error('Failed to fetch');
      const data = await res.json();

      setApps(data.applications.map((app: BackendApplication) => ({
        id: app.id,
        student: `${app.first_name} ${app.last_name}`,
        firstName: app.first_name,
        lastName: app.last_name,
        company: "Tech Corp Inc.",
        fieldOfStudy: app.department,
        year: app.academic_year,
        github: app.github_link,
        linkedin: app.linkedin_link,
        cv: app.cv_url,
        resume: app.resume_url,
        email: app.email,
        status: app.status ? app.status.charAt(0).toUpperCase() + app.status.slice(1).toLowerCase() : "Pending",
        submittedAt: app.created_at,
        company_id: app.company_id,
      })));
      setTotalPages(data.pagination.pages);
      setTotalApps(data.pagination.total);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load");
    } finally { setLoading(false); }
  };

  // ✅ FIXED: Add application with proper status formatting
  const addApplication = (app: Application) => {
    // Ensure status is properly formatted (Pending, not PENDING)
    const formattedApp = {
      ...app,
      status: app.status === "PENDING" ? "Pending" : 
              app.status === "ACCEPTED" ? "Accepted" : 
              app.status === "REJECTED" ? "Rejected" : 
              app.status || "Pending"
    };
    setApps(prev => [formattedApp, ...prev]);
    setTotalApps(prev => prev + 1);
  };

  const viewApplication = (app: Application) => {
    setSelectedApp(app);
    setIsViewOpen(true);
  };

  const downloadFile = async (url: string, name: string) => {
    try {
      const token = localStorage.getItem('accessToken');
      const res = await fetch(`http://localhost:5000${url}`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Download failed');
      const blob = await res.blob();
      const a = document.createElement('a');
      a.href = window.URL.createObjectURL(blob);
      a.download = name;
      a.click();
    } catch (err) { console.error("Download error:", err); }
  };

  const getStatusBadge = (status: string) => {
    const s = status?.toLowerCase() || '';
    if (s === 'pending') return <Badge className="bg-amber-100 text-amber-700 border-amber-200 px-3 py-1"><Clock className="h-3 w-3 mr-1" />Pending</Badge>;
    if (s === 'accepted') return <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200 px-3 py-1"><CheckCircle className="h-3 w-3 mr-1" />Accepted</Badge>;
    if (s === 'rejected') return <Badge className="bg-rose-100 text-rose-700 border-rose-200 px-3 py-1"><XCircle className="h-3 w-3 mr-1" />Rejected</Badge>;
    return <Badge className="bg-gray-100 text-gray-700 border-gray-200 px-3 py-1">{status || "Pending"}</Badge>;
  };

  const formatDate = (date: string) => new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });

  // ✅ FIXED: Stats now correctly count applications
  const stats = {
    total: totalApps,
    accepted: apps.filter(a => a.status?.toLowerCase() === "accepted").length,
    pending: apps.filter(a => a.status?.toLowerCase() === "pending").length,
    rejected: apps.filter(a => a.status?.toLowerCase() === "rejected").length,
  };

  return (
    <div className="flex bg-gray-50 min-h-screen">
      <UniversitySidebar />
      <div className="flex-1 p-8 space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Student Applications</h1>
            <p className="text-gray-500 mt-1">Manage and review internship applications</p>
          </div>
          <ApplyInternshipDialog onSubmit={addApplication} />
        </div>

        {/* Stats Cards - FIXED: Using dynamic color classes */}
        <div className="grid grid-cols-4 gap-5">
          <Card className="border-none shadow-sm">
            <CardContent className="p-6 flex justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Total</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{stats.total}</p>
              </div>
              <div className="p-3 bg-blue-50 rounded-xl">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-none shadow-sm">
            <CardContent className="p-6 flex justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Accepted</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{stats.accepted}</p>
              </div>
              <div className="p-3 bg-emerald-50 rounded-xl">
                <CheckCircle className="h-6 w-6 text-emerald-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-none shadow-sm">
            <CardContent className="p-6 flex justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Pending</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{stats.pending}</p>
              </div>
              <div className="p-3 bg-amber-50 rounded-xl">
                <Clock className="h-6 w-6 text-amber-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-none shadow-sm">
            <CardContent className="p-6 flex justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Rejected</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{stats.rejected}</p>
              </div>
              <div className="p-3 bg-rose-50 rounded-xl">
                <XCircle className="h-6 w-6 text-rose-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="border-none shadow-sm">
          <CardContent className="p-6">
            <div className="flex justify-between items-center">
              <div className="flex gap-3">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <input
                    placeholder="Search name or email..."
                    value={search}
                    onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                    className="pl-10 pr-4 py-2.5 border rounded-lg w-72 focus:ring-2 focus:ring-orange-500"
                  />
                </div>
                <select
                  value={statusFilter}
                  onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
                  className="border rounded-lg px-3 py-2.5 bg-white focus:ring-2 focus:ring-orange-500"
                >
                  <option value="all">All Status</option>
                  <option value="PENDING">Pending</option>
                  <option value="ACCEPTED">Accepted</option>
                  <option value="REJECTED">Rejected</option>
                </select>
              </div>
              <span className="text-sm text-gray-500">
                Showing {apps.length} of {totalApps} applications
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Loading/Error/Table */}
        {loading ? (
          <Card><CardContent className="p-12 flex flex-col items-center"><Loader2 className="h-8 w-8 animate-spin text-orange-500 mb-4" /><p>Loading...</p></CardContent></Card>
        ) : error ? (
          <Card><CardContent className="p-12 flex flex-col items-center">
            <AlertCircle className="h-8 w-8 text-red-500 mb-4" />
            <p className="text-lg font-semibold mb-2">Failed to load</p>
            <p className="text-gray-500 mb-4">{error}</p>
            <Button onClick={fetchApps} className="bg-orange-500">Try Again</Button>
          </CardContent></Card>
        ) : (
          <Card className="border-none shadow-sm overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50">
                  <TableHead className="font-semibold">Student</TableHead>
                  <TableHead className="font-semibold">Department</TableHead>
                  <TableHead className="font-semibold">Status</TableHead>
                  <TableHead className="font-semibold text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {apps.length === 0 ? (
                  <TableRow><TableCell colSpan={4} className="text-center py-12">
                    <Users className="h-8 w-8 text-gray-300 mx-auto mb-2" />
                    <p className="text-gray-500">No applications found</p>
                  </TableCell></TableRow>
                ) : (
                  apps.map(app => (
                    <TableRow key={app.id} className="hover:bg-orange-50/30">
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-100 to-orange-200 flex items-center justify-center">
                            <span className="text-orange-700 font-semibold">{app.firstName?.[0]}{app.lastName?.[0]}</span>
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{app.student}</p>
                            <p className="text-xs text-gray-500 flex items-center gap-1"><Mail className="h-3 w-3" />{app.email}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <GraduationCap className="h-4 w-4 text-gray-400" />
                          <div>
                            <p className="text-sm font-medium">{app.fieldOfStudy}</p>
                            <p className="text-xs text-gray-500">{app.year}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{getStatusBadge(app.status)}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm" onClick={() => viewApplication(app)} className="hover:bg-orange-100">
                          <Eye className="h-4 w-4 mr-1" />View
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
            {totalPages > 1 && (
              <div className="px-6 py-4 border-t flex justify-between items-center">
                <span className="text-sm text-gray-500">Page {page} of {totalPages}</span>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => setPage(p => Math.max(p - 1, 1))} disabled={page === 1}>
                    <ChevronLeft className="h-4 w-4 mr-1" />Previous
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => setPage(p => Math.min(p + 1, totalPages))} disabled={page === totalPages}>
                    Next<ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                </div>
              </div>
            )}
          </Card>
        )}

        {/* View Modal - Add hidden DialogTitle for accessibility */}
        <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
          <DialogContent className="max-w-4xl p-0 overflow-hidden rounded-2xl">
            <DialogHeader className="sr-only">
              <DialogTitle>Application Details</DialogTitle>
            </DialogHeader>
            {selectedApp && (
              <div className="flex flex-col h-full max-h-[85vh]">
                {/* Header - same as before */}
                <div className="bg-gradient-to-r from-orange-600 to-amber-500 px-8 py-5 text-white">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-4">
                      <div className="w-20 h-20 rounded-full bg-white/20 backdrop-blur flex items-center justify-center text-3xl font-bold border-4 border-white/30">
                        {selectedApp.firstName?.[0]}{selectedApp.lastName?.[0]}
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold">{selectedApp.student}</h2>
                        <div className="flex gap-2 mt-1">
                          <Badge className="bg-white/20 text-white border-white/30">{selectedApp.fieldOfStudy}</Badge>
                          <Badge className="bg-white/20 text-white border-white/30">{selectedApp.year}</Badge>
                        </div>
                      </div>
                    </div>
                    <div className="bg-white rounded-lg px-4 py-1.5 shadow-lg">
                      {getStatusBadge(selectedApp.status)}
                    </div>
                  </div>
                </div>

                {/* Rest of modal - unchanged */}
                <div className="overflow-y-auto flex-1 px-8 py-5 space-y-5">
                  {/* ... keep all your existing modal content ... */}
                  <div className="grid grid-cols-3 gap-4">
                    {[
                      { icon: Mail, label: "Email", value: selectedApp.email, href: `mailto:${selectedApp.email}` },
                      { icon: Calendar, label: "Submitted", value: formatDate(selectedApp.submittedAt || "") },
                      { icon: Building2, label: "Company", value: selectedApp.company },
                    ].map(({ icon: Icon, label, value, href }) => (
                      <div key={label} className="bg-orange-50/50 p-4 rounded-xl border border-orange-100">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-white rounded-lg shadow-sm"><Icon className="h-4 w-4 text-orange-600" /></div>
                          <div>
                            <p className="text-xs text-gray-500">{label}</p>
                            {href ? <a href={href} className="text-sm font-semibold text-gray-800 hover:text-orange-600">{value}</a>
                              : <p className="text-sm font-semibold text-gray-800">{value}</p>}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="bg-white rounded-xl border p-5">
                    <h3 className="font-semibold flex items-center gap-2 mb-4"><GraduationCap className="h-4 w-4 text-orange-600" />Academic</h3>
                    <div className="grid grid-cols-4 gap-4">
                      {[
                        { label: "Department", value: selectedApp.fieldOfStudy },
                        { label: "Year", value: selectedApp.year },
                        { label: "First Name", value: selectedApp.firstName },
                        { label: "Last Name", value: selectedApp.lastName },
                      ].map(({ label, value }) => (
                        <div key={label} className="bg-gray-50 p-3 rounded-lg">
                          <p className="text-xs text-gray-500">{label}</p>
                          <p className="font-medium text-gray-800">{value}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {(selectedApp.github || selectedApp.linkedin) && (
                    <div className="bg-white rounded-xl border p-5">
                      <h3 className="font-semibold flex items-center gap-2 mb-4"><UserCircle className="h-4 w-4 text-orange-600" />Profiles</h3>
                      <div className="flex gap-3">
                        {selectedApp.github && (
                          <a href={selectedApp.github} target="_blank" className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800">
                            <Github className="h-4 w-4" /> GitHub
                          </a>
                        )}
                        {selectedApp.linkedin && (
                          <a href={selectedApp.linkedin} target="_blank" className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                            <Linkedin className="h-4 w-4" /> LinkedIn
                          </a>
                        )}
                      </div>
                    </div>
                  )}

                  <div className="bg-white rounded-xl border p-5">
                    <h3 className="font-semibold flex items-center gap-2 mb-4"><FileText className="h-4 w-4 text-orange-600" />Documents</h3>
                    <div className="grid grid-cols-2 gap-4">
                      {selectedApp.cv && (
                        <div className="bg-gradient-to-br from-orange-50 to-amber-50 p-5 rounded-xl border-2 border-orange-200">
                          <FileText className="h-8 w-8 text-orange-600 mb-3" />
                          <h4 className="font-semibold mb-1">CV</h4>
                          <Button onClick={() => downloadFile(selectedApp.cv as string, `${selectedApp.student}_CV.pdf`)} className="w-full mt-2 bg-white border-2 border-orange-200 text-orange-700 hover:bg-orange-600 hover:text-white">
                            <Download className="h-4 w-4 mr-2" />Download
                          </Button>
                        </div>
                      )}
                      {selectedApp.resume && (
                        <div className="bg-gradient-to-br from-orange-50 to-amber-50 p-5 rounded-xl border-2 border-orange-200">
                          <FileText className="h-8 w-8 text-orange-600 mb-3" />
                          <h4 className="font-semibold mb-1">Resume</h4>
                          <Button onClick={() => downloadFile(selectedApp.resume as string, `${selectedApp.student}_Resume.pdf`)} className="w-full mt-2 bg-white border-2 border-orange-200 text-orange-700 hover:bg-orange-600 hover:text-white">
                            <Download className="h-4 w-4 mr-2" />Download
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="px-8 py-4 bg-white border-t flex justify-end gap-3">
                  <Button variant="outline" onClick={() => setIsViewOpen(false)}>Close</Button>
                  <Button className="bg-gradient-to-r from-orange-600 to-amber-600 text-white">
                    <CheckCircle className="h-4 w-4 mr-2" />Mark Reviewed
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}