"use server";

import service from "@/utils/axios";
import {
  CreatePostRequest,
  PublishPostStepOneRequest,
} from "@/types/post/post";
import { GetTagsRequest } from "@/types/post/tags";

export interface deleteFileRequest {
  fileName?: string;
  userId?: string;
  path?: string;
  isPrivate?: boolean;
};

export interface cleanTemporaryCoverRequest {
  postId?: string;
  authorId?: string;
  coverUrl?: string;
};

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
 * 删除上传文件
 * @param request
 * @returns
 */
export async function deleteFileAction(request: deleteFileRequest) {
  return service({
    url: "/common/deleteFile",
    method: "post",
    data: request,
  });
}
/**
 * 删除封面缓存
 * @param request
 * @returns
 */
export async function cleanTemporaryCoverAction(request: cleanTemporaryCoverRequest) {
  return service({
    url: "/cleanTemporaryCoverAction",
    method: "post",
    data: request,
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
