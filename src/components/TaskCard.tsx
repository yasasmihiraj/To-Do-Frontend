"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface Task {
  id: number;
  title: string;
  description: string;
  status: string;
  created_at: string;
  due_date: string | null;
  priority: string;
}

interface TaskCardProps {
  task: Task;
  onTaskDeleted: (taskId: number) => void;
  onTaskUpdated: (task: Task) => void;
}

export default function TaskCard({ task, onTaskDeleted, onTaskUpdated }: TaskCardProps) {
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [updateLoading, setUpdateLoading] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this task?")) {
      return;
    }

    setDeleteLoading(true);

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/tasks/${task.id}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Accept": "application/json",
        },
      });

      if (res.ok) {
        onTaskDeleted(task.id);
      } else {
        alert("Failed to delete task");
      }
    } catch (err) {
      console.error("Failed to delete task:", err);
      alert("Network error. Please try again.");
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleStatusToggle = async () => {
    setUpdateLoading(true);
    const newStatus = task.status === "completed" ? "pending" : "completed";

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/tasks/${task.id}`, {
        method: "PUT",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
        body: JSON.stringify({
          title: task.title,
          description: task.description,
          status: newStatus,
          priority: task.priority,
          due_date: task.due_date,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        const updatedTask = data.data || data;
        onTaskUpdated(updatedTask);
      } else {
        alert("Failed to update task");
      }
    } catch (err) {
      console.error("Failed to update task:", err);
      alert("Network error. Please try again.");
    } finally {
      setUpdateLoading(false);
    }
  };

  const handleEdit = () => {
    router.push(`/tasks/edit/${task.id}`);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-700 border-red-200";
      case "medium":
        return "bg-amber-100 text-amber-700 border-amber-200";
      case "low":
        return "bg-emerald-100 text-emerald-700 border-emerald-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const getStatusColor = (status: string) => {
    return status === "completed"
      ? "bg-emerald-100 text-emerald-700 border-emerald-200"
      : "bg-blue-100 text-blue-700 border-blue-200";
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "No due date";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const isOverdue = (dueDate: string | null) => {
    if (!dueDate || task.status === "completed") return false;
    return new Date(dueDate) < new Date();
  };

  return (
    <div className={`bg-purple-50 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 border-l-4 transform hover:-translate-y-1 ${
      task.status === "completed" ? "border-emerald-500" : "border-indigo-500"
    }`}>
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <h3 className={`text-lg font-bold text-gray-900 flex-1 ${
          task.status === "completed" ? "line-through text-gray-500" : ""
        }`}>
          {task.title}
        </h3>
        
        {/* Action Buttons */}
        <div className="flex gap-2 ml-3">
          <button
            onClick={handleEdit}
            className="p-2 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-600 transition-colors"
            title="Edit task"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>

          <button
            onClick={handleStatusToggle}
            disabled={updateLoading}
            className={`p-2 rounded-lg transition-colors ${
              task.status === "completed"
                ? "bg-amber-50 hover:bg-amber-100 text-amber-600"
                : "bg-emerald-50 hover:bg-emerald-100 text-emerald-600"
            } disabled:opacity-50`}
            title={task.status === "completed" ? "Mark as pending" : "Mark as completed"}
          >
            {updateLoading ? (
              <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            )}
          </button>
          
          <button
            onClick={handleDelete}
            disabled={deleteLoading}
            className="p-2 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 transition-colors disabled:opacity-50"
            title="Delete task"
          >
            {deleteLoading ? (
              <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Description */}
      <p className="text-gray-600 text-sm mb-4 line-clamp-3 leading-relaxed">
        {task.description || "No description provided"}
      </p>

      {/* Tags */}
      <div className="flex flex-wrap gap-2 mb-4">
        <span className={`px-3 py-1 rounded-lg text-xs font-semibold border ${getStatusColor(task.status)}`}>
          {task.status.charAt(0).toUpperCase() + task.status.slice(1)}
        </span>
        <span className={`px-3 py-1 rounded-lg text-xs font-semibold border ${getPriorityColor(task.priority)}`}>
          {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
        </span>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between text-xs text-gray-500 pt-4 border-t border-gray-100">
        <div className="flex items-center gap-1">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <span className={isOverdue(task.due_date) ? "text-red-600 font-semibold" : ""}>
            {formatDate(task.due_date)}
            {isOverdue(task.due_date) && " ⚠️"}
          </span>
        </div>
      </div>
    </div>
  );
}