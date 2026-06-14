import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-hot-toast';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await axios.post('http://localhost:3000/auth/forgot-password', { email });
            toast.success(response.data.message || 'Reset link sent to your email!');
            setEmail('');
        } catch (err) {
            toast.error(err.response?.data?.error || 'Something went wrong');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-100 via-white to-gray-200 flex items-center justify-center px-4">
            <div className="w-full max-w-md bg-white/80 backdrop-blur-lg rounded-3xl p-8 shadow-2xl border border-gray-200">
                <div className="mb-8 text-center">
                    <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Forgot Password</h1>
                    <p className="text-gray-500 text-sm mt-2">
                        Enter your email address and we'll send you a link to reset your password.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <input
                        type="email"
                        placeholder="Email Address"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full bg-gray-50 text-gray-900 text-sm placeholder-gray-400 rounded-xl px-4 py-3 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition-all"
                        required
                    />

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full mt-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold rounded-xl py-3 transition-all duration-300 shadow-md hover:shadow-indigo-300 cursor-pointer disabled:bg-indigo-400"
                    >
                        {loading ? 'Sending Link...' : 'Send Reset Link'}
                    </button>

                    <div className="text-center text-sm text-gray-500 mt-3">
                        Remember your password?{' '}
                        <Link to="/auth/login" className="text-indigo-600 font-medium hover:text-indigo-500 transition-colors">
                            Login
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ForgotPassword;
