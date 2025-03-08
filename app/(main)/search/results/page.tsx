'use client'
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

interface SearchResult {
  title: string;
  url: string;
  snippet: string;
}

const mockResults: SearchResult[] = [
  // 同上...
];

export default function ResultsPage() {
  const searchParams = useSearchParams();

  const q = searchParams.get("q");

  // TODO: 替换为实际API调用
  // const { data, error } = useSWR(`/api/search?q=${q}`, fetcher);

  return (
    <div className="min-h-screen p-4 max-w-4xl mx-auto">
      <div>
        这是数据
      </div>
      <div className="mb-8">
        <Link href="/search" className="text-blue-600 hover:underline">
          ← 返回搜索
        </Link>
      </div>

      <div className="space-y-8">
        {mockResults.map((result, index) => (
          <div key={index} className="space-y-1">
            <div className="text-sm text-gray-600">{result.url}</div>
            <a
              href={result.url}
              className="text-xl text-blue-800 hover:underline font-medium block"
            >
              {result.title}
            </a>
            <p className="text-gray-600">{result.snippet}</p>
          </div>
        ))}
      </div>

      {/* TODO: 分页功能 */}
      <div className="flex justify-center space-x-4 mt-8">
        <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
          上一页
        </button>
        <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
          下一页
        </button>
      </div>
    </div>
  );
}