"use client";
// eslint-disable-next-line import/order
import {
  createContext,
  useContext,
  useEffect,
  useState,
  useMemo,
  useCallback,
} from "react";

import { getChatListAction } from "./action";

import { getCookie } from "@/utils/cookies";
import { GetChatListRequest, GetChatListResponse } from "@/types/chat/chatList";
import { BasePage } from "@/types";
import { BaseResponse } from "@/types";
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
  const [updateFlag, setUpdateFlag] = useState(0);
  // 添加一个状态来追踪是否在客户端
  const [isClient, setIsClient] = useState(false);

  const getChatListRequest: GetChatListRequest = useMemo(
    () => ({
      pageNo: 1,
      pageSize: 10,
      fromId: getCookie()?.id,
    }),
    [],
  );

  // 获取聊天列表，接口调用
  const fetchChatList = useCallback(async () => {
    // 只在客户端执行
    if (!isClient) return;

    console.log("开始获取聊天列表");
    const res: BaseResponse<BasePage<GetChatListResponse>> =
      await getChatListAction(getChatListRequest);

    console.log("获取聊天列表响应:", res);

    if (res.success && res.data) {
      console.log("更新聊天列表:", res.data.records);
      setChatList(res.data.records);
      setUpdateFlag((prev) => prev + 1);
    } else {
      console.log("获取聊天列表失败:", res);
    }
  }, [getChatListRequest, isClient]);

  const resetChatList = useCallback(async () => {
    console.log("重置聊天列表开始");
    await fetchChatList();
    console.log("重置后的聊天列表:", chatList);
    // 不返回任何值
  }, [fetchChatList, chatList]);

  const { isCookiePresent } = useGetUserContext();

  // 添加用于检测客户端的 useEffect
  useEffect(() => {
    setIsClient(true);
  }, []);

  /**
   * 页面初始化
   */
  useEffect(() => {
    if (!isClient) return;

    const isLogin = localStorage.getItem("token");

    if (isCookiePresent || isLogin) {
      fetchChatList();
    }
  }, [isCookiePresent, fetchChatList, isClient]);

  const contextValue = useMemo(
    () => ({
      chatList,
      resetChatList,
    }),
    [chatList, resetChatList, updateFlag],
  );

  // 在服务端渲染时返回加载状态
  if (!isClient) {
    return <div>加载中。。。</div>;
  }

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
