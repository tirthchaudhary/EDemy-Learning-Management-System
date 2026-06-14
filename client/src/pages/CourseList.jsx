import React, { useEffect, useState, useContext } from 'react'
import { useParams } from 'react-router-dom'
import Searchbar from '../components/common/Searchbar.jsx';
import { dummyCourses } from '../assets2/assets.js'
import CourseCard from '../components/common/CourseCard.jsx';
import { AppContext } from '../context/AppContext.jsx';

const CourseList = () => {
  const { input } = useParams();
  const decodedInput = input ? decodeURIComponent(input) : '';
  const [filteredCourses, setFilteredCourses] = useState([]);
  const { allCourses } = useContext(AppContext);

  useEffect(() => {
    if (decodedInput) {
      const results = allCourses.filter(course =>
        course.courseTitle.toLowerCase().includes(decodedInput.toLowerCase())
      );
      setFilteredCourses(results);
    } else {
      setFilteredCourses(allCourses);
    }
  }, [decodedInput, allCourses]);

  return (
    <div className='px-6 md:px-16 lg:px-24 py-8'>
      <Searchbar data={input} />

      <h2 className='text-xl font-semibold text-gray-800 mb-6'>
        {input ? `Results for "${input}"` : 'All Courses'}
      </h2>

      {/* Grid OUTSIDE the map */}
      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5'>
        {filteredCourses.map(course => (
          <CourseCard key={course._id} course={course} />
        ))}
      </div>
    </div>
  )
}

export default CourseList
