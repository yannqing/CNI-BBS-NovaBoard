"use client";

import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import { twMerge } from "tailwind-merge";
import { Eye, PartyPopper } from "lucide-react";
import { Divider } from "@nextui-org/divider";

import { getPostInfoByIdAction } from "@/app/(main)/mdx-page/[slug]/action";
import { BaseResponse } from "@/types";
import { GetPostByIdResponse } from "@/types/post/post";
import AuthorCard from "@/components/myself/author/AuthorCard";

export default function Page({ params }: { params: { slug: string } }) {
  const [postContent, setPostContent] = useState<GetPostByIdResponse>();

  // 初始化获取数据
  useEffect(() => {
    fetchPostData().then(() => {});
  }, []);

  const fetchPostData = async () => {
    const res: BaseResponse<GetPostByIdResponse> = await getPostInfoByIdAction(
      params.slug,
    );

    if (res.success && res.data) {
      // toast.success("获取帖子信息成功");
      setPostContent(res.data);
    }
  };

  return (
    <div className="prose flex flex-col">
      <div
        className={twMerge(
          "w-full bg-gradient-to-r from-pink-500 to-orange-500 p-10 flex justify-center",
        )}
      >
        <AuthorCard userVo={postContent?.userVo} />
      </div>
      <div className={"flex flex-col px-10 justify-center w-full mt-10"}>
        {/*TODO 如果数据未空会怎样？*/}
        <div className={"text-4xl flex justify-center"}>
          <div>{postContent?.title}</div>
        </div>
        <div className={"flex justify-center gap-2 mt-5"}>
          <div>
            {postContent?.createTime
              ? new Date(postContent?.createTime).getFullYear() +
                "年" +
                new Date(postContent?.createTime).getMonth() +
                "月" +
                new Date(postContent?.createTime).getDate() +
                "日"
              : ""}
          </div>
          <div>
            {/*TODO 如果 tag 数量过多，如何处理？*/}
            {postContent?.tagVos
              ? postContent?.tagVos?.map((tag, index) => (
                  <span key={index} className={"mr-2"}>
                    #{tag.tagName}
                  </span>
                ))
              : ""}
          </div>
          <div className={"flex justify-center gap-0.5"}>
            <Eye className={"w-5 mt-1"} />
            {postContent?.view_counts}
          </div>
        </div>
        <div className={"flex justify-center w-full mt-5"}>
          <div className={"w-2/3 border-2 rounded-lg p-4"}>
            <div className={"flex flex-row gap-2"}>
              <PartyPopper className={"mt-0.5 w-5"} />
              <div>AI 生成的摘要</div>
            </div>
            <div
              className={
                "flex gap-2 mt-2 text-sm tracking-wide leading-relaxed"
              }
            >
              {postContent?.summary}
            </div>
          </div>
        </div>
      </div>
      <div className={"px-10 flex justify-center w-full mt-5"}>
        <div className={"w-2/3"}>
          <ReactMarkdown className={"w-full"}>
            {postContent?.postContent?.content}
          </ReactMarkdown>
        </div>
      </div>
      <Divider className="my-4" />
      <div className={"flex justify-center w-full mt-1 px-10"}>
        <div className={"w-2/3 font-serif text-sm"}>
          商业转载请联系站长获得授权，非商业转载请注明本文出处及文章链接，您可以自由地在任何媒体以任何形式复制和分发作品，也可以修改和创作，但是分发衍生作品时必须采用相同的许可协议。
        </div>
      </div>
      <div className={"flex justify-center w-full mt-1 px-10"}>
        <div className={"w-2/3 font-serif text-sm"}>
          本文采用CC BY-NC-SA 4.0 - 非商业性使用 - 相同方式共享 4.0
          国际进行许可。
        </div>
      </div>
    </div>
  );
}
