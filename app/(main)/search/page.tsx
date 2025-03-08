"use client";

import {  useState } from "react";
import { useRouter } from "next/navigation";
interface SearchResult {
  title: string;
  url: string;
  snippet: string;
}

const mockResults: SearchResult[] = [
  {
    title: "手术注意事项 - 医疗百科",
    url: "https://medical.com/surgery-guide",
    snippet: "了解手术前的准备事项和术后护理指南，包含常见手术的注意事项..."
  },
  {
    title: "微创手术最新技术发展",
    url: "https://tech-surgery.com",
    snippet: "近年来微创手术技术的突破性进展，减少患者恢复时间..."
  }
];

export default function SearchPage() {
  const [query, setQuery] = useState('');
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    // TODO: 替换为实际API调用
    // fetch(`/api/search?q=${encodeURIComponent(query)}`)
    //   .then(res => res.json())
    //   .then(data => router.push({
    //     pathname: '/results',
    //     query: { q: query },
    //   }))

    // 使用模拟数据跳转

    router.push(`/search/results?q=${encodeURIComponent(query)}`);
  };

  return (
    <div className=" mt-36 flex flex-col items-center justify-center p-4">
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