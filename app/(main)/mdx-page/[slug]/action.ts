"use server";

import service from "@/utils/axios";

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
