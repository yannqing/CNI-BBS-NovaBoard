"use server";

import service from "@/utils/axios";
import { GetChatRecordRequest } from "@/types/chat/chatList";
import { SendMessageRequestType } from "@/types/chat/message";
import { BaseResponse } from "@/types";

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

type SendFileOrMediaPayload = {
  file: File;
  userId: string;
  msgId: string;
};

async function uploadChatBinaryAction(
  url: string,
  payload: SendFileOrMediaPayload,
): Promise<BaseResponse<string>> {
  const formData = new FormData();
  formData.append("file", payload.file);
  formData.append("userId", payload.userId);
  formData.append("msgId", payload.msgId);

  return await service({
    url,
    method: "post",
    data: formData,
  });
}

export async function sendFileMessageAction(payload: SendFileOrMediaPayload) {
  return uploadChatBinaryAction("/chat/message/send/file", payload);
}

export async function sendMediaMessageAction(payload: SendFileOrMediaPayload) {
  return uploadChatBinaryAction("/chat/message/send/media", payload);
}
