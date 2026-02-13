// 文件上传，请求参数
export type UploadFileRequest = {
    file: File;
    userId: string;
  };
  

// 生成文件临时Url，请求参数
export type CreateTemporaryUrlRequest = {
fileName?: string;
userId?: string;
expiresIn?: number;
isPrivate?: string;
};


// 删除文件，请求参数
export type DeleteFileRequest = {
fileName?: string;
userId?: string;
path?: string;
private?: boolean;
};
