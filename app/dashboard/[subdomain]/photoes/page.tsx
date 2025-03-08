"use client";

import { Button } from "@nextui-org/button";
import { Input } from "@nextui-org/input";
import { Select, SelectItem } from "@nextui-org/select";
import { useEffect, useState } from "react";

import {
  createPostAction,
  getTagsAction,
  publishPostStepOneAction,
} from "./action";

import MarkdownEditor from "@/components/dashboard/MarkdownEditor";
import TagInput from "@/components/myself/TagInput";
import { getAllCategoryAction } from "@/app/(main)/home/action";
import { Category, GetAllCategoryRequest } from "@/types/post/category";
import { BasePage, BaseResponse } from "@/types";
import {
  CreatePostRequest,
  PublishPostStepOneRequest,
} from "@/types/post/post";
import { GetTagsRequest, GetTagsResponse } from "@/types/post/tags";
import { getCookie } from "@/utils/cookies";
import { uploadFileAction,deleteFileAction,deleteFileRequest,cleanTemporaryCoverAction,cleanTemporaryCoverRequest } from "@/app/dashboard/[subdomain]/photoes/action";
import { toast } from "sonner";
import { ErrorCode } from "@/types/error/ErrorCode";
import { useRouter } from "next/navigation";
import { siteConfig } from "@/config/site";


export default function DashBoardPhotosPage({
  params,
}: {
  params: { subdomain: string };
}) {
  // 发布帖子请求构建
  // TODO 封面图片
  const [publishPostRequest, setPublishPostRequest] =
    useState<CreatePostRequest>({
      id: "",
      authorId: getCookie()?.id,
      title: "",
      summary: "",
      content: "",
      contentHtml: "",
      categoryId: "",
      type: "0", // 0 表示图文，1 表示视频 TODO 这里暂定图文，后续修改
      tagIds: [],
    });
  // 帖子分类数据
  const [categorys, setCategorys] = useState<Category[]>();
  const router = useRouter();
  // 获取帖子分类请求
  const getAllCategoryRequest: GetAllCategoryRequest = {
    pageNo: 1,
    pageSize: 1000,
  };

  // 获取帖子分类
  const fetchCategorys = async () => {
    const response: BaseResponse<BasePage<Category>> =
      await getAllCategoryAction(getAllCategoryRequest);

    if (response.success) {
      setCategorys(response.data?.records);
    }
  };

  const getTagsRequest: GetTagsRequest = {
    pageNo: 1,
    pageSize: 1000,
  };

  // 获取帖子标签
  const fetchTags = async () => {
    const response: BaseResponse<BasePage<GetTagsResponse>> =
      await getTagsAction(getTagsRequest);

    if (response.success) {
      setTags(response.data?.records || []);
    }
  };

  // 发布帖子第一步请求
  const publishPostStepOneRequest: PublishPostStepOneRequest = {
    userId: getCookie()?.id,
  };

  // 发布帖子第一步请求临时 id （后端存储，前端无意义）
  const [temporaryPostId, setTemporaryPostId] = useState<string>("");
  const [temporaryUrl, setTemporaryUrl] = useState<string>("");

  // 发布帖子第一步
  const publishPostStepOne = async () => {
    const response: BaseResponse<string> = await publishPostStepOneAction(
      publishPostStepOneRequest,
    );

    if (response.success) {
      setTemporaryPostId(response.data || "");
    }
  };

  // 发布帖子
  const publishPost = async () => {
    const response: BaseResponse<string> =
      await createPostAction(publishPostRequest);

      if(response.success && response.data){
        toast.success("发布成功!");
        router.push('/')
      }else{
        toast.error(response.message || "发布失败!");

      }
  };

  // 发布帖子按钮绑定事件
  const publicPostClick = () => {
    publishPost();
  };

  // 标签数据
  const [tags, setTags] = useState<GetTagsResponse[]>([]);

  // 标签数据变化
  const handleTagsChange = (newTags: GetTagsResponse[]) => {
    setPublishPostRequest((prev) => ({
      ...prev,
      tagIds: newTags.map((tag) => tag.id),
    }));
  };

  // 页面初始化
  useEffect(() => {
    fetchCategorys();
    fetchTags();
    publishPostStepOne();
  }, []);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

//URL 处理函数
function splitOssUrl(url :string) {
  const lastSlashIndex = url.lastIndexOf('/');
  return {
    basePath: url.substring(0, lastSlashIndex), // 基础路径
    fileName: url.substring(lastSlashIndex + 1) // 文件名
  };
}

// 处理封面
const handleFileChange =  async (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0];
  if (!file) return;
  // 验证文件类型
  if (!file.type.startsWith('image/')) {
    alert('请选择图片文件');
    return;
  }
  if(temporaryUrl){
    const { basePath, fileName } = splitOssUrl(temporaryUrl);
    const userId = getCookie()?.id as string;
    const deleteRequest : deleteFileRequest = {
      fileName: fileName,
      userId: userId,
      path: basePath,
      isPrivate: true
    }
    const response: BaseResponse<any> =  await deleteFileAction(deleteRequest);
    const cleanRequest : cleanTemporaryCoverRequest = {
      postId: temporaryPostId,
      authorId: userId,
      coverUrl: temporaryUrl
    }
    await cleanTemporaryCoverAction(cleanRequest);
  }
  
  setSelectedFile(file);
  onImageUpload(file);

  // 创建对象URL用于预览
  const objectUrl = URL.createObjectURL(file);
  setPreviewUrl(objectUrl);
}

async function onImageUpload(file: File) {
  try {
    // 创建请求数据
    const formData = new FormData();
    let userId =  getCookie()?.id as string;
    formData.append("file", file);
    formData.append("userId", userId);
    formData.append("type", "cover");

    const response: BaseResponse<any> = await uploadFileAction(formData);

    if (response.success) {
      setTemporaryUrl(response.data);
      toast.success("上传成功!");
      return response.data;
    } else {
      toast.error(response.message || "上传失败!");
    }

    return "";
    // return url; // 返回图片URL，编辑器会自动将其转换为 ![]() 格式
  } catch (error) {
    if (error && typeof error === "object" && "message" in error) {
      toast.error(error.message as string);
      if (
        error.message === ErrorCode.NOT_LOGIN.message ||
        error.message === ErrorCode.TOKEN_EXPIRE.message
      ) {
        router.push(siteConfig.innerLinks.login);
      }
    } else {
      toast.error("服务器异常，请联系管理员");
    }
  }
}
  return (
    <div>
      <main>
        <div className="flex flex-row justify-between m-4">
          <div>发布文章</div>
          <div>
            <Button onPress={publicPostClick}>发布</Button>
          </div>
        </div>
        <div className="m-4 gap-2">
          <div>标题</div>
          <div>
            <Input
              placeholder="请输入标题"
              onValueChange={(value) => {
                setPublishPostRequest((prev) => ({
                  ...prev,
                  title: value,
                }));
              }}
            />
          </div>
        </div>
      <div className="m-4 flex flex-row gap-6"> 
        <div className="flex-1 space-y-2">
          <div className="text-gray-700 font-medium">输入标签</div>
          <div>
            <TagInput initialTags={tags} onTagsChange={handleTagsChange} />
          </div>
        </div>
        <div className="flex-1 space-y-4">
          {!previewUrl ? (
            <div className="space-y-2">
              <label className="block text-gray-700 font-medium">封面图片</label>
              <label className="block relative h-32 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 transition-colors cursor-pointer">
                <input
                  type="file"
                  accept="image/*"
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  onChange={handleFileChange}
                />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
                  <svg className="mx-auto h-8 w-8 text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span className="text-sm text-gray-600">点击上传封面图片</span>
                  <p className="text-xs text-gray-400 mt-1">支持 JPG/PNG 格式，建议尺寸 1200x630</p>
                </div>
              </label>
            </div>
          ) : (
            /* 预览时可点击更换的区域 */
            <div className="space-y-2">
              <label className="block text-gray-700 font-medium">封面预览</label>
              <label className="block relative aspect-video border rounded-lg overflow-hidden group cursor-pointer">
                {/* 保持文件输入可用 */}
                <input
                  type="file"
                  accept="image/*"
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  onChange={handleFileChange}
                />
                
                {/* 预览图片 */}
                <img
                  src={previewUrl}
                  alt="封面预览"
                  className="w-full h-full object-cover group-hover:opacity-75 transition-opacity"
                  onLoad={() => URL.revokeObjectURL(previewUrl)}
                />
                
                {/* 悬浮提示层 */}
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all flex items-center justify-center">
                  <span className="text-white opacity-0 group-hover:opacity-100 transition-opacity">
                    点击更换图片
                  </span>
                </div>
              </label>
            </div>
          )}
        </div>
      </div>
        <div className="m-4 gap-2">
          <div>输入摘要</div>
          <div>
            <Input
              placeholder="请输入摘要"
              onValueChange={(value) => {
                setPublishPostRequest((prev) => ({
                  ...prev,
                  summary: value,
                }));
              }}
            />
          </div>
        </div>
        <div className="m-4 gap-2">
          <div>选择分类</div>
          <div>
            <Select
              className="max-w-xs"
              label="选择一个类别"
              selectedKeys={
                publishPostRequest.categoryId
                  ? new Set([publishPostRequest.categoryId])
                  : new Set()
              }
              onSelectionChange={(value) => {
                const selectedValue = Array.from(value)[0]?.toString();

                setPublishPostRequest((prev) => ({
                  ...prev,
                  categoryId: selectedValue,
                }));
              }}
            >
              {(categorys || []).map((category) => (
                <SelectItem key={category.id} value={category.id}>
                  {category.categoryName}
                </SelectItem>
              ))}
            </Select>
          </div>
        </div>
        <MarkdownEditor
          getContent={(content) => {
            setPublishPostRequest((prev) => ({
              ...prev,
              content: content,
            }));
          }}
        />
      </main>
    </div>
  );
}
