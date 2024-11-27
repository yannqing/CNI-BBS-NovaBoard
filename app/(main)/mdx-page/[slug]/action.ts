import service from "@/utils/axios";

/**
 * 根据帖子 id 查询帖子具体信息
 * @param postId
 */
export function getPostInfoByIdAction(postId: string) {
  return service({
    url: "/post/open/" + postId,
    method: "get",
  });
}
