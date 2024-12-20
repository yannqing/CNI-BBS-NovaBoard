"use client";

import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { Card, CardBody } from "@nextui-org/card";
import { Textarea } from "@nextui-org/input";

import {
  GetChatRecordRequest,
  GetChatRecordResponse,
} from "@/types/chat/chatList";
import { BasePage, BaseResponse } from "@/types";
import { getChatRecord } from "@/app/(main)/chat/[slug]/action";
import { getCookie } from "@/utils/cookies";

// 定义 props 类型
interface ChatMessageProps {
  message: string; // 指定 message 的类型为 string
}

interface ChatMessageType {
  text: string;
  side: string;
}
export default function Page({ params }: { params: { slug: string } }) {
  const divRef = useRef<HTMLDivElement | null>(null); // 创建 ref
  const [divHeight, setDivHeight] = useState<number>(0); // 状态存储高度
  /**
   * 输入框绑定
   */
  const [inputValue, setInputValue] = useState("");
  const [messages, setMessages] = useState<ChatMessageType[]>([]);

  /**
   * 发送消息
   * @param event
   */
  const handleKeyDown = (event: any) => {
    if (event.key === "Enter") {
      event.preventDefault(); // 防止换行
      if (inputValue.trim()) {
        // 确保输入不是空的
        const newMessage = {
          text: inputValue,
          side: "right",
        };

        setMessages((prevMessages) => [...prevMessages, newMessage]); // 更新消息列表
        setInputValue(""); // 清空输入框
      } else {
        toast.error("不能发送空消息！");
      }
    }
  };

  // 每次消息更新时滚动到底部
  useEffect(() => {
    if (divRef.current) {
      divRef.current.scrollTop = divRef.current.scrollHeight; // 滚动到最新消息
    }
  }, [messages]); // 依赖 messages，确保每次消息更新时滚动

  const userInfo = getCookie();

  // 页面初始化
  useEffect(() => {
    fetchData().then(() => {});
  }, []);

  const getChatRecordRequest: GetChatRecordRequest = {
    pageNo: 1,
    pageSize: 10,
    isDesc: "0", // 0 为倒序
    fromId: "0", // 登录用户 id
    targetId: "0", // 目标用户 id
  };

  const fetchData = async () => {
    if (userInfo?.id) {
      getChatRecordRequest.fromId = userInfo.id;
      getChatRecordRequest.targetId = params.slug;
      const res: BaseResponse<BasePage<GetChatRecordResponse>> =
        await getChatRecord(getChatRecordRequest);

      console.log("获取聊天数据 request：", getChatRecordRequest);

      if (res.success) {
        if (res.data && res.data.records.length > 0) {
          // 有数据
          const responseData = res.data.records;

          console.log("聊天记录：", responseData);
          for (let i = 0; i < responseData.length; i++) {
            if (
              responseData[i].fromId == Number(userInfo.id) &&
              responseData[i].chatMessageContent.content
            ) {
              setMessages((prevMessages) => [
                ...prevMessages,
                {
                  text: responseData[i].chatMessageContent.content,
                  side: "right",
                },
              ]);
            }
          }
        } else {
          // 无数据
        }
      }
    }
  };

  const LeftChat: React.FC<ChatMessageProps> = ({ message }) => (
    <div className="justify-start grid mt-3 mb-3 ml-6">
      <Card isPressable className="w-full">
        <CardBody className="w-full">
          <span>{message}</span>
        </CardBody>
      </Card>
    </div>
  );

  const RightChat: React.FC<ChatMessageProps> = ({ message }) => (
    <div className="w-full justify-end grid mt-3 mb-3">
      <Card isPressable className="w-full">
        <CardBody className="w-full">
          <span>{message}</span>
        </CardBody>
      </Card>
    </div>
  );

  return (
    <div className="w-full flex flex-col h-full">
      <div
        ref={divRef}
        className="h-4/5 max-h-[485px] overflow-y-auto scroll-hidden"
      >
        <div>
          {messages.map((msg, index) =>
            msg.side === "left" ? (
              <LeftChat key={index} message={msg.text} /> // 使用左侧聊天组件
            ) : (
              <RightChat key={index} message={msg.text} /> // 使用右侧聊天组件
            ),
          )}
        </div>
      </div>

      <Textarea
        className="h-1/5 px-6 justify-center"
        labelPlacement="outside"
        maxRows={3}
        placeholder="Enter message"
        // placeholder={params.[slug]}
        value={inputValue}
        onKeyDown={handleKeyDown}
        onValueChange={setInputValue}
      />
    </div>
  );
  // return <div>My Post: {[slug]}</div>;
}
