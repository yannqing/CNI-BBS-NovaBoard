"use client";

import { Tab, Tabs } from "@nextui-org/tabs";
import { useEffect, useState } from "react";

import { getAllCategoryAction } from "@/app/(main)/home/action";
import { Category } from "@/types/post/category";

export const TopBar = () => {
  const [data, setData] = useState<Category[]>([]);

  const request = {
    pageNo: 1,
    pageSize: 50,
    categoryName: "",
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getAllCategoryAction(request);

        setData(res.data.records); // 更新状态
      } catch (error) {}
    };

    fetchData();
  }, []); // 空数组表示只在组件挂载时执行一次

  return (
    <div className="flex flex-wrap gap-4 w-full md:w-max max-w-4xl">
      <div className="overflow-x-auto hide-scrollbar whitespace-nowrap">
        <Tabs
          key="primary"
          aria-label="Tabs colors"
          className="gap-1 flex"
          color="primary"
          radius="full"
        >
          {data.map((item, index) => (
            <Tab key={index} title={item?.categoryName} />
          ))}
        </Tabs>
      </div>
    </div>
  );
};
