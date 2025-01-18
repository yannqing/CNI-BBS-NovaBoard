export type GetAllCategoryRequest = {
  /* */
  pageNo?: number;

  /* */
  pageSize?: number;

  /*帖子名称 */
  categoryName?: string;
};

export type Category = {
  id?: number;
  categoryName?: string;
  categoryUrl?: string;
  description?: string;
  createDate?: number;
  updateDate?: number;
};
