"use client";
import { useSearchParams } from "next/navigation";
import React from "react";
import { User } from "@nextui-org/user";

interface Author {
  name: string;
  description: string;
  avatar: string;
}

interface SearchResult {
  author: Author;
  title: string;
  url: string;
  snippet: string;
}

const mockResults: SearchResult[] = [
  // 同上...
  {
    author: {
      name: "Wikipedia",
      description: "",
      avatar:
        "https://cdn.pixabay.com/photo/2023/06/26/21/22/shack-8090832_1280.jpg",
    },
    title: "你好-维基词典，自由的多言语词典",
    url: "https://i.pravatar.cc/150?u=a04258114e29026702d",
    snippet:
      "本詞條為常用語手冊計畫的一部分，基於收錄標準，給出一些具有實用性、簡潔性、通用性的短語。 正體/繁體 (你好), 你 · 好 · 簡體 #(你好), 你 · 好. 異體, 汝好 閩語 ...",
  },
  {
    author: {
      name: "Wikipedia",
      description: "",
      avatar:
        "https://cdn.pixabay.com/photo/2023/06/26/21/22/shack-8090832_1280.jpg",
    },
    title: "你好-维基词典，自由的多言语词典",
    url: "https://i.pravatar.cc/150?u=a04258114e29026702d",
    snippet:
      "本詞條為常用語手冊計畫的一部分，基於收錄標準，給出一些具有實用性、簡潔性、通用性的短語。 正體/繁體 (你好), 你 · 好 · 簡體 #(你好), 你 · 好. 異體, 汝好 閩語 ...",
  },
  {
    author: {
      name: "Wikipedia",
      description: "",
      avatar:
        "https://cdn.pixabay.com/photo/2023/06/26/21/22/shack-8090832_1280.jpg",
    },
    title: "你好-维基词典，自由的多言语词典",
    url: "https://i.pravatar.cc/150?u=a04258114e29026702d",
    snippet:
      "本詞條為常用語手冊計畫的一部分，基於收錄標準，給出一些具有實用性、簡潔性、通用性的短語。 正體/繁體 (你好), 你 · 好 · 簡體 #(你好), 你 · 好. 異體, 汝好 閩語 ...",
  },
  {
    author: {
      name: "Wikipedia",
      description: "",
      avatar:
        "https://cdn.pixabay.com/photo/2023/06/26/21/22/shack-8090832_1280.jpg",
    },
    title: "你好-维基词典，自由的多言语词典",
    url: "https://i.pravatar.cc/150?u=a04258114e29026702d",
    snippet:
      "本詞條為常用語手冊計畫的一部分，基於收錄標準，給出一些具有實用性、簡潔性、通用性的短語。 正體/繁體 (你好), 你 · 好 · 簡體 #(你好), 你 · 好. 異體, 汝好 閩語 ...",
  },
  {
    author: {
      name: "Wikipedia",
      description: "",
      avatar:
        "https://cdn.pixabay.com/photo/2023/06/26/21/22/shack-8090832_1280.jpg",
    },
    title: "你好-维基词典，自由的多言语词典",
    url: "https://i.pravatar.cc/150?u=a04258114e29026702d",
    snippet:
      "本詞條為常用語手冊計畫的一部分，基於收錄標準，給出一些具有實用性、簡潔性、通用性的短語。 正體/繁體 (你好), 你 · 好 · 簡體 #(你好), 你 · 好. 異體, 汝好 閩語 ...",
  },
];

export default function ResultsPage() {
  const searchParams = useSearchParams();

  const q = searchParams.get("q");

  // TODO: 替换为实际API调用
  // const { data, error } = useSWR(`/api/search?q=${q}`, fetcher);

  const ResultItems: React.FC<SearchResult> = ({
    author,
    url,
    title,
    snippet,
  }: SearchResult) => {
    return (
      <div className="space-y-1 cursor-pointer group">
        <User
          avatarProps={{
            src: author.avatar,
          }}
          description={<div className="text-sm text-gray-600">{url}</div>}
          name={author.name}
        />
        <a
          className="text-xl text-blue-800 group-hover:underline font-medium block"
          href={url}
        >
          {title}
        </a>
        <p className="text-gray-600 text-sm">{snippet}</p>
      </div>
    );
  };

  return (
    <div className="min-h-screen p-4 max-w-4xl mx-auto">
      {/*<div>这是数据</div>*/}
      {/*<div className="mb-8">*/}
      {/*  <Link className="text-blue-600 hover:underline" href="/search">*/}
      {/*    ← 返回搜索*/}
      {/*  </Link>*/}
      {/*</div>*/}

      <div className="space-y-8">
        {mockResults.map((result, index) => (
          <ResultItems
            key={index}
            author={result.author}
            snippet={result.snippet}
            title={result.title}
            url={result.url}
          />
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
