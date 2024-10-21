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
          <Tab key="excellent" title="精选" />
          <Tab key="photo" title="图文" />
          <Tab key="new" title="最新" />
          <Tab key="hot" title="最热" />
          <Tab key="following" title="正在关注" />
          <Tab key="xlog" title="xLog" />
          <Tab key="web3" title="Web3" />
          <Tab key="ai" title="AI" />
          <Tab key="note" title="日记" />
          <Tab key="novel" title="小说" />
          <Tab key="code" title="编程" />
          <Tab key="videos" title="播客" />
          {data.map((item, index) => (
            <Tab key={index} title={item?.categoryName} />
          ))}
        </Tabs>
      </div>
    </div>
  );
};
