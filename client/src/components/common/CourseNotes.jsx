import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AppContext } from '../../context/AppContext';
import { toast } from 'react-hot-toast';

const CourseNotes = ({ courseId, educatorId }) => {
    const { userData } = useContext(AppContext);
    const [notes, setNotes] = useState([]);
    const [loading, setLoading] = useState(true);

    // Form state for educator upload
    const [title, setTitle] = useState('');
    const [file, setFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [showUploadModal, setShowUploadModal] = useState(false);

    const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000';

    // Check if the currently logged-in user is the educator of this course
    const isCourseEducator =
        userData &&
        userData.role === 'educator' &&
        (userData._id === educatorId || userData.id === educatorId);

    // Fetch notes for this course
    const fetchNotes = async () => {
        try {
            const response = await axios.get(`${backendUrl}/courses/notes/${courseId}`);
            if (response.data.success) {
                setNotes(response.data.notes);
            }
        } catch (error) {
            console.error('Error fetching course notes:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (courseId) {
            fetchNotes();
        }
    }, [courseId]);

    // Format bytes to KB / MB
    const formatFileSize = (bytes) => {
        if (!bytes || bytes === 0) return '0 KB';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
    };

    // Handle Note Upload
    const handleUpload = async (e) => {
        e.preventDefault();
        if (!title.trim() || !file) {
            toast.error('Please enter a title and select a file.');
            return;
        }

        const formData = new FormData();
        formData.append('courseId', courseId);
        formData.append('title', title);
        formData.append('noteFile', file);

        setUploading(true);
        const toastId = toast.loading('Uploading note...');

        try {
            const token = localStorage.getItem('token');
            const response = await axios.post(`${backendUrl}/courses/notes/upload`, formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data',
                },
            });

            if (response.data.success) {
                toast.success('Note uploaded successfully!', { id: toastId });
                setTitle('');
                setFile(null);
                setShowUploadModal(false);
                fetchNotes(); // refresh list
            }
        } catch (error) {
            const msg = error.response?.data?.message || 'Failed to upload note';
            toast.error(msg, { id: toastId });
        } finally {
            setUploading(false);
        }
    };

    // Handle Note Delete
    const handleDelete = async (noteId) => {
        if (!window.confirm('Are you sure you want to delete this note?')) return;

        const toastId = toast.loading('Deleting note...');
        try {
            const token = localStorage.getItem('token');
            const response = await axios.delete(`${backendUrl}/courses/notes/${noteId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.data.success) {
                toast.success('Note deleted successfully!', { id: toastId });
                setNotes((prev) => prev.filter((n) => n._id !== noteId));
            }
        } catch (error) {
            const msg = error.response?.data?.message || 'Failed to delete note';
            toast.error(msg, { id: toastId });
        }
    };

    return (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-4">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-lg font-bold text-slate-900">Course Notes & Resources</h3>
                    <p className="text-xs text-slate-500">Official study material and cheat sheets provided for this course.</p>
                </div>

                {/* Upload Button visible only to the Course Educator */}
                {isCourseEducator && (
                    <button
                        onClick={() => setShowUploadModal(true)}
                        className="cursor-pointer bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-3.5 py-2 rounded-xl transition-all shadow-sm flex items-center gap-1.5"
                    >
                        <span>+</span> Upload Note
                    </button>
                )}
            </div>

            {/* Loading State */}
            {loading ? (
                <div className="py-8 text-center">
                    <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                </div>
            ) : notes.length === 0 ? (
                /* Empty State */
                <div className="text-center py-8 bg-slate-50/60 rounded-xl border border-dashed border-slate-200">
                    <p className="text-sm font-medium text-slate-500">No notes uploaded yet for this course.</p>
                    {isCourseEducator && (
                        <p className="text-xs text-slate-400 mt-1">Click the "Upload Note" button above to add study material.</p>
                    )}
                </div>
            ) : (
                /* Notes List */
                <div className="space-y-3">
                    {notes.map((note) => (
                        <div
                            key={note._id}
                            className="flex items-center justify-between p-3.5 rounded-xl border border-slate-100 hover:border-slate-200 bg-slate-50/40 hover:bg-slate-50 transition-all gap-4"
                        >
                            <div className="flex items-center gap-3 min-w-0">
                                {/* File Type Badge */}
                                <div className="w-10 h-10 rounded-lg bg-blue-100/80 text-blue-700 font-bold text-[11px] uppercase flex items-center justify-center flex-shrink-0">
                                    {note.fileType || 'PDF'}
                                </div>
                                <div className="min-w-0">
                                    <h4 className="text-sm font-semibold text-slate-800 truncate">
                                        {note.title}
                                    </h4>
                                    <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-0.5">
                                        <span>{formatFileSize(note.fileSize)}</span>
                                        <span>•</span>
                                        <span>{new Date(note.createdAt).toLocaleDateString('en-GB')}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex items-center gap-2 flex-shrink-0">
                                <a
                                    href={`${backendUrl}/courses/notes/download/${note._id}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    download
                                    className="cursor-pointer bg-white hover:bg-blue-50 text-blue-600 border border-slate-200 hover:border-blue-200 px-3 py-1.5 rounded-lg text-xs font-semibold shadow-2xs transition-all flex items-center gap-1"
                                >
                                    <span>Download</span>
                                </a>

                                {isCourseEducator && (
                                    <button
                                        onClick={() => handleDelete(note._id)}
                                        className="cursor-pointer text-rose-500 hover:bg-rose-50 px-2 py-1.5 rounded-lg text-xs font-semibold transition-all"
                                        title="Delete Note"
                                    >
                                        Delete
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Modal for Educator to Upload Note */}
            {showUploadModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
                    <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl border border-slate-100 space-y-4">
                        <div className="flex items-center justify-between">
                            <h3 className="text-base font-bold text-slate-900">Upload Course Note</h3>
                            <button
                                onClick={() => setShowUploadModal(false)}
                                className="text-slate-400 hover:text-slate-600 text-lg cursor-pointer"
                            >
                                ✕
                            </button>
                        </div>

                        <form onSubmit={handleUpload} className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-700 mb-1">
                                    Note Title <span className="text-rose-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    placeholder="e.g. Chapter 1 Summary & Cheat Sheet"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-blue-600"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-700 mb-1">
                                    File (PDF, Doc, Image) <span className="text-rose-500">*</span>
                                </label>
                                <input
                                    type="file"
                                    accept=".pdf,.doc,.docx,.ppt,.pptx,.txt,image/*"
                                    onChange={(e) => setFile(e.target.files[0])}
                                    className="w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer border border-slate-200 rounded-xl p-1"
                                    required
                                />
                            </div>

                            <div className="flex items-center justify-end gap-2 pt-2">
                                <button
                                    type="button"
                                    onClick={() => setShowUploadModal(false)}
                                    className="cursor-pointer px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition-all"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={uploading}
                                    className="cursor-pointer bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-xs font-bold px-4 py-2 rounded-xl transition-all shadow-sm"
                                >
                                    {uploading ? 'Uploading...' : 'Upload File'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CourseNotes;