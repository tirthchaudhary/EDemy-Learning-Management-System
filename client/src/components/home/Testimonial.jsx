import React from 'react'
import { assets, dummyTestimonial } from '../../assets2/assets'

const Testimonial = () => {
  return (
    <div className='w-full from-slate-50 via-blue-50 to-indigo-100 py-20 px-4'>
      <div className='max-w-7xl mx-auto'>

        {/* Header */}
        <div className='text-center mb-14'>
          <div className='inline-flex items-center gap-2 bg-indigo-100 text-indigo-700 px-4 py-2 rounded-full text-sm font-medium mb-4'>
            <span className='w-2 h-2 bg-indigo-500 rounded-full'></span>
            Student Reviews
          </div>
          <h2 className='text-4xl sm:text-5xl font-extrabold text-indigo-950 mb-4'>
            What Our Learners Say
          </h2>
          <p className='text-gray-500 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed'>
            Hear from our learners as they share their journeys of transformation, success, 
            and how our platform has made a difference in their lives.
          </p>
        </div>

        {/* Cards Grid */}
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8'>
          {dummyTestimonial.map((testimonial, index) => (
            <div
              key={index}
              className='group flex flex-col bg-white/70 backdrop-blur-sm border border-indigo-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:shadow-indigo-100 hover:-translate-y-1 transition-all duration-300'
            >
              {/* Card Header */}
              <div className='flex items-center gap-4 px-6 py-5 bg-gradient-to-r from-indigo-50 to-blue-50 border-b border-indigo-100'>
                <div className='relative'>
                  <img
                    className='h-14 w-14 rounded-full object-cover ring-2 ring-indigo-200'
                    src={testimonial.image}
                    alt={testimonial.name}
                  />
                  <span className='absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white'></span>
                </div>
                <div>
                  <h3 className='text-base font-semibold text-indigo-950'>{testimonial.name}</h3>
                  <p className='text-sm text-indigo-400 font-medium'>{testimonial.role}</p>
                </div>
              </div>

              {/* Card Body */}
              <div className='flex flex-col flex-1 p-6'>
                {/* Stars */}
                <div className='flex gap-1 mb-4'>
                  {[...Array(5)].map((_, i) => (
                    <img
                      key={i}
                      className='h-4 w-4'
                      src={i < testimonial.rating ? assets.star : assets.star_blank}
                      alt='star'
                    />
                  ))}
                  <span className='text-xs text-gray-400 ml-2 mt-0.5'>{testimonial.rating}.0</span>
                </div>

                {/* Feedback */}
                <p className='text-gray-500 text-sm leading-relaxed flex-1'>
                  "{testimonial.feedback}"
                </p>

                {/* Read More */}
                <div className='mt-6 pt-4 border-t border-indigo-50'>
                   <a
                    href='#'
                    className='inline-flex items-center gap-1 text-sm text-indigo-600 font-medium hover:text-indigo-800 transition-colors'
                 >
                    Read full story
                    <span className='group-hover:translate-x-1 transition-transform duration-200'>→</span>
                  </a>
                </div>
              </div>

            </div>
          ))}
        </div>

      </div>
    </div>
  )
}

export default Testimonial
