"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import StatsCard from "@/components/StatsCard";
import UserTable from "@/components/UserTable";

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

  // Delete Handler
  const handleDeleteUser = async (userId: number) => {
    const userToDelete = users.find(u => u.id === userId);
    
    if (!userToDelete) return;

    if (!confirm(`Are you sure you want to delete ${userToDelete.name}?`)) return;

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
      } else {
        const errorData = await res.json();
        setError(errorData.message || "Failed to delete user");
      }
    } catch (err) {
      console.error("Failed to delete user:", err);
      setError("Network error. Failed to delete user.");
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-green-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-green-100">
      <Header />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Error Alert */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            <p className="font-medium">{error}</p>
          </div>
        )}

        {/* Stats Card */}
        <StatsCard title="Total Users" count={users.length} />

        {/* User Management Table */}
        <div className="bg-white rounded-xl shadow overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-800">User Management</h2>
            <p className="text-sm text-gray-500 mt-1">
              Manage all registered users in the system
            </p>
          </div>
          
          {loading ? (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading users...</p>
            </div>
          ) : (
            <UserTable 
              users={users} 
              currentUserRole={user.role} 
              onDelete={handleDeleteUser} 
            />
          )}
        </div>

      </main>
    </div>
  );
}