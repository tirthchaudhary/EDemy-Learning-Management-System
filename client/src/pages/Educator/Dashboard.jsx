import React, { useState, useEffect, useContext } from 'react'
import axios from 'axios'
import { AppContext } from '../../context/AppContext'
import Loading from '../../components/common/Loading.jsx'

const Dashboard = () => {
  const { currency } = useContext(AppContext)
  const [stats, setStats] = useState({ totalRevenue: 0, totalEnrollments: 0, totalCourses: 0 })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000'}/courses/educator-dashboard`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (response.data.success) {
          setStats(response.data.stats);
        }
      } catch (error) {
        console.error("Error fetching educator dashboard data:", error);
      } finally {
        setLoading(false)
      }
    };
    fetchDashboardData();
  }, [])

  if (loading) {
    return <Loading />
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 md:p-8">
      <h2 className="text-xl font-bold text-slate-800 mb-2">Dashboard Overview</h2>
      <p className="text-sm text-slate-500">Welcome to your dashboard. This screen will display your overall earnings, course analytics, and recent student sign-ups.</p>

      {/* Visual Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        {/* Total Revenue */}
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100/60 p-6 rounded-2xl">
          <span className="text-xs font-semibold text-blue-600 uppercase tracking-wider">Total Revenue</span>
          <h3 className="text-3xl font-extrabold text-indigo-900 mt-2">
            {currency}{stats.totalRevenue.toFixed(2)}
          </h3>
        </div>

        {/* Total Enrollments */}
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100/60 p-6 rounded-2xl">
          <span className="text-xs font-semibold text-blue-600 uppercase tracking-wider">Total Enrollments</span>
          <h3 className="text-3xl font-extrabold text-indigo-900 mt-2">
            {stats.totalEnrollments}
          </h3>
        </div>

        {/* My Courses */}
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100/60 p-6 rounded-2xl">
          <span className="text-xs font-semibold text-blue-600 uppercase tracking-wider">My Courses</span>
          <h3 className="text-3xl font-extrabold text-indigo-900 mt-2">
            {stats.totalCourses}
          </h3>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
