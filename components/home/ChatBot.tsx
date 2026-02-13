"use client";

import React, { useState, useRef, useEffect } from "react";
import { SSE } from "sse.js";
import { getCookie } from "@/utils/cookies";
import { toast } from "sonner";
import { getApiUrl } from "@/config/api";
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
  medias: [];
}

export default function ChatBot() {
  const [isSupportCenterOpen, setIsSupportCenterOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const token = getCookie()?.token as string;
  const currentId = getCookie()?.id;

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

    const nowStr = new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

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

    const botMsgId = messageIdRef.current++;
    const waitingMsg: Message = {
      id: botMsgId,
      type: "assistant",
      content: "",
      createTime: nowStr,
      avatar: "https://i.pravatar.cc/64?u=bot",
    };
    setMessages((prev) => [...prev, waitingMsg]);

    const chatMessage: ChatMessage = {
      aiSessionId: selectedSession,
      creatorId: user.userId,
      editorId: user.userId,
      enableVectorStore,
      type: "user",
      textContent: trimmed,
      medias: [],
    };

    const evtSource = new SSE(getApiUrl("/aiService/chatAgent"), {
      method: "POST",
      headers: { "Content-Type": "application/json", token: token },
      payload: JSON.stringify(chatMessage),
      withCredentials: true,
      start: false,
    });

    let currentBotContent = "";

    // Handle streamed message chunks
    evtSource.addEventListener("message", (event: MessageEvent) => {
      // The data is raw text according to the user's example
      const data = event.data;
      if (!data) return;

      currentBotContent += data;
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === botMsgId ? { ...msg, content: currentBotContent } : msg
        )
      );
    });

    // Handle the completion event
    evtSource.addEventListener("complete", (event: MessageEvent) => {
      console.log("Stream completed:", event.data);
      evtSource.close();
      setLoading(false);
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

    evtSource.stream();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleOpenChat = () => {
    setIsSupportCenterOpen(false);
    setIsChatOpen(true);
  };

  const handleCloseSupportCenter = () => {
    setIsSupportCenterOpen(false);
  };

  const handleCloseChat = () => {
    setIsChatOpen(false);
  };

  return (
    <>
      {/* Floating Action Button */}
      <div className="fixed bottom-8 right-8 z-50 flex items-center gap-4 group">
        <button
          aria-label="Toggle Support Center"
          onClick={() => setIsSupportCenterOpen(true)}
          className="h-16 w-16 bg-[#137fec] hover:bg-blue-600 text-white rounded-full shadow-lg hover:shadow-blue-500/40 flex items-center justify-center transition-all transform hover:scale-110 active:scale-95"
        >
          <svg
            className="w-8 h-8"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
            />
          </svg>
        </button>
        {!isSupportCenterOpen && !isChatOpen && (
          <div className="bg-white dark:bg-[#1a2632] text-gray-900 dark:text-white px-4 py-2 rounded-lg shadow-lg border border-gray-100 dark:border-gray-700 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
            <span className="text-sm font-medium whitespace-nowrap">
              需要帮助吗？
            </span>
          </div>
        )}
      </div>

      {/* Blur Overlay */}
      {(isSupportCenterOpen || isChatOpen) && (
        <div
          className="fixed inset-0 z-40 bg-black/20 dark:bg-black/50 backdrop-blur-sm transition-opacity duration-300"
          onClick={() => {
            handleCloseSupportCenter();
            handleCloseChat();
          }}
        />
      )}

      {/* Support Center Modal */}
      {isSupportCenterOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="w-full max-w-3xl bg-white dark:bg-[#1a2632] rounded-xl shadow-2xl transform transition-all flex flex-col overflow-hidden max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header with Close Button */}
            <div className="px-8 pt-8 pb-4 flex justify-between items-start">
              <div>
                <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
                  支持中心
                </h2>
                <p className="text-gray-500 dark:text-gray-400 mt-1">
                  我们在这里为您提供帮助。搜索答案或直接联系我们。
                </p>
              </div>
              <button
                onClick={handleCloseSupportCenter}
                className="text-gray-500 dark:text-gray-400 hover:text-[#137fec] dark:hover:text-[#137fec] transition-colors p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <svg
                  className="w-7 h-7"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto px-8 pb-8">
              {/* Self Help Search Section */}
              <div className="mt-4 mb-8">
                <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                  自助服务
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <svg
                      className="w-6 h-6 text-gray-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                      />
                    </svg>
                  </div>
                  <input
                    autoFocus
                    className="block w-full pl-12 pr-4 py-4 bg-gray-100 dark:bg-[#23303e] border-none rounded-lg text-gray-900 dark:text-white placeholder-gray-500 focus:ring-2 focus:ring-[#137fec] focus:bg-white dark:focus:bg-[#1a2632] transition-all shadow-sm text-lg"
                    placeholder="搜索文章、指南和常见问题..."
                    type="text"
                  />
                  <div className="absolute inset-y-0 right-0 pr-4 flex items-center">
                    <span className="text-xs font-medium text-gray-500 bg-white dark:bg-[#23303e] px-2 py-1 rounded border border-gray-200 dark:border-gray-700 hidden sm:block">
                      CMD + K
                    </span>
                  </div>
                </div>
                {/* Quick Suggestions */}
                <div className="flex gap-2 mt-3 overflow-x-auto pb-2">
                  <span className="text-xs font-medium text-gray-500 dark:text-gray-400 py-1">
                    热门:
                  </span>
                  <button className="text-xs font-medium text-[#137fec] bg-[#137fec]/10 hover:bg-[#137fec]/20 px-3 py-1 rounded-full transition-colors whitespace-nowrap">
                    重置密码
                  </button>
                  <button className="text-xs font-medium text-[#137fec] bg-[#137fec]/10 hover:bg-[#137fec]/20 px-3 py-1 rounded-full transition-colors whitespace-nowrap">
                    账户问题
                  </button>
                  <button className="text-xs font-medium text-[#137fec] bg-[#137fec]/10 hover:bg-[#137fec]/20 px-3 py-1 rounded-full transition-colors whitespace-nowrap">
                    使用指南
                  </button>
                </div>
              </div>

              <div className="h-px bg-gray-200 dark:bg-gray-700 w-full mb-8"></div>

              {/* Direct Contact Section */}
              <div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-5">
                  直接联系
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {/* Card 1: Live Chat */}
                  <button
                    onClick={handleOpenChat}
                    className="flex flex-col items-start p-5 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-[#137fec]/50 hover:shadow-lg dark:hover:shadow-[#137fec]/10 bg-white dark:bg-[#23303e] transition-all group text-left"
                  >
                    <div className="bg-[#137fec]/10 dark:bg-[#137fec]/20 p-3 rounded-lg mb-4 group-hover:bg-[#137fec] group-hover:text-white text-[#137fec] transition-colors">
                      <svg
                        className="w-7 h-7"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                        />
                      </svg>
                    </div>
                    <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-1">
                      AI 在线聊天
                    </h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                      与 AI 助手直接对话。
                    </p>
                    <div className="mt-auto flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                      <span className="text-xs font-semibold text-green-600 dark:text-green-400">
                        在线
                      </span>
                    </div>
                  </button>

                  {/* Card 2: Email */}
                  <button className="flex flex-col items-start p-5 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-[#137fec]/50 hover:shadow-lg dark:hover:shadow-[#137fec]/10 bg-white dark:bg-[#23303e] transition-all group text-left">
                    <div className="bg-[#137fec]/10 dark:bg-[#137fec]/20 p-3 rounded-lg mb-4 group-hover:bg-[#137fec] group-hover:text-white text-[#137fec] transition-colors">
                      <svg
                        className="w-7 h-7"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                        />
                      </svg>
                    </div>
                    <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-1">
                      邮件支持
                    </h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                      发送详细信息给我们。
                    </p>
                    <div className="mt-auto flex items-center gap-2">
                      <svg
                        className="w-4 h-4 text-gray-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      <span className="text-xs font-semibold text-gray-500 dark:text-gray-400">
                        24小时内回复
                      </span>
                    </div>
                  </button>

                  {/* Card 3: Help Center */}
                  <button className="flex flex-col items-start p-5 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-[#137fec]/50 hover:shadow-lg dark:hover:shadow-[#137fec]/10 bg-white dark:bg-[#23303e] transition-all group text-left">
                    <div className="bg-[#137fec]/10 dark:bg-[#137fec]/20 p-3 rounded-lg mb-4 group-hover:bg-[#137fec] group-hover:text-white text-[#137fec] transition-colors">
                      <svg
                        className="w-7 h-7"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </div>
                    <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-1">
                      帮助文档
                    </h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                      浏览完整的帮助中心。
                    </p>
                    <div className="mt-auto flex items-center gap-2">
                      <svg
                        className="w-4 h-4 text-gray-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                        />
                      </svg>
                      <span className="text-xs font-semibold text-gray-500 dark:text-gray-400">
                        丰富的资源
                      </span>
                    </div>
                  </button>
                </div>
              </div>

              {/* Footer Link */}
              <div className="mt-8 text-center">
                <a
                  className="inline-flex items-center gap-1 text-sm font-semibold text-[#137fec] hover:text-blue-700 dark:hover:text-blue-400 transition-colors"
                  href="#"
                >
                  访问完整帮助中心
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M14 5l7 7m0 0l-7 7m7-7H3"
                    />
                  </svg>
                </a>
              </div>
            </div>

            {/* Modal Footer Gradient Line */}
            <div className="h-1.5 w-full bg-gradient-to-r from-blue-400 via-[#137fec] to-blue-600"></div>
          </div>
        </div>
      )}

      {/* Chat Modal */}
      {isChatOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="w-full max-w-3xl bg-white dark:bg-[#1a2632] rounded-xl shadow-2xl transform transition-all flex flex-col overflow-hidden max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <header className="px-8 pt-8 pb-4 flex justify-between items-start border-b border-gray-100 dark:border-white/10">
              <div>
                <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
                  CNI - Chat with AI
                </h2>
                <p className="text-gray-500 dark:text-gray-400 mt-1">
                  我在这里为您提供帮助。有什么问题吗？
                </p>
              </div>
              <div className="flex items-center gap-2">
                {/* Back Button */}
                <button
                  onClick={() => {
                    setIsChatOpen(false);
                    setIsSupportCenterOpen(true);
                  }}
                  className="text-gray-500 dark:text-gray-400 hover:text-[#137fec] dark:hover:text-[#137fec] transition-colors p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
                  aria-label="Back to Support Center"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 19l-7-7 7-7"
                    />
                  </svg>
                </button>
                {/* Close Button */}
                <button
                  onClick={handleCloseChat}
                  className="text-gray-500 dark:text-gray-400 hover:text-[#137fec] dark:hover:text-[#137fec] transition-colors p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
                  aria-label="Close"
                >
                  <svg
                    className="w-7 h-7"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            </header>

            {/* Chat History Area */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-transparent">
              {messages.length === 0 && (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <div className="bg-[#137fec]/10 dark:bg-[#137fec]/20 p-4 rounded-full mb-4">
                    <svg
                      className="w-12 h-12 text-[#137fec]"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                    开始与CNI对话
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400 text-sm">
                    向我询问任何问题，我会尽力为您解答
                  </p>
                </div>
              )}

              {messages.map(({ id, type, content, avatar, createTime }) => {
                const isUser = type === "user";
                return (
                  <div
                    key={id}
                    className={`flex items-end gap-3 ${isUser ? "justify-end ml-auto" : ""} max-w-[80%] ${isUser ? "ml-auto" : ""}`}
                  >
                    {!isUser && (
                      <div
                        className="bg-center bg-no-repeat aspect-square bg-cover rounded-full w-8 h-8 shrink-0 mb-1 border-2 border-[#137fec]/30"
                        style={{ backgroundImage: `url(${avatar})` }}
                      />
                    )}
                    <div className="flex flex-col gap-1.5 items-start">
                      <div
                        className={`text-base font-normal leading-relaxed px-4 py-3 shadow-lg ${
                          isUser
                            ? "rounded-xl rounded-br-none bg-[#137fec] text-white shadow-[#137fec]/20"
                            : "rounded-xl rounded-bl-none bg-gray-100 dark:bg-[#283039] text-gray-900 dark:text-white"
                        }`}
                      >
                        {content || (
                          <div className="flex gap-1">
                            <span className="w-1.5 h-1.5 bg-gray-400 dark:bg-white/40 rounded-full animate-pulse" />
                            <span
                              className="w-1.5 h-1.5 bg-gray-400 dark:bg-white/40 rounded-full animate-pulse"
                              style={{ animationDelay: "0.2s" }}
                            />
                            <span
                              className="w-1.5 h-1.5 bg-gray-400 dark:bg-white/40 rounded-full animate-pulse"
                              style={{ animationDelay: "0.4s" }}
                            />
                          </div>
                        )}
                      </div>
                      {createTime && (
                        <p
                          className={`text-gray-400 dark:text-white/30 text-[11px] font-normal ${
                            isUser ? "mr-1" : "ml-1"
                          }`}
                        >
                          {createTime}
                        </p>
                      )}
                    </div>
                    {isUser && (
                      <div
                        className="bg-center bg-no-repeat aspect-square bg-cover rounded-full w-8 h-8 shrink-0 mb-1"
                        style={{ backgroundImage: `url(${avatar})` }}
                      />
                    )}
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Bar */}
            <footer className="p-4 bg-gray-50 dark:bg-white/5 border-t border-gray-100 dark:border-white/10">
              <div className="flex items-center gap-3 bg-white dark:bg-white/5 rounded-xl border border-gray-200 dark:border-white/10 p-2 focus-within:border-[#137fec]/50 transition-all">
                <input
                  className="flex-1 bg-transparent border-none focus:ring-0 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-white/30 py-2 px-2 focus:outline-none"
                  placeholder="输入消息..."
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  disabled={loading}
                  maxLength={2000}
                />
                <button
                  onClick={handleSend}
                  disabled={loading || input.trim() === ""}
                  className="bg-[#137fec] hover:bg-[#137fec]/90 disabled:bg-gray-300 dark:disabled:bg-gray-700 disabled:cursor-not-allowed text-white h-10 px-4 rounded-lg font-bold flex items-center justify-center gap-2 transition-transform active:scale-95 shadow-lg shadow-[#137fec]/20"
                >
                  <span>发送</span>
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                    />
                  </svg>
                </button>
              </div>
              <div className="mt-3 flex justify-center">
                <p className="text-[10px] text-gray-400 dark:text-white/20 uppercase tracking-[0.2em]">
                  由 AI 提供支持
                </p>
              </div>
            </footer>

            {/* Footer Gradient Line */}
            <div className="h-1.5 w-full bg-gradient-to-r from-blue-400 via-[#137fec] to-blue-600" />
          </div>
        </div>
      )}
    </>
  );
}