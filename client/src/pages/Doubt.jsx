import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function Doubt({ courseId, lectureId, lectureTitle }) {
    const [question, setQuestion] = useState('');
    const [replyInputs, setReplyInputs] = useState({}); // Stores reply input text per doubt: { [doubtId]: 'text' }    
    const [doubts, setDoubts] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchDoubts = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000'}/courses/doubts/${courseId}/${lectureId}`, { headers: { Authorization: `Bearer ${token}` } });

            if (response.data.success) {
                setDoubts(response.data.doubts);
            }
        } catch (error) {
            console.error("Error fetching doubts:", error);
        } finally {
            setLoading(false);
        }

    }

    const handleAskQuestion = async (e) => {
        e.preventDefault()
        if (!question.trim()) return;

        try {
            const token = localStorage.getItem('token');
            const response = await axios.post(
                `${import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000'}/courses/doubts/create`,
                {
                    courseId,
                    lectureId,
                    lectureTitle: lectureTitle || 'Lecture Video', // pass lecture title
                    question
                },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            if (response.data.success) {
                setQuestion('');
                fetchDoubts();
            }

        } catch (error) {
            console.error("Error asking question:", error);
        }
    }

    const handleReplySubmit = async (e, doubtId) => {
        e.preventDefault();
        const replyText = replyInputs[doubtId] || '';
        if (!replyText.trim()) return;

        try {
            const token = localStorage.getItem('token');
            const response = await axios.post(
                `${import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000'}/courses/doubts/reply/${doubtId}`,
                { replyText },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            if (response.data.success) {
                setReplyInputs(prev => ({ ...prev, [doubtId]: '' }));
                fetchDoubts();
            }

        } catch (error) {
            console.error("Error replying to doubt:", error);
        }
    }

    useEffect(() => {
        fetchDoubts();
    }, [courseId, lectureId])

    return (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-6">
            <div>
                <h3 className="font-bold text-slate-900 text-lg">Lecture Doubts & Discussion</h3>
                <p className="text-xs text-slate-400 mt-1">Ask questions regarding this active lecture or answer other students' queries.</p>
            </div>

            {/* Ask Doubt Form */}
            <form onSubmit={handleAskQuestion} className="space-y-3 flex flex-col">
                <textarea
                    rows="3"
                    placeholder="Ask a question about this lecture..."
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    className="w-full p-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-blue-600 resize-none bg-slate-50/50"
                />
                <button
                    type="submit"
                    disabled={!question.trim()}
                    className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-all self-end cursor-pointer disabled:opacity-50"
                >
                    Ask Question
                </button>
            </form>

            {/* Doubts List Feed */}
            <div className="space-y-6 divide-y divide-slate-100">
                {doubts.length === 0 ? (
                    <p className="text-slate-400 text-xs italic pt-4">No questions asked yet. Be the first to ask!</p>
                ) : (
                    doubts.map((doubt) => (
                        <div key={doubt._id} className="pt-5 first:pt-0 space-y-4">

                            {/* Question card */}
                            <div className="flex items-start gap-3">
                                <img
                                    src={doubt.user?.imageUrl}
                                    alt={doubt.user?.name}
                                    className="w-9 h-9 rounded-full object-cover border border-slate-100 shadow-xxs"
                                    onError={(e) => {
                                        e.target.src = 'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y';
                                    }}
                                />
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2">
                                        <span className="text-sm font-bold text-slate-800">{doubt.user?.name}</span>
                                        <span className="text-[10px] text-slate-400">{new Date(doubt.createdAt).toLocaleDateString('en-GB')}</span>
                                    </div>
                                    <p className="text-sm text-slate-700 mt-1">{doubt.question}</p>
                                </div>
                            </div>

                            {/* Replies list */}
                            {doubt.replies && doubt.replies.length > 0 && (
                                <div className="ml-9 pl-4 border-l-2 border-slate-100 space-y-3">
                                    {doubt.replies.map((reply) => (
                                        <div key={reply._id} className="flex items-start gap-2.5">
                                            <img
                                                src={reply.user?.imageUrl}
                                                alt={reply.user?.name}
                                                className="w-7 h-7 rounded-full object-cover border border-slate-100"
                                                onError={(e) => {
                                                    e.target.src = 'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y';
                                                }}
                                            />
                                            <div className="flex-1 min-w-0 bg-slate-50 p-2.5 rounded-xl">
                                                <div className="flex items-center gap-2">
                                                    <span className="text-xs font-bold text-slate-800">{reply.user?.name}</span>
                                                    <span className="text-[9px] text-slate-400">{new Date(reply.createdAt).toLocaleDateString('en-GB')}</span>
                                                </div>
                                                <p className="text-xs text-slate-600 mt-1">{reply.replyText}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* Reply form */}
                            <form onSubmit={(e) => handleReplySubmit(e, doubt._id)} className="ml-9 flex gap-2">
                                <input
                                    type="text"
                                    placeholder="Write an answer..."
                                    value={replyInputs[doubt._id] || ''}
                                    onChange={(e) => setReplyInputs(prev => ({ ...prev, [doubt._id]: e.target.value }))}
                                    className="flex-1 px-3 py-1.5 border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-blue-600 bg-slate-50/50"
                                />
                                <button
                                    type="submit"
                                    disabled={!(replyInputs[doubt._id] || '').trim()}
                                    className="bg-slate-100 hover:bg-blue-600 hover:text-white text-slate-700 text-xxs font-bold px-3 py-1.5 rounded-lg transition-all cursor-pointer disabled:opacity-50"
                                >
                                    Reply
                                </button>
                            </form>

                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
