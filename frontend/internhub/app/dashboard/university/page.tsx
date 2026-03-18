"use client"

import { UniversitySidebar } from "@/components/sidebar/UniversitySideBar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, FileText, CheckCircle, Clock, Building2, Briefcase, Calendar, TrendingUp } from "lucide-react"

export default function UniversityLayout() {
  return (
    <div className="flex min-h-screen bg-blue-50">
      
      {/* Sidebar */}
      <UniversitySidebar />

      {/* Main Content */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6 lg:space-y-8 w-full">
        
        {/* Page Title */}
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-blue-700">
            University Dashboard
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground">
            Overview of internship activities
          </p>
        </div>

        {/* Stats Section */}
        <div className="grid gap-3 sm:gap-4 lg:gap-6 grid-cols-2 lg:grid-cols-4">
          
          <Card className="border-blue-200">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-xs sm:text-sm font-medium text-blue-700">
                Total Students
              </CardTitle>
              <Users className="h-4 w-4 sm:h-5 sm:w-5 text-blue-500" />
            </CardHeader>
            <CardContent>
              <p className="text-xl sm:text-2xl font-bold">120</p>
            </CardContent>
          </Card>

          <Card className="border-blue-200">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-xs sm:text-sm font-medium text-blue-700">
                Applications
              </CardTitle>
              <FileText className="h-4 w-4 sm:h-5 sm:w-5 text-blue-500" />
            </CardHeader>
            <CardContent>
              <p className="text-xl sm:text-2xl font-bold">85</p>
            </CardContent>
          </Card>

          <Card className="border-blue-200">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-xs sm:text-sm font-medium text-blue-700">
                Approved
              </CardTitle>
              <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-green-600" />
            </CardHeader>
            <CardContent>
              <p className="text-xl sm:text-2xl font-bold">60</p>
            </CardContent>
          </Card>

          <Card className="border-blue-200">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-xs sm:text-sm font-medium text-blue-700">
                Pending
              </CardTitle>
              <Clock className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <p className="text-xl sm:text-2xl font-bold">25</p>
            </CardContent>
          </Card>

        </div>

        {/* Recent Activity & Overview */}
        <div className="grid gap-4 sm:gap-6 lg:grid-cols-3">
          
          {/* Active Companies - Hide on mobile, show on tablet+ */}
          <Card className="border-blue-200 lg:col-span-2 hidden sm:block">
            <CardHeader>
              <CardTitle className="text-base sm:text-lg text-blue-700 flex items-center gap-2">
                <Building2 className="h-4 w-4 sm:h-5 sm:w-5" />
                Active Companies
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 sm:space-y-4">
                <div className="flex items-center justify-between border-b pb-2">
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-sm sm:text-base truncate">Tech Corp</p>
                    <p className="text-xs sm:text-sm text-gray-500">3 internships posted</p>
                  </div>
                  <span className="text-xs sm:text-sm bg-green-100 px-2 py-1 rounded ml-2 flex-shrink-0">5 applicants</span>
                </div>
                <div className="flex items-center justify-between border-b pb-2">
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-sm sm:text-base truncate">Design Studio</p>
                    <p className="text-xs sm:text-sm text-gray-500">2 internships posted</p>
                  </div>
                  <span className="text-xs sm:text-sm bg-green-100 px-2 py-1 rounded ml-2 flex-shrink-0">3 applicants</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-sm sm:text-base truncate">Marketing Solutions</p>
                    <p className="text-xs sm:text-sm text-gray-500">1 internship posted</p>
                  </div>
                  <span className="text-xs sm:text-sm bg-green-100 px-2 py-1 rounded ml-2 flex-shrink-0">2 applicants</span>
                </div>
              </div>
              <button className="mt-4 text-xs sm:text-sm text-blue-600 hover:text-blue-800 font-medium">
                View all companies →
              </button>
            </CardContent>
          </Card>

          {/* Upcoming Deadlines */}
          <Card className="border-blue-200 sm:col-span-2 lg:col-span-1">
            <CardHeader>
              <CardTitle className="text-base sm:text-lg text-blue-700 flex items-center gap-2">
                <Calendar className="h-4 w-4 sm:h-5 sm:w-5" />
                Upcoming Deadlines
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 sm:space-y-4">
                <div className="bg-blue-50 p-3 rounded-lg">
                  <p className="font-medium text-xs sm:text-sm">Internship Reports</p>
                  <p className="text-xs text-gray-500 mt-1">Due in 3 days</p>
                </div>
                <div className="bg-blue-50 p-3 rounded-lg">
                  <p className="font-medium text-xs sm:text-sm">Company Evaluations</p>
                  <p className="text-xs text-gray-500 mt-1">Due in 5 days</p>
                </div>
                <div className="bg-blue-50 p-3 rounded-lg hidden sm:block">
                  <p className="font-medium text-xs sm:text-sm">Student Feedback</p>
                  <p className="text-xs text-gray-500 mt-1">Due in 7 days</p>
                </div>
              </div>
            </CardContent>
          </Card>

        </div>

        {/* Department Overview - Hide on mobile */}
        <div className="hidden sm:block">
          <h2 className="text-lg sm:text-xl font-semibold text-blue-700 mb-3 sm:mb-4 flex items-center gap-2">
            <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5" />
            Department Performance
          </h2>
          <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            <Card className="border-blue-200">
              <CardContent className="pt-4 sm:pt-6">
                <p className="text-xs sm:text-sm text-gray-500">Computer Science</p>
                <p className="text-xl sm:text-2xl font-bold mt-1">45</p>
                <p className="text-xs text-green-600 mt-2">32 placed</p>
              </CardContent>
            </Card>
            <Card className="border-blue-200">
              <CardContent className="pt-4 sm:pt-6">
                <p className="text-xs sm:text-sm text-gray-500">Business Administration</p>
                <p className="text-xl sm:text-2xl font-bold mt-1">38</p>
                <p className="text-xs text-green-600 mt-2">25 placed</p>
              </CardContent>
            </Card>
            <Card className="border-blue-200 sm:col-span-2 lg:col-span-1">
              <CardContent className="pt-4 sm:pt-6">
                <p className="text-xs sm:text-sm text-gray-500">Engineering</p>
                <p className="text-xl sm:text-2xl font-bold mt-1">37</p>
                <p className="text-xs text-green-600 mt-2">28 placed</p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white p-4 sm:p-6 rounded-lg border border-blue-200">
          <h2 className="text-base sm:text-lg font-semibold text-blue-700 mb-3 sm:mb-4 flex items-center gap-2">
            <Briefcase className="h-4 w-4 sm:h-5 sm:w-5" />
            Quick Actions
          </h2>
          <div className="grid grid-cols-2 sm:flex sm:flex-wrap gap-2 sm:gap-4">
            <button className="bg-blue-600 text-white px-3 sm:px-4 py-2 rounded-md hover:bg-blue-700 text-xs sm:text-sm">
              Review Applications
            </button>
            <button className="bg-white text-blue-600 border border-blue-600 px-3 sm:px-4 py-2 rounded-md hover:bg-blue-50 text-xs sm:text-sm">
              Post Internship
            </button>
            <button className="bg-white text-blue-600 border border-blue-600 px-3 sm:px-4 py-2 rounded-md hover:bg-blue-50 text-xs sm:text-sm">
              Generate Reports
            </button>
            <button className="bg-white text-blue-600 border border-blue-600 px-3 sm:px-4 py-2 rounded-md hover:bg-blue-50 text-xs sm:text-sm">
              Contact Companies
            </button>
          </div>
        </div>

      </main>
    </div>
  )
}