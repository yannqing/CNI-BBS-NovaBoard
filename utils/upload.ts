import service from "@/utils/axios";

import {
  UploadFileRequest
} from '@/types/cloud/cloudfile';
  
/**
 * 文件上传
 * @param data 上传文件请求参数
 * @returns 
 */
export async function uploadFileAction(data: UploadFileRequest) {
  const formData = new FormData();
  formData.append('file', data.file);
  formData.append('userId', data.userId);
  
  return await service({
    url: "/common/upload/file",
    method: "post",
    data: formData,
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
}
