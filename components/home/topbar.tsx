"use client";

import { Tab, Tabs } from "@nextui-org/tabs";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { getAllCategoryAction } from "@/app/(main)/home/action";
import {
  Category,
  GetAllCategoryRequest,
} from "@/types/post/category";
import { BasePage, BaseResponse } from "@/types";
import { useGetPostContext } from "@/app/(main)/PostContext";
import { GetPostListRequest } from "@/types/post/post";
import { getCookie } from "@/utils/cookies";

export const TopBar = () => {
  const [data, setData] = useState<Category[]>([]);

  // 分类请求参数
  const request: GetAllCategoryRequest = {
    pageNo: 1,
    pageSize: 50,
    categoryName: "",
  };

  // 帖子请求参数
  const postRequest: GetPostListRequest = {
    pageNo: 1,
    pageSize: 10,
    postId: "",
    categoryId: "",
    tagIds: [],
    userId: '',
  };

  // 帖子获取
  const { fetchData } = useGetPostContext();

  // 页面初始化
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res: BaseResponse<BasePage<Category>> =
          await getAllCategoryAction(request);

        if (res.data) {
          setData(res.data.records); // 更新状态
        }
      } catch (error) { }
    };

    fetchData().then(() => { });
  }, []);

async function selectChange(key: React.Key) {
  if(getCookie()?.id != null){
    postRequest.userId = getCookie()?.id;
  }
  if (Number(key) === -1) {
    postRequest.categoryId = "";
    await fetchData(postRequest); // 确保请求完成
  } else {
    const selectedCategory = data[Number(key)];
    if (selectedCategory && selectedCategory.id) {
      postRequest.categoryId = String(selectedCategory.id);
      await fetchData(postRequest); // 确保请求完成
    } else {
      toast.error("无法获取信息，请联系管理员");
    }
  }
}

  return (
    <div className="flex flex-wrap gap-4 w-full md:w-max max-w-4xl">
      <div className="overflow-x-auto hide-scrollbar whitespace-nowrap">
        <Tabs
          key="primary"
          aria-label="Tabs colors"
          className="gap-1 flex"
          color="primary"
          radius="full"
          onSelectionChange={(key) => selectChange(key)}
        >
          <Tab key={-1} title={"全部"} />
          {data.map((item, index) => (
            <Tab key={index} title={item?.categoryName} />
          ))}
        </Tabs>
      </div>
    </div>
  );
};
