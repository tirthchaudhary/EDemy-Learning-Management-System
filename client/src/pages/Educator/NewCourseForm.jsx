import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { assets } from '../../assets2/assets.js'
import axios from 'axios'
import { toast } from 'react-hot-toast'

const NewCourseForm = () => {
  const navigate = useNavigate()

  // Form State
  const [courseTitle, setCourseTitle] = useState('')
  const [courseDescription, setCourseDescription] = useState('')
  const [coursePrice, setCoursePrice] = useState('')
  const [discount, setDiscount] = useState('')
  const [courseThumbnail, setCourseThumbnail] = useState(null)
  const [thumbnailPreview, setThumbnailPreview] = useState(null)

  // Curriculum State
  const [chapters, setChapters] = useState([])

  // Temporary states for adding items
  const [showAddLectureModal, setShowAddLectureModal] = useState(false)
  const [activeChapterId, setActiveChapterId] = useState(null)

  const [lectureTitle, setLectureTitle] = useState('')
  const [lectureDuration, setLectureDuration] = useState('')
  const [lectureUrl, setLectureUrl] = useState('')
  const [isPreviewFree, setIsPreviewFree] = useState(false)

  // Handlers
  const handleThumbnailChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setCourseThumbnail(file)
      setThumbnailPreview(URL.createObjectURL(file))
    }
  }

  const handleAddChapter = () => {
    const title = prompt("Enter Chapter Title:")
    if (!title || title.trim() === '') return

    const newChapter = {
      chapterId: Date.now().toString(),
      chapterTitle: title,
      chapterOrder: chapters.length + 1,
      chapterContent: []
    }
    setChapters([...chapters, newChapter])
  }

  const handleRemoveChapter = (chapterId) => {
    setChapters(chapters.filter(ch => ch.chapterId !== chapterId))
  }

  const openAddLecture = (chapterId) => {
    setActiveChapterId(chapterId)
    setShowAddLectureModal(true)
  }


  const handleAddLecture = (e) => {
    e.preventDefault()
    if (!lectureTitle.trim() || !lectureDuration || !lectureUrl.trim()) {
      toast.error("Please fill in all lecture details.")
      return
    }

    const targetedChapter = chapters.find(ch => ch.chapterId === activeChapterId);
    const lectureOrder = targetedChapter.chapterContent.length + 1;

    const newLecture = {
      lectureId: Date.now().toString(),
      lectureTitle: lectureTitle,
      lectureDuration: parseInt(lectureDuration),
      lectureUrl: lectureUrl,
      isPreviewFree: isPreviewFree,
      lectureOrder: lectureOrder,
    }

    setChapters(chapters.map(ch => {
      if (ch.chapterId === activeChapterId) {
        return {
          ...ch,
          chapterContent: [...ch.chapterContent, newLecture]
        }
      }
      return ch
    }))

    // Reset temporary lecture state
    setLectureTitle('')
    setLectureDuration('')
    setLectureUrl('')
    setIsPreviewFree(false)
    setShowAddLectureModal(false)
  }

  const handleRemoveLecture = (chapterId, lectureId) => {
    setChapters(chapters.map(ch => {
      if (ch.chapterId === chapterId) {
        return {
          ...ch,
          chapterContent: ch.chapterContent.filter(lec => lec.lectureId !== lectureId)
        }
      }
      return ch
    }))
  }

  const handleSubmitCourse = async (e) => {
    e.preventDefault()
    if (!courseTitle.trim() || !coursePrice || !courseDescription.trim()) {
      toast.error("Please enter course title, description, and price.")
      return
    }


    try {
      const formData = new FormData();
      formData.append("courseTitle", courseTitle);
      formData.append("courseDescription", courseDescription);
      formData.append("coursePrice", parseFloat(coursePrice));
      formData.append("discount", discount ? parseInt(discount) : 0);
      formData.append("courseThumbnail", courseThumbnail);
      formData.append("chapters", JSON.stringify(chapters));

      const token = localStorage.getItem('token');

      const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000'}/courses/create`, formData, { headers: { Authorization: `Bearer ${token}` } });
      toast.success(response.data.message);

      console.log("Submitting Course:", {
        courseTitle,
        courseDescription,
        coursePrice,
        discount: discount || 0,
        courseThumbnail,
        chapters
      });



      // Navigate back to course listing after publishing
      navigate('/educator/my-courses')

    }
    catch (err) {
      console.error(err);
      toast.error(err.response?.data?.error || "Failed to create course");
    }

  }

  return (
    <div className="space-y-8">

      {/* Top action header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Course Creator</h2>
          <p className="text-sm text-slate-400 mt-1">Configure your course metadata and curriculum details below.</p>
        </div>
        <button
          type="button"
          onClick={() => {
            if (confirm("Are you sure you want to cancel? Any unsaved progress will be lost.")) {
              navigate('/educator/add-course')
            }
          }}
          className="cursor-pointer text-xs font-semibold text-slate-500 hover:text-red-500 bg-white hover:bg-red-50 px-4 py-2 rounded-lg border border-slate-200 transition-colors"
        >
          Cancel Builder
        </button>
      </div>

      <form onSubmit={handleSubmitCourse} className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* Left Side: Course Metadata (2 Cols) */}
        <div className="lg:col-span-2 space-y-6">

          {/* Metadata Card */}
          <div className="bg-white p-6 md:p-8 rounded-2xl border border-slate-100 shadow-sm space-y-5">
            <h3 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3">Course Info</h3>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Course Title</label>
              <input
                type="text"
                placeholder="e.g. Master React & Node from Scratch"
                value={courseTitle}
                onChange={(e) => setCourseTitle(e.target.value)}
                className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 text-sm placeholder:text-slate-400"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Course Description</label>
              <textarea
                rows="5"
                placeholder="Write a compelling course intro description..."
                value={courseDescription}
                onChange={(e) => setCourseDescription(e.target.value)}
                className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 text-sm placeholder:text-slate-400 resize-none"
                required
              ></textarea>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Base Price ($)</label>
                <input
                  type="number"
                  step="0.01"
                  placeholder="e.g. 99.99"
                  value={coursePrice}
                  onChange={(e) => setCoursePrice(e.target.value)}
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 text-sm placeholder:text-slate-400"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Discount (%)</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  placeholder="e.g. 20"
                  value={discount}
                  onChange={(e) => setDiscount(e.target.value)}
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 text-sm placeholder:text-slate-400"
                />
              </div>
            </div>
          </div>

          {/* Curriculum Builder Card */}
          <div className="bg-white p-6 md:p-8 rounded-2xl border border-slate-100 shadow-sm space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-lg font-bold text-slate-900">Curriculum Syllabus</h3>
              <button
                type="button"
                onClick={handleAddChapter}
                className="cursor-pointer text-xs font-bold text-blue-600 hover:text-blue-700 bg-blue-50 px-3 py-1.5 rounded-lg transition-colors"
              >
                + Add Chapter
              </button>
            </div>

            {chapters.length === 0 ? (
              <div className="text-center py-10 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                <p className="text-sm text-slate-400 font-medium">No chapters added yet. Start by adding a chapter.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {chapters.map((chapter, index) => (
                  <div key={chapter.chapterId} className="border border-slate-100 rounded-xl overflow-hidden shadow-sm">
                    {/* Chapter Header */}
                    <div className="bg-slate-50 px-4 py-3 flex items-center justify-between border-b border-slate-100">
                      <div>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Chapter {index + 1}</span>
                        <h4 className="font-bold text-slate-800 text-sm">{chapter.chapterTitle}</h4>
                      </div>
                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          onClick={() => openAddLecture(chapter.chapterId)}
                          className="cursor-pointer text-xs font-semibold text-blue-600 hover:underline"
                        >
                          + Add Lecture
                        </button>
                        <button
                          type="button"
                          onClick={() => handleRemoveChapter(chapter.chapterId)}
                          className="cursor-pointer text-xs text-red-500 hover:underline"
                        >
                          Remove
                        </button>
                      </div>
                    </div>

                    {/* Lectures List */}
                    <div className="p-4 bg-white space-y-2.5">
                      {chapter.chapterContent.length === 0 ? (
                        <p className="text-xs text-slate-400 italic">No lectures in this chapter yet.</p>
                      ) : (
                        <div className="divide-y divide-slate-50">
                          {chapter.chapterContent.map((lecture, lIdx) => (
                            <div key={lecture.lectureId} className="flex items-center justify-between py-2 first:pt-0 last:pb-0 text-xs">
                              <div className="flex items-center gap-2">
                                <span className="w-5 h-5 bg-slate-100 rounded-full flex items-center justify-center font-bold text-[10px] text-slate-500">
                                  {lIdx + 1}
                                </span>
                                <div>
                                  <p className="font-bold text-slate-800">{lecture.lectureTitle}</p>
                                  <p className="text-[10px] text-slate-400">{lecture.lectureDuration} mins • {lecture.isPreviewFree ? "Free Preview" : "Paid Content"}</p>
                                </div>
                              </div>
                              <button
                                type="button"
                                onClick={() => handleRemoveLecture(chapter.chapterId, lecture.lectureId)}
                                className="cursor-pointer text-red-400 hover:text-red-600 transition-colors"
                              >
                                delete
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Side: Thumbnail & Publish (1 Col) */}
        <div className="space-y-6">

          {/* Thumbnail Panel */}
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">Course Image</h3>

            <div className="relative aspect-video rounded-xl overflow-hidden bg-slate-50 border border-slate-100 flex flex-col items-center justify-center p-4">
              {thumbnailPreview ? (
                <>
                  <img src={thumbnailPreview} alt="Preview" className="w-full h-full object-cover absolute inset-0" />
                  <button
                    type="button"
                    onClick={() => { setCourseThumbnail(null); setThumbnailPreview(null); }}
                    className="absolute top-2 right-2 bg-red-600/80 hover:bg-red-600 text-white rounded-full p-1.5 shadow transition-colors cursor-pointer"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </>
              ) : (
                <label className="cursor-pointer flex flex-col items-center justify-center text-center space-y-2">
                  <img src={assets.upload_area} alt="Upload" className="w-12 h-12 opacity-40" />
                  <div>
                    <p className="text-xs font-semibold text-slate-600">Click to upload thumbnail</p>
                    <p className="text-[10px] text-slate-400 mt-0.5">PNG, JPG or WEBP (Max 2MB)</p>
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleThumbnailChange}
                    className="hidden"
                  />
                </label>
              )}
            </div>
          </div>

          {/* Save/Publish Controls */}
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-3">
            <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">Publish Settings</h3>

            <button
              type="submit"
              className="cursor-pointer w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-xl transition-all shadow-md shadow-blue-600/10"
            >
              Publish Course
            </button>

            <button
              type="button"
              onClick={() => toast.success("Draft saved successfully!")}
              className="cursor-pointer w-full py-2.5 bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200/60 font-semibold text-xs rounded-xl transition-all"
            >
              Save as Draft
            </button>
          </div>
        </div>
      </form>

      {/* --- ADD LECTURE MODAL DIALOG --- */}
      {showAddLectureModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full overflow-hidden border border-slate-100 animate-in fade-in zoom-in-95 duration-200">
            <div className="bg-slate-50 px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <h3 className="font-bold text-slate-800">Add New Lecture</h3>
              <button
                type="button"
                onClick={() => setShowAddLectureModal(false)}
                className="text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleAddLecture} className="p-6 space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Lecture Title</label>
                <input
                  type="text"
                  placeholder="e.g. 1. Introduction & Setup"
                  value={lectureTitle}
                  onChange={(e) => setLectureTitle(e.target.value)}
                  className="w-full px-3 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-600 text-sm"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Duration (Minutes)</label>
                <input
                  type="number"
                  placeholder="e.g. 15"
                  value={lectureDuration}
                  onChange={(e) => setLectureDuration(e.target.value)}
                  className="w-full px-3 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-600 text-sm"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Video URL</label>
                <input
                  type="text"
                  placeholder="e.g. https://youtu.be/..."
                  value={lectureUrl}
                  onChange={(e) => setLectureUrl(e.target.value)}
                  className="w-full px-3 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-600 text-sm"
                  required
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="previewCheckbox"
                  checked={isPreviewFree}
                  onChange={(e) => setIsPreviewFree(e.target.checked)}
                  className="w-4 h-4 text-blue-600 focus:ring-blue-500 border-slate-300 rounded"
                />
                <label htmlFor="previewCheckbox" className="text-xs font-semibold text-slate-600 select-none cursor-pointer">
                  Make this lecture available for free preview
                </label>
              </div>

              <div className="flex gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddLectureModal(false)}
                  className="cursor-pointer flex-1 py-2.5 bg-slate-50 hover:bg-slate-100 text-slate-600 text-xs font-semibold rounded-xl border border-slate-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="cursor-pointer flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition-colors shadow-sm"
                >
                  Add Lecture
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  )
}

export default NewCourseForm
