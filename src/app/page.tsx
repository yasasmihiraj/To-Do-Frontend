"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function LandingPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect if already logged in
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("user");

    if (token && user) {
      const parsedUser = JSON.parse(user);
      if (parsedUser.role === "admin") {
        router.push("/admin");
      } else {
        router.push("/tasks");
      }
    }
  }, [router]);

  return (
    <div className="min-h-screen bg-linear-to-br from-zinc-50 to-cyan-100">
      {/* Navigation */}
      <nav className="bg-cyan/70  border-gray-300 shadow-sm">
        <div className="max-w-6xl mx-auto px-2 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="bg-indigo-600 p-2 rounded-lg">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
              </svg>
            </div>
            <span className="text-xl font-bold bg-linear-to-b from-rose-700 to-indigo-600 bg-clip-text text-transparent">My To-Do App</span>
          </div>
          <Link
            href="/login"
            className="px-6 py-2 bg-white hover:bg-blue-100 text-gray-800 font-semibold rounded-lg transition-colors border-2 border-blue-600 shadow-lg"
          >
            Sign In
          </Link>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-6 py-20 mt-6 bg-linear-to-t from-zinc-50 to-cyan-100 rounded-2xl">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Manage Your Tasks
            <span className="block bg-linear-to-b from-pink-600 to-indigo-600 bg-clip-text text-transparent mt-2">Simply & Efficiently</span>
          </h1>
          <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
            A clean and simple task management app to help you stay organized and productive.
          </p>
          <div className="flex gap-4 justify-center">
            <Link
              href="/register"
              className="px-8 py-3 bg-linear-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-xl transform hover:scale-[1.02] shadow-lg"
            >
              Get Started
            </Link>
            <Link
              href="/login"
              className="px-8 py-3 bg-white hover:bg-indigo-300 text-gray-800 font-semibold rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-xl transform hover:scale-[1.02] border-2 border-blue-400 shadow-lg"
            >
              Sign In
            </Link>
          </div>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow">
            <div className="bg-indigo-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2 ">Create Tasks</h3>
            <p className="text-gray-600">Quickly add and organize your tasks with ease.</p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow">
            <div className="bg-green-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Track Progress</h3>
            <p className="text-gray-600">Monitor your completed and pending tasks.</p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow">
            <div className="bg-blue-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Stay Secure</h3>
            <p className="text-gray-600">Your data is protected and private.</p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white border-t mt-20 py-6">
        <div className="max-w-6xl mx-auto px-6 text-center text-gray-600">
          <p>© Simple Task Management</p>
        </div>
      </footer>
    </div>
  );
}