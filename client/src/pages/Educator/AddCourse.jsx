import React from 'react'
import { useNavigate } from 'react-router-dom'
import { assets } from '../../assets2/assets.js'

const AddCourse = () => {
  const navigate = useNavigate()

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-8 md:p-12 text-center max-w-3xl mx-auto my-6">
      <div className="w-20 h-20 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-inner">
        <img 
          src={assets.add_icon} 
          alt="Add Course" 
          className="w-10 h-10" 
          style={{ filter: 'invert(33%) sepia(87%) saturate(1915%) hue-rotate(209deg) brightness(97%) contrast(97%)' }} 
        />
      </div>
      <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">Create a New Course</h2>
      <p className="text-slate-500 text-sm md:text-base mt-3 max-w-xl mx-auto leading-relaxed">
        Design your curriculum, upload tutorials, define chapters, set discounts, and share your technical knowledge with thousands of eager learners.
      </p>
      
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-10 text-left">
        <div className="p-5 bg-slate-50 rounded-xl border border-slate-100">
          <span className="text-xs font-bold text-blue-600 uppercase tracking-widest">Step 1</span>
          <h4 className="font-bold text-slate-800 mt-2">Course Info</h4>
          <p className="text-xs text-slate-500 mt-1 leading-snug">Set up titles, descriptions, discount percentages, and key thumbnails.</p>
        </div>
        <div className="p-5 bg-slate-50 rounded-xl border border-slate-100">
          <span className="text-xs font-bold text-blue-600 uppercase tracking-widest">Step 2</span>
          <h4 className="font-bold text-slate-800 mt-2">Build Syllabus</h4>
          <p className="text-xs text-slate-500 mt-1 leading-snug">Organize lectures and group them clean into custom chapters.</p>
        </div>
        <div className="p-5 bg-slate-50 rounded-xl border border-slate-100">
          <span className="text-xs font-bold text-blue-600 uppercase tracking-widest">Step 3</span>
          <h4 className="font-bold text-slate-800 mt-2">Go Live</h4>
          <p className="text-xs text-slate-500 mt-1 leading-snug">Publish drafts instantly onto the EDemy course library.</p>
        </div>
      </div>

      <button 
        onClick={() => navigate('/educator/add-course/form')}
        className="cursor-pointer mt-10 px-8 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm rounded-xl transition-all shadow-md shadow-blue-600/10 hover:scale-[1.01]"
      >
        Get Started
      </button>
    </div>
  )
}

export default AddCourse
