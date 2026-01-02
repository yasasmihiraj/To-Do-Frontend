"use client";


export default function StatsCard({ title, count }: { title: string, count: number }) {
  return (
    <div className="bg-white rounded-xl shadow p-6 mb-8">
      <h3 className="text-gray-500 text-sm font-medium">{title}</h3>
      <p className="text-3xl font-bold text-gray-800 mt-2">{count}</p>
    </div>
  );
}