"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AdminHeader from "@/components/Header";
import UserTable from "@/components/UserTable";
import AdminStatsCards from "@/components/AdminStatsCards";
import { useAlert } from "@/contexts/AlertContext";

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  created_at: string;
}

export default function AdminDashboard() {
  const [user, setUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const router = useRouter();
  const { showAlert } = useAlert();

  // Authentication Check & Fetching Logic
  useEffect(() => {
    const userData = localStorage.getItem("user");
    const token = localStorage.getItem("token");

    if (!userData || !token) {
      router.push("/login");
      return;
    }

    try {
      const parsedUser = JSON.parse(userData);
      
      if (parsedUser.role !== "admin") {
        router.push("/tasks");
        return;
      }

      setUser(parsedUser);
      fetchUsers();
    } catch (err) {
      console.error("Invalid user data");
      router.push("/login");
    }
  }, [router]);

  // Fetch Users Function
  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/users`, {
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
      });

      if (res.status === 403) {
        setError("Access denied. Admin privileges required.");
        router.push("/tasks");
        return;
      }

      if (res.status === 401) {
        setError("Session expired. Please login again.");
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        router.push("/login");
        return;
      }

      if (res.ok) {
        const data = await res.json();
        setUsers(data);
        setError("");
      } else {
        setError("Failed to fetch users");
      }
    } catch (err) {
      console.error("Failed to fetch users:", err);
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Role Change Handler
  const handleRoleChange = async (userId: number, newRole: string) => {
    const userToUpdate = users.find(u => u.id === userId);
    
    if (!userToUpdate) return;

    const roleLabel = newRole === 'admin' ? 'Administrator' : 'Regular User';

    showAlert({
      title: 'Confirm Role Change',
      message: `Are you sure you want to change ${userToUpdate.name}'s role to ${roleLabel}?`,
      type: 'warning',
      showCancel: true,
      onConfirm: async () => {
        try {
          const token = localStorage.getItem("token");
          const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/users/${userId}/role`, {
            method: "PUT",
            headers: { 
              "Authorization": `Bearer ${token}`,
              "Content-Type": "application/json",
              "Accept": "application/json",
            },
            body: JSON.stringify({ role: newRole })
          });

          if (res.ok) {
            const data = await res.json();
            // Update local state
            setUsers(users.map(u => 
              u.id === userId ? { ...u, role: newRole } : u
            ));
            setError("");
            showAlert({
              title: 'Success',
              message: `${userToUpdate.name}'s role has been updated to ${roleLabel}.`,
              type: 'success'
            });
          } else {
            const errorData = await res.json();
            setError(errorData.message || "Failed to update user role");
            showAlert({
              title: 'Error',
              message: errorData.message || "Failed to update user role",
              type: 'error'
            });
          }
        } catch (err) {
          console.error("Failed to update user role:", err);
          setError("Network error. Failed to update user role.");
          showAlert({
            title: 'Error',
            message: "Network error. Failed to update user role.",
            type: 'error'
          });
        }
      }
    });
  };

  // Delete Handler
  const handleDeleteUser = async (userId: number) => {
    const userToDelete = users.find(u => u.id === userId);
    
    if (!userToDelete) return;

    showAlert({
      title: 'Confirm Deletion',
      message: `Are you sure you want to delete ${userToDelete.name}? This action cannot be undone.`,
      type: 'warning',
      showCancel: true,
      onConfirm: async () => {
        try {
          const token = localStorage.getItem("token");
          const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/users/${userId}`, {
            method: "DELETE",
            headers: { 
              "Authorization": `Bearer ${token}`,
              "Accept": "application/json",
            },
          });

          if (res.ok) {
            setUsers(users.filter((u) => u.id !== userId));
            setError("");
            showAlert({
              title: 'Success',
              message: `${userToDelete.name} has been deleted successfully.`,
              type: 'success'
            });
          } else {
            const errorData = await res.json();
            setError(errorData.message || "Failed to delete user");
            showAlert({
              title: 'Error',
              message: errorData.message || "Failed to delete user",
              type: 'error'
            });
          }
        } catch (err) {
          console.error("Failed to delete user:", err);
          setError("Network error. Failed to delete user.");
          showAlert({
            title: 'Error',
            message: "Network error. Failed to delete user.",
            type: 'error'
          });
        }
      }
    });
  };

  return (
    <div className="min-h-screen bg-linear-to-b from-zinc-50 to-cyan-200">
      <AdminHeader />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Admin <span className="bg-linear-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">Dashboard</span>
          </h2>
          <p className="text-gray-600">Manage users and monitor system activity</p>
        </div>
        
        {/* Error Alert */}
        {error && (
          <div className="mb-6 bg-red-50 border-l-4 border-red-500 text-red-700 px-6 py-4 rounded-lg flex justify-between items-center shadow-sm">
            <div className="flex items-center gap-3">
              <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <span className="font-medium">{error}</span>
            </div>
            <button onClick={() => setError("")} className="text-red-500 hover:text-red-700 transition-colors">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        )}

        <AdminStatsCards users={users} />

        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-200 bg-linear-to-r from-indigo-50 to-purple-50">
            <div className="flex items-center gap-3">
              <div className="bg-linear-to-br from-indigo-500 to-purple-600 p-2 rounded-lg">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">User Management</h2>
                <p className="text-sm text-gray-600 mt-1">Manage all registered users and their roles</p>
              </div>
            </div>
          </div>
          
          {loading ? (
            <div className="p-12 text-center">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-indigo-200 border-t-indigo-600 mb-4"></div>
              <p className="text-gray-600 font-medium">Loading users...</p>
            </div>
          ) : user ? (
            <UserTable 
              users={users} 
              currentUserRole={user.role} 
              onDelete={handleDeleteUser}
              onRoleChange={handleRoleChange}
            />
          ) : null}
        </div>
      </main>
    </div>
  );
}