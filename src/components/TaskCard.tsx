"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAlert } from "@/contexts/AlertContext";

interface Attachment {
  name: string;
  path: string;
  url: string;
  size: number;
  mime_type: string;
}

interface Task {
  id: number;
  title: string;
  description: string;
  status: string;
  created_at: string;
  due_date: string | null;
  priority: string;
  attachments?: Attachment[];
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
  const { showAlert } = useAlert();

  const handleDelete = async () => {
    showAlert({
      title: 'Confirm Deletion',
      message: `Are you sure you want to delete "${task.title}"? This action cannot be undone.`,
      type: 'warning',
      showCancel: true,
      onConfirm: async () => {
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
            showAlert({
              title: 'Success',
              message: 'Task deleted successfully!',
              type: 'success'
            });
          } else {
            showAlert({
              title: 'Error',
              message: 'Failed to delete task. Please try again.',
              type: 'error'
            });
          }
        } catch (err) {
          console.error("Failed to delete task:", err);
          showAlert({
            title: 'Error',
            message: 'Network error. Please try again.',
            type: 'error'
          });
        } finally {
          setDeleteLoading(false);
        }
      }
    });
  };

  const handleStatusToggle = async () => {
    const newStatus = task.status === "completed" ? "pending" : "completed";
    const statusMessage = newStatus === "completed" 
      ? `Mark "${task.title}" as completed?` 
      : `Mark "${task.title}" as pending?`;

    showAlert({
      title: 'Confirm Status Change',
      message: statusMessage,
      type: 'info',
      showCancel: true,
      onConfirm: async () => {
        setUpdateLoading(true);

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
            showAlert({
              title: 'Success',
              message: `Task marked as ${newStatus}!`,
              type: 'success'
            });
          } else {
            showAlert({
              title: 'Error',
              message: 'Failed to update task status.',
              type: 'error'
            });
          }
        } catch (err) {
          console.error("Failed to update task:", err);
          showAlert({
            title: 'Error',
            message: 'Network error. Please try again.',
            type: 'error'
          });
        } finally {
          setUpdateLoading(false);
        }
      }
    });
  };

  const handleEdit = () => {
    router.push(`/tasks/edit/${task.id}`);
  };

  const getPriorityStyles = (priority: string, isCompleted: boolean) => {
    if (isCompleted) {
      return {
        border: "border-gray-300",
        bg: "bg-gradient-to-br from-gray-50 to-slate-100",
        badge: "bg-gray-100 text-gray-500 border-gray-200",
        glow: "shadow-gray-200",
        icon: "✓"
      };
    }

    switch (priority) {
      case "high":
        return {
          border: "border-red-500",
          bg: "bg-gradient-to-br from-red-50 to-orange-50",
          badge: "bg-red-100 text-red-700 border-red-200",
          glow: "shadow-red-200",
          icon: "🔴"
        };
      case "medium":
        return {
          border: "border-amber-500",
          bg: "bg-gradient-to-br from-amber-50 to-yellow-50",
          badge: "bg-amber-100 text-amber-700 border-amber-200",
          glow: "shadow-amber-200",
          icon: "🟡"
        };
      case "low":
        return {
          border: "border-emerald-500",
          bg: "bg-gradient-to-br from-emerald-50 to-teal-50",
          badge: "bg-emerald-100 text-emerald-700 border-emerald-200",
          glow: "shadow-emerald-200",
          icon: "🟢"
        };
      default:
        return {
          border: "border-gray-500",
          bg: "bg-gradient-to-br from-gray-50 to-slate-50",
          badge: "bg-gray-100 text-gray-700 border-gray-200",
          glow: "shadow-gray-100",
          icon: "⚪"
        };
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

  const getFileIcon = (mimeType: string) => {
    if (mimeType.startsWith('image/')) {
      return '🖼️';
    } else if (mimeType === 'application/pdf') {
      return '📄';
    } else {
      return '🖇️';
    }
  };

  const isCompleted = task.status === "completed";
  const priorityStyles = getPriorityStyles(task.priority, isCompleted);

  return (
    <div className={`${priorityStyles.bg} rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 border-l-4 ${priorityStyles.border} ${priorityStyles.glow} transform hover:-translate-y-1 ${
      isCompleted ? "opacity-70" : ""
    }`}>

      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-start gap-2 flex-1">
          {isCompleted && (
            <span className="text-xl mt-0.5 animate-pulse">✅</span>
          )}
          <h3 className={`text-lg font-bold flex-1 pr-8 ${
            isCompleted ? "line-through text-gray-500" : "text-gray-900"
          }`}>
            {task.title}
          </h3>
        </div>
        
        {/* Action Buttons */}
        <div className="flex gap-2 ml-3">
          <button
            onClick={handleEdit}
            className="p-2 rounded-lg bg-blue-200 hover:bg-blue-300 text-blue-600 transition-colors"
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
              isCompleted
                ? "bg-amber-200 hover:bg-amber-300 text-amber-600"
                : "bg-emerald-200 hover:bg-emerald-300 text-emerald-600"
            } disabled:opacity-50`}
            title={isCompleted ? "Mark as pending" : "Mark as completed"}
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
            className="p-2 rounded-lg bg-red-200 hover:bg-red-300 text-red-600 transition-colors disabled:opacity-50"
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
      <p className={`text-sm mb-4 line-clamp-3 leading-relaxed ${
        isCompleted ? "text-gray-500" : "text-gray-600"
      }`}>
        {task.description || "No description provided"}
      </p>

      {/* Attachments Display */}
      {task.attachments && task.attachments.length > 0 && (
        <div className="mb-4 p-3 bg-white/50 rounded-lg border border-gray-200">
          <div className="flex items-center gap-2 mb-2">
            <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
            </svg>
            <span className="text-xs font-semibold text-gray-700">
              {task.attachments.length} Attachment{task.attachments.length > 1 ? 's' : ''}
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            {task.attachments.slice(0, 3).map((attachment, index) => (
              <a
                key={index}
                href={`${process.env.NEXT_PUBLIC_API_URL?.replace('/api', '')}${attachment.url}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 px-2 py-1 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded text-xs font-medium transition-colors border border-blue-200"
                title={attachment.name}
              >
                <span>{getFileIcon(attachment.mime_type)}</span>
                <span className="max-w-25 truncate">{attachment.name}</span>
              </a>
            ))}
            {task.attachments.length > 3 && (
              <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs font-medium">
                +{task.attachments.length - 3} more
              </span>
            )}
          </div>
        </div>
      )}

      {/* Tags */}
      <div className="flex flex-wrap gap-2 mb-4">
        <span className={`px-3 py-1 rounded-lg text-xs font-semibold border ${getStatusColor(task.status)}`}>
          {isCompleted && "✓ "}
          {task.status.charAt(0).toUpperCase() + task.status.slice(1)}
        </span>
        <span className={`px-3 py-1 rounded-lg text-xs font-bold border-2 ${priorityStyles.badge}`}>
          {priorityStyles.icon} {isCompleted ? "DONE" : task.priority.toUpperCase()}
        </span>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between text-xs text-gray-500 pt-4 border-t border-gray-200">
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