import React, { useContext, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { AppContext } from '../context/AppContext'
import axios from 'axios'
import { toast } from 'react-hot-toast'

const Auth = () => {
  const { state } = useParams()
  const { navigate, isEducator, setIsEducator, setIsLoggedIn, setUserData } = useContext(AppContext);

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState('student')

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (state === 'register') {
      try {
        const response = await axios.post('http://localhost:3000/auth/register', {
          name,
          email,
          password,
          role
        }, { withCredentials: true });
        toast.success(response.data.message || 'Registration successful!');

        // Mark user as logged in and set their role context
        setIsLoggedIn(true);
        const isUserEducator = response.data.user.role === 'educator';
        setIsEducator(isUserEducator);
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('isEducator', isUserEducator ? 'true' : 'false');
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        setUserData(response.data.user);

        if (isUserEducator) {
          navigate('/educator');
        } else {
          navigate('/my-enrollments');
        }

      } catch (err) {
        console.error(err);
        toast.error(err.response?.data?.error || 'Registration failed');
      }
    } else {
      // Login flow
      try {
        const response = await axios.post('http://localhost:3000/auth/login', {
          email,
          password
        }, { withCredentials: true });
        toast.success(response.data.message || 'Login successful!');

        // Mark user as logged in and set their role context
        setIsLoggedIn(true);
        const isUserEducator = response.data.user.role === 'educator';
        setIsEducator(isUserEducator);
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('isEducator', isUserEducator ? 'true' : 'false');
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user)); // <-- Add this
        setUserData(response.data.user); // <-- Add this


        // Navigate to appropriate dashboard
        if (isUserEducator) {
          navigate('/educator');
        } else {
          navigate('/my-enrollments');
        }
      } catch (err) {
        console.error(err);
        toast.error(err.response?.data?.error || 'Login failed');
      }
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 via-white to-gray-200 flex items-center justify-center px-4">

      <div className="w-full max-w-md bg-white/80 backdrop-blur-lg rounded-3xl p-8 shadow-2xl border border-gray-200">

        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
            {state === 'register' ? 'Create Account' : 'Welcome Back'}
          </h1>

          <p className="text-gray-500 text-sm mt-2">
            {state === 'register'
              ? 'Sign up to start your learning journey'
              : 'Login to continue learning'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">

          {/* Username */}
          {state === 'register' && (
            <input
              type="text"
              placeholder="Username"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-gray-50 text-gray-900 text-sm placeholder-gray-400 rounded-xl px-4 py-3 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition-all"
              required
            />
          )}

          {/* Email */}
          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-gray-50 text-gray-900 text-sm placeholder-gray-400 rounded-xl px-4 py-3 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition-all"
            required
          />

          {/* Password */}
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-gray-50 text-gray-900 text-sm placeholder-gray-400 rounded-xl px-4 py-3 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition-all"
            required
          />

          {/* Role Selection (Only for Register) */}
          {state === 'register' && (
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider ml-1">
                Select Your Role
              </label>
              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => setRole('student')}
                  className={`flex-1 py-3 px-4 rounded-xl text-sm font-semibold border transition-all duration-300 ${role === 'student'
                    ? 'bg-indigo-600 border-indigo-600 text-white shadow-md'
                    : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100 hover:border-gray-300'
                    }`}
                >
                  Student
                </button>
                <button
                  type="button"
                  onClick={() => setRole('educator')}
                  className={`flex-1 py-3 px-4 rounded-xl text-sm font-semibold border transition-all duration-300 ${role === 'educator'
                    ? 'bg-indigo-600 border-indigo-600 text-white shadow-md'
                    : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100 hover:border-gray-300'
                    }`}
                >
                  Educator
                </button>
              </div>
            </div>
          )}

          {/* Forgot Password */}
          {state !== 'register' && (
            <div className="text-right">
              <Link
                to="/forgot-password"
                className="text-sm text-indigo-600 hover:text-indigo-500 transition-colors"
              >
                Forgot Password?
              </Link>
            </div>
          )}

          {/* Button */}
          <button className="w-full mt-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold rounded-xl py-3 transition-all duration-300 shadow-md hover:shadow-indigo-300 cursor-pointer">
            {state === 'register' ? 'Create Account' : 'Login'}
          </button>

          {/* Footer */}
          <div className="text-center text-sm text-gray-500 mt-3">

            {state === 'register' ? (
              <>
                Already have an account?{' '}
                <Link
                  to="/auth/login"
                  className="text-indigo-600 font-medium hover:text-indigo-500 transition-colors"
                >
                  Login
                </Link>
              </>
            ) : (
              <>
                Don&apos;t have an account?{' '}
                <Link
                  to="/auth/register"
                  className="text-indigo-600 font-medium hover:text-indigo-500 transition-colors"
                >
                  Sign Up
                </Link>
              </>
            )}

          </div>

        </form>
      </div>
    </div>
  )
}

export default Auth