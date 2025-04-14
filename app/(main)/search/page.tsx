"use client";

import {  useState } from "react";
import { useRouter } from "next/navigation";
export default function SearchPage() {
  const [query, setQuery] = useState('');
  const router = useRouter();

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
        router.push(`/search/results?q=${encodeURIComponent(query)}`);
  };

  return (
    <div className=" mt-24 ml-36 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-3xl space-y-6">
        <h1 className="text-7xl font-bold text-center text-blue-600">CNI-BBS</h1>
        
        <form onSubmit={handleSearch} className="space-y-4">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="输入搜索内容"
            className="w-full px-4 py-2 border border-gray-300 rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          
          <div className="flex justify-center space-x-4">
            <button
              type="submit"
              className="px-6 py-2 bg-gray-100 hover:bg-gray-200 rounded text-sm text-gray-600 transition-colors"
            >
              CNI-BBS 搜索
            </button>
            <button
              type="button"
              className="px-6 py-2 bg-gray-100 hover:bg-gray-200 rounded text-sm text-gray-600 transition-colors"
            >
              手气不错哟
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
