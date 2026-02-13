"use client"

import { useState, useEffect } from "react"
import { CompanySidebar } from "../../../../components/sidebar/CompanySidebar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { 
  FileText, 
  Search, 
  Filter, 
  Download, 
  Eye, 
  CheckCircle, 
  Clock, 
  XCircle,
  AlertCircle,
  Star,
  Calendar,
  User,
  Mail,
  BookOpen,
  Github,
  Linkedin,
  ChevronLeft,
  ChevronRight,
  FileText as FileIcon
} from "lucide-react"

interface Application {
  id: string
  application_id: string
  first_name: string
  last_name: string
  email: string
  department: string
  academic_year: string
  github_link: string
  linkedin_link: string
  cv_url: string
  resume_url: string
  status: 'PENDING' | 'UNDER_REVIEW' | 'SHORTLISTED' | 'ACCEPTED' | 'REJECTED'
  created_at: string
  university_id: string
  company_id: string
  university_name?: string
  feedback?: string
}

export default function CompanyApplicationsPage() {
  const [applications, setApplications] = useState<Application[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("ALL")
  const [departmentFilter, setDepartmentFilter] = useState<string>("ALL")
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null)
  const [showDetailsModal, setShowDetailsModal] = useState(false)
  const [feedbackText, setFeedbackText] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    under_review: 0,
    shortlisted: 0,
    accepted: 0,
    rejected: 0
  })

  const itemsPerPage = 10

  // Fetch applications
  useEffect(() => {
    fetchApplications()
    fetchStats()
  }, [currentPage, statusFilter, departmentFilter])

  const fetchApplications = async () => {
    setLoading(true)
    try {
      const token = localStorage.getItem('token')
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: itemsPerPage.toString(),
        ...(statusFilter !== 'ALL' && { status: statusFilter }),
        ...(departmentFilter !== 'ALL' && { department: departmentFilter }),
        ...(searchTerm && { search: searchTerm })
      })

      const response = await fetch(`http://localhost:5000/api/applications/company?${params}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (!response.ok) throw new Error('Failed to fetch applications')
      
      const data = await response.json()
      setApplications(data.applications || [])
      setTotalPages(data.pagination?.pages || 1)
    } catch (error) {
      console.error('Error fetching applications:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch('http://localhost:5000/api/applications/company/stats', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      
      if (!response.ok) throw new Error('Failed to fetch stats')
      
      const data = await response.json()
      setStats(data)
    } catch (error) {
      console.error('Error fetching stats:', error)
    }
  }

  // Update application status
  const updateApplicationStatus = async (applicationId: string, newStatus: string) => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`http://localhost:5000/api/applications/${applicationId}/review`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ 
          status: newStatus,
          feedback: feedbackText || ''
        })
      })

      if (!response.ok) throw new Error('Failed to update status')
      
      // Refresh applications and stats
      fetchApplications()
      fetchStats()
      setShowDetailsModal(false)
      setSelectedApplication(null)
      setFeedbackText("")
      
    } catch (error) {
      console.error('Error updating status:', error)
    }
  }

  // Download file
  const downloadFile = async (fileUrl: string, fileName: string) => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`http://localhost:5000${fileUrl}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      
      if (!response.ok) throw new Error('Failed to download file')
      
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = fileName
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      window.URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Error downloading file:', error)
    }
  }

  // Get status badge
  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'PENDING':
        return <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 w-fit"><Clock className="h-3 w-3" /> Pending</span>
      case 'UNDER_REVIEW':
        return <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 w-fit"><AlertCircle className="h-3 w-3" /> Under Review</span>
      case 'SHORTLISTED':
        return <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 w-fit"><Star className="h-3 w-3" /> Shortlisted</span>
      case 'ACCEPTED':
        return <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 w-fit"><CheckCircle className="h-3 w-3" /> Accepted</span>
      case 'REJECTED':
        return <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 w-fit"><XCircle className="h-3 w-3" /> Rejected</span>
      default:
        return <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs font-medium">{status}</span>
    }
  }

  // Get status action buttons
  const getStatusActions = (application: Application) => {
    return (
      <div className="flex gap-2 mt-4 flex-wrap">
        {application.status === 'PENDING' && (
          <>
            <button
              onClick={() => updateApplicationStatus(application.application_id, 'UNDER_REVIEW')}
              className="bg-blue-600 text-white px-3 py-1 rounded-md text-sm hover:bg-blue-700 flex items-center gap-1"
            >
              <AlertCircle className="h-4 w-4" /> Review
            </button>
            <button
              onClick={() => {
                setSelectedApplication(application)
                setShowDetailsModal(true)
              }}
              className="bg-gray-600 text-white px-3 py-1 rounded-md text-sm hover:bg-gray-700 flex items-center gap-1"
            >
              <Eye className="h-4 w-4" /> View
            </button>
          </>
        )}
        
        {application.status === 'UNDER_REVIEW' && (
          <>
            <button
              onClick={() => updateApplicationStatus(application.application_id, 'SHORTLISTED')}
              className="bg-purple-600 text-white px-3 py-1 rounded-md text-sm hover:bg-purple-700 flex items-center gap-1"
            >
              <Star className="h-4 w-4" /> Shortlist
            </button>
            <button
              onClick={() => updateApplicationStatus(application.application_id, 'REJECTED')}
              className="bg-red-600 text-white px-3 py-1 rounded-md text-sm hover:bg-red-700 flex items-center gap-1"
            >
              <XCircle className="h-4 w-4" /> Reject
            </button>
          </>
        )}
        
        {application.status === 'SHORTLISTED' && (
          <>
            <button
              onClick={() => updateApplicationStatus(application.application_id, 'ACCEPTED')}
              className="bg-green-600 text-white px-3 py-1 rounded-md text-sm hover:bg-green-700 flex items-center gap-1"
            >
              <CheckCircle className="h-4 w-4" /> Accept
            </button>
            <button
              onClick={() => updateApplicationStatus(application.application_id, 'REJECTED')}
              className="bg-red-600 text-white px-3 py-1 rounded-md text-sm hover:bg-red-700 flex items-center gap-1"
            >
              <XCircle className="h-4 w-4" /> Reject
            </button>
          </>
        )}
        
        {application.status === 'ACCEPTED' && (
          <span className="text-green-600 text-sm font-medium flex items-center gap-1">
            <CheckCircle className="h-4 w-4" /> Accepted
          </span>
        )}
        
        {application.status === 'REJECTED' && (
          <span className="text-red-600 text-sm font-medium flex items-center gap-1">
            <XCircle className="h-4 w-4" /> Rejected
          </span>
        )}
      </div>
    )
  }

  // Filter options
  const departments = ['ALL', 'Computer Science', 'Engineering', 'Business', 'Design', 'Marketing', 'paster']
  const statusOptions = ['ALL', 'PENDING', 'UNDER_REVIEW', 'SHORTLISTED', 'ACCEPTED', 'REJECTED']

  return (
    <div className="flex min-h-screen bg-orange-50">
      
      {/* Sidebar */}
      <CompanySidebar />

      {/* Main Content */}
      <main className="flex-1 p-8 space-y-8">
        
        {/* Page Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-orange-700 flex items-center gap-2">
              <FileText className="h-8 w-8" />
              Applications Management
            </h1>
            <p className="text-muted-foreground">
              Review and manage all internship applications
            </p>
          </div>
          <button className="bg-orange-600 text-white px-4 py-2 rounded-md hover:bg-orange-700 flex items-center gap-2">
            <Download className="h-4 w-4" />
            Export Report
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-6">
          <Card className="border-orange-200">
            <CardContent className="pt-6 text-center">
              <p className="text-2xl font-bold text-orange-700">{stats.total}</p>
              <p className="text-xs text-gray-500">Total</p>
            </CardContent>
          </Card>
          <Card className="border-yellow-200 bg-yellow-50">
            <CardContent className="pt-6 text-center">
              <p className="text-2xl font-bold text-yellow-700">{stats.pending}</p>
              <p className="text-xs text-gray-500">Pending</p>
            </CardContent>
          </Card>
          <Card className="border-blue-200 bg-blue-50">
            <CardContent className="pt-6 text-center">
              <p className="text-2xl font-bold text-blue-700">{stats.under_review}</p>
              <p className="text-xs text-gray-500">Under Review</p>
            </CardContent>
          </Card>
          <Card className="border-purple-200 bg-purple-50">
            <CardContent className="pt-6 text-center">
              <p className="text-2xl font-bold text-purple-700">{stats.shortlisted}</p>
              <p className="text-xs text-gray-500">Shortlisted</p>
            </CardContent>
          </Card>
          <Card className="border-green-200 bg-green-50">
            <CardContent className="pt-6 text-center">
              <p className="text-2xl font-bold text-green-700">{stats.accepted}</p>
              <p className="text-xs text-gray-500">Accepted</p>
            </CardContent>
          </Card>
          <Card className="border-red-200 bg-red-50">
            <CardContent className="pt-6 text-center">
              <p className="text-2xl font-bold text-red-700">{stats.rejected}</p>
              <p className="text-xs text-gray-500">Rejected</p>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="border-orange-200">
          <CardContent className="pt-6">
            <div className="flex flex-wrap gap-4">
              <div className="flex-1 min-w-[200px]">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search by name or email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-orange-200 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-4 py-2 border border-orange-200 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                >
                  {statusOptions.map(status => (
                    <option key={status} value={status}>{status}</option>
                  ))}
                </select>
                <select
                  value={departmentFilter}
                  onChange={(e) => setDepartmentFilter(e.target.value)}
                  className="px-4 py-2 border border-orange-200 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                >
                  {departments.map(dept => (
                    <option key={dept} value={dept}>{dept}</option>
                  ))}
                </select>
                <button
                  onClick={() => {
                    setSearchTerm("")
                    setStatusFilter("ALL")
                    setDepartmentFilter("ALL")
                  }}
                  className="px-4 py-2 border border-orange-200 rounded-md hover:bg-orange-50"
                >
                  Clear
                </button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Applications Table */}
        <Card className="border-orange-200">
          <CardHeader>
            <CardTitle className="text-lg text-orange-700">Applications ({applications.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-700"></div>
              </div>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-orange-200">
                        <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Applicant</th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Department</th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Year</th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Status</th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Applied</th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {applications.map((app) => (
                        <tr key={app.id} className="border-b border-orange-100 hover:bg-orange-50">
                          <td className="py-3 px-4">
                            <div>
                              <p className="font-medium">{app.first_name} {app.last_name}</p>
                              <p className="text-sm text-gray-500">{app.email}</p>
                            </div>
                          </td>
                          <td className="py-3 px-4 text-sm">{app.department}</td>
                          <td className="py-3 px-4 text-sm">{app.academic_year}</td>
                          <td className="py-3 px-4">{getStatusBadge(app.status)}</td>
                          <td className="py-3 px-4 text-sm">
                            {new Date(app.created_at).toLocaleDateString()}
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex gap-2">
                              <button
                                onClick={() => {
                                  setSelectedApplication(app)
                                  setShowDetailsModal(true)
                                }}
                                className="text-orange-600 hover:text-orange-800"
                                title="View Details"
                              >
                                <Eye className="h-5 w-5" />
                              </button>
                              {app.status === 'PENDING' && (
                                <button
                                  onClick={() => updateApplicationStatus(app.application_id, 'UNDER_REVIEW')}
                                  className="text-blue-600 hover:text-blue-800"
                                  title="Start Review"
                                >
                                  <AlertCircle className="h-5 w-5" />
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                <div className="flex justify-between items-center mt-4">
                  <p className="text-sm text-gray-500">
                    Page {currentPage} of {totalPages}
                  </p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                      disabled={currentPage === 1}
                      className="px-3 py-1 border border-orange-200 rounded-md disabled:opacity-50"
                    >
                      <ChevronLeft className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                      disabled={currentPage === totalPages}
                      className="px-3 py-1 border border-orange-200 rounded-md disabled:opacity-50"
                    >
                      <ChevronRight className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Application Details Modal */}
        {showDetailsModal && selectedApplication && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <h2 className="text-2xl font-bold text-orange-700">Application Details</h2>
                  <button
                    onClick={() => {
                      setShowDetailsModal(false)
                      setSelectedApplication(null)
                      setFeedbackText("")
                    }}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    ✕
                  </button>
                </div>

                <div className="space-y-6">
                  {/* Personal Information */}
                  <div className="bg-orange-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-orange-700 mb-3 flex items-center gap-2">
                      <User className="h-5 w-5" />
                      Personal Information
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-500">Full Name</p>
                        <p className="font-medium">{selectedApplication.first_name} {selectedApplication.last_name}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Email</p>
                        <p className="font-medium flex items-center gap-1">
                          <Mail className="h-4 w-4 text-gray-400" />
                          {selectedApplication.email}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Department</p>
                        <p className="font-medium">{selectedApplication.department}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Academic Year</p>
                        <p className="font-medium">{selectedApplication.academic_year}</p>
                      </div>
                    </div>
                  </div>

                  {/* Links */}
                  <div className="bg-orange-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-orange-700 mb-3">Profile Links</h3>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Github className="h-5 w-5 text-gray-600" />
                        <a href={selectedApplication.github_link} target="_blank" rel="noopener noreferrer" 
                           className="text-blue-600 hover:underline text-sm">
                          {selectedApplication.github_link}
                        </a>
                      </div>
                      <div className="flex items-center gap-2">
                        <Linkedin className="h-5 w-5 text-gray-600" />
                        <a href={selectedApplication.linkedin_link} target="_blank" rel="noopener noreferrer"
                           className="text-blue-600 hover:underline text-sm">
                          {selectedApplication.linkedin_link}
                        </a>
                      </div>
                    </div>
                  </div>

                  {/* Documents */}
                  <div className="bg-orange-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-orange-700 mb-3 flex items-center gap-2">
                      <FileIcon className="h-5 w-5" />
                      Documents
                    </h3>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span>CV</span>
                        <button
                          onClick={() => downloadFile(selectedApplication.cv_url, `CV_${selectedApplication.first_name}_${selectedApplication.last_name}.pdf`)}
                          className="text-orange-600 hover:text-orange-800 text-sm flex items-center gap-1"
                        >
                          <Download className="h-4 w-4" />
                          Download CV
                        </button>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Resume</span>
                        <button
                          onClick={() => downloadFile(selectedApplication.resume_url, `Resume_${selectedApplication.first_name}_${selectedApplication.last_name}.pdf`)}
                          className="text-orange-600 hover:text-orange-800 text-sm flex items-center gap-1"
                        >
                          <Download className="h-4 w-4" />
                          Download Resume
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Status and Feedback */}
                  <div className="bg-orange-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-orange-700 mb-3">Application Status</h3>
                    <div className="mb-4">
                      {getStatusBadge(selectedApplication.status)}
                    </div>

                    {selectedApplication.feedback && (
                      <div className="mb-4 p-3 bg-white rounded border border-orange-200">
                        <p className="text-sm font-medium text-gray-700">Feedback:</p>
                        <p className="text-sm text-gray-600">{selectedApplication.feedback}</p>
                      </div>
                    )}

                    <div className="space-y-3">
                      <textarea
                        placeholder="Add feedback (optional)"
                        value={feedbackText}
                        onChange={(e) => setFeedbackText(e.target.value)}
                        className="w-full px-3 py-2 border border-orange-200 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                        rows={3}
                      />
                      
                      <div className="flex gap-2 flex-wrap">
                        {selectedApplication.status === 'PENDING' && (
                          <>
                            <button
                              onClick={() => updateApplicationStatus(selectedApplication.application_id, 'UNDER_REVIEW')}
                              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                            >
                              Start Review
                            </button>
                            <button
                              onClick={() => updateApplicationStatus(selectedApplication.application_id, 'REJECTED')}
                              className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
                            >
                              Reject
                            </button>
                          </>
                        )}
                        
                        {selectedApplication.status === 'UNDER_REVIEW' && (
                          <>
                            <button
                              onClick={() => updateApplicationStatus(selectedApplication.application_id, 'SHORTLISTED')}
                              className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700"
                            >
                              Shortlist
                            </button>
                            <button
                              onClick={() => updateApplicationStatus(selectedApplication.application_id, 'REJECTED')}
                              className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
                            >
                              Reject
                            </button>
                          </>
                        )}
                        
                        {selectedApplication.status === 'SHORTLISTED' && (
                          <>
                            <button
                              onClick={() => updateApplicationStatus(selectedApplication.application_id, 'ACCEPTED')}
                              className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
                            >
                              Accept
                            </button>
                            <button
                              onClick={() => updateApplicationStatus(selectedApplication.application_id, 'REJECTED')}
                              className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
                            >
                              Reject
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}