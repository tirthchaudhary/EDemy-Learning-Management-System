import React, { useContext, useState } from 'react'
import { Link } from 'react-router-dom'; // Ensure Link is imported
import { assets } from '../../assets2/assets.js'
import {AppContext} from '../../context/AppContext.jsx';

const Navbar = () => {

    const { isEducator ,isLoggedIn} = useContext(AppContext);

    // Shared Tailwind link styles for clean maintenance
    const linkStyles = "text-indigo-900 hover:text-indigo-600 font-medium transition-colors duration-200 ease-in-out";

    return (
        <nav className="absolute top-0 left-0 w-full z-50 bg-transparent  border-gray-200/20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    
                    {/* Logo Section */}
                    <div className="flex-shrink-0">
                        <Link to="/">
                            <img src={assets.logo} alt="logo" className="w-28 lg:w-32 object-contain" />
                        </Link>
                    </div>

                    {/* Navigation Links */}
                    {isLoggedIn ? (
                        <div className="hidden md:flex items-center space-x-8">
                            <Link to="/" className={linkStyles}>Home</Link>
                            <Link to="/courses" className={linkStyles}>All Courses</Link>
                            <Link to="/about" className={linkStyles}>About</Link>
                            <Link to="/contact" className={linkStyles}>Contact</Link>
                            {isEducator ? (
                                <Link to="/educator" className={linkStyles}>Educator Dashboard</Link>
                            ) : (
                                <Link to="/my-enrollments" className={linkStyles}>My Enrollments</Link>
                            )}
                            <Link to="/account" className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-all shadow-sm">My Account</Link>
                        </div>
                    ) : (
                        <div className="hidden md:flex items-center space-x-8">
                            <Link to="/" className={linkStyles}>Home</Link>
                            <Link to="/courses" className={linkStyles}>All Courses</Link>
                            <Link to="/about" className={linkStyles}>About</Link>
                            <Link to="/contact" className={linkStyles}>Contact</Link>
                            
                            {/* Replaced Sign Up with Login and Get Started */}
                            <div className="flex items-center space-x-4">
                                <Link to="/auth/login" className="text-sm font-medium text-indigo-900 hover:text-indigo-600 transition-all">
                                    Login
                                </Link>
                                <Link to="/auth/register" className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-all shadow-sm">
                                    Get Started
                                </Link>
                            </div>
                        </div>
                    )}

                </div>
            </div>
        </nav>
    )
}

export default Navbar