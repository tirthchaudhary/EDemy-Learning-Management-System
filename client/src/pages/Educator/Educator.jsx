import React, { useContext } from 'react'
import { NavLink, Outlet, Link } from 'react-router-dom'
import { assets } from '../../assets2/assets.js'
import { AppContext } from '../../context/AppContext'

const Educator = () => {
  const { userData } = useContext(AppContext);
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row text-slate-800 font-sans">

      {/* Sidebar Navigation */}
      <aside className="w-full md:w-64 bg-white border-b md:border-b-0 md:border-r border-slate-100 flex flex-col p-5 gap-6 shrink-0 shadow-sm">

        {/* Brand Logo & Tag */}
        <div className="flex items-center justify-between md:justify-start gap-3 pb-5 border-b border-slate-100">
          <Link to="/" className="flex items-center">
            <img src={assets.logo} alt="EDemy Logo" className="w-28 object-contain" />
          </Link>
          <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full uppercase tracking-wider">
            Educator
          </span>
        </div>

        {/* Navigation Menu */}
        <nav className="flex flex-row md:flex-col gap-2 overflow-x-auto md:overflow-x-visible pb-2 md:pb-0 whitespace-nowrap scrollbar-none">

          <NavLink
            to="/educator"
            end
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 ${isActive
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/10'
                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`
            }
          >
            <img
              src={assets.home_icon}
              alt="Dashboard"
              className="w-5 h-5 opacity-80 invert brightness-0 filter group-[.active]:brightness-100 group-[.active]:invert-0"
              style={{ filter: 'grayscale(1) brightness(0.4)' }}
            />
            <span>Dashboard</span>
          </NavLink>

          <NavLink
            to="/educator/my-courses"
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 ${isActive
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/10'
                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`
            }
          >
            <img
              src={assets.my_course_icon}
              alt="My Courses"
              className="w-5 h-5"
              style={{ filter: 'grayscale(1) brightness(0.4)' }}
            />
            <span>My Courses</span>
          </NavLink>

          <NavLink
            to="/educator/add-course"
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 ${isActive
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/10'
                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`
            }
          >
            <img
              src={assets.add_icon}
              alt="Add Course"
              className="w-5 h-5"
              style={{ filter: 'grayscale(1) brightness(0.4)' }}
            />
            <span>Add Course</span>
          </NavLink>

          <NavLink
            to="/educator/student-enrolled"
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 ${isActive
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/10'
                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`
            }
          >
            <img
              src={assets.person_tick_icon}
              alt="Students Enrolled"
              className="w-5 h-5"
              style={{ filter: 'grayscale(1) brightness(0.4)' }}
            />
            <span>Students Enrolled</span>
          </NavLink>

          <NavLink
            to="/educator/student-doubts"
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 ${isActive
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/10'
                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`
            }
          >
            <svg
              className="w-5 h-5 shrink-0"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>Student's Doubt</span>
          </NavLink>

          <NavLink
            to="/account"
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 ${isActive
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/10'
                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`
            }
          >
            <img
              src={assets.user_icon}
              alt="My Account"
              className="w-5 h-5"
              style={{ filter: 'grayscale(1) brightness(0.4)' }}
            />
            <span>My Account</span>
          </NavLink>

        </nav>

        {/* Footer Link back to student view */}
        <div className="hidden md:flex flex-col gap-3 mt-auto pt-5 border-t border-slate-100">
          <Link
            to="/"
            className="text-center text-xs font-semibold text-slate-500 hover:text-blue-600 transition-colors py-2 rounded-lg bg-slate-50 hover:bg-blue-50"
          >
            ← Exit to Main Site
          </Link>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">

        {/* Top Header */}
        <header className="bg-white border-b border-slate-100 px-6 py-4 flex items-center justify-between shrink-0 shadow-sm">
          <div>
            <h1 className="text-lg md:text-xl font-bold text-slate-900">
              Welcome, <span className="text-blue-600">{userData?.name}</span>! 👋
            </h1>
            <p className="text-xs text-slate-400 mt-0.5">Manage your courses and analyze student performance.</p>
          </div>

          {/* User Profile */}
          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-bold text-slate-800 leading-none">{userData?.name}</p>
              <p className="text-xs text-slate-400 mt-1">{userData?.email}</p>
            </div>

            <img
              src={userData?.imageUrl || 'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y'}
              alt={userData?.name || 'User Profile'}
              className="w-10 h-10 rounded-full object-cover border-2 border-blue-50 shadow-sm"
              onError={(e) => {
                e.target.src = 'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y'
              }}
            />
          </div>
        </header>

        {/* Outlet Content Panel */}
        <main className="flex-1 p-6 md:p-8 overflow-y-auto">
          <div className="max-w-6xl mx-auto">
            <Outlet />
          </div>
        </main>

      </div>

    </div>
  )
}

export default Educator
