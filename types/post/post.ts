import { UserVo } from "@/types/auth/user";

// 查询帖子列表请求参数
export type GetPostListRequest = {
  pageNo: number;
  pageSize: number;
  postId: string;
  categoryId: string;
  tagIds: string[];
};

// 根据帖子 id 查询帖子信息接口响应
export type GetPostByIdResponse = {
  categoryVo?: CategoryVo;
  commentTime?: string;
  createTime?: string;
  postContent?: PostContent;
  postId?: string;
  summary?: string;
  tagVos?: TagVo[];
  title?: string;
  type: string;
  updateTime?: string;
  urls?: PostUrl[];
  userVo?: UserVo;
  view_counts?: string;
};

// 帖子封装类
export type Post = {
  authorName: string;
  categoryVo: CategoryVo;
  commentTime: number;
  createTime: number;
  isTop: string;
  postId: string;
  summary: string;
  tagVos: TagVo[];
  title: string;
  type: string;
  updateTime: number;
  urls: PostUrl[];
  userVo: UserVo;
  view_counts: string;
};

// 帖子 url 封装类
export type PostUrl = {
  createTime: number;
  id: number;
  mediaType: string;
  mediaUrl: string;
};

// 标签封装类
export type TagVo = {
  createTime: number;
  description: string;
  tagUrl: string;
  updateTime: number;
  id: number;
  categoryId: string;
  tagName: string;
};

// 类别封装类
export type CategoryVo = {
  categoryName: string;
  categoryUrl: string;
  createTime: number;
  description: string;
  id: number;
  updateTime: number;
};

// 帖子内容
export type PostContent = {
  content: string;
  contentHtml: string;
};
