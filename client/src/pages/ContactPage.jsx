import React, { useState } from 'react';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'Student',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle your form submission logic here (e.g., API call)
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 5000);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans">
      {/* Hero Header Section */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-16 px-4 text-center">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
          Get in Touch with Us
        </h1>
        <p className="text-blue-100 text-lg max-w-2xl mx-auto">
          Have questions about our courses, platform, or enterprise training solutions? We are here to help you clear your path to learning.
        </p>
      </div>

      {/* Main Content Split Grid */}
      <div className="max-w-6xl mx-auto px-4 py-12 grid grid-cols-1 lg:grid-cols-12 gap-8 -mt-8">
        
        {/* Left Side: Contact Information Cards */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Founder Profile Card */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-start space-x-4">
            <div className="bg-blue-50 p-3 rounded-xl text-blue-600">
              {/* User Icon */}
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-blue-600 tracking-wider uppercase">Founder & CEO</h3>
              <p className="text-xl font-bold text-slate-900 mt-0.5">Tirth Chaudhary</p>
              <p className="text-sm text-slate-500 mt-1">
                "Our mission is to make quality technical education accessible, structured, and highly interactive for everyone."
              </p>
            </div>
          </div>

          {/* Quick Connect Channels */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 space-y-6">
            <h3 className="text-lg font-bold text-slate-900">Direct Channels</h3>
            
            {/* Email info */}
            <div className="flex items-center space-x-4">
              <div className="bg-blue-50 p-3 rounded-xl text-blue-600">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Email Support</p>
                <a href="mailto:chaudharytirth23@gmail.com" className="text-slate-700 font-medium hover:text-blue-600 transition-colors">
                  chaudharytirth23@gmail.com
                </a>
              </div>
            </div>

            {/* Phone info */}
            <div className="flex items-center space-x-4">
              <div className="bg-blue-50 p-3 rounded-xl text-blue-600">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.94.725l.548 2.2a1 1 0 01-.321.988l-1.305.98a10.582 10.582 0 004.872 4.872l.98-1.305a1 1 0 01.988-.321l2.2.548a1 1 0 01.725.94V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Call or WhatsApp</p>
                <a href="tel:+919909410145" className="text-slate-700 font-medium hover:text-blue-600 transition-colors">
                  +91 99094 10145
                </a>
              </div>
            </div>

            {/* Operating Hours */}
            <div className="flex items-center space-x-4">
              <div className="bg-blue-50 p-3 rounded-xl text-blue-600">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Support Hours</p>
                <p className="text-slate-700 font-medium">Monday – Saturday, 9 AM – 6 PM IST</p>
              </div>
            </div>

          </div>
        </div>

        {/* Right Side: Interactive Support Form */}
        <div className="lg:col-span-7">
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Send a Message</h2>
            <p className="text-slate-500 mb-6 text-sm">
              Drop us your query and our academic support team will get back to you within 12-24 hours.
            </p>

            {submitted ? (
              <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-4 rounded-xl flex items-center space-x-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-emerald-600 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <p className="font-semibold">Message sent successfully!</p>
                  <p className="text-xs opacity-90">Thank you for reaching out. We will connect with you soon.</p>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Your Name</label>
                    <input 
                      type="text" 
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="John Doe" 
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Email Address</label>
                    <input 
                      type="email" 
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="you@example.com" 
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">I am a...</label>
                  <select 
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all text-sm bg-white"
                  >
                    <option value="Student">Student looking for courses</option>
                    <option value="Instructor">Instructor wanting to teach</option>
                    <option value="Enterprise">Organization / Enterprise client</option>
                    <option value="Other">Other Query</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">How can we help you?</label>
                  <textarea 
                    name="message"
                    required
                    rows="4"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Type your message details here..." 
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all text-sm resize-none"
                  ></textarea>
                </div>

                <button 
                  type="submit" 
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-xl transition-all shadow-sm hover:shadow-md transform hover:-translate-y-0.5 active:translate-y-0"
                >
                  Submit Inquiry
                </button>
              </form>
            )}
          </div>
        </div>

      </div>

      {/* Trust Badges / Footer Info */}
      <div className="max-w-6xl mx-auto px-4 py-12 text-center text-slate-400 text-xs">
        <p>© 2026 Your LMS Platform. Built with passion to empower learners worldwide.</p>
      </div>
    </div>
  );
}