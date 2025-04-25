"use server";

import service from "@/utils/axios";

import {
  CreateTemporaryUrlRequest,
  DeleteFileRequest,
  UploadFileRequest
} from '@/types/cloud/cloudfile';
import { getCookie } from "@/utils/cookies";
import { CustomError } from "@/types/error/Error";
import { ErrorCode } from "@/types/error/ErrorCode";
import { BaseResponse } from "@/types";
import { headers } from "next/headers";

const BaseURL = "http://localhost:8080";

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

/**
 * 文件上传Server Action
 * @param formData 包含文件的FormData
 * @returns 上传结果
 */
export async function uploadFileAction(formData: FormData) {
  try {
    const file = formData.get("file") as File;
    const userId = formData.get("userId") as string;
    const token = formData.get("token") as string;
    if (!file || !userId) {
      throw new CustomError(
        ErrorCode.TOKEN_EXPIRE.message,
        ErrorCode.TOKEN_EXPIRE.code,
      );
    }

    // 这里实现实际的文件上传逻辑
    const uploadFormData = new FormData();
    uploadFormData.append("file", file);
    uploadFormData.append("userId", userId);
    let backendUrl = process.env.BackEndUrl || BaseURL;
    const response = await fetch(`${backendUrl}/common/upload/file`, {
      method: "POST",
      body: uploadFormData,
      headers: {
        "token": token
      }
    });

    if (!response.ok) {
      throw new Error("上传失败");
    }

    const result = await response.json();

    return {
      success: true,
      message: "上传成功",
      data: result
    } as BaseResponse<string>;
  } catch (error) {
    console.error("上传文件出错:", error);
    return {
        success: true,
        message: "上传失败",
        data: null
      } as BaseResponse<null>;
    
}
}
