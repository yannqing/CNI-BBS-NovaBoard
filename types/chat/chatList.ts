// 获取聊天列表，请求参数
export type GetChatListRequest = {
  pageNo: number;
  pageSize: number;
  fromId?: string;
};

// 获取聊天列表，响应参数
export type GetChatListResponse = {
  fromId?: string;
  id?: string;
  isTop?: boolean;
  lastMsgContent?: ChatMessageContent;
  sourceType?: string;
  toId?: string;
  toName?: string;
  unreadNum?: number;
  updateTime?: string;
};

// 查询聊天内容，请求参数
export type GetChatRecordRequest = {
  pageNo: number;
  pageSize: number;
  fromId: string;
  targetId: string;
  isDesc: string;
};

// 查询聊天内容，响应参数
export type GetChatRecordResponse = {
  chatMessageContent: ChatMessageContent;
  fromId: string;
  id: number;
  isShowTime: boolean;
  levelType: string;
  sourceType: string;
  status: number;
  toId: number;
  type: string;
  createTime: string;
  updateTime: string;
};

// 聊天消息内容封装类
export type ChatMessageContent = {
  content: string;
  ext?: string;
  formUserId?: string;
  formUserName?: string;
  formUserPortrait?: string;
  type?: string;
};
