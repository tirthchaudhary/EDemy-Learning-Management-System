import React, { useContext } from 'react'
import { Link } from 'react-router-dom'
import { AppContext } from '../../context/AppContext'
import CourseCard from '../common/CourseCard.jsx'

const CourseSection = () => {

  const { allCourses } = useContext(AppContext)

  return (
    <div className='w-full from-slate-50 via-blue-50 to-indigo-100 py-20 px-4'>
      <div className='max-w-7xl mx-auto'>

        {/* Header */}
        <div className='text-center mb-12'>
          <div className='inline-flex items-center gap-2 bg-indigo-100 text-indigo-700 px-4 py-2 rounded-full text-sm font-medium mb-4'>
            <span className='w-2 h-2 bg-indigo-500 rounded-full'></span>
            Top Rated Courses
          </div>
          <h2 className='text-4xl sm:text-5xl font-extrabold text-indigo-950 mb-4'>
            Learn from the Best
          </h2>
          <p className='text-gray-500 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed'>
            Discover our top-rated courses across various categories. From coding
            and design to business and wellness, our courses are crafted to deliver results.
          </p>
        </div>

        {/* Grid — 1 col mobile, 2 col tablet, 3 col mid, 4 col desktop */}
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
          {allCourses.slice(0, 8).map((course, index) => (
            <CourseCard key={index} course={course} />
          ))}
        </div>

        {/* Show All Button */}
        <div className='mt-12 flex justify-center'>
          <Link
            to='/course-list'
            onClick={() => scrollTo(0, 0)}
            className='group inline-flex items-center gap-2 px-8 py-3 bg-indigo-600 text-white text-sm font-semibold rounded-xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200'
          >
            Browse All Courses
            <span className='group-hover:translate-x-1 transition-transform duration-200'>→</span>
          </Link>
        </div>

      </div>
    </div>
  )
}

export default CourseSection