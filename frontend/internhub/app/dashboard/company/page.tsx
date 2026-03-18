"use client"

import { CompanySidebar } from "../../../components/sidebar/CompanySidebar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Building2, FileText, CheckCircle, Clock, Users, Briefcase, Calendar, TrendingUp, DollarSign, Star } from "lucide-react"

export default function CompanyLayout() {
  return (
    <div className="flex min-h-screen bg-blue-50">
      
      {/* Sidebar */}
      <CompanySidebar />

      {/* Main Content */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6 lg:space-y-8">
        
        {/* Page Title */}
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-blue-700">
            Company Dashboard
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground">
            Manage your internship programs and applicants
          </p>
        </div>

        {/* Stats Section */}
        <div className="grid gap-3 sm:gap-4 lg:gap-6 grid-cols-2 lg:grid-cols-4">
          
          <Card className="border-blue-200">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-xs sm:text-sm font-medium text-blue-700">
                Total Applicants
              </CardTitle>
              <Users className="h-4 w-4 sm:h-5 sm:w-5 text-blue-500" />
            </CardHeader>
            <CardContent>
              <p className="text-xl sm:text-2xl font-bold">156</p>
              <p className="text-xs text-green-600 mt-1">+12 this week</p>
            </CardContent>
          </Card>

          <Card className="border-blue-200">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-xs sm:text-sm font-medium text-blue-700">
                Active Internships
              </CardTitle>
              <Briefcase className="h-4 w-4 sm:h-5 sm:w-5 text-blue-500" />
            </CardHeader>
            <CardContent>
              <p className="text-xl sm:text-2xl font-bold">8</p>
              <p className="text-xs text-gray-500 mt-1">3 positions each</p>
            </CardContent>
          </Card>

          <Card className="border-blue-200">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-xs sm:text-sm font-medium text-blue-700">
                Shortlisted
              </CardTitle>
              <Star className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <p className="text-xl sm:text-2xl font-bold">42</p>
              <p className="text-xs text-green-600 mt-1">27% of applicants</p>
            </CardContent>
          </Card>

          <Card className="border-blue-200">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-xs sm:text-sm font-medium text-blue-700">
                Hired
              </CardTitle>
              <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-green-600" />
            </CardHeader>
            <CardContent>
              <p className="text-xl sm:text-2xl font-bold">18</p>
              <p className="text-xs text-blue-600 mt-1">This semester</p>
            </CardContent>
          </Card>

        </div>

        {/* Recent Activity & Overview */}
        <div className="grid gap-4 sm:gap-6 lg:grid-cols-3">
          
          {/* Recent Applications */}
          <Card className="border-blue-200 lg:col-span-2">
            <CardHeader>
              <CardTitle className="text-base sm:text-lg text-blue-700 flex items-center gap-2">
                <FileText className="h-4 w-4 sm:h-5 sm:w-5" />
                Recent Applications
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 sm:space-y-4">
                <div className="flex items-center justify-between border-b pb-2">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-xs sm:text-sm font-medium text-blue-700">JD</span>
                    </div>
                    <div className="min-w-0">
                      <p className="font-medium text-sm sm:text-base truncate">John Doe</p>
                      <p className="text-xs sm:text-sm text-gray-500 truncate">Computer Science · Stanford</p>
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row items-end sm:items-center gap-1 sm:gap-3">
                    <span className="text-xs sm:text-sm bg-yellow-100 text-yellow-700 px-2 py-1 rounded whitespace-nowrap">Pending</span>
                    <span className="text-xs sm:text-sm text-gray-500 whitespace-nowrap">2h ago</span>
                  </div>
                </div>
                <div className="flex items-center justify-between border-b pb-2">
                  <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-xs sm:text-sm font-medium text-blue-700">JS</span>
                    </div>
                    <div className="min-w-0">
                      <p className="font-medium text-sm sm:text-base truncate">Jane Smith</p>
                      <p className="text-xs sm:text-sm text-gray-500 truncate">Business · NYU</p>
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row items-end sm:items-center gap-1 sm:gap-3">
                    <span className="text-xs sm:text-sm bg-green-100 text-green-700 px-2 py-1 rounded whitespace-nowrap">Shortlisted</span>
                    <span className="text-xs sm:text-sm text-gray-500 whitespace-nowrap">5h ago</span>
                  </div>
                </div>
                <div className="flex items-center justify-between border-b pb-2">
                  <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-xs sm:text-sm font-medium text-blue-700">MW</span>
                    </div>
                    <div className="min-w-0">
                      <p className="font-medium text-sm sm:text-base truncate">Michael Wilson</p>
                      <p className="text-xs sm:text-sm text-gray-500 truncate">Engineering · MIT</p>
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row items-end sm:items-center gap-1 sm:gap-3">
                    <span className="text-xs sm:text-sm bg-blue-100 text-blue-700 px-2 py-1 rounded whitespace-nowrap">Interview</span>
                    <span className="text-xs sm:text-sm text-gray-500 whitespace-nowrap">1d ago</span>
                  </div>
                </div>
              </div>
              <button className="mt-4 text-xs sm:text-sm text-blue-600 hover:text-blue-800 font-medium">
                View all applications →
              </button>
            </CardContent>
          </Card>

          {/* Upcoming Interviews */}
          <Card className="border-blue-200">
            <CardHeader>
              <CardTitle className="text-base sm:text-lg text-blue-700 flex items-center gap-2">
                <Calendar className="h-4 w-4 sm:h-5 sm:w-5" />
                Upcoming Interviews
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 sm:space-y-4">
                <div className="bg-blue-50 p-3 rounded-lg">
                  <div className="flex justify-between items-start">
                    <div className="min-w-0">
                      <p className="font-medium text-xs sm:text-sm truncate">Sarah Johnson</p>
                      <p className="text-xs text-gray-500 truncate">Frontend Developer</p>
                    </div>
                    <span className="text-xs bg-blue-200 px-2 py-1 rounded whitespace-nowrap ml-2">10:30 AM</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">Today, 22 Feb 2026</p>
                </div>
                <div className="bg-blue-50 p-3 rounded-lg">
                  <div className="flex justify-between items-start">
                    <div className="min-w-0">
                      <p className="font-medium text-xs sm:text-sm truncate">David Lee</p>
                      <p className="text-xs text-gray-500 truncate">Backend Engineer</p>
                    </div>
                    <span className="text-xs bg-blue-200 px-2 py-1 rounded whitespace-nowrap ml-2">2:00 PM</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">Today, 22 Feb 2026</p>
                </div>
                <div className="bg-blue-50 p-3 rounded-lg">
                  <div className="flex justify-between items-start">
                    <div className="min-w-0">
                      <p className="font-medium text-xs sm:text-sm truncate">Emily Chen</p>
                      <p className="text-xs text-gray-500 truncate">UI/UX Designer</p>
                    </div>
                    <span className="text-xs bg-blue-200 px-2 py-1 rounded whitespace-nowrap ml-2">11:00 AM</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">Tomorrow, 23 Feb 2026</p>
                </div>
              </div>
              <button className="mt-4 text-xs sm:text-sm text-blue-600 hover:text-blue-800 font-medium w-full text-center">
                Schedule Interview →
              </button>
            </CardContent>
          </Card>

        </div>

        {/* Internship Positions & Performance */}
        <div className="grid gap-4 sm:gap-6 lg:grid-cols-2">
          
          {/* Active Internships */}
          <Card className="border-blue-200">
            <CardHeader>
              <CardTitle className="text-base sm:text-lg text-blue-700 flex items-center gap-2">
                <Briefcase className="h-4 w-4 sm:h-5 sm:w-5" />
                Active Internship Positions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 sm:space-y-4">
                <div className="flex items-center justify-between border-b pb-2">
                  <div className="min-w-0">
                    <p className="font-medium text-sm sm:text-base truncate">Frontend Developer</p>
                    <p className="text-xs sm:text-sm text-gray-500">3 months · Remote</p>
                  </div>
                  <div className="text-right ml-2">
                    <p className="font-medium text-sm sm:text-base whitespace-nowrap">24 applicants</p>
                    <p className="text-xs text-green-600">8 shortlisted</p>
                  </div>
                </div>
                <div className="flex items-center justify-between border-b pb-2">
                  <div className="min-w-0">
                    <p className="font-medium text-sm sm:text-base truncate">Backend Engineer</p>
                    <p className="text-xs sm:text-sm text-gray-500">6 months · Hybrid</p>
                  </div>
                  <div className="text-right ml-2">
                    <p className="font-medium text-sm sm:text-base whitespace-nowrap">18 applicants</p>
                    <p className="text-xs text-green-600">5 shortlisted</p>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="min-w-0">
                    <p className="font-medium text-sm sm:text-base truncate">UI/UX Designer</p>
                    <p className="text-xs sm:text-sm text-gray-500">4 months · On-site</p>
                  </div>
                  <div className="text-right ml-2">
                    <p className="font-medium text-sm sm:text-base whitespace-nowrap">12 applicants</p>
                    <p className="text-xs text-green-600">3 shortlisted</p>
                  </div>
                </div>
              </div>
              <button className="mt-4 text-xs sm:text-sm text-blue-600 hover:text-blue-800 font-medium">
                Post New Internship →
              </button>
            </CardContent>
          </Card>

          {/* University Partners */}
          <Card className="border-blue-200">
            <CardHeader>
              <CardTitle className="text-base sm:text-lg text-blue-700 flex items-center gap-2">
                <Building2 className="h-4 w-4 sm:h-5 sm:w-5" />
                University Partners
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 sm:space-y-4">
                <div className="flex items-center justify-between border-b pb-2">
                  <div className="min-w-0">
                    <p className="font-medium text-sm sm:text-base truncate">Stanford University</p>
                    <p className="text-xs sm:text-sm text-gray-500">15 students placed</p>
                  </div>
                  <span className="text-xs sm:text-sm bg-green-100 px-2 py-1 rounded whitespace-nowrap ml-2">Active</span>
                </div>
                <div className="flex items-center justify-between border-b pb-2">
                  <div className="min-w-0">
                    <p className="font-medium text-sm sm:text-base truncate">MIT</p>
                    <p className="text-xs sm:text-sm text-gray-500">12 students placed</p>
                  </div>
                  <span className="text-xs sm:text-sm bg-green-100 px-2 py-1 rounded whitespace-nowrap ml-2">Active</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="min-w-0">
                    <p className="font-medium text-sm sm:text-base truncate">Harvard University</p>
                    <p className="text-xs sm:text-sm text-gray-500">8 students placed</p>
                  </div>
                  <span className="text-xs sm:text-sm bg-yellow-100 px-2 py-1 rounded whitespace-nowrap ml-2">Pending</span>
                </div>
              </div>
              <button className="mt-4 text-xs sm:text-sm text-blue-600 hover:text-blue-800 font-medium">
                View all partners →
              </button>
            </CardContent>
          </Card>

        </div>

        {/* Skills in Demand & Quick Stats */}
        <div className="grid gap-4 sm:gap-6 lg:grid-cols-3">
          
          {/* Skills Distribution */}
          <Card className="border-blue-200">
            <CardHeader>
              <CardTitle className="text-base sm:text-lg text-blue-700 flex items-center gap-2">
                <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5" />
                Top Skills
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>React.js</span>
                    <span className="font-medium">45%</span>
                  </div>
                  <div className="w-full bg-blue-100 rounded-full h-2">
                    <div className="bg-blue-600 h-2 rounded-full" style={{ width: '45%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Python</span>
                    <span className="font-medium">32%</span>
                  </div>
                  <div className="w-full bg-blue-100 rounded-full h-2">
                    <div className="bg-blue-600 h-2 rounded-full" style={{ width: '32%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>UI/UX Design</span>
                    <span className="font-medium">23%</span>
                  </div>
                  <div className="w-full bg-blue-100 rounded-full h-2">
                    <div className="bg-blue-600 h-2 rounded-full" style={{ width: '23%' }}></div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Hiring Budget */}
          <Card className="border-blue-200">
            <CardHeader>
              <CardTitle className="text-lg text-blue-700 flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                Monthly Stipend Budget
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-blue-700">$45,000</p>
              <p className="text-sm text-gray-500 mt-1">Allocated for Q1 2026</p>
              <div className="mt-4">
                <div className="flex justify-between text-sm mb-1">
                  <span>Utilized: $28,500</span>
                  <span className="font-medium">63%</span>
                </div>
                <div className="w-full bg-blue-100 rounded-full h-2">
                  <div className="bg-blue-600 h-2 rounded-full" style={{ width: '63%' }}></div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Pending Reviews */}
          <Card className="border-blue-200">
            <CardHeader>
              <CardTitle className="text-lg text-blue-700 flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Pending Reviews
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-blue-700">24</p>
              <p className="text-sm text-gray-500 mt-1">Applications awaiting review</p>
              <button className="mt-4 w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 text-sm">
                Review Now
              </button>
            </CardContent>
          </Card>

        </div>

        {/* Quick Actions */}
        <div className="bg-white p-6 rounded-lg border border-blue-200">
          <h2 className="text-lg font-semibold text-blue-700 mb-4 flex items-center gap-2">
            <Briefcase className="h-5 w-5" />
            Quick Actions
          </h2>
          <div className="flex gap-4 flex-wrap">
            <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 text-sm">
              Review Applications
            </button>
            <button className="bg-white text-blue-600 border border-blue-600 px-4 py-2 rounded-md hover:bg-blue-50 text-sm">
              Post New Internship
            </button>
            <button className="bg-white text-blue-600 border border-blue-600 px-4 py-2 rounded-md hover:bg-blue-50 text-sm">
              Schedule Interviews
            </button>
            <button className="bg-white text-blue-600 border border-blue-600 px-4 py-2 rounded-md hover:bg-blue-50 text-sm">
              Contact Universities
            </button>
            <button className="bg-white text-blue-600 border border-blue-600 px-4 py-2 rounded-md hover:bg-blue-50 text-sm">
              Generate Reports
            </button>
          </div>
        </div>

      </main>
    </div>
  )
}