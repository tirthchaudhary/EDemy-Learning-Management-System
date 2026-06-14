import React, { useState, useRef, useContext, useEffect } from 'react'
import Footer from '../components/layout/Footer.jsx'
import { AppContext } from '../context/AppContext.jsx'
import axios from 'axios'

const Account = () => {
  const { setIsLoggedIn, setIsEducator, navigate, userData, setUserData } = useContext(AppContext)
  const [activeTab, setActiveTab] = useState('profile')
  const [profile, setProfile] = useState({
    name: userData?.name || '',
    email: userData?.email || '',
    imageUrl: userData?.imageUrl || 'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y'
  })

  useEffect(() => {
    if (userData) {
      setProfile({
        name: userData.name || '',
        email: userData.email || '',
        imageUrl: userData.imageUrl || 'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y'
      });
    }
  }, [userData]);

  const [passwords, setPasswords] = useState({
    current: '',
    new: '',
    confirm: ''
  })



  const [toast, setToast] = useState({ show: false, message: '', type: 'success' })
  const [isSaving, setIsSaving] = useState(false)

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type })
    setTimeout(() => {
      setToast({ show: false, message: '', type: 'success' })
    }, 3500)
  }

  const handleLogout = () => {
    setIsLoggedIn(false)
    setIsEducator(false)
    setUserData(null)
    localStorage.removeItem('isLoggedIn')
    localStorage.removeItem('isEducator')
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    showToast('Logged out successfully!')
    setTimeout(() => {
      navigate('/')
    }, 1000)
  }

  const handleProfileSubmit = async (e) => {
    e.preventDefault()
    setIsSaving(true)
    try {
      const token = localStorage.getItem('token')
      const response = await axios.post('http://localhost:3000/auth/update-profile', {
        name: profile.name,
        imageUrl: profile.imageUrl
      }, {
        headers: { Authorization: `Bearer ${token}` }
      })

      if (response.data.success) {
        const updatedUser = response.data.user;
        setUserData(updatedUser);
        localStorage.setItem('user', JSON.stringify(updatedUser));
        showToast('Profile information updated successfully!')
      }
    } catch (error) {
      console.error("Failed to update profile:", error);
      showToast(error.response?.data?.error || 'Failed to update profile.', 'error')
    } finally {
      setIsSaving(false)
    }
  }

  const handlePasswordSubmit = async (e) => {
    e.preventDefault()
    if (!passwords.current || !passwords.new || !passwords.confirm) {
      showToast('Please fill in all password fields.', 'error')
      return
    }
    if (passwords.new !== passwords.confirm) {
      showToast('New passwords do not match.', 'error')
      return
    }

    if (passwords.new.length < 8) {
      showToast('New password must be at least 8 characters.', 'error')
      return
    }

    setIsSaving(true)

    try {
      const token = localStorage.getItem('token')

      const response = await axios.post('http://localhost:3000/auth/change-password', { currentPassword: passwords.current, newPassword: passwords.new }, {
        headers: { Authorization: `Bearer ${token}` }
      })

      if (response.data.success) {
        showToast('Password updated successfully!')
        // Reset the password fields
        setPasswords({ current: '', new: '', confirm: '' })
      }
    } catch (error) {
      console.error("Failed to update password:", error);
      showToast(error.response?.data?.error || 'Failed to update password.', 'error')
    } finally {
      setIsSaving(false)
    }
  }

  const fileInputRef = useRef(null)

  const handleAvatarChange = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      showToast('Please select a valid image file.', 'error')
      return
    }

    const reader = new FileReader()
    reader.onload = () => {
      setProfile(prev => ({ ...prev, imageUrl: reader.result }))
      showToast('Profile photo updated successfully!')
    }
    reader.onerror = () => {
      showToast('Failed to read the image file.', 'error')
    }
    reader.readAsDataURL(file)
  }

  return (
    <div className="min-h-screen bg-slate-50/50 flex flex-col justify-between font-sans relative">
      {/* Toast Notification */}
      {toast.show && (
        <div className={`fixed top-20 right-6 z-50 flex items-center gap-3 px-5 py-3.5 rounded-2xl shadow-xl border text-sm font-semibold transition-all duration-300 animate-slide-in-right ${toast.type === 'success'
          ? 'bg-emerald-50 text-emerald-800 border-emerald-100'
          : 'bg-rose-50 text-rose-800 border-rose-100'
          }`}>
          {toast.type === 'success' ? (
            <svg className="w-5 h-5 text-emerald-600 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          ) : (
            <svg className="w-5 h-5 text-rose-600 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          )}
          <span>{toast.message}</span>
        </div>
      )}



      {/* Main Account Settings Layout */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-14">

        {/* Page Title & Breadcrumb Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Account Settings</h1>
          <p className="text-sm text-slate-500 mt-1">Manage your public profile settings, change security keys, and choose notification parameters.</p>
        </div>

        {/* Outer Layout wrapper */}
        <div className="flex flex-col lg:flex-row gap-8 items-start">

          {/* Left Layout Pane: Sidebar Profile card and Tabs */}
          <div className="w-full lg:w-80 shrink-0 space-y-6">

            {/* Quick Profile Summary Card */}
            <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm text-center relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-indigo-500 to-blue-600"></div>

              {/* Profile Image with Upload Trigger */}
              <div className="relative w-24 h-24 mx-auto mb-4 group/avatar">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept="image/*"
                  className="hidden"
                />
                <img
                  src={profile.imageUrl}
                  alt={profile.name}
                  className="w-full h-full rounded-full object-cover border-4 border-slate-50 shadow-inner group-hover/avatar:opacity-90 transition-opacity"
                  onError={(e) => {
                    e.target.src = 'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y'
                  }}
                />
                <button
                  onClick={handleAvatarChange}
                  title="Change Photo"
                  className="absolute bottom-0 right-0 p-2 bg-indigo-600 text-white rounded-full shadow-md hover:bg-indigo-700 transition-colors border-2 border-white cursor-pointer"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </button>
              </div>

              <h2 className="font-bold text-slate-800 text-lg leading-tight truncate">{profile.name}</h2>
              <p className="text-xs font-semibold text-indigo-600 mt-1 uppercase tracking-wider">{userData?.role || 'user'}</p>
              <p className="text-xxs text-slate-400 mt-2 font-mono bg-slate-50 py-1.5 px-2.5 rounded-lg inline-block border border-slate-100 max-w-full truncate">
                {profile.email}
              </p>
            </div>

            {/* Navigation Tabs List */}
            <div className="bg-white border border-slate-100 rounded-2xl p-3.5 shadow-sm">
              <nav className="flex flex-row lg:flex-col gap-1 overflow-x-auto lg:overflow-x-visible pb-1 lg:pb-0 whitespace-nowrap scrollbar-none">

                {/* Tab: Profile */}
                <button
                  onClick={() => setActiveTab('profile')}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold w-full transition-all duration-200 cursor-pointer ${activeTab === 'profile'
                    ? 'bg-indigo-50 text-indigo-700 border-l-4 border-indigo-600'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900 border-l-4 border-transparent'
                    }`}
                >
                  <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <span>Profile Information</span>
                </button>

                {/* Tab: Security */}
                <button
                  onClick={() => setActiveTab('security')}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold w-full transition-all duration-200 cursor-pointer ${activeTab === 'security'
                    ? 'bg-indigo-50 text-indigo-700 border-l-4 border-indigo-600'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900 border-l-4 border-transparent'
                    }`}
                >
                  <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  <span>Login & Security</span>
                </button>


                {/* Divider for separation */}
                <div className="hidden lg:block my-2 border-t border-slate-100" />

                {/* Action: Logout */}
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold w-full transition-all duration-200 cursor-pointer text-rose-600 hover:bg-rose-50 hover:text-rose-700 border-l-4 border-transparent"
                >
                  <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  <span>Logout from Device</span>
                </button>

              </nav>
            </div>

          </div>

          {/* Right Layout Pane: Tab Settings Forms Container */}
          <div className="flex-1 w-full bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden min-h-[460px]">

            {/* Form 1: Profile Information Settings */}
            {activeTab === 'profile' && (
              <form onSubmit={handleProfileSubmit} className="p-6 md:p-8 space-y-6">
                <div>
                  <h3 className="text-lg font-bold text-slate-800 border-b border-slate-50 pb-2">Profile Information</h3>
                  <p className="text-xs text-slate-400 mt-1">Update your profile display name and avatar picture.</p>
                </div>

                {/* Field: Full Name */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider">Full Name</label>
                  <input
                    type="text"
                    required
                    value={profile.name}
                    onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                  />
                </div>

                {/* Field: Email Address (Read-only for security) */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider">Email Address</label>
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full uppercase tracking-wide border border-emerald-100">
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 12l2 2 4-4" />
                      </svg>
                      Verified
                    </span>
                  </div>
                  <input
                    type="email"
                    disabled
                    value={profile.email}
                    className="w-full px-4 py-2.5 bg-slate-100/70 border border-slate-200 rounded-xl text-sm text-slate-500 font-medium cursor-not-allowed select-none"
                  />
                </div>

                {/* Action button */}
                <div className="pt-4 border-t border-slate-100 flex justify-end">
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="px-6 py-2.5 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-md shadow-indigo-600/10 hover:shadow-indigo-600/20 transition-all flex items-center gap-2 cursor-pointer disabled:opacity-75 disabled:cursor-wait"
                  >
                    {isSaving && (
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                    )}
                    Save Changes
                  </button>
                </div>
              </form>
            )}

            {/* Form 2: Password / Login Credentials Security Settings */}
            {activeTab === 'security' && (
              <form onSubmit={handlePasswordSubmit} className="p-6 md:p-8 space-y-6">
                <div>
                  <h3 className="text-lg font-bold text-slate-800 border-b border-slate-50 pb-2">Login & Security</h3>
                  <p className="text-xs text-slate-400 mt-1">Configure authorization parameters, rotate login codes, and set active account locks.</p>
                </div>

                {/* Field: Current Password */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider">Current Password</label>
                  <input
                    type="password"
                    value={passwords.current}
                    onChange={(e) => setPasswords({ ...passwords, current: e.target.value })}
                    placeholder="••••••••"
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Field: New Password */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider">New Password</label>
                    <input
                      type="password"
                      value={passwords.new}
                      onChange={(e) => setPasswords({ ...passwords, new: e.target.value })}
                      placeholder="Min. 8 characters"
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                    />
                  </div>

                  {/* Field: Confirm Password */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider">Confirm New Password</label>
                    <input
                      type="password"
                      value={passwords.confirm}
                      onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })}
                      placeholder="Repeat new password"
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                    />
                  </div>
                </div>

                {/* Password Strength Tip banner */}
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 flex gap-3 text-xs text-slate-500 leading-relaxed">
                  <svg className="w-5 h-5 text-indigo-500 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p>
                    Ensure your password includes uppercase characters, special punctuation icons, and numeric digits. Standard rotation policies suggest updating key passwords every 6 months.
                  </p>
                </div>

                {/* Action button */}
                <div className="pt-4 border-t border-slate-100 flex justify-end">
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="px-6 py-2.5 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-md shadow-indigo-600/10 hover:shadow-indigo-600/20 transition-all flex items-center gap-2 cursor-pointer disabled:opacity-75 disabled:cursor-wait"
                  >
                    {isSaving && (
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                    )}
                    Update Password
                  </button>
                </div>
              </form>
            )}


          </div>

        </div>

      </main>

      {/* Footer Container */}
      <div className="w-full shrink-0">
        <Footer />
      </div>
    </div>
  )
}

export default Account
