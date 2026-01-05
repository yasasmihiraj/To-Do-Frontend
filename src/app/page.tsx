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
    <div className="min-h-screen flex items-center justify-center bg-green-100 from-blue-50 to-indigo-100">
      <div className="w-full max-w-2xl px-4">
        <div className="bg-white rounded-2xl shadow-xl p-12 text-center">
          {/* Header */}
          <h1 className="text-5xl font-bold text-red-500 mb-4">
            My To-Do App
          </h1>

          {/* Introduction */}
          <p className="text-gray-600 text-lg mb-8 leading-relaxed">
            Organize your tasks efficiently and boost your productivity. 
            Simple and easy to use task management application.
          </p>

          {/* Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="p-4 bg-green-200 rounded-lg">
              <h3 className="font-semibold text-gray-800">Easy to Use</h3>
              <p className="text-sm text-gray-600 mt-1">Simple and intuitive interface</p>
            </div>
            <div className="p-4 bg-purple-200 rounded-lg">
              <h3 className="font-semibold text-gray-800">Task Management</h3>
              <p className="text-sm text-gray-600 mt-1">Create and manage tasks easily</p>
            </div>
            <div className="p-4 bg-blue-200 rounded-lg">
              <h3 className="font-semibold text-gray-800">Secure</h3>
              <p className="text-sm text-gray-600 mt-1">Your data is safe with us</p>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/login"
              className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition duration-200 shadow-lg hover:shadow-xl"
            >
              Login
            </Link>
            <Link
              href="/register"
              className="px-8 py-4 bg-white hover:bg-gray-50 text-blue-600 font-semibold rounded-lg transition duration-200 border-2 border-blue-600"
            >
              Register
            </Link>
          </div>

          {/* Footer Text */}
          <p className="text-sm text-gray-500 mt-8">
            Get started today and organize your works better!
          </p>
        </div>
      </div>
    </div>
  );
}