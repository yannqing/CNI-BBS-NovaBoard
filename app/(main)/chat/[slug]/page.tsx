"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import { Card, CardBody } from "@nextui-org/card";
import { Textarea } from "@nextui-org/input";
import { Button } from "@nextui-org/button";
import { Tooltip } from "@nextui-org/tooltip";
import { Popover, PopoverTrigger, PopoverContent } from "@nextui-org/popover";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@nextui-org/modal";
import { useDisclosure } from "@nextui-org/react";
import { Image } from "@nextui-org/image";
import { Progress } from "@nextui-org/progress";

import { useGetChatContext } from "../ChatContext";
import { useWebSocket } from "../useWebSocket";

import {
  getChatRecordAction,
  sendFileMessageAction,
  sendMediaMessageAction,
  sendMessageAction,
} from "@/app/(main)/chat/[slug]/action";
import {
  GetChatRecordRequest,
  GetChatRecordResponse,
} from "@/types/chat/chatList";
import { SendMessageRequestType } from "@/types/chat/message";
import { BasePage, BaseResponse } from "@/types";
import { getCookie } from "@/utils/cookies";

interface ChatMessageProps {
  message?: string;
  fileUrl?: string;
  fileName?: string;
  side?: "left" | "right";
}

type UiMessageType = "text" | "image" | "video" | "file" | "system";

interface ChatMessageType {
  text: string;
  side: "left" | "right";
  type: UiMessageType;
  fileUrl?: string;
  fileName?: string;
}

type SendMessageDml = {
  id?: string;
  status?: boolean;
  message?: string;
};

type ParsedContent = {
  text: string;
  fileUrl?: string;
  fileName?: string;
};

function parseMessageContent(rawContent: string, type?: string): ParsedContent {
  if (!rawContent) {
    return { text: "" };
  }

  if (type === "text") {
    try {
      const parsed = JSON.parse(rawContent);
      const nestedText = parsed?.content?.text;
      if (typeof nestedText === "string") {
        return { text: nestedText };
      }
    } catch {
      return { text: rawContent };
    }

    return { text: rawContent };
  }

  try {
    const parsed = JSON.parse(rawContent);

    return {
      text: parsed?.fileName || parsed?.content || rawContent,
      fileName: parsed?.fileName,
      fileUrl: parsed?.fileUrl,
    };
  } catch {
    return { text: rawContent };
  }
}

function mapMessageRecordToUi(
  record: GetChatRecordResponse,
  currentUserId: string,
): ChatMessageType | null {
  const content = record.chatMessageContent;
  if (!content || !content.content) {
    return null;
  }

  const messageType = content.type || "text";
  const parsed = parseMessageContent(content.content, messageType);

  return {
    text: parsed.text,
    side: content.formUserId === currentUserId ? "right" : "left",
    type:
      messageType === "image" ||
      messageType === "video" ||
      messageType === "file"
        ? messageType
        : messageType === "text"
          ? "text"
          : "system",
    fileName: parsed.fileName,
    fileUrl: parsed.fileUrl,
  };
}

function buildMessageSource(chatList: { toId?: string; sourceType?: string }[], slug: string) {
  const matched = chatList.find((item) => item.toId === slug);
  return matched?.sourceType || "user";
}

export default function Page({ params }: { params: { slug: string } }) {
  const divRef = useRef<HTMLDivElement | null>(null);
  const { resetChatList, chatList } = useGetChatContext();

  const [inputValue, setInputValue] = useState("");
  const [messages, setMessages] = useState<ChatMessageType[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [fileType, setFileType] = useState<"image" | "video" | "file">("file");
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [isComposing, setIsComposing] = useState(false);
  const [isSending, setIsSending] = useState(false);

  const userInfo = useMemo(() => getCookie(), []);
  const currentUserId = userInfo?.id || "";

  const getChatRecordRequest: GetChatRecordRequest = useMemo(
    () => ({
      pageNo: 1,
      pageSize: 30,
      isDesc: "0",
      fromId: currentUserId,
      targetId: params.slug,
    }),
    [currentUserId, params.slug],
  );

  const handleResetChatList = useCallback(async () => {
    await resetChatList();
  }, [resetChatList]);

  const fetchData = useCallback(async () => {
    if (!currentUserId) {
      setMessages([]);
      setIsLoading(false);
      return;
    }

    const res: BaseResponse<BasePage<GetChatRecordResponse>> =
      await getChatRecordAction(getChatRecordRequest);

    if (!res.success || !res.data) {
      setIsLoading(false);
      return;
    }

    const mapped = [...res.data.records]
      .reverse()
      .map((record) => mapMessageRecordToUi(record, currentUserId))
      .filter((msg): msg is ChatMessageType => msg !== null);

    setMessages(mapped);
    setIsLoading(false);
  }, [currentUserId, getChatRecordRequest]);

  const appendWsMessage = useCallback(
    (payload: any) => {
      const message = payload?.content;
      if (!message?.chatMessageContent || !currentUserId) {
        return;
      }

      const fromId = String(message.fromId || "");
      const toId = String(message.toId || "");

      if (fromId !== params.slug && toId !== params.slug) {
        return;
      }

      const parsed = mapMessageRecordToUi(message, currentUserId);
      if (!parsed) {
        return;
      }

      setMessages((prev) => [...prev, parsed]);
      handleResetChatList().then(() => {});
    },
    [currentUserId, handleResetChatList, params.slug],
  );

  useWebSocket({ onMessage: appendWsMessage });

  useEffect(() => {
    const initializeChat = async () => {
      try {
        if (!chatList || chatList.length === 0) {
          await handleResetChatList();
        }
      } finally {
        await fetchData();
      }
    };

    initializeChat().then(() => {});
  }, [chatList, fetchData, handleResetChatList]);

  useEffect(() => {
    if (!divRef.current) {
      return;
    }

    divRef.current.scrollTop = divRef.current.scrollHeight;
  }, [messages]);

  useEffect(() => {
    return () => {
      if (filePreview && filePreview.startsWith("blob:")) {
        URL.revokeObjectURL(filePreview);
      }
    };
  }, [filePreview]);

  const handleFileUpload = (pickedType: "image" | "video" | "file") => {
    const input = document.createElement("input");
    input.type = "file";

    if (pickedType === "image") {
      input.accept = "image/*";
    } else if (pickedType === "video") {
      input.accept = "video/*";
    } else {
      input.accept = ".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt";
    }

    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) {
        return;
      }

      if (file.size > 20 * 1024 * 1024) {
        toast.error("文件大小不能超过20MB");
        return;
      }

      setSelectedFile(file);
      setFileType(pickedType);

      if (pickedType === "image") {
        const reader = new FileReader();
        reader.onload = () => {
          setFilePreview(reader.result as string);
        };
        reader.readAsDataURL(file);
      } else if (pickedType === "video") {
        setFilePreview(URL.createObjectURL(file));
      } else {
        setFilePreview(null);
      }

      onOpen();
    };

    input.click();
  };

  const sendFile = async () => {
    if (!selectedFile || !currentUserId) {
      toast.error("请先登录再发送文件");
      return;
    }

    setIsSending(true);
    setUploadProgress(0);

    const interval = setInterval(() => {
      setUploadProgress((prev) => (prev >= 90 ? prev : prev + 10));
    }, 200);

    try {
      const source = buildMessageSource(chatList || [], params.slug);

      const createMsgRequest: SendMessageRequestType = {
        fromId: currentUserId,
        toId: params.slug,
        source,
        messageType: "media",
        chatMessageContent: {
          formUserId: currentUserId,
          formUserName: userInfo?.username || "Anonymous",
          formUserPortrait: userInfo?.avatar || "",
          type: fileType,
          content: JSON.stringify({
            fileName: selectedFile.name,
            fileSize: selectedFile.size,
          }),
        },
      };

      const createRes: BaseResponse<SendMessageDml> =
        await sendMessageAction(createMsgRequest);
      const msgId = createRes.data?.id;

      if (!createRes.success || !msgId) {
        throw new Error("预创建消息失败");
      }

      const uploadRes =
        fileType === "image" || fileType === "video"
          ? await sendMediaMessageAction({
              file: selectedFile,
              userId: currentUserId,
              msgId,
            })
          : await sendFileMessageAction({
              file: selectedFile,
              userId: currentUserId,
              msgId,
            });

      if (!uploadRes.success) {
        throw new Error(uploadRes.message || "上传失败");
      }

      setUploadProgress(100);
      await Promise.all([handleResetChatList(), fetchData()]);
      toast.success("文件发送成功");
      onClose();
      setSelectedFile(null);
      setFilePreview(null);
    } catch (error) {
      toast.error("文件上传失败，请重试");
    } finally {
      clearInterval(interval);
      setIsSending(false);
      setUploadProgress(0);
    }
  };

  const sendTextMessage = async () => {
    const messageText = inputValue.trim();
    if (!messageText) {
      toast.error("不能发送空消息！");
      return;
    }

    if (!currentUserId) {
      toast.error("请先登录再发送消息");
      return;
    }

    setIsSending(true);
    setInputValue("");

    setMessages((prev) => [
      ...prev,
      {
        text: messageText,
        side: "right",
        type: "text",
      },
    ]);

    const source = buildMessageSource(chatList || [], params.slug);

    const sendMessageRequest: SendMessageRequestType = {
      fromId: currentUserId,
      toId: params.slug,
      source,
      messageType: "message",
      chatMessageContent: {
        formUserId: currentUserId,
        formUserName: userInfo?.username || "Anonymous",
        formUserPortrait: userInfo?.avatar || "",
        type: "text",
        content: messageText,
      },
    };

    try {
      const res: BaseResponse<SendMessageDml> =
        await sendMessageAction(sendMessageRequest);

      if (!res.success) {
        toast.error("消息发送失败，请重试");
        return;
      }

      await handleResetChatList();
    } catch {
      toast.error("网络错误，请稍后重试");
    } finally {
      setIsSending(false);
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && isComposing) {
      return;
    }

    if (event.key === "Enter" && !event.shiftKey && !isComposing) {
      event.preventDefault();
      sendTextMessage().then(() => {});
    }
  };

  const LeftChat: React.FC<ChatMessageProps> = ({ message }) => (
    <div className="justify-start grid mt-3 mb-3 ml-6">
      <Card
        isPressable
        className="w-full bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 shadow-sm hover:shadow-md transition-shadow duration-200"
      >
        <CardBody className="w-full p-3">
          <span>{message}</span>
        </CardBody>
      </Card>
    </div>
  );

  const RightChat: React.FC<ChatMessageProps> = ({ message }) => (
    <div className="w-full justify-end grid mt-3 mb-3">
      <Card
        isPressable
        className="w-full bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900 dark:to-blue-800 shadow-sm hover:shadow-md transition-shadow duration-200"
      >
        <CardBody className="w-full p-3">
          <span>{message}</span>
        </CardBody>
      </Card>
    </div>
  );

  const ImageMessage: React.FC<ChatMessageProps> = ({ fileUrl, fileName, side }) => (
    <div
      className={`flex ${side === "left" ? "justify-start ml-6" : "justify-end"} mt-3 mb-3`}
    >
      <Card
        isPressable
        className="max-w-xs overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 shadow-sm hover:shadow-lg transition-all duration-200"
      >
        <CardBody className="p-2">
          <Image
            src={fileUrl || "https://via.placeholder.com/150"}
            alt={fileName || "图片"}
            className="rounded-lg w-full object-cover max-h-60"
            classNames={{
              wrapper: "mx-auto",
            }}
            radius="lg"
            shadow="sm"
          />
          {fileName && (
            <p className="text-xs text-gray-500 mt-2 truncate text-center">{fileName}</p>
          )}
        </CardBody>
      </Card>
    </div>
  );

  const VideoMessage: React.FC<ChatMessageProps> = ({ fileUrl, fileName, side }) => (
    <div
      className={`flex ${side === "left" ? "justify-start ml-6" : "justify-end"} mt-3 mb-3`}
    >
      <Card
        isPressable
        className="max-w-xs overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 shadow-sm hover:shadow-lg transition-all duration-200"
      >
        <CardBody className="p-2">
          <video src={fileUrl} controls className="rounded-lg w-full object-cover max-h-60">
            <track kind="captions" src="" label="中文" />
          </video>
          {fileName && (
            <p className="text-xs text-gray-500 mt-2 truncate text-center">{fileName}</p>
          )}
        </CardBody>
      </Card>
    </div>
  );

  const DocumentMessage: React.FC<ChatMessageProps> = ({ fileName, side }) => (
    <div
      className={`flex ${side === "left" ? "justify-start ml-6" : "justify-end"} mt-3 mb-3`}
    >
      <Card
        isPressable
        className="max-w-xs overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 shadow-sm hover:shadow-lg transition-all duration-200"
      >
        <CardBody className="p-3">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-blue-600 dark:text-blue-300"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium truncate max-w-[180px]">{fileName}</p>
              <p className="text-xs text-gray-500">文档</p>
            </div>
          </div>
        </CardBody>
      </Card>
    </div>
  );

  const emojiList = [
    "😊",
    "😂",
    "🥰",
    "😎",
    "🙄",
    "👍",
    "❤️",
    "🎉",
    "🔥",
    "✨",
    "🤔",
    "😅",
    "😍",
    "🙏",
    "👏",
    "💯",
  ];

  return (
    <div className="w-full flex flex-col h-[calc(100vh-60px)] bg-background overflow-hidden rounded-xl transition-all duration-300 animate-in fade-in-50">
      <div ref={divRef} className="flex-1 overflow-y-auto scroll-hidden p-2">
        <div className="flex flex-col">
          {isLoading ? (
            <div className="text-sm text-foreground-500 p-4">加载中...</div>
          ) : (
            messages.map((msg, index) =>
              msg.side === "left" && msg.type === "text" ? (
                <LeftChat key={index} message={msg.text} />
              ) : msg.side === "right" && msg.type === "text" ? (
                <RightChat key={index} message={msg.text} />
              ) : msg.type === "image" ? (
                <ImageMessage
                  key={index}
                  fileUrl={msg.fileUrl}
                  fileName={msg.fileName}
                  side={msg.side}
                />
              ) : msg.type === "video" ? (
                <VideoMessage
                  key={index}
                  fileUrl={msg.fileUrl}
                  fileName={msg.fileName}
                  side={msg.side}
                />
              ) : msg.type === "file" ? (
                <DocumentMessage key={index} fileName={msg.fileName} side={msg.side} />
              ) : (
                <div key={index} className="flex justify-center my-2 animate-in fade-in-50 duration-300">
                  <div className="text-sm bg-default-100 px-3 py-1 rounded-full text-foreground-500">
                    {msg.text}
                  </div>
                </div>
              ),
            )
          )}
        </div>
      </div>

      <div className="px-4 py-3 bg-background border-t border-divider shrink-0">
        <div className="flex mb-2 gap-2">
          <div className="flex gap-1">
            <Tooltip content="发送图片" placement="top">
              <Button
                isIconOnly
                variant="light"
                radius="full"
                className="text-lg hover:bg-default-200 transition-all duration-200"
                onPress={() => handleFileUpload("image")}
                aria-label="发送图片"
              >
                🖼️
              </Button>
            </Tooltip>

            <Tooltip content="发送视频" placement="top">
              <Button
                isIconOnly
                variant="light"
                radius="full"
                className="text-lg hover:bg-default-200 transition-all duration-200"
                onPress={() => handleFileUpload("video")}
                aria-label="发送视频"
              >
                🎥
              </Button>
            </Tooltip>

            <Tooltip content="发送文件" placement="top">
              <Button
                isIconOnly
                variant="light"
                radius="full"
                className="text-lg hover:bg-default-200 transition-all duration-200"
                onPress={() => handleFileUpload("file")}
                aria-label="发送文件"
              >
                📎
              </Button>
            </Tooltip>
          </div>

          <div className="h-6 w-px bg-divider mx-1"></div>

          <Popover placement="top" showArrow offset={10}>
            <PopoverTrigger>
              <Button
                isIconOnly
                variant="light"
                radius="full"
                className="text-lg hover:bg-default-200 transition-all duration-200"
                aria-label="表情"
              >
                😊
              </Button>
            </PopoverTrigger>
            <PopoverContent className="p-2">
              <div className="grid grid-cols-8 gap-1 w-64">
                {emojiList.map((emoji, i) => (
                  <Button
                    key={i}
                    isIconOnly
                    variant="light"
                    radius="full"
                    size="sm"
                    className="text-lg hover:bg-default-200 scale-100 hover:scale-125 transition-all duration-200"
                    onPress={() => setInputValue((prev) => prev + emoji)}
                  >
                    {emoji}
                  </Button>
                ))}
              </div>
            </PopoverContent>
          </Popover>
        </div>

        <div className="flex items-end gap-2">
          <Textarea
            variant="bordered"
            radius="lg"
            placeholder="输入消息..."
            minRows={1}
            maxRows={4}
            value={inputValue}
            onCompositionEnd={() => setIsComposing(false)}
            onCompositionStart={() => setIsComposing(true)}
            onKeyDown={handleKeyDown}
            onValueChange={setInputValue}
            classNames={{
              base: "flex-grow",
              input: "resize-none py-2 text-base",
              inputWrapper:
                "bg-default-50 hover:bg-default-100 dark:bg-default-100/20 dark:hover:bg-default-100/30 transition-colors duration-150",
            }}
          />

          <Button
            color="primary"
            isLoading={isSending}
            radius="full"
            className="px-4 min-w-12 h-11 shadow-sm hover:shadow-md transition-all duration-200"
            isDisabled={!inputValue.trim() || isSending}
            onPress={sendTextMessage}
          >
            发送
          </Button>
        </div>

        <div className="text-xs text-foreground-500 mt-1 px-1">按Enter发送，Shift+Enter换行</div>
      </div>

      <Modal
        isOpen={isOpen}
        onClose={!isSending ? onClose : undefined}
        size="2xl"
        classNames={{
          base: "bg-background",
          header: "border-b border-divider",
          footer: "border-t border-divider",
          closeButton: "hover:bg-default-100",
        }}
      >
        <ModalContent>
          {(modalOnClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                {fileType === "image" ? "发送图片" : fileType === "video" ? "发送视频" : "发送文件"}
              </ModalHeader>
              <ModalBody>
                {isSending && (
                  <Progress
                    aria-label="上传中..."
                    size="sm"
                    value={uploadProgress}
                    color="primary"
                    className="mb-3"
                    showValueLabel={true}
                    classNames={{
                      track: "drop-shadow-sm",
                      value:
                        "bg-gradient-to-r from-primary to-secondary transition-all duration-1000",
                    }}
                  />
                )}

                {filePreview && fileType === "image" && (
                  <div className="flex justify-center">
                    <Image
                      src={filePreview}
                      alt="预览"
                      className="max-h-96 object-contain rounded-lg"
                      radius="lg"
                      shadow="md"
                    />
                  </div>
                )}

                {filePreview && fileType === "video" && (
                  <div className="flex justify-center">
                    <video src={filePreview} controls className="max-h-96 w-full rounded-lg">
                      <track kind="captions" src="" label="中文" />
                    </video>
                  </div>
                )}

                {selectedFile && !filePreview && (
                  <div className="flex flex-col items-center py-8">
                    <div className="p-6 rounded-full bg-primary-100 dark:bg-primary-900/30 mb-4 animate-pulse">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-12 w-12 text-primary dark:text-primary-500"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        />
                      </svg>
                    </div>
                    <p className="text-lg font-semibold mb-1">{selectedFile.name}</p>
                    <p className="text-sm text-foreground-500">
                      {selectedFile.size < 1024 * 1024
                        ? `${(selectedFile.size / 1024).toFixed(2)} KB`
                        : `${(selectedFile.size / (1024 * 1024)).toFixed(2)} MB`}
                    </p>
                  </div>
                )}
              </ModalBody>
              <ModalFooter>
                <Button
                  variant="flat"
                  onPress={modalOnClose}
                  isDisabled={isSending}
                  className="hover:bg-default-200 transition-colors duration-200"
                >
                  取消
                </Button>
                <Button
                  color="primary"
                  onPress={sendFile}
                  isLoading={isSending}
                  isDisabled={isSending}
                  className="shadow-sm hover:shadow-md transition-all duration-200"
                >
                  发送
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
}
