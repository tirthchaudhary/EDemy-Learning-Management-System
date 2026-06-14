import React, { useState, useEffect } from 'react'
import { assets } from '../../assets2/assets'
import { useNavigate } from 'react-router-dom'

const Searchbar = ({ data }) => {

  const navigate = useNavigate()
  const [input, setInput] = useState(data ? data : '')

  useEffect(() => {
    setInput(data ? data : '')
  }, [data])

  const onSearchHandler = (e) => {
    e.preventDefault()
    navigate('/course-list/' + input)
  }

  return (
    <div className='w-full from-slate-50 via-blue-50 to-indigo-100 py-12 px-4'>
      <div className='max-w-7xl mx-auto flex flex-col items-center gap-6'>

        {/* Label */}
        <div className='text-center'>
          <div className='inline-flex items-center gap-2 bg-indigo-100 text-indigo-700 px-4 py-2 rounded-full text-sm font-medium mb-4'>
            <span className='w-2 h-2 bg-indigo-500 rounded-full'></span>
            Find Your Course
          </div>
          <h3 className='text-2xl sm:text-3xl font-extrabold text-indigo-950'>
            What do you want to learn today?
          </h3>
          <p className='text-gray-400 text-sm mt-2'>
            Search from 200+ courses across design, code, business & more
          </p>
        </div>

        {/* Search Form */}
        <form
          onSubmit={onSearchHandler}
          className='w-full max-w-2xl flex items-center bg-white border border-indigo-100 rounded-2xl shadow-md shadow-indigo-100 overflow-hidden px-4 py-2 gap-3'
        >
          <img
            src={assets.search_icon}
            alt="search"
            className='w-5 h-5 opacity-40 flex-shrink-0'
          />
          <input
            onChange={e => setInput(e.target.value)}
            value={input}
            type="text"
            placeholder='e.g. React, UI Design, Python...'
            className='flex-1 h-full outline-none text-sm text-gray-700 placeholder-gray-300 bg-transparent'
          />
          <button
            type='submit'
            className='cursor-pointer bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold px-6 py-2.5 rounded-xl transition-all shadow-sm shadow-indigo-200 flex-shrink-0'
          >
            Search
          </button>
        </form>

        {/* Popular Tags */}
        <div className='flex flex-wrap items-center justify-center gap-2'>
          <span className='text-xs text-gray-400 font-medium'>Popular:</span>
          {['React', 'Python', 'UI/UX', 'Node.js', 'Data Science'].map((tag) => (
            <button
              key={tag}
              onClick={() => navigate('/course-list'+`/${encodeURIComponent(tag)}`)}
              className='text-xs text-indigo-600 bg-indigo-50 hover:bg-indigo-600 hover:text-white px-3 py-1.5 rounded-full font-medium transition-all duration-200'
            >
              {tag}
            </button>
          ))}
        </div>

      </div>
    </div>
  )
}

export default Searchbar