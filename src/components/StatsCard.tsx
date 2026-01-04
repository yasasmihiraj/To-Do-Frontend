"use client";

interface StatsCardProps {
  title: string;
  count: number;
}

export default function StatsCard({ title, count }: StatsCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-md p-6 mb-8 hover:shadow-lg transition-shadow">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-gray-500 text-sm font-medium uppercase tracking-wide">
            {title}
          </h3>
          <p className="text-4xl font-bold text-gray-800 mt-2">{count}</p>
        </div>
        <div className="bg-green-100 rounded-full p-4">
          <svg 
            className="w-8 h-8 text-green-600" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" 
            />
          </svg>
        </div>
      </div>
    </div>
  );
}