"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Header() {
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    router.push("/login");
  };

  if (!user) return null;

  return (
    <header className="bg-blue-400 shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <h1 className="text-4xl font-bold text-red-500">To-Do App</h1>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-2xl">Welcome, {user.name}</span>
          <button
            onClick={handleLogout}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition"
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  );
}