"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { toast } from "sonner";

import { externalPost, GetPostListRequest, Post } from "@/types/post/post";
import { CustomError } from "@/types/error/Error";
import { ErrorCode } from "@/types/error/ErrorCode";
import { queryPostList } from "@/app/(main)/home/action";
import { BaseResponse } from "@/types";

const defaultPostArray: Post[] = [
  {
    authorName: "xx",
    categoryVo: {
      categoryName: "",
      categoryUrl: "",
      createTime: 123,
      description: "",
      id: 123,
      updateTime: 123,
    },
    commentTime: 123,
    createTime: 123,
    isTop: "",
    postId: "",
    summary: "",
    tagVos: [
      {
        createTime: 123,
        description: "",
        tagUrl: "",
        updateTime: 123,
        id: 123,
      },
    ],
    title: "",
    type: "",
    updateTime: 123,
    urls: [
      {
        createTime: 123,
        id: 123,
        mediaType: "",
        mediaUrl: "",
      },
    ],
    userVo: {
      avatar: "",
      bio: "",
      fansCount: "",
      followingCount: "",
      userId: "",
      userName: "",
    },
    view_counts: "",
  },
];

interface PostProvider {
  postList: Post[];
  fetchData: (request: GetPostListRequest) => void;
}
export const PostContext = createContext<PostProvider | undefined>(undefined);

export const useGetPostContext = () => {
  const postContext = useContext(PostContext);

  if (postContext === undefined) {
    throw new CustomError("post context undefined!", 500);
  }

  return postContext;
};

export function PostProvider({ children }: { children: React.ReactNode }) {
  const [postList, setPostList] = useState<Post[]>(defaultPostArray);
  const fetchData = async (request: GetPostListRequest) => {
    try {
      const res: BaseResponse<externalPost> = await queryPostList(request);

      console.log("查询全部帖子：", res);

      if (res.data) {
        setPostList(res.data.records);
      } else {
        // 后端返回无数据
        toast.error(ErrorCode.SERVER_ERROR.message);
      }
    } catch (error) {
      console.error("err--->", error);
    }
  };

  useEffect(() => {
    fetchData({
      pageNo: 1,
      pageSize: 10,
      postId: "",
      categoryId: "",
      tagIds: [],
    });
  }, []);
  // const fetchData = (request: GetPostListRequest) => {
  //   return "";
  // };

  return (
    <PostContext.Provider value={{ postList, fetchData }}>
      {postList[0].authorName !== "xx" ? children : <div>加载中...</div>}
    </PostContext.Provider>
  );
}
