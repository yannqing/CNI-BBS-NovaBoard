"use server";

import service from "@/utils/axios";
import { GetChatRecordRequest } from "@/types/chat/chatList";

export async function getChatRecordAction(data: GetChatRecordRequest) {
  return await service({
    url: "/chat/message/record",
    method: "post",
    data: data,
  });
}

export async function sendMessageAction(data: SendMessageRequestType) {
  return await service({
    url: "/chat/message/send",
    method: "post",
    data: data,
  });
}
