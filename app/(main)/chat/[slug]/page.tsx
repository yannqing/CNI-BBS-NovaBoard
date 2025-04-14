"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import { toast } from "sonner";
import { Card, CardBody } from "@nextui-org/card";
import { Textarea } from "@nextui-org/input";

import { useGetChatContext } from "../ChatContext";
import { useWebSocket } from "../useWebSocket";

import {
  GetChatRecordRequest,
  GetChatRecordResponse,
} from "@/types/chat/chatList";
import { BasePage, BaseResponse } from "@/types";
import {
  getChatRecordAction,
  sendMessageAction,
} from "@/app/(main)/chat/[slug]/action";
import { getCookie } from "@/utils/cookies";

// 定义 props 类型
interface ChatMessageProps {
  message: string; // 指定 message 的类型为 string
}

interface ChatMessageType {
  text: string;
  side: string;
  type: string;
}
export default function Page({ params }: { params: { slug: string } }) {
  const divRef = useRef<HTMLDivElement | null>(null); // 创建 ref
  // 从 ChatContext 获取 WebSocket 状态
  const { resetChatList } = useGetChatContext();

  // 使用 WebSocket hook
  const { isConnected } = useWebSocket();
  /**
   * 输入框绑定
   */
  const [inputValue, setInputValue] = useState("");
  const [messages, setMessages] = useState<ChatMessageType[]>([]);

  // 1. 修改 handleResetChatList 为异步函数
  const handleResetChatList = useCallback(async () => {
    await resetChatList();
  }, [resetChatList]);

  /**
   * 发送消息
   * @param event
   */
  const handleKeyDown = async (event: any) => {
    if (event.key === "Enter") {
      event.preventDefault(); // 防止换行
      if (inputValue.trim()) {
        // 确保输入不是空的
        const newMessage = {
          text: inputValue,
          side: "right",
          type: "text",
        };

        // 更新消息列表
        setMessages((prevMessages) => [...prevMessages, newMessage]);

        // 构建发送消息的请求
        const sendMessageRequest: SendMessageRequestType = {
          fromId: getCookie()?.id.toString(),
          toId: params.slug,
          source: "user",
          messageType: "message",
          chatMessageContent: {
            fromUserId: getCookie()?.id,
            fromUserName: getCookie()?.username,
            fromUserPortrait: getCookie()?.avatar,
            type: "message",
            content: inputValue,
          },
        };

        // 发送消息
        const res: BaseResponse<Object> =
          await sendMessageAction(sendMessageRequest);

        // 2. 在使用处等待完成
        if (res.success) {
          console.log("发送消息成功！");
          await handleResetChatList(); // 等待刷新完成
        } else {
          console.log("发送消息失败！");
        }

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

    // 组件卸载时清理
    return () => {};
  }, []);

  // 构建获取聊天内容请求
  const getChatRecordRequest: GetChatRecordRequest = {
    pageNo: 1,
    pageSize: 10,
    isDesc: "0", // 0 为倒序
    fromId: "", // 登录用户 id
    targetId: "0", // 目标用户 id
  };

  // 获取聊天内容
  const fetchData = async () => {
    if (userInfo?.id) {
      getChatRecordRequest.fromId = userInfo.id;
      getChatRecordRequest.targetId = params.slug;
      const res: BaseResponse<BasePage<GetChatRecordResponse>> =
        await getChatRecordAction(getChatRecordRequest);

      console.log("获取聊天数据 request：", getChatRecordRequest);

      if (res.success) {
        if (res.data && res.data.records.length > 0) {
          // 有数据
          const responseData = res.data.records;

          responseData.map((response) => {
            if (
              response.chatMessageContent &&
              response.chatMessageContent.content.startsWith('{\"content\":')
            ) {
              console.log("需要进一步解析 json");
              let obj = JSON.parse(response.chatMessageContent.content);

              console.log("obj:", obj);
              response.chatMessageContent.content = obj.content.text;
            }

            return response;
          });
          console.log("聊天记录：", responseData);
          // 区分消息内容是自己发的，还是其他人发的，或者是系统消息
          for (let i = 0; i < responseData.length; i++) {
            if (responseData[i].chatMessageContent.content) {
              if (
                userInfo.id === responseData[i].chatMessageContent.formUserId &&
                responseData[i].chatMessageContent.type === "text"
              ) {
                console.log("111");
                setMessages((prevMessages) => [
                  ...prevMessages,
                  {
                    text: responseData[i].chatMessageContent.content,
                    side: "right",
                    type: "message",
                  },
                ]);
              } else {
                if (responseData[i].chatMessageContent.type === "text") {
                  setMessages((prevMessages) => [
                    ...prevMessages,
                    {
                      text: responseData[i].chatMessageContent.content,
                      side: "left",
                      type: "message",
                    },
                  ]);
                } else {
                  setMessages((prevMessages) => [
                    ...prevMessages,
                    {
                      text: responseData[i].chatMessageContent.content,
                      side: "left",
                      type: "system",
                    },
                  ]);
                }
              }
            }
          }
          console.log("Messages:==>", messages);
        } else {
          // TODO 无数据
          console.log("获取聊天记录错误：", res);
        }
      }
    }
  };

  // 发送消息
  const sendMessage = async () => {};

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
        <div className="flex flex-col h-full">
          {messages.map((msg, index) =>
            msg.side === "left" && msg.type === "message" ? (
              <LeftChat key={index} message={msg.text} /> // 使用左侧聊天组件
            ) : msg.type === "message" ? (
              <RightChat key={index} message={msg.text} /> // 使用右侧聊天组件
            ) : (
              <div key={index} className="flex justify-center ">
                <div className="text-sm">{msg.text}</div>
              </div>
            ),
          )}
        </div>
      </div>
      {/*TODO 添加防抖或节流，避免频繁触发消息发送。支持多行输入（Shift + Enter 换行，Enter 发送）。*/}
      <Textarea
        className="h-1/5 px-6 justify-center"
        labelPlacement="outside"
        maxRows={3}
        placeholder="发送消息"
        // placeholder={params.[slug]}
        value={inputValue}
        onKeyDown={handleKeyDown}
        onValueChange={setInputValue}
      />
    </div>
  );
  // return <div>My Post: {[slug]}</div>;
}
