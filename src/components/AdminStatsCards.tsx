interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  created_at: string;
}

interface AdminStatsCardsProps {
  users: User[];
}

export default function AdminStatsCards({ users }: AdminStatsCardsProps) {
  const totalUsers = users.length;
  const adminUsers = users.filter(u => u.role === 'admin').length;
  const regularUsers = users.filter(u => u.role === 'user').length;

  const stats = [
    {
      title: "Total Users",
      value: totalUsers,
      subtitle: "Registered users",
      bgGradient: "from-blue-500 to-indigo-600",
      textColor: "text-gray-900",
      icon: (
        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      ),
    },
    {
      title: "Admins",
      value: adminUsers,
      subtitle: "Administrator accounts",
      bgGradient: "from-amber-500 to-orange-600",
      textColor: "text-gray-900",
      icon: (
        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ),
    },
    {
      title: "Regular Users",
      value: regularUsers,
      subtitle: "Standard accounts",
      bgGradient: "from-emerald-500 to-green-600",
      textColor: "text-gray-900",
      icon: (
        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      {stats.map((stat, index) => (
        <div
          key={index}
          className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">
                {stat.title}
              </p>
              <p className={`text-4xl font-bold ${stat.textColor}`}>
                {stat.value}
              </p>
              <p className="text-xs text-gray-500 mt-2">
                {stat.subtitle}
              </p>
            </div>
            <div className={`bg-linear-to-br ${stat.bgGradient} p-4 rounded-xl shadow-lg`}>
              {stat.icon}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}