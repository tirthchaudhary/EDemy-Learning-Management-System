import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-hot-toast';

const ResetPassword = () => {
    const { token } = useParams();
    const navigate = useNavigate();
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            return toast.error('Passwords do not match');
        }

        setLoading(true);
        try {
            const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000'}/auth/reset-password/${token}`, { password });
            toast.success(response.data.message || 'Password reset successful!');
            navigate('/auth/login');
        } catch (err) {
            toast.error(err.response?.data?.message || err.response?.data?.error || 'Invalid or expired token');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-100 via-white to-gray-200 flex items-center justify-center px-4">
            <div className="w-full max-w-md bg-white/80 backdrop-blur-lg rounded-3xl p-8 shadow-2xl border border-gray-200">
                <div className="mb-8 text-center">
                    <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Reset Password</h1>
                    <p className="text-gray-500 text-sm mt-2">Enter your new secure password below.</p>
                </div>

                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <input
                        type="password"
                        placeholder="New Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full bg-gray-50 text-gray-900 text-sm placeholder-gray-400 rounded-xl px-4 py-3 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition-all"
                        required
                        minLength={6}
                    />

                    <input
                        type="password"
                        placeholder="Confirm New Password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full bg-gray-50 text-gray-900 text-sm placeholder-gray-400 rounded-xl px-4 py-3 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition-all"
                        required
                        minLength={6}
                    />

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full mt-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold rounded-xl py-3 transition-all duration-300 shadow-md hover:shadow-indigo-300 cursor-pointer disabled:bg-indigo-400"
                    >
                        {loading ? 'Resetting...' : 'Reset Password'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ResetPassword;
