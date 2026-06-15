import React, { useState, useEffect } from 'react'
import axios from 'axios'
import Loading from '../../components/common/Loading.jsx'

export default function StudentDoubts() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCourse, setSelectedCourse] = useState('All')
  const [selectedStatus, setSelectedStatus] = useState('All')
  const [replyInputs, setReplyInputs] = useState({}) // Stores input per doubtId: { [doubtId]: 'text' }
  const [doubts, setDoubts] = useState([])
  const [loading, setLoading] = useState(true);

  // Get unique courses from current doubts to populate the filter dropdown
  const uniqueCourses = ['All', ...new Set(doubts.map(d => d.courseId?.courseTitle).filter(Boolean))]

  const fetchEducatorDoubts = async () => {
    try {
      const token = localStorage.getItem('token');

      const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000'}/courses/doubts/educator`, { headers: { Authorization: `Bearer ${token}` } });

      if (response.data.success) {
        setDoubts(response.data.doubts);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchEducatorDoubts();
  }, []);

  // Handle local mockup submission of a reply
  const handleReplySubmit = async (e, doubtId) => {
    e.preventDefault()

    const replyText = replyInputs[doubtId] || ''

    if (!replyText.trim()) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000'}/courses/doubts/reply/${doubtId}`, { replyText }, { headers: { Authorization: `Bearer ${token}` } });

      if (response.data.success) {
        setReplyInputs(prev => ({ ...prev, [doubtId]: '' }));
        fetchEducatorDoubts();
      }
    } catch (error) {
      console.error(error);
    }

  }

  if (loading) {
    return <Loading />
  }

  // Filter logic
  const filteredDoubts = doubts.filter(doubt => {
    const query = searchTerm.toLowerCase()
    const matchesSearch =
      doubt.question.toLowerCase().includes(query) ||
      doubt.user.name.toLowerCase().includes(query) ||
      doubt.lectureTitle.toLowerCase().includes(query)

    const matchesCourse = selectedCourse === 'All' || doubt.courseId?.courseTitle === selectedCourse

    const matchesStatus =
      selectedStatus === 'All' ||
      (selectedStatus === 'Resolved' && doubt.isResolved) ||
      (selectedStatus === 'Pending' && !doubt.isResolved)

    return matchesSearch && matchesCourse && matchesStatus
  })

  // KPI computations
  const totalDoubtsCount = doubts.length
  const unresolvedCount = doubts.filter(d => !d.isResolved).length
  const resolvedCount = doubts.filter(d => d.isResolved).length

  // Course badges styling helper
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
    setSelectedStatus('All')
  }

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Student Doubts</h2>
        <p className="text-sm text-slate-500 mt-1">
          Review, answer, and manage technical queries asked by students inside active lecture workspaces.
        </p>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {/* Total Doubts */}
        <div className="bg-gradient-to-br from-blue-50/80 to-indigo-50/20 border border-blue-100/60 p-6 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 relative overflow-hidden group">
          <div className="absolute right-0 top-0 w-24 h-24 bg-blue-100/30 rounded-full translate-x-4 -translate-y-4 group-hover:scale-110 transition-transform duration-300"></div>
          <div className="flex items-center gap-4 relative z-10">
            <div className="p-3 bg-blue-500 text-white rounded-xl shadow-md shadow-blue-500/10">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <span className="text-xs font-semibold text-blue-600 uppercase tracking-wider">Total Doubts</span>
              <h3 className="text-3xl font-extrabold text-indigo-900 mt-1">{totalDoubtsCount}</h3>
            </div>
          </div>
        </div>

        {/* Unresolved / Pending */}
        <div className="bg-gradient-to-br from-rose-50/80 to-red-50/20 border border-rose-100/60 p-6 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 relative overflow-hidden group">
          <div className="absolute right-0 top-0 w-24 h-24 bg-rose-100/30 rounded-full translate-x-4 -translate-y-4 group-hover:scale-110 transition-transform duration-300"></div>
          <div className="flex items-center gap-4 relative z-10">
            <div className="p-3 bg-rose-500 text-white rounded-xl shadow-md shadow-rose-500/10">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <div>
              <span className="text-xs font-semibold text-rose-600 uppercase tracking-wider">Pending</span>
              <h3 className="text-3xl font-extrabold text-rose-900 mt-1">{unresolvedCount}</h3>
            </div>
          </div>
        </div>

        {/* Resolved */}
        <div className="bg-gradient-to-br from-emerald-50/80 to-teal-50/20 border border-emerald-100/60 p-6 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 relative overflow-hidden group">
          <div className="absolute right-0 top-0 w-24 h-24 bg-emerald-100/30 rounded-full translate-x-4 -translate-y-4 group-hover:scale-110 transition-transform duration-300"></div>
          <div className="flex items-center gap-4 relative z-10">
            <div className="p-3 bg-emerald-500 text-white rounded-xl shadow-md shadow-emerald-500/10">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <span className="text-xs font-semibold text-emerald-600 uppercase tracking-wider">Resolved</span>
              <h3 className="text-3xl font-extrabold text-emerald-900 mt-1">{resolvedCount}</h3>
            </div>
          </div>
        </div>
      </div>

      {/* Filter and doubts list */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
        {/* Search & Filter Toolbar */}
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
              placeholder="Search doubts, students, or lectures..."
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

          {/* Filters dropdowns */}
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

            {/* Filter by Status */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider hidden lg:inline">Status:</span>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 cursor-pointer"
              >
                <option value="All">All Doubts</option>
                <option value="Pending">Pending</option>
                <option value="Resolved">Resolved</option>
              </select>
            </div>

            {/* Reset Filters */}
            {(searchTerm || selectedCourse !== 'All' || selectedStatus !== 'All') && (
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

        {/* Doubts List Feed */}
        {filteredDoubts.length > 0 ? (
          <div className="space-y-8 divide-y divide-slate-100">
            {filteredDoubts.map((doubt, idx) => (
              <div key={doubt._id} className={`pt-6 first:pt-0 space-y-4`}>
                {/* Meta details: Course and status badge */}
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xxs font-semibold border ${getCourseBadgeStyle(doubt.courseId?.courseTitle || '')}`}>
                      {doubt.courseId?.courseTitle || 'General'}
                    </span>
                    <span className="text-slate-300">•</span>
                    <span className="font-semibold text-slate-700 bg-slate-100 px-2 py-0.5 rounded-md">
                      Ch: {doubt.chapterTitle}
                    </span>
                    <span className="text-slate-300">•</span>
                    <span className="font-semibold text-slate-600">
                      Lec: {doubt.lectureTitle}
                    </span>
                  </div>

                  {/* Status Badge */}
                  <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xxs font-bold ${doubt.isResolved
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                    : 'bg-rose-50 text-rose-700 border border-rose-100'
                    }`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${doubt.isResolved ? 'bg-emerald-500' : 'bg-rose-500 animate-pulse'}`}></span>
                    {doubt.isResolved ? 'Answered' : 'Pending'}
                  </span>
                </div>

                {/* Question Details card */}
                <div className="flex items-start gap-4">
                  <img
                    src={doubt.user.imageUrl}
                    alt={doubt.user.name}
                    className="w-10 h-10 rounded-full object-cover border shadow-sm shrink-0"
                    onError={(e) => {
                      e.target.src = 'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y'
                    }}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-baseline justify-between gap-2">
                      <h4 className="font-bold text-slate-800 text-sm leading-none">{doubt.user.name}</h4>
                      <span className="text-[10px] text-slate-400 font-medium">
                        {new Date(doubt.createdAt).toLocaleDateString('en-GB', {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                    </div>
                    <p className="text-slate-400 text-[10px] mt-0.5 font-mono">UID: {doubt.user._id}</p>
                    <p className="text-slate-700 text-sm mt-3 bg-slate-50/50 border border-slate-100 p-3.5 rounded-2xl leading-relaxed">
                      {doubt.question}
                    </p>
                  </div>
                </div>

                {/* Responses / Answers list */}
                {doubt.replies.length > 0 && (
                  <div className="ml-14 pl-4 border-l-2 border-slate-100 space-y-4">
                    {doubt.replies.map((reply) => (
                      <div key={reply._id} className="flex items-start gap-3">
                        <img
                          src={reply.user.imageUrl}
                          alt={reply.user.name}
                          className="w-8 h-8 rounded-full object-cover border shadow-xxs shrink-0"
                          onError={(e) => {
                            e.target.src = 'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y'
                          }}
                        />
                        <div className="flex-1 min-w-0 bg-slate-50 border border-slate-100 p-3.5 rounded-2xl">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-slate-800">{reply.user.name}</span>
                            <span className="text-[9px] text-slate-400 font-medium">
                              {new Date(reply.createdAt).toLocaleDateString('en-GB', {
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </span>
                          </div>
                          <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">{reply.replyText}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Reply Form */}
                <form
                  onSubmit={(e) => handleReplySubmit(e, doubt._id)}
                  className="ml-14 flex items-center gap-3 pt-2"
                >
                  <input
                    type="text"
                    placeholder="Provide a solution or advice..."
                    value={replyInputs[doubt._id] || ''}
                    onChange={(e) => setReplyInputs(prev => ({ ...prev, [doubt._id]: e.target.value }))}
                    className="flex-1 px-4 py-2.5 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-blue-600 bg-slate-50/50 focus:ring-2 focus:ring-blue-500/10 transition-all duration-200"
                  />
                  <button
                    type="submit"
                    disabled={!(replyInputs[doubt._id] || '').trim()}
                    className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed shadow-sm shadow-blue-500/10 shrink-0"
                  >
                    Reply
                  </button>
                </form>
              </div>
            ))}
          </div>
        ) : (
          /* Empty Search/Filter State */
          <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
            <div className="p-4 bg-slate-50 text-slate-400 rounded-full mb-4">
              <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <h4 className="text-base font-bold text-slate-700">No student doubts found</h4>
            <p className="text-sm text-slate-400 mt-1 max-w-xs">We couldn't find any doubt threads matching your selected search or filters.</p>
            <button
              onClick={handleClearFilters}
              className="mt-5 px-4.5 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-md shadow-blue-600/10 transition-all duration-200 cursor-pointer"
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
