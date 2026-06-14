import React, { useContext } from 'react'
import { assets } from '../../assets2/assets.js'
import { AppContext } from '../../context/AppContext'
import { Link } from 'react-router-dom'

const CourseCard = ({ course }) => {
  const { currency, calculateRating } = useContext(AppContext)

  const rating = calculateRating(course)
  const discountedPrice = (course.coursePrice - course.discount * course.coursePrice / 100).toFixed(2)
  const originalPrice = course.coursePrice.toFixed(2)
  const thumbnailUrl = course.courseThumbnail.startsWith('http')
    ? course.courseThumbnail
    : `http://localhost:3000/${course.courseThumbnail}`;

  return (
    <Link
      to={'/course/' + course._id}
      onClick={() => scrollTo(0, 0)}
      className='group flex flex-col bg-white border border-gray-100 rounded-xl overflow-hidden hover:-translate-y-1 hover:border-indigo-200 transition-all duration-300'
    >
      {/* Thumbnail — 16:9 ratio, scales with card width */}
      <div className='relative w-full overflow-hidden' style={{ aspectRatio: '16/9' }}>
        <img
          className='w-full h-full object-cover group-hover:scale-105 transition-transform duration-500'
          src={thumbnailUrl}
          alt={course.courseTitle}
        />
        {course.discount > 0 && (
          <div className='absolute top-2 left-2 bg-indigo-600 text-white text-xs font-medium px-2.5 py-1 rounded-full'>
            {course.discount}% OFF
          </div>
        )}
      </div>

      {/* Content */}
      <div className='flex flex-col flex-1 p-3.5 gap-2'>

        {/* Title */}
        <h3 className='text-sm font-medium text-gray-900 leading-snug line-clamp-2 group-hover:text-indigo-600 transition-colors duration-200'>
          {course.courseTitle}
        </h3>

        {/* Educator */}
        <p className='text-xs text-gray-400'>by Edemy Educator</p>

        {/* Rating */}
        <div className='flex items-center gap-1.5'>
          <span className='text-xs font-medium text-amber-500'>{rating}</span>
          <div className='flex items-center gap-0.5'>
            {[...Array(5)].map((_, i) => (
              <img
                key={i}
                className='w-2.5 h-2.5'
                src={i < Math.floor(rating) ? assets.star : assets.star_blank}
                alt='star'
              />
            ))}
          </div>
          <span className='text-xs text-gray-400'>({course.courseRatings.length})</span>
        </div>

        <div className='h-px bg-gray-100'></div>

        {/* Price row */}
        <div className='flex items-center justify-between'>
          <div className='flex items-center gap-1.5'>
            <span className='text-sm font-medium text-indigo-700'>
              {currency}{discountedPrice}
            </span>
            {course.discount > 0 && (
              <span className='text-xs text-gray-400 line-through'>
                {currency}{originalPrice}
              </span>
            )}
          </div>
          <span className='text-xs text-indigo-600 bg-indigo-50 group-hover:bg-indigo-600 group-hover:text-white px-2.5 py-1 rounded-full transition-all duration-200'>
            Enroll →
          </span>
        </div>

      </div>
    </Link>
  )
}

export default CourseCard