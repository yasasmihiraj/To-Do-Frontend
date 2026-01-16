"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAlert } from "@/contexts/AlertContext";

export default function Header() {
  const [user, setUser] = useState<any>(null);
  const router = useRouter();
  const { showAlert } = useAlert();

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  const handleLogout = () => {
    showAlert({
      title: 'Confirm Logout',
      message: 'Are you sure you want to logout?',
      type: 'warning',
      showCancel: true,
      onConfirm: () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        showAlert({
          title: 'Logged Out',
          message: 'You have been successfully logged out.',
          type: 'success'
        });
        // Small delay to show success message before redirecting
        setTimeout(() => {
          router.push("/login");
        }, 1000);
      }
    });
  };

  if (!user) return null;

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="bg-linear-to-br from-indigo-600 to-purple-600 p-2 rounded-lg">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold bg-linear-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            MyTo-DoApp
          </h1>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3 px-4 py-2 bg-gray-50 rounded-lg">
            <div className="w-10 h-10 bg-linear-to-br from-indigo-500 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold shadow-md">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div className="hidden sm:block">
              <p className="text-sm font-medium text-gray-900">{user.name}</p>
              {user.role && (
                <p className="text-xs text-gray-500 capitalize">{user.role}</p>
              )}
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 bg-red-100 hover:bg-red-200 text-red-700 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:shadow-md"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </div>
    </header>
  );
}