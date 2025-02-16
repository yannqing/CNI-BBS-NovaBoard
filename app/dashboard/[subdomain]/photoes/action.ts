"use server";

import service from "@/utils/axios";
import {
  CreatePostRequest,
  PublishPostStepOneRequest,
} from "@/types/post/post";
import { GetTagsRequest } from "@/types/post/tags";

/**
 * 上传文件
 * @param request
 * @returns
 */
export async function uploadFileAction(request: FormData) {
  return service({
    url: "/common/upload/media",
    method: "post",
    data: request,
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
}

/**
 * 发布帖子
 * @param request
 * @returns
 */
export async function createPostAction(request: CreatePostRequest) {
  return service({
    url: "/post/createPost",
    method: "post",
    data: request,
  });
}

/**
 * 获取标签列表
 * @returns
 */
export async function getTagsAction(request: GetTagsRequest) {
  return service({
    url: "/tag/open/list",
    method: "post",
    data: request,
  });
}

/**
 * 发布帖子第一步
 * @param request
 * @returns
 */
export async function publishPostStepOneAction(
  request: PublishPostStepOneRequest,
) {
  return service({
    url: "/post/createTemporaryPostId",
    method: "get",
    params: request,
  });
}
