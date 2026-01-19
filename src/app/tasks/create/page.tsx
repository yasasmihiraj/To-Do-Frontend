"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import CreateTaskForm from "@/components/CreateTaskForm";

interface Task {
  id: number;
  title: string;
  description: string;
  status: string;
  created_at: string;
  due_date: string | null;
  priority: string;
}

export default function CreateTaskPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const userData = localStorage.getItem("user");
    const token = localStorage.getItem("token");

    if (!userData || !token) {
      router.push("/login");
      return;
    }

    try {
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);
    } catch (err) {
      console.error("Invalid user data");
      router.push("/login");
    }
  }, [router]);

  const handleTaskCreated = (newTask: Task) => {
    // Redirect back to tasks page after successful creation
    router.push("/tasks");
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-green-100">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mb-4"></div>
          <p className="text-gray-700">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-b from-zinc-50 to-cyan-200">
      <Header />
      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Create Task Form Component */}
        <CreateTaskForm onTaskCreated={handleTaskCreated} />

        {/* Back Button */}
        <div className="mb-6 mt-10 flex justify-center">
          <button
            onClick={() => router.push("/tasks")}
            className="w-full md:w-auto bg-linear-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold py-3 px-8 rounded-xl shadow-lg transition-all duration-200 flex items-center justify-center gap-2 hover:shadow-xl transform hover:scale-105"
          >
            <svg 
              className="w-5 h-5 mr-2" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M10 19l-7-7m0 0l7-7m-7 7h18" 
              />
            </svg>
            Back to Tasks
          </button>
        </div>
      </main>
    </div>
  );
}