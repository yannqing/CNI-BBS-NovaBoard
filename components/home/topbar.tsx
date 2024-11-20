"use client";

import { Tab, Tabs } from "@nextui-org/tabs";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { getAllCategoryAction } from "@/app/(main)/home/action";
import {
  Category,
  CategoryList,
  GetAllCategoryRequest,
} from "@/types/post/category";
import { BaseResponse } from "@/types";
import { useGetPostContext } from "@/app/(main)/PostContext";
import { GetPostListRequest } from "@/types/post/post";

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
  };

  // 帖子获取
  const { fetchData } = useGetPostContext();

  // 页面初始化
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res: BaseResponse<CategoryList> =
          await getAllCategoryAction(request);

        console.log("res", res);
        if (res.data) {
          setData(res.data.records); // 更新状态
        }
      } catch (error) {}
    };

    fetchData();
  }, []);

  async function selectChange(key: React.Key) {
    if (Number(key) === -1) {
      postRequest.categoryId = "";
      console.log("???");
      fetchData(postRequest);
    } else {
      for (let i = 0; i < data.length; i++) {
        if (i === Number(key)) {
          if (data[i].id) {
            postRequest.categoryId = String(data[i].id);
            console.log("帖子类别请求：", postRequest);
            fetchData(postRequest);
            console.log("data[i].id", data[i].id);
            break;
          } else {
            toast.error("无法获取信息，请联系管理员");

            return;
          }
        }
      }
    }
    console.log("React.Key", key);
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
          onSelectionChange={selectChange}
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
