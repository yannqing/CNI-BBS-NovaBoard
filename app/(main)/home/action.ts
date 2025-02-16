"use server";

import service from "@/utils/axios";
import { GetAllCategoryRequest } from "@/types/post/category";
import { GetPostListRequest } from "@/types/post/post";
import { BuildFollowRequest, ChangeFollowStatusRequest, GetFollowListRequest,RemoveFollowRequest } from "@/types/follow/follow";
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
export async function queryPostListAction(
  getPostListRequest: GetPostListRequest,
) {
  return await service({
    url: "/post/open/queryPostList",
    method: "post",
    data: getPostListRequest,
  });
}

/**
 * 查询推荐作者列表
 * @param userId  可选的用户Id
 * @returns 
 */
export async function getRecommendUsersAction(userId: string = '') {
  const url = userId ? `/user/recommendedUser/${userId}` : "/user/open/recommendedUser";
  return await service({
    url: url,
    method: "get",
  });
}
/**
 * 查询关注列表
 */
export async function getFollowListAction(
  getFollowListRequest: GetFollowListRequest,
){
  return await service({
    url: "/follow/list",
    method: "post",
    data: getFollowListRequest,
  });
}
/**
 * 改变关注状态
 */
export async function changeFollowStatusAction(
  changeFollowStatusRequest: ChangeFollowStatusRequest,
){
  return await service({
    url: "/follow/changeFollowStatus",
    method: "post",
    data: changeFollowStatusRequest,
  });
}
/**
 * 建立关注
 */
export async function buildFollowAction(
  buildFollowRequest: BuildFollowRequest,
){
  return await service({
    url: "/follow/buildFollow",
    method: "post",
    data: buildFollowRequest,
  });
}
/**
 * 取消关注彼此
 */
export async function removeFollowAction(
  removeFollowRequest: RemoveFollowRequest,
){
  return await service({
    url: "/follow/removeFollow",
    method: "post",
    data: removeFollowRequest,
  });
}
