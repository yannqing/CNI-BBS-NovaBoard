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

    console.log("publish post response:", response);
  };

  // 发布帖子按钮绑定事件
  const publicPostClick = () => {
    console.log("publish post request:", publishPostRequest);
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
        <div className="m-4 gap-2">
          <div>输入标签</div>
          <div>
            <TagInput initialTags={tags} onTagsChange={handleTagsChange} />
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
