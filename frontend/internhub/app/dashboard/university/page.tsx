"use client"

import { UniversitySidebar } from "@/components/sidebar/UniversitySideBar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, FileText, CheckCircle, Clock, Building2, Briefcase, Calendar, TrendingUp } from "lucide-react"

export default function UniversityLayout() {
  return (
    <div className="flex min-h-screen bg-orange-50">
      
      {/* Sidebar */}
      <UniversitySidebar />

      {/* Main Content */}
      <main className="flex-1 p-8 space-y-8">
        
        {/* Page Title */}
        <div>
          <h1 className="text-3xl font-bold text-orange-700">
            University Dashboard
          </h1>
          <p className="text-muted-foreground">
            Overview of internship activities
          </p>
        </div>

        {/* Stats Section */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          
          <Card className="border-orange-200">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-sm font-medium text-orange-700">
                Total Students
              </CardTitle>
              <Users className="h-5 w-5 text-orange-500" />
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">120</p>
            </CardContent>
          </Card>

          <Card className="border-orange-200">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-sm font-medium text-orange-700">
                Applications
              </CardTitle>
              <FileText className="h-5 w-5 text-orange-500" />
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">85</p>
            </CardContent>
          </Card>

          <Card className="border-orange-200">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-sm font-medium text-orange-700">
                Approved
              </CardTitle>
              <CheckCircle className="h-5 w-5 text-green-600" />
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">60</p>
            </CardContent>
          </Card>

          <Card className="border-orange-200">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-sm font-medium text-orange-700">
                Pending
              </CardTitle>
              <Clock className="h-5 w-5 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">25</p>
            </CardContent>
          </Card>

        </div>

        {/* Recent Activity & Overview */}
        <div className="grid gap-6 lg:grid-cols-3">
          
          {/* Active Companies */}
          <Card className="border-orange-200 lg:col-span-2">
            <CardHeader>
              <CardTitle className="text-lg text-orange-700 flex items-center gap-2">
                <Building2 className="h-5 w-5" />
                Active Companies
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b pb-2">
                  <div>
                    <p className="font-medium">Tech Corp</p>
                    <p className="text-sm text-gray-500">3 internships posted</p>
                  </div>
                  <span className="text-sm bg-green-100 px-2 py-1 rounded">5 applicants</span>
                </div>
                <div className="flex items-center justify-between border-b pb-2">
                  <div>
                    <p className="font-medium">Design Studio</p>
                    <p className="text-sm text-gray-500">2 internships posted</p>
                  </div>
                  <span className="text-sm bg-green-100 px-2 py-1 rounded">3 applicants</span>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Marketing Solutions</p>
                    <p className="text-sm text-gray-500">1 internship posted</p>
                  </div>
                  <span className="text-sm bg-green-100 px-2 py-1 rounded">2 applicants</span>
                </div>
              </div>
              <button className="mt-4 text-sm text-orange-600 hover:text-orange-800 font-medium">
                View all companies →
              </button>
            </CardContent>
          </Card>

          {/* Upcoming Deadlines */}
          <Card className="border-orange-200">
            <CardHeader>
              <CardTitle className="text-lg text-orange-700 flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Upcoming Deadlines
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="bg-orange-50 p-3 rounded-lg">
                  <p className="font-medium text-sm">Internship Reports</p>
                  <p className="text-xs text-gray-500 mt-1">Due in 3 days</p>
                </div>
                <div className="bg-orange-50 p-3 rounded-lg">
                  <p className="font-medium text-sm">Company Evaluations</p>
                  <p className="text-xs text-gray-500 mt-1">Due in 5 days</p>
                </div>
                <div className="bg-orange-50 p-3 rounded-lg">
                  <p className="font-medium text-sm">Student Feedback</p>
                  <p className="text-xs text-gray-500 mt-1">Due in 7 days</p>
                </div>
              </div>
            </CardContent>
          </Card>

        </div>

        {/* Department Overview */}
        <div>
          <h2 className="text-xl font-semibold text-orange-700 mb-4 flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Department Performance
          </h2>
          <div className="grid gap-4 md:grid-cols-3">
            <Card className="border-orange-200">
              <CardContent className="pt-6">
                <p className="text-sm text-gray-500">Computer Science</p>
                <p className="text-2xl font-bold mt-1">45</p>
                <p className="text-xs text-green-600 mt-2">32 placed</p>
              </CardContent>
            </Card>
            <Card className="border-orange-200">
              <CardContent className="pt-6">
                <p className="text-sm text-gray-500">Business Administration</p>
                <p className="text-2xl font-bold mt-1">38</p>
                <p className="text-xs text-green-600 mt-2">25 placed</p>
              </CardContent>
            </Card>
            <Card className="border-orange-200">
              <CardContent className="pt-6">
                <p className="text-sm text-gray-500">Engineering</p>
                <p className="text-2xl font-bold mt-1">37</p>
                <p className="text-xs text-green-600 mt-2">28 placed</p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white p-6 rounded-lg border border-orange-200">
          <h2 className="text-lg font-semibold text-orange-700 mb-4 flex items-center gap-2">
            <Briefcase className="h-5 w-5" />
            Quick Actions
          </h2>
          <div className="flex gap-4 flex-wrap">
            <button className="bg-orange-600 text-white px-4 py-2 rounded-md hover:bg-orange-700 text-sm">
              Review Applications
            </button>
            <button className="bg-white text-orange-600 border border-orange-600 px-4 py-2 rounded-md hover:bg-orange-50 text-sm">
              Post New Internship
            </button>
            <button className="bg-white text-orange-600 border border-orange-600 px-4 py-2 rounded-md hover:bg-orange-50 text-sm">
              Generate Reports
            </button>
            <button className="bg-white text-orange-600 border border-orange-600 px-4 py-2 rounded-md hover:bg-orange-50 text-sm">
              Contact Companies
            </button>
          </div>
        </div>

      </main>
    </div>
  )
}