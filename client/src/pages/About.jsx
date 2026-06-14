import React, { useContext } from 'react';
import { AppContext } from '../context/AppContext';

 const AboutPage =()=>{
  // Mock data for key statistics
  const stats = [
    { label: 'Active Learners', value: '10,000+' },
    { label: 'Expert Instructors', value: '50+' },
    { label: 'Total Courses', value: '120+' },
    { label: 'Success Rate', value: '94%' },
  ];

  const {navigate}=useContext(AppContext);

  // Core values array
  const coreValues = [
    {
      title: 'Accessible Excellence',
      description: 'We believe premium technical education should not be locked behind massive price tags. We provide top-tier learning resources for everyone.',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      )
    },
    {
      title: 'Practical Learning',
      description: 'Our platform bypasses pure theory. We focus heavily on project-building, interactive assignments, and production-ready architectures.',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
        </svg>
      )
    },
    {
      title: 'Community First',
      description: 'Learning alone is hard. We foster vibrant community ecosystems where peer-to-peer debugging and collective growth thrive.',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      )
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans">
      
      {/* Hero Header Section */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-20 px-4 text-center">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
          Empowering the Next Generation of Tech Leaders
        </h1>
        <p className="text-blue-100 text-lg max-w-2xl mx-auto">
          We are dedicated to closing the gap between academic education and industry requirements through a structured, interactive learning platform.
        </p>
      </div>

      {/* Main Narrative Section */}
      <div className="max-w-6xl mx-auto px-4 py-16 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <div>
          <h2 className="text-xs font-bold text-blue-600 uppercase tracking-wider mb-2">Our Story</h2>
          <h3 className="text-3xl font-bold text-slate-900 mb-6">Driven by a Vision to Revolutionize Education</h3>
          <p className="text-slate-600 mb-4 leading-relaxed">
            Founded with the belief that anyone can master complex software engineering concepts if given the right roadmaps, our Learning Management System is designed for impact. We strip away the unnecessary noise and deliver laser-focused curriculums.
          </p>
          <p className="text-slate-600 leading-relaxed">
            Whether you are picking up programming for the first time or deep-diving into complex technical stacks, our platform scales with your pace. We combine interactive code execution, guided learning modules, and expert instruction into one seamless dashboard.
          </p>
        </div>
        
        {/* Visual Graphic Representation */}
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 grid grid-cols-2 gap-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/10 rounded-full blur-xl"></div>
          {stats.map((stat, idx) => (
            <div key={idx} className="p-6 bg-slate-50/60 rounded-xl border border-slate-100 text-center">
              <p className="text-3xl md:text-4xl font-extrabold text-blue-600">{stat.value}</p>
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mt-2">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Core Values Section */}
      <div className="bg-white border-y border-slate-100 py-16">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center max-w-xl mx-auto mb-12">
            <h2 className="text-xs font-bold text-blue-600 uppercase tracking-wider mb-2">Our Foundation</h2>
            <p className="text-3xl font-bold text-slate-900">The Values That Shape Us</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {coreValues.map((value, idx) => (
              <div key={idx} className="p-6 rounded-2xl bg-slate-50 border border-slate-100 hover:border-blue-200 transition-colors group">
                <div className="bg-blue-600 text-white p-3 rounded-xl inline-block shadow-sm group-hover:scale-105 transition-transform">
                  {value.icon}
                </div>
                <h4 className="text-xl font-bold text-slate-900 mt-4 mb-2">{value.title}</h4>
                <p className="text-sm text-slate-600 leading-relaxed">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Leadership Profile Section */}
      <div className="max-w-6xl mx-auto px-4 py-16 text-center">
        <h2 className="text-xs font-bold text-blue-600 uppercase tracking-wider mb-2">The Brains Behind the Platform</h2>
        <h3 className="text-3xl font-bold text-slate-900 mb-12">Meet Our Founder</h3>

        <div className="max-w-md mx-auto bg-white p-8 rounded-3xl shadow-sm border border-slate-100 relative group hover:shadow-md transition-all">
          {/* Avatar Placeholder with Initials */}
          <div className="w-24 h-24 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-2xl mx-auto flex items-center justify-center text-white text-3xl font-bold tracking-wider shadow-inner transform group-hover:rotate-3 transition-transform">
            TC
          </div>

          <h4 className="text-2xl font-bold text-slate-900 mt-6">Tirth Chaudhary</h4>
          <p className="text-sm font-semibold text-blue-600 uppercase tracking-wider mt-1">Founder & Chief Architect</p>
          
          <p className="text-slate-500 text-sm mt-4 leading-relaxed">
            Tirth built this platform to tackle the common roadblocks students face when entering the developer ecosystem. By combining high-performance platform speeds with direct educational tracking, his vision forms the backbone of our daily student success metrics.
          </p>

          <div className="flex justify-center space-x-4 mt-6">
            {/* Simple Email Social Link */}
            <a href="mailto:chaudharytirth23@gmail.com" className="text-slate-400 hover:text-blue-600 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
              </svg>
            </a>
          </div>
        </div>
      </div>

      {/* Bottom CTA (Call To Action) */}
      <div className="max-w-5xl mx-auto px-4 pb-16">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-3xl p-8 md:p-12 text-center text-white shadow-xl">
          <h3 className="text-2xl md:text-3xl font-bold mb-3">Ready to Accelerate Your Career?</h3>
          <p className="text-blue-100 max-w-xl mx-auto text-sm md:text-base mb-6">
            Join thousands of active tech enthusiasts building live features, analyzing real code structures, and refining engineering instincts.
          </p>
          <button onClick={()=>navigate('/courses')} className="bg-white text-blue-600 font-semibold px-8 py-3 rounded-xl hover:bg-blue-50 transition-colors shadow-sm">
            Explore Courses
          </button>
        </div>
      </div>

    </div>
  );
}

export default AboutPage