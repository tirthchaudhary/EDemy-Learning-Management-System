import React, { useState, useContext } from 'react';
import { NavLink, Outlet, Link } from 'react-router-dom';
import { assets } from '../assets2/assets.js';
import { AppContext } from '../context/AppContext.jsx';
import Navbar from '../components/layout/Navbar.jsx';

const Student = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { isLoggedIn } = useContext(AppContext);

  if (isLoggedIn) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row text-slate-800 font-sans">
        
        {/* Mobile Top Header */}
        <div className="md:hidden flex items-center justify-between bg-white px-5 py-3 border-b border-slate-100 shrink-0 shadow-sm z-50">
          <Link to="/" className="flex items-center">
            <img src={assets.logo} alt="EDemy Logo" className="w-24 object-contain" />
          </Link>
          <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 text-slate-600 hover:text-slate-950 focus:outline-none transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isSidebarOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Sidebar Navigation */}
        <aside className={`
          fixed inset-y-0 left-0 z-40 w-64 bg-white border-r border-slate-100 flex flex-col p-5 gap-6 shrink-0 shadow-sm
          transform transition-transform duration-300 ease-in-out md:translate-x-0 md:static md:h-screen
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        `}>
          
          {/* Brand Logo & Label */}
          <div className="hidden md:flex items-center justify-between gap-3 pb-5 border-b border-slate-100">
            <Link to="/" className="flex items-center">
              <img src={assets.logo} alt="EDemy Logo" className="w-28 object-contain" />
            </Link>
            <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full uppercase tracking-wider">
              Student
            </span>
          </div>

          {/* Navigation Menu Links */}
          <nav className="flex flex-col gap-2">
            
            <NavLink
              to="/my-enrollments"
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/10'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`
              }
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              <span>My Enrollments</span>
            </NavLink>

            <NavLink
              to="/courses"
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/10'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`
              }
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
              </svg>
              <span>All Courses</span>
            </NavLink>

            <NavLink
              to="/about"
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/10'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`
              }
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>About Us</span>
            </NavLink>

            <NavLink
              to="/contact"
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/10'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`
              }
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <span>Contact Us</span>
            </NavLink>

            <NavLink
              to="/account"
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/10'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`
              }
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <span>My Account</span>
            </NavLink>

          </nav>

          {/* Sidebar Footer Link */}
          <div className="mt-auto pt-5 border-t border-slate-100 flex flex-col gap-3">
            <Link 
              to="/" 
              className="text-center text-xs font-semibold text-slate-500 hover:text-indigo-600 transition-colors py-2 rounded-lg bg-slate-50 hover:bg-indigo-50"
            >
              ← Exit to Main Site
            </Link>
          </div>
        </aside>

        {/* Mobile Drawer Overlay Backdrop */}
        {isSidebarOpen && (
          <div 
            onClick={() => setIsSidebarOpen(false)}
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-30 md:hidden"
          />
        )}

        {/* Main Content Viewport */}
        <div className="flex-1 flex flex-col min-w-0 md:h-screen md:overflow-y-auto bg-slate-50/50">
          <main className="flex-1">
            <Outlet />
          </main>
        </div>

      </div>
    );
  } else {
    // Guest view: Top Navbar, then outlet page content
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col justify-between font-sans relative">
        {/* Navbar Container */}
        <div className="relative w-full h-16 shrink-0">
          <Navbar />
        </div>
        
        {/* Main Content */}
        <main className="flex-1">
          <Outlet />
        </main>
      </div>
    );
  }
};

export default Student;
