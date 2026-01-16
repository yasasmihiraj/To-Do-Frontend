"use client";

import { useState, useMemo } from "react";

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  created_at: string;
}

interface UserTableProps {
  users: User[];
  currentUserRole: string; 
  onDelete: (id: number) => void;
  onRoleChange: (userId: number, newRole: string) => void;
}

export default function UserTable({ users, currentUserRole, onDelete, onRoleChange }: UserTableProps) {
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [editingUserId, setEditingUserId] = useState<number | null>(null);
  const [selectedRole, setSelectedRole] = useState<string>("");

  // Filter users
  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      // Role filter
      if (roleFilter !== "all" && user.role !== roleFilter) {
        return false;
      }

      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return (
          user.name.toLowerCase().includes(query) ||
          user.email.toLowerCase().includes(query)
        );
      }

      return true;
    });
  }, [users, roleFilter, searchQuery]);

  const clearFilters = () => {
    setRoleFilter("all");
    setSearchQuery("");
  };

  const hasActiveFilters = roleFilter !== "all" || searchQuery !== "";

  const handleRoleEditClick = (user: User) => {
    setEditingUserId(user.id);
    setSelectedRole(user.role);
  };

  const handleRoleSave = (userId: number) => {
    onRoleChange(userId, selectedRole);
    setEditingUserId(null);
  };

  const handleRoleCancel = () => {
    setEditingUserId(null);
    setSelectedRole("");
  };
  
  if (users.length === 0) {
    return (
      <div className="p-12 text-center">
        <div className="text-gray-300 mb-4">
          <svg 
            className="mx-auto h-20 w-20" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={1.5} 
              d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" 
            />
          </svg>
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">No users found</h3>
        <p className="text-gray-500">Get started by registering a new user.</p>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  return (
    <div>
      {/* Filters */}
      <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Search */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-2 uppercase tracking-wider">
              Search Users
            </label>
            <div className="relative">
              <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Search by name or email..."
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {/* Role Filter */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-2 uppercase tracking-wider">
              Filter by Role
            </label>
            <select
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
            >
              <option value="all">All Roles</option>
              <option value="admin">Admin</option>
              <option value="user">User</option>
            </select>
          </div>
        </div>

        {/* Clear Filters & Results Count */}
        <div className="mt-4 flex items-center justify-between">
          <p className="text-sm text-gray-600">
            Showing <span className="font-bold text-gray-900">{filteredUsers.length}</span> of{" "}
            <span className="font-bold text-gray-900">{users.length}</span> users
          </p>
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="text-sm text-indigo-600 hover:text-indigo-700 font-semibold flex items-center gap-1 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              Clear all filters
            </button>
          )}
        </div>
      </div>

      {/* Table */}
      {filteredUsers.length === 0 ? (
        <div className="p-12 text-center">
          <div className="text-gray-300 mb-4">
            <svg 
              className="mx-auto h-16 w-16" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={1.5} 
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" 
              />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">No users found</h3>
          <p className="text-gray-500">
            {hasActiveFilters
              ? "Try adjusting your filters to see more results"
              : "No users match your search criteria"}
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  ID
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Joined
                </th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {filteredUsers.map((u) => (
                <tr key={u.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-500">
                    #{u.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold shadow-md ${
                        u.role === 'admin' 
                          ? 'bg-linear-to-br from-amber-500 to-orange-500' 
                          : 'bg-linear-to-br from-indigo-500 to-purple-500'
                      }`}>
                        {u.name.charAt(0).toUpperCase()}
                      </div>
                      <span className="text-sm font-medium text-gray-900">{u.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {u.email}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {editingUserId === u.id ? (
                      <div className="flex items-center gap-2">
                        <select
                          value={selectedRole}
                          onChange={(e) => setSelectedRole(e.target.value)}
                          className="text-xs px-3 py-1.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                        >
                          <option value="user">User</option>
                          <option value="admin">Admin</option>
                        </select>
                        <button
                          onClick={() => handleRoleSave(u.id)}
                          className="text-green-600 hover:text-green-700 p-1.5 hover:bg-green-50 rounded transition-colors"
                          title="Save"
                        >
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </button>
                        <button
                          onClick={handleRoleCancel}
                          className="text-red-600 hover:text-red-700 p-1.5 hover:bg-red-50 rounded transition-colors"
                          title="Cancel"
                        >
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                          </svg>
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <span className={`inline-flex items-center px-3 py-1 rounded-lg text-xs font-semibold border ${
                          u.role === 'admin' 
                            ? 'bg-amber-100 text-amber-700 border-amber-200' 
                            : 'bg-blue-100 text-blue-700 border-blue-200'
                        }`}>
                          {u.role === 'admin' ? (
                            <svg className="w-3 h-3 mr-1.5" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                          ) : (
                            <svg className="w-3 h-3 mr-1.5" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                            </svg>
                          )}
                          {u.role.charAt(0).toUpperCase() + u.role.slice(1)}
                        </span>
                        {currentUserRole === 'admin' && (
                          <button
                            onClick={() => handleRoleEditClick(u)}
                            className="text-indigo-600 hover:text-indigo-700 p-1.5 hover:bg-indigo-50 rounded transition-colors"
                            title="Change Role"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                            </svg>
                          </button>
                        )}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {formatDate(u.created_at)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-right">
                    {u.role !== 'admin' ? (
                      <button
                        onClick={() => onDelete(u.id)}
                        className="inline-flex items-center gap-1.5 text-red-600 hover:text-red-700 hover:bg-red-50 px-3 py-1.5 rounded-lg transition-all duration-200 font-semibold"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        Delete
                      </button>
                    ) : (
                      <span className="text-xs text-gray-400 font-medium flex items-center justify-end gap-1">
                        <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                        </svg>
                        Protected
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}