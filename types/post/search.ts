import { UserVo } from "@/types/auth/user";
import { CategoryVo,TagVo } from "@/types/post/post";



export type PostMediaUrlVo = {
  id: string;
  mediaUrl: string;
  mediaType: string;
  createTime: string;
};

export type PostViewVo = {
  postId: string;
  userVo: UserVo;
  title: string;
  summary: string;
  createTime: string; 
  updateTime: string;
  commentTime: string;
  categoryVo: CategoryVo;
  tagVos: TagVo[];
  urls: PostMediaUrlVo[];
  type: string;
  view_counts: string;
  isTop: string; 
};

export type PostSearchRequest = {
  pageNo?: number;
  pageSize?: number;
  keyword?: string;
  authorName?: string;
  categoryId?: number;
  tagList?: number[]; 
  beforeTime?: string;
  afterTime?: string;
  isAsc?: boolean;
  sortBy?: string;
};

