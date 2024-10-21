import { UserVo } from "@/types/auth/user";

export type GetPostListRequest = {
  pageNo: number;
  pageSize: number;
  postId: string;
  categoryId: string;
  tagIds: string[];
};

export type externalPost = {
  records: Post[];
  total: number;
};

export type Post = {
  authorName: string;
  categoryVo: categoryVo;
  commentTime: number;
  createTime: number;
  isTop: string;
  postId: string;
  summary: string;
  tagVos: tagVo[];
  title: string;
  type: string;
  updateTime: number;
  urls: PostUrl[];
  userVo: UserVo;
  view_counts: string;
};

export type PostUrl = {
  createTime: number;
  id: number;
  mediaType: string;
  mediaUrl: string;
};

export type tagVo = {
  createTime: number;
  description: string;
  tagUrl: string;
  updateTime: number;
  id: number;
};

export type categoryVo = {
  categoryName: string;
  categoryUrl: string;
  createTime: number;
  description: string;
  id: number;
  updateTime: number;
};
