import React, { useState, useEffect } from 'react'
import axios from 'axios'
import Loading from '../../components/common/Loading.jsx'


const StudentsEnrolled = () => {
  const [enrolledStudents, setEnrolledStudents] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCourse, setSelectedCourse] = useState('All')
  const [sortBy, setSortBy] = useState('newest')

  useEffect(() => {
    const fetchEnrolledStudents = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000'}/courses/educator-dashboard`, { headers: { Authorization: `Bearer ${token}` } })
        if (response.data.success) {
          setEnrolledStudents(response.data.enrolledStudents || []);
        }
      } catch (error) {
        console.error('Error fetching enrolled students:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchEnrolledStudents();
  }, [])

  const uniqueCourses = ['All', ...new Set(enrolledStudents.map(item => item.courseTitle || ''))];

  const filteredStudents = enrolledStudents.filter(item => {
    const studentName = item.student?.name || '';
    const courseTitle = item.courseTitle || '';
    const matchesSearch = studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      courseTitle.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCourse = selectedCourse === 'All' || courseTitle === selectedCourse
    return matchesSearch && matchesCourse
  }).sort((a, b) => {
    if (sortBy === 'newest') {
      return new Date(b.purchaseDate) - new Date(a.purchaseDate)
    } else if (sortBy === 'oldest') {
      return new Date(a.purchaseDate) - new Date(b.purchaseDate)
    } else {
      return (a.student?.name || '').localeCompare(b.student?.name || '')
    }
  })


  if (loading) {
    return <Loading />
  }


  // Stat computations
  const totalEnrollments = enrolledStudents.length
  const uniqueStudents = new Set(enrolledStudents.map(item => item.student?._id).filter(Boolean)).size
  const activeCourses = new Set(enrolledStudents.map(item => item.courseTitle).filter(Boolean)).size

  // Format date nicely
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  // Soft course badge styling based on title
  const getCourseBadgeStyle = (title) => {
    if (title.includes('JavaScript')) {
      return 'bg-amber-50 text-amber-700 border-amber-200/50'
    } else if (title.includes('Python')) {
      return 'bg-blue-50 text-blue-700 border-blue-200/50'
    } else if (title.includes('Web Development')) {
      return 'bg-emerald-50 text-emerald-700 border-emerald-200/50'
    }
    return 'bg-violet-50 text-violet-700 border-violet-200/50'
  }

  const handleClearFilters = () => {
    setSearchTerm('')
    setSelectedCourse('All')
    setSortBy('newest')
  }

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Students Enrolled</h2>
        <p className="text-sm text-slate-500 mt-1">Track student sign-ups, purchase details, and course registration across your active curriculum.</p>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {/* KPI 1: Total Enrollments */}
        <div className="bg-gradient-to-br from-blue-50/80 to-indigo-50/20 border border-blue-100/60 p-6 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 relative overflow-hidden group">
          <div className="absolute right-0 top-0 w-24 h-24 bg-blue-100/30 rounded-full translate-x-4 -translate-y-4 group-hover:scale-110 transition-transform duration-300"></div>
          <div className="flex items-center gap-4 relative z-10">
            <div className="p-3 bg-blue-500 text-white rounded-xl shadow-md shadow-blue-500/10">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
            <div>
              <span className="text-xs font-semibold text-blue-600 uppercase tracking-wider">Total Enrollments</span>
              <h3 className="text-3xl font-extrabold text-indigo-900 mt-1">{totalEnrollments}</h3>
            </div>
          </div>
        </div>

        {/* KPI 2: Unique Students */}
        <div className="bg-gradient-to-br from-violet-50/80 to-purple-50/20 border border-violet-100/60 p-6 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 relative overflow-hidden group">
          <div className="absolute right-0 top-0 w-24 h-24 bg-violet-100/30 rounded-full translate-x-4 -translate-y-4 group-hover:scale-110 transition-transform duration-300"></div>
          <div className="flex items-center gap-4 relative z-10">
            <div className="p-3 bg-violet-500 text-white rounded-xl shadow-md shadow-violet-500/10">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <span className="text-xs font-semibold text-violet-600 uppercase tracking-wider">Unique Students</span>
              <h3 className="text-3xl font-extrabold text-violet-900 mt-1">{uniqueStudents}</h3>
            </div>
          </div>
        </div>

        {/* KPI 3: Active Courses */}
        <div className="bg-gradient-to-br from-teal-50/80 to-emerald-50/20 border border-teal-100/60 p-6 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 relative overflow-hidden group">
          <div className="absolute right-0 top-0 w-24 h-24 bg-teal-100/30 rounded-full translate-x-4 -translate-y-4 group-hover:scale-110 transition-transform duration-300"></div>
          <div className="flex items-center gap-4 relative z-10">
            <div className="p-3 bg-teal-500 text-white rounded-xl shadow-md shadow-teal-500/10">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <div>
              <span className="text-xs font-semibold text-teal-600 uppercase tracking-wider">Active Courses</span>
              <h3 className="text-3xl font-extrabold text-teal-900 mt-1">{activeCourses}</h3>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area: Filters and Table */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">

        {/* Search, Filter, Sort Toolbar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-6 border-b border-slate-100">

          {/* Search Box */}
          <div className="relative flex-1 max-w-md">
            <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </span>
            <input
              type="text"
              placeholder="Search by student or course..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>

          {/* Filter Dropdowns */}
          <div className="flex flex-wrap items-center gap-3">

            {/* Filter by Course */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider hidden lg:inline">Course:</span>
              <select
                value={selectedCourse}
                onChange={(e) => setSelectedCourse(e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 cursor-pointer"
              >
                {uniqueCourses.map((course, idx) => (
                  <option key={idx} value={course}>{course}</option>
                ))}
              </select>
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider hidden lg:inline">Sort:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 cursor-pointer"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="name">Name (A-Z)</option>
              </select>
            </div>

            {/* Reset Filters (Only displays if active filters exist) */}
            {(searchTerm || selectedCourse !== 'All' || sortBy !== 'newest') && (
              <button
                onClick={handleClearFilters}
                className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-500 hover:text-blue-600 bg-slate-50 hover:bg-blue-50 border border-slate-200 hover:border-blue-200 rounded-xl transition-all duration-200 cursor-pointer"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 1121.21 8H18.5" />
                </svg>
                Reset
              </button>
            )}

          </div>

        </div>

        {/* Table Content */}
        {filteredStudents.length > 0 ? (
          <>
            {/* Desktop Table View */}
            <div className="hidden sm:block overflow-x-auto rounded-xl border border-slate-100">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/75 border-b border-slate-100 text-xs font-bold text-slate-500 uppercase tracking-wider">
                    <th className="py-4 px-6 text-center w-12">#</th>
                    <th className="py-4 px-6">Student</th>
                    <th className="py-4 px-6">Course Name</th>
                    <th className="py-4 px-6">Date Enrolled</th>
                    <th className="py-4 px-6">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-sm">
                  {filteredStudents.map((item, index) => (
                    <tr key={index} className="hover:bg-slate-50/40 transition-colors duration-150 group">
                      <td className="py-4.5 px-6 text-center text-slate-400 font-medium">
                        {index + 1}
                      </td>
                      <td className="py-4.5 px-6">
                        <div className="flex items-center gap-3">
                          <img
                            src={item.student?.imageUrl}
                            alt={item.student?.name}
                            className="w-9 h-9 rounded-full object-cover border-2 border-white shadow-sm group-hover:scale-105 transition-transform duration-200"
                            onError={(e) => {
                              e.target.src = 'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y'
                            }}
                          />
                          <div>
                            <p className="font-semibold text-slate-800">{item.student?.name}</p>
                            <p className="text-[10px] text-slate-400 font-mono mt-0.5">{item.student?._id}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4.5 px-6">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getCourseBadgeStyle(item.courseTitle)}`}>
                          {item.courseTitle}
                        </span>
                      </td>
                      <td className="py-4.5 px-6 text-slate-600 font-medium">
                        {formatDate(item.purchaseDate)}
                      </td>
                      <td className="py-4.5 px-6">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-100">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                          Active
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Card View */}
            <div className="grid grid-cols-1 gap-4 sm:hidden">
              {filteredStudents.map((item, index) => (
                <div key={index} className="bg-slate-50 border border-slate-100 rounded-xl p-5 shadow-sm space-y-4 hover:border-slate-200 transition-colors duration-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <img
                        src={item.student?.imageUrl}
                        alt={item.student?.name}
                        className="w-9 h-9 rounded-full object-cover border-2 border-white shadow-sm"
                        onError={(e) => {
                          e.target.src = 'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y'
                        }}
                      />
                      <div>
                        <h4 className="font-bold text-slate-800 leading-tight">{item.student?.name}</h4>
                        <p className="text-[10px] text-slate-400 font-mono mt-0.5">{item.student?._id}</p>
                      </div>
                    </div>
                    <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xxs font-bold bg-emerald-50 text-emerald-700 border border-emerald-100">
                      <span className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse"></span>
                      Active
                    </span>
                  </div>

                  <div className="border-t border-slate-200/60 pt-3 space-y-2 text-xs">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Course Enrolled</span>
                      <span className="font-semibold text-slate-700 text-right max-w-[200px] truncate">{item.courseTitle}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Enrolled On</span>
                      <span className="font-medium text-slate-600">{formatDate(item.purchaseDate)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Total Results Summary */}
            <div className="mt-4 flex justify-between items-center text-xs text-slate-400 font-medium">
              <p>Showing {filteredStudents.length} of {enrolledStudents.length} enrolled students</p>
            </div>
          </>
        ) : (
          /* Empty / No Search Results State */
          <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
            <div className="p-4 bg-slate-50 text-slate-400 rounded-full mb-4">
              <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h4 className="text-base font-bold text-slate-700">No matching students found</h4>
            <p className="text-sm text-slate-400 mt-1 max-w-xs">We couldn't find any student registrations matching your search or filters.</p>
            <button
              onClick={handleClearFilters}
              className="mt-5 px-4.5 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-md shadow-blue-600/10 transition-all duration-200 cursor-pointer"
            >
              Clear Search & Filters
            </button>
          </div>
        )}

      </div>
    </div>
  )
}

export default StudentsEnrolled

