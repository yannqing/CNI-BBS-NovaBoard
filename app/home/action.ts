import service from "@/utils/axios";
import { GetAllCategoryRequest } from "@/types/post/category";
import { GetPostListRequest } from "@/types/post/post";

/**
 * 查询分类标签
 * @param getAllCategoryRequest
 */
export async function getAllCategoryAction(
  getAllCategoryRequest: GetAllCategoryRequest,
) {
  return await service({
    url: "/category/open/list",
    method: "post",
    data: getAllCategoryRequest,
  });
}

/**
 * 查询所有帖子列表
 * @param getPostListRequest
 */
export async function queryPostList(getPostListRequest: GetPostListRequest) {
  return await service({
    url: "/post/open/queryPostList",
    method: "post",
    data: getPostListRequest,
  });
}
