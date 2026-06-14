import React, { useEffect, useState } from 'react'
import axios from 'axios'

const MyCourses = () => {
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:3000/courses/educator', {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (response.data.success) {
          setCourses(response.data.courses);
        }
      } catch (err) {
        console.error("Failed to fetch courses:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-slate-800 mb-2">My Courses</h2>
        <p className="text-sm text-slate-500">Manage and update all the courses you have created on the platform.</p>
      </div>

      {courses.length === 0 ? (
        <div className="mt-8 text-center py-12 bg-slate-50 rounded-2xl border border-slate-100">
          <p className="text-slate-500 font-medium">You haven't uploaded any courses yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {courses.map((course) => {
            // Calculate discounted price
            const discountedPrice = (course.coursePrice - (course.discount * course.coursePrice) / 100).toFixed(2);
            const thumbnailUrl = course.courseThumbnail.startsWith('http')
              ? course.courseThumbnail
              : `http://localhost:3000/${course.courseThumbnail}`;
            return (
              <div
                key={course._id}
                className="bg-white border border-slate-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300"
              >
                {/* Course Image */}
                <div className="aspect-video w-full overflow-hidden bg-slate-100 relative">
                  <img
                    src={thumbnailUrl}
                    alt={course.courseTitle}
                    className="w-full h-full object-cover"
                  />
                  {course.discount > 0 && (
                    <span className="absolute top-2.5 left-2.5 bg-indigo-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
                      {course.discount}% OFF
                    </span>
                  )}
                </div>

                {/* Course Details */}
                <div className="p-4 space-y-3">
                  <h3 className="font-bold text-slate-800 text-sm line-clamp-2 min-h-[40px]">
                    {course.courseTitle}
                  </h3>

                  <div className="flex items-baseline gap-2">
                    <span className="text-base font-bold text-indigo-600">
                      ${discountedPrice}
                    </span>
                    {course.discount > 0 && (
                      <span className="text-xs text-slate-400 line-through">
                        ${course.coursePrice.toFixed(2)}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  )
}

export default MyCourses;
