// 发送消息请求
type SendMessageRequestType = {
  fromId?: string;
  toId?: string;
  // 消息源：user，group，system
  source?: string;
  // 消息类型:message,notify,media
  messageType?: string;
  chatMessageContent?: ChatMessageContent;
};

// 消息内容
type ChatMessageContent = {
  fromUserId?: string;
  fromUserName?: string;
  // 发送方用户头像
  fromUserPortrait?: string;
  // 消息内容类型 check in MessageContentType
  type?: string;
  content?: string;
  ext?: string;
};
