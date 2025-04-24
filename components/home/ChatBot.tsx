"use client";

import React, { useState, useRef, useEffect } from "react";
import { Button } from "@nextui-org/button";
import { SSE } from "sse.js";
import { getCookie } from "@/utils/cookies";
import { toast } from "sonner";

import { useRouter } from "next/navigation";
interface Message {
  id: number;
  type: "user" | "assistant";
  content: string;
  createTime?: string;
  avatar?: string;
}

interface ChatMessage {
  aiSessionId: string;
  creatorId: string;
  editorId: string;
  enableVectorStore?: boolean;
  type: string;
  textContent: string;
  medias: []
}

export default function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const token = getCookie()?.token as string;
  const currentId = getCookie()?.id;
  const BaseURL = "http://localhost:8080";
  
  // 假设这些数据从外部上下文或props传入，这里仅示例
  const user = {
    userId: "001",
    avatar: "https://i.pravatar.cc/64",
  };
  const selectedSession = "1";
  const enableVectorStore = false;

  const messageIdRef = useRef(0);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = () => {
    if (!currentId) {
      router.push("/login");
      toast.error("请先登录");
      return;
    }
    const trimmed = input.trim();
    if (!trimmed || loading) return;

    const nowStr =
      new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString();

    // 添加用户消息
    const userMsg: Message = {
      id: messageIdRef.current++,
      type: "user",
      content: trimmed,
      createTime: nowStr,
      avatar: user.avatar,
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    // 添加占位机器人消息(等待中)
    const botMsgId = messageIdRef.current++;
    const waitingMsg: Message = {
      id: botMsgId,
      type: "assistant",
      content: "waiting...",
      createTime: nowStr,
      avatar: "https://i.pravatar.cc/64?u=bot",
    };
    setMessages((prev) => [...prev, waitingMsg]);

    // 构造请求体
    const chatMessage: ChatMessage = {
      aiSessionId: selectedSession,
      creatorId: user.userId,
      editorId: user.userId,
      enableVectorStore,
      type: "user",
      textContent: trimmed,
      medias: []
    };

    // 创建 SSE 实例，发送 POST 请求，传 JSON 字符串
    let baackEndUrl = process.env.NEXT_PUBLIC_BackEndUrl 
    const evtSource = new SSE((baackEndUrl == null ? BaseURL: baackEndUrl )+"/aiService/chatAgent", {
      method: "POST",
      headers: { "Content-Type": "application/json","token": token },
      payload: JSON.stringify(chatMessage),
      withCredentials: false,
      start: false,
    });
debugger
    let currentBotContent = "";

    evtSource.addEventListener("message", (event : MessageEvent) => {
      try {
        debugger
        const data = JSON.parse(event.data);
        if (data === "[complete]") {
          evtSource.close();
          setLoading(false);
          return;
        }
        currentBotContent += data;
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === botMsgId ? { ...msg, content: currentBotContent } : msg
          )
        );
      } catch (err) {
        console.error("SSE数据解析错误:", err);
      }
    });

    evtSource.onerror = (err) => {
      console.error("SSE流错误:", err);
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === botMsgId
            ? { ...msg, content: "接收消息时出错，请重试" }
            : msg
        )
      );
      setLoading(false);
      evtSource.close();
    };

    evtSource.stream(); // 启动 SSE 流
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      <button
        aria-label="Toggle ChatBot"
        onClick={() => setIsOpen((v) => !v)}
        className="
          fixed bottom-5 right-5 z-50 w-14 h-14 rounded-full 
          bg-blue-600 text-white text-2xl shadow-lg 
          flex justify-center items-center hover:bg-blue-700 transition
        "
      >
        💬
      </button>

      {isOpen && (
        <div
          className="
            fixed bottom-20 right-5 z-50 w-[320px] h-[400px] 
            bg-white rounded-xl shadow-lg flex flex-col
          "
          role="dialog"
          aria-modal="true"
          aria-label="Chat bot dialog"
        >
          <header className="px-4 py-2 border-b border-gray-200 flex justify-between items-center">
            <h2 className="font-semibold text-lg">论坛智能体</h2>
            <button
              aria-label="Close ChatBot"
              onClick={() => setIsOpen(false)}
              className="text-gray-500 hover:text-gray-700 font-bold text-xl"
            >
              ×
            </button>
          </header>

          <main
            className="flex-1 overflow-y-auto p-4 space-y-3 scroll-smooth"
            style={{ scrollbarGutter: "stable" }}
          >
            {messages.map(({ id, type, content, avatar, createTime }) => {
              const isUser = type === "user";
              return (
                <div
                  key={id}
                  className={`flex ${
                    isUser ? "justify-end" : "justify-start"
                  }`}
                >
                  {!isUser && (
                    <img
                      src={avatar}
                      alt="Bot Avatar"
                      className="w-8 h-8 rounded-full"
                    />
                  )}
                  <div
                    className={`max-w-[70%] px-3 py-2 rounded-lg whitespace-pre-wrap break-words ${
                      isUser
                        ? "bg-blue-600 text-white rounded-br-none"
                        : "bg-gray-200 text-gray-900 rounded-bl-none ml-2"
                    }`}
                  >
                    {content}
                    {createTime && (
                      <div className="text-[10px] text-right opacity-50 mt-1">
                        {createTime}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </main>

          <footer className="p-3 border-t border-gray-200 flex gap-2">
            <textarea
              aria-label="Message input"
              placeholder="请输入消息，回车发送"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={loading}
              rows={1}
              maxLength={2000}
              className="
                resize-none
                rounded
                border
                border-gray-300
                px-3
                py-2
                flex-1
                focus:outline-none
                focus:ring-2
                focus:ring-blue-500
                text-sm
              "
            />
            <Button
              color="primary"
              isDisabled={loading || input.trim() === ""}
              onPress={handleSend}
            >
              发送
            </Button>
          </footer>
        </div>
      )}
    </>
  );
}