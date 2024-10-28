import service from "@/utils/axios";
import { GetChatListRequest } from "@/types/chat/chatList";

export async function getChatList(data: GetChatListRequest) {
  return await service({
    url: "/chat/chat-list/list",
    method: "post",
    data: data,
  });
}
