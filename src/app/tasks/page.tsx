"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import TaskTable from "@/components/TaskTable";

interface Task {
  id: number;
  title: string;
  description: string;
  status: string;
  created_at: string;
  due_date: string | null;
  priority: string;
}

export default function TasksPage() {
  const [user, setUser] = useState<any>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const router = useRouter();

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
      fetchTasks();
    } catch (err) {
      console.error("Invalid user data");
      router.push("/login");
    }
  }, [router]);

  const fetchTasks = async () => {
    setLoading(true);
    
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/tasks`, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
      });

      if (res.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        router.push("/login");
        return;
      }

      if (res.ok) {
        const data = await res.json();
        console.log("Raw API Response:", data);
        
        let tasksData: Task[] = [];
        
        if (Array.isArray(data)) {
          tasksData = data;
        } else if (data.data && Array.isArray(data.data)) {
          tasksData = data.data;
        } else if (data.success && Array.isArray(data.data)) {
          tasksData = data.data;
        }
        
        setTasks(tasksData);
        setError("");
      } else {
        const errorData = await res.json();
        setError(errorData.message || "Failed to fetch tasks");
      }
    } catch (err) {
      console.error("Failed to fetch tasks:", err);
      setError("Network error. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  const handleTaskDeleted = (taskId: number) => {
    setTasks(tasks.filter((t) => t.id !== taskId));
    setError("");
  };

  const handleTaskUpdated = (updatedTask: Task) => {
    console.log("Task updated:", updatedTask);
    setTasks(tasks.map((t) => (t.id === updatedTask.id ? updatedTask : t)));
    setError("");
  };

  if (loading && !user) {
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
    <div className="min-h-screen bg-green-50">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-4 flex justify-between items-center">
            <span>{error}</span>
            <button 
              onClick={() => setError("")} 
              className="text-red-800 font-bold hover:text-red-900 text-xl"
            >
              ×
            </button>
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-blue-500">
            <h3 className="text-gray-500 text-sm font-medium uppercase">Total Tasks</h3>
            <p className="text-4xl font-bold text-gray-800 mt-2">{tasks.length}</p>
          </div>
          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-green-500">
            <h3 className="text-gray-500 text-sm font-medium uppercase">Completed</h3>
            <p className="text-4xl font-bold text-green-600 mt-2">
              {tasks.filter(t => t.status === 'completed').length}
            </p>
          </div>
          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-yellow-500">
            <h3 className="text-gray-500 text-sm font-medium uppercase">Pending</h3>
            <p className="text-4xl font-bold text-yellow-600 mt-2">
              {tasks.filter(t => t.status === 'pending').length}
            </p>
          </div>
        </div>

        {/* Create Task Button */}
        <div className="mb-6">
          <button
            onClick={() => router.push("/tasks/create")}
            className="w-full md:w-auto bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-8 rounded-lg shadow-md transition-all duration-200 flex items-center justify-center gap-2 hover:shadow-lg"
          >
            <svg 
              className="w-5 h-5" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M12 4v16m8-8H4" 
              />
            </svg>
            Create New Task
          </button>
        </div>

        {/* Tasks Table */}
        <TaskTable
          tasks={tasks}
          loading={loading}
          onTaskDeleted={handleTaskDeleted}
          onTaskUpdated={handleTaskUpdated}
        />
      </main>
    </div>
  );
}