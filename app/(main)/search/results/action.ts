"use server";

import service from "@/utils/axios";
import { PostSearchRequest } from "@/types/post/search";

/**
 * 查询es中的帖子信息
 * @param postSearchRequest
 */
export async function searchPostAction(
  postSearchRequest: PostSearchRequest,
) {
  return await service({
    url: "/es/postSearch",
    method: "post",
    data: postSearchRequest,
  });
}
