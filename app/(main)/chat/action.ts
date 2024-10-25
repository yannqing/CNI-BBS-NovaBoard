import service from "@/utils/axios";
import { GetChatListRequest } from "@/types/chat/chatList";

export async function getChatList(data: GetChatListRequest, token: string) {
  return await service({
    url: "/chat/chat-list/list",
    method: "post",
    data: data,
    headers: {
      token: token,
      "content-type": "application/json;charset=utf-8",
    },
  });
}
