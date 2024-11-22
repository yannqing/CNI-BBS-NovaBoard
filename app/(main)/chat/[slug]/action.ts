import service from "@/utils/axios";
import { GetChatRecordRequest } from "@/types/chat/chatList";

export async function getChatRecord(data: GetChatRecordRequest) {
  return await service({
    url: "/chat/message/record",
    method: "post",
    data: data,
  });
}
