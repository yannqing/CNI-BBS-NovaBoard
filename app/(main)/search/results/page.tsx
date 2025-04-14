"use client";
import { useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { User } from "@nextui-org/user";
import { searchPostAction } from "./action";
import { PostSearchRequest, PostViewVo } from "@/types/post/search";
import { useRouter } from "next/navigation";

export default function ResultsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const q = searchParams.get("q");
  const page = parseInt(searchParams.get("page") || "1");
  
  const [results, setResults] = useState<PostViewVo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState(page);
  const pageSize = 10;

  useEffect(() => {
    const fetchResults = async () => {
      if (!q) return;
      
      try {
        setLoading(true);
        const postSearchRequest: PostSearchRequest = {
          keyword: q,
          pageNo: currentPage, 
          pageSize: pageSize
        };

        const response = await searchPostAction(postSearchRequest);
        if (response.data) {
          setResults(response.data.records || []);
          setTotal(response.data.total || 0);
        }
      } catch (err) {
        setError("Failed to fetch search results");
        console.error("Search error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [q, currentPage]);

  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > Math.ceil(total / pageSize)) return;
    setCurrentPage(newPage);
    router.push(`/search/results?q=${encodeURIComponent(q || '')}&page=${newPage}`);
  };

  const ResultItem: React.FC<{ result: PostViewVo }> = ({ result }) => {
    return (
      <div className="space-y-1 cursor-pointer group mb-6">
        <User
          avatarProps={{
            src: result.userVo.avatar,
          }}
          description={
            <div className="text-sm text-gray-600">
              {result.createTime} • {result.userVo.userName}
            </div>
          }
          name={result.userVo.userName}
        />
        <a
          className="text-xl text-blue-800 group-hover:underline font-medium block"
          href={`/mdx-page/${result.postId}`}  // Changed to /mdx-page/
        >
          {result.title}
        </a>
        <p className="text-gray-600 text-sm">{result.summary}</p>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen p-4 max-w-4xl mx-auto">
        <div>Loading results for "{q}"...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen p-4 max-w-4xl mx-auto">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  if (!q) {
    return (
      <div className="min-h-screen p-4 max-w-4xl mx-auto">
        <div>No search query provided</div>
      </div>
    );
  }

  const totalPages = Math.ceil(total / pageSize);

  return (
    <div className="min-h-screen p-4 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Search Results for "{q}"</h1>
      
      <div className="space-y-8">
        {results.length > 0 ? (
          results.map((result) => (
            <ResultItem key={result.postId} result={result} />
          ))
        ) : (
          <div>No results found for "{q}"</div>
        )}
      </div>

      {total > pageSize && (
        <div className="flex justify-center space-x-4 mt-8">
          <button 
            className={`px-4 py-2 rounded hover:bg-blue-600 ${
              currentPage === 1 
                ? "bg-gray-300 cursor-not-allowed" 
                : "bg-blue-500 text-white"
            }`}
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            上一页
          </button>
          
          <span className="flex items-center">
            所在页 {currentPage} 总页数 {totalPages}
          </span>
          
          <button 
            className={`px-4 py-2 rounded hover:bg-blue-600 ${
              currentPage === totalPages 
                ? "bg-gray-300 cursor-not-allowed" 
                : "bg-blue-500 text-white"
            }`}
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            下一页
          </button>
        </div>
      )}
    </div>
  );
}