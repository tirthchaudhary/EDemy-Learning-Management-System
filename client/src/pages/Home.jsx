import React from 'react'
import Navbar from '../components/layout/Navbar'
import Hero from '../components/home/Hero'
import Companies from '../components/home/Companies'
import Searchbar from '../components/common/Searchbar'
import Testmonial from '../components/home/Testimonial'
import CourseSection from '../components/home/CourseSection'
import Footer from '../components/home/Footer'

const Home = () => {
  return (
    <div>
      <div className='flex flex-col w-full bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100'>
      <Navbar/>
      <Hero/>
      <Companies/>
      <Searchbar/>
      <CourseSection/>
      <Testmonial/>
      <Footer/>
      </div>
    </div>
  )
}

export default Home
