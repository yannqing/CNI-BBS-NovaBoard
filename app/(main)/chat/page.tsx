"use client";

import { Card, CardBody } from "@nextui-org/card";
import { Textarea } from "@nextui-org/input";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

// 定义 props 类型
interface ChatMessageProps {
  message: string; // 指定 message 的类型为 string
}

export default function ChatPage() {
  const divRef = useRef<HTMLDivElement | null>(null); // 创建 ref
  const [divHeight, setDivHeight] = useState<number>(0); // 状态存储高度
  /**
   * 输入框绑定
   */
  const [inputValue, setInputValue] = useState("");
  const [messages, setMessages] = useState([
    { text: "Hello, how can I help you?", side: "left" },
    {
      text: "Make beautiful websites regardless of your design experience.",
      side: "right",
    },
    { text: "Feel free to ask any questions!", side: "left" },
    {
      text: "Make beautiful websites regardless of your design experience.",
      side: "right",
    },
    { text: "Feel free to ask any questions!", side: "left" },
    {
      text: "Make beautiful websites regardless of your design experience.",
      side: "right",
    },
    { text: "Feel free to ask any questions!", side: "left" },
    {
      text: "Make beautiful websites regardless of your design experience.",
      side: "right",
    },
    { text: "Feel free to ask any questions!", side: "left" },
    {
      text: "Make beautiful websites regardless of your design experience.",
      side: "right",
    },
    { text: "Feel free to ask any questions!", side: "left" },
  ]);

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

  useEffect(() => {
    if (divRef.current) {
      divRef.current.scrollTop = divRef.current.scrollHeight; // 滚动到最新消息
    }
  }, [messages]); // 依赖 messages，确保每次消息更新时滚动

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
        value={inputValue}
        onKeyDown={handleKeyDown}
        onValueChange={setInputValue}
      />
    </div>
  );
}
