"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";

import StatsCard from "@/components/StatsCard";
import UserTable from "@/components/UserTable";

export default function AdminDashboard() {
  const [user, setUser] = useState<any>(null);
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  //  Authentication Check & Fetching Logic
  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (!userData) {
      router.push("/login");
      return;
    }

    const parsedUser = JSON.parse(userData);
    if (parsedUser.role !== "admin") {
      router.push("/tasks");
      return;
    }

    setUser(parsedUser);
    fetchUsers();
  }, [router]);

  //  Fetch Users Function
  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/users`, {
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (res.ok) {
        const data = await res.json();
        setUsers(data);
      }
    } catch (err) {
      console.error("Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  //  Delete Handler
  const handleDeleteUser = async (userId: number) => {
    if (!confirm("Are you sure you want to delete this user?")) return;

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/users/${userId}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` },
      });

      if (res.ok) {
        setUsers(users.filter((u) => u.id !== userId));
      }
    } catch (err) {
      console.error("Failed to delete user");
    }
  };

  if (!user) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

  return (
    <div className="min-h-screen bg-green-100">
      <Header />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        <StatsCard title="Total Users" count={users.length} />
        <div className="bg-white rounded-xl shadow overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-800">User Management</h2>
          </div>
          
          {loading ? (
             <div className="p-8 text-center">Loading users...</div>
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