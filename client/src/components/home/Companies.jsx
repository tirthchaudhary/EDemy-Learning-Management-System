import React from 'react'
import { assets } from '../../assets2/assets'

const Companies = () => {
  return (
    <div className='w-full  from-slate-50 via-blue-50 to-indigo-100 py-16 px-4'>
      
      <div className='max-w-7xl mx-auto text-center'>
        
        {/* Divider Line */}
        <div className='flex items-center gap-4 mb-8'>
          <div className='flex-1 h-px bg-indigo-100'></div>
          <p className='text-sm sm:text-base text-gray-400 font-medium tracking-wide uppercase'>
            Trusted by learners from
          </p>
          <div className='flex-1 h-px bg-indigo-100'></div>
        </div>

        {/* Logos */}
        <div className='flex flex-wrap items-center justify-center gap-8 sm:gap-12 md:gap-16'>
          
          <div className='group flex items-center justify-center p-4 rounded-xl hover:bg-white/60 transition-all duration-300'>
            <img src={assets.microsoft_logo} alt="Microsoft" className='w-20 sm:w-24 md:w-28 opacity-60 group-hover:opacity-100 transition-opacity duration-300'/>
          </div>

          <div className='group flex items-center justify-center p-4 rounded-xl hover:bg-white/60 transition-all duration-300'>
            <img src={assets.walmart_logo} alt="Walmart" className='w-20 sm:w-24 md:w-28 opacity-60 group-hover:opacity-100 transition-opacity duration-300'/>
          </div>

          <div className='group flex items-center justify-center p-4 rounded-xl hover:bg-white/60 transition-all duration-300'>
            <img src={assets.accenture_logo} alt="Accenture" className='w-20 sm:w-24 md:w-28 opacity-60 group-hover:opacity-100 transition-opacity duration-300'/>
          </div>

          <div className='group flex items-center justify-center p-4 rounded-xl hover:bg-white/60 transition-all duration-300'>
            <img src={assets.adobe_logo} alt="Adobe" className='w-20 sm:w-24 md:w-28 opacity-60 group-hover:opacity-100 transition-opacity duration-300'/>
          </div>

          <div className='group flex items-center justify-center p-4 rounded-xl hover:bg-white/60 transition-all duration-300'>
            <img src={assets.paypal_logo} alt="PayPal" className='w-20 sm:w-24 md:w-28 opacity-60 group-hover:opacity-100 transition-opacity duration-300'/>
          </div>

        </div>
      </div>
    </div>
  )
}

export default Companies