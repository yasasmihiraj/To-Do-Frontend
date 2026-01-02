"use client";

interface UserTableProps {
  users: any[];
  currentUserRole: string; 
  onDelete: (id: number) => void;
}

export default function UserTable({ users, currentUserRole, onDelete }: UserTableProps) {
  
 
  if (users.length === 0) {
    return <div className="p-8 text-center text-gray-500">No users found</div>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {users.map((u) => (
            <tr key={u.id}>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{u.id}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{u.name}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{u.email}</td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                  u.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'
                }`}>
                  {u.role}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm">
  
                {u.role !== 'admin' && (
                  <button
                    onClick={() => onDelete(u.id)}
                    className="text-red-600 hover:text-red-900 font-medium"
                  >
                    Delete
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}