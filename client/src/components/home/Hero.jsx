import React from 'react'

const Hero = () => {
  return (
    <div className="relative w-full h-screen from-slate-50 via-blue-50 to-indigo-100 flex items-center">
      
      {/* Background decorative circles */}
      <div className="absolute top-20 right-20 w-72 h-72 bg-indigo-200/30 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 left-20 w-96 h-96 bg-blue-100/40 rounded-full blur-3xl"></div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Badge */}
        <div className="inline-flex items-center gap-2 bg-indigo-100 text-indigo-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
          <span className="w-2 h-2 bg-indigo-500 rounded-full"></span>
          Modern Learning Platform
        </div>

        {/* Main Heading */}
        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold text-indigo-950 leading-tight mb-6">
          Master New Skills. <br />
          <span className="text-indigo-600">Achieve Your Goals.</span>
        </h1>

        {/* Subtext */}
        <p className="text-lg sm:text-xl text-gray-500 max-w-xl mb-10 leading-relaxed">
          Empower your journey with EDemy's modern learning platform. 
          Accessible, engaging courses tailored for your success.
        </p>

        {/* CTA Buttons */}
        <div className="flex items-center gap-4 flex-wrap">
          <a href="/courses" className="px-8 py-3 bg-indigo-600 text-white text-sm font-semibold rounded-xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200">
            Explore Courses
          </a>
          <a href="/about" className="px-8 py-3 text-indigo-700 text-sm font-semibold rounded-xl border border-indigo-200 hover:bg-indigo-50 transition-all">
            Learn More →
          </a>
        </div>

        {/* Stats Row */}
        <div className="flex items-center gap-10 mt-16 flex-wrap">
          <div>
            <p className="text-3xl font-bold text-indigo-950">10k+</p>
            <p className="text-sm text-gray-400 mt-1">Students Enrolled</p>
          </div>
          <div className="w-px h-10 bg-gray-200"></div>
          <div>
            <p className="text-3xl font-bold text-indigo-950">200+</p>
            <p className="text-sm text-gray-400 mt-1">Courses Available</p>
          </div>
          <div className="w-px h-10 bg-gray-200"></div>
          <div>
            <p className="text-3xl font-bold text-indigo-950">98%</p>
            <p className="text-sm text-gray-400 mt-1">Satisfaction Rate</p>
          </div>
        </div>

      </div>
    </div>
  )
}

export default Hero