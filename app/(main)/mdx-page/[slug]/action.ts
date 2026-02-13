"use server";

import service from "@/utils/axios";
import { PostCommentParam,PostCommentsDTO } from "@/types/post/comment";

/**
 * 根据帖子 id 查询帖子具体信息
 * @param postId
 */
export async function getPostInfoByIdAction(postId: string) {
  return await service({
    url: "/post/open/" + postId,
    method: "get",
  });
}
/**
 * 获取帖子评论分页
 * @param postCommentParam 
 * @returns 
 */
export async function getCommentListByPostIdAction(postCommentParam: PostCommentParam) {
  return await service({
    url: "/post/open/queryCommentListByPostId",
    method: "post",
    data: postCommentParam,
  });
}
/**
 * 新增帖子评论
 * @param postCommentsDTO 
 * @returns 
 */
export async function addPostCommentAction(postCommentsDTO: PostCommentsDTO) {
  return await service({
    url: "/post/addPostComment",
    method: "post",
    data: postCommentsDTO,
  });
}
/**
 * 删除帖子评论
 * @param postCommentsDTO 
 * @returns 
 */
export async function deletePostCommentAction(postCommentParam: PostCommentParam) {
  return await service({
    url: "/post/deletePostComment",
    method: "delete",
    data: postCommentParam,
  });
}
