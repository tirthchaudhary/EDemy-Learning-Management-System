import React from 'react'

const Loading = () => {
  return (
    <div className='min-h-screen flex flex-col items-center justify-center gap-4 bg-gray-50'>
      
      {/* Spinner */}
      <div className='relative w-16 h-16'>
        {/* Outer ring */}
        <div className='absolute inset-0 rounded-full border-4 border-indigo-100'></div>
        {/* Spinning arc */}
        <div className='absolute inset-0 rounded-full border-4 border-transparent border-t-indigo-600 animate-spin'></div>
        {/* Inner dot */}
        <div className='absolute inset-0 flex items-center justify-center'>
          <div className='w-2 h-2 bg-indigo-600 rounded-full animate-pulse'></div>
        </div>
      </div>

      {/* Text */}
      <div className='flex flex-col items-center gap-1'>
        <p className='text-sm font-semibold text-indigo-700 tracking-wide'>Loading</p>
        <div className='flex gap-1'>
          <span className='w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce' style={{animationDelay:'0ms'}}></span>
          <span className='w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce' style={{animationDelay:'150ms'}}></span>
          <span className='w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce' style={{animationDelay:'300ms'}}></span>
        </div>
      </div>

    </div>
  )
}

export default Loading