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
  create_date: number;
  istop: string;
  postId: string;
  summary: string;
  tagVos: tagVo[];
  title: string;
  type: string;
  update_date: number;
  urls: PostUrl[];
  view_counts: string;
};

export type PostUrl = {
  createData: number;
  id: number;
  mediaType: string;
  mediaUrl: string;
};

export type tagVo = {
  createData: number;
  description: string;
  tagUrl: string;
  updateDate: number;
  id: number;
};

export type categoryVo = {
  categoryName: string;
  categoryUrl: string;
  createDate: number;
  description: string;
  id: number;
  updateDate: number;
};
