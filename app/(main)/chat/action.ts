"use server";

import service from "@/utils/axios";
import { GetChatListRequest } from "@/types/chat/chatList";
import { SendMessageRequestType } from "@/types/chat/message";

export async function getChatListAction(data: GetChatListRequest) {
  return await service({
    url: "/chat/chat-list/list",
    method: "post",
    data: data,
  });
}

export async function createChatListAction(data: Record<string, unknown>) {
  return await service({
    url: "/chat/chat-list/createChatList",
    method: "post",
    data,
  });
}

export async function deleteChatListAction(data: Record<string, unknown>) {
  return await service({
    url: "/chat/chat-list/deleteChatList",
    method: "post",
    data,
  });
}

export async function setTopChatListAction(data: Record<string, unknown>) {
  return await service({
    url: "/chat/chat-list/setTopChatList",
    method: "post",
    data,
  });
}

export async function readChatAction(fromId: string, toId: string) {
  return await service({
    url: `/chat/chat-list/read/${fromId}/${toId}`,
    method: "get",
  });
}

export async function readAllChatAction(userId: string) {
  return await service({
    url: `/chat/chat-list/read/all?userId=${userId}`,
    method: "get",
  });
}

export async function chatDetailAction(data: Record<string, unknown>) {
  return await service({
    url: "/chat/chat-list/detail",
    method: "post",
    data,
  });
}

export async function retractMessageAction(data: Record<string, unknown>) {
  return await service({
    url: "/chat/message/retraction",
    method: "post",
    data,
  });
}

export async function reeditMessageAction(data: Record<string, unknown>) {
  return await service({
    url: "/chat/message/reedit",
    method: "post",
    data,
  });
}

export async function createMediaMessageAction(data: SendMessageRequestType) {
  return await service({
    url: "/chat/message/send",
    method: "post",
    data,
  });
}
