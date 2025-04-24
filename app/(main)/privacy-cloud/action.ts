"use server";

import service from "@/utils/axios";

import {
  CreateTemporaryUrlRequest,
  DeleteFileRequest
} from '@/types/cloud/cloudfile';

/**
 * 根据用户ID查询文件列表
 * @param userId 用户ID
 * @returns 
 */
export async function queryFileListAction(userId: string) {
  return await service({
    url: `/common/queryFileList/${userId}`,
    method: "get"
  });
}

/**
 * 生成文件临时Url(供下载使用)
 * @param data 生成临时URL请求参数
 * @returns 
 */
export async function createTemporaryUrlAction(data: CreateTemporaryUrlRequest){
  return await service({
    url: "/common/file/createTemporaryUrl",
    method: "post",
    data: data
  });
}

/**
 * 删除文件
 * @param data 删除文件请求参数
 * @returns 
 */
export async function deleteFileAction(data: DeleteFileRequest){
  return await service({
    url: "/common/deleteFile",
    method: "post",
    data: data
  });
}