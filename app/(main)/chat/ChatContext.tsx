"use client";
// eslint-disable-next-line import/order
import { createContext, useContext, useEffect, useState, useMemo } from "react";

import { getChatListAction } from "./action";

import { getCookie } from "@/utils/cookies";
import { GetChatListRequest, GetChatListResponse } from "@/types/chat/chatList";
import { BasePage } from "@/types";
import { BaseResponse } from "@/types";
import { userInfoCookie } from "@/common/auth/constant";
import { useGetUserContext } from "@/app/UserContext";

// 用户上下文提供者
interface ChatProvider {
  chatList: GetChatListResponse[];
  resetChatList: () => Promise<void>;
}

// 聊天上下文
export const ChatContext = createContext<ChatProvider | undefined>(undefined);

// 获取用户上下文
export const useGetChatContext = () => {
  const chatContext = useContext(ChatContext);

  // 如果用户上下文未定义，则抛出错误
  if (chatContext === undefined) {
    throw new Error("chat context undefined!");
  }

  return chatContext;
};

// 用户上下文提供者
export function ChatProvider({ children }: { children: React.ReactNode }) {
  const [chatList, setChatList] = useState<GetChatListResponse[]>([]);

  const getChatListRequest: GetChatListRequest = {
    pageNo: 1,
    pageSize: 10,
    fromId: getCookie(userInfoCookie)?.id,
  };

  // 获取聊天列表，接口调用
  const fetchChatList = async () => {
    console.log("开始获取聊天列表");
    const res: BaseResponse<BasePage<GetChatListResponse>> =
      await getChatListAction(getChatListRequest);

    console.log("获取聊天列表响应:", res);

    if (res.success && res.data) {
      console.log("更新聊天列表:", res.data.records);
      setChatList(res.data.records);
    } else {
      console.log("获取聊天列表失败:", res);
    }
  };

  // 修改为异步函数，并返回 Promise
  const resetChatList = async () => {
    await fetchChatList();

    return Promise.resolve();
  };

  const { isCookiePresent } = useGetUserContext();

  /**
   * 页面初始化
   */
  useEffect(() => {
    const isLogin = localStorage.getItem("token");

    // 只有在登录状态下才获取聊天列表
    if (isCookiePresent || isLogin) {
      fetchChatList();
    }
  }, [isCookiePresent]);

  const contextValue = useMemo(
    () => ({
      chatList,
      resetChatList,
    }),
    [chatList], // 注意：这里不需要将 resetChatList 加入依赖数组，因为它不依赖于任何状态
  );

  return (
    <ChatContext.Provider value={contextValue}>
      {chatList === null || chatList === undefined ? (
        <div>加载中。。。</div>
      ) : (
        children
      )}
    </ChatContext.Provider>
  );
}
