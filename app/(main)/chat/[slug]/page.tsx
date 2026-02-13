"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import { toast } from "sonner";
import { Card, CardBody } from "@nextui-org/card";
import { Textarea } from "@nextui-org/input";
import { Button } from "@nextui-org/button";
import { Tooltip } from "@nextui-org/tooltip";
import { Popover, PopoverTrigger, PopoverContent } from "@nextui-org/popover";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from "@nextui-org/modal";
import { useDisclosure } from "@nextui-org/react";
import { Image } from "@nextui-org/image";
import { Progress } from "@nextui-org/progress";

import { useGetChatContext } from "../ChatContext";

import {
  GetChatRecordRequest,
  GetChatRecordResponse,
} from "@/types/chat/chatList";
import { BasePage, BaseResponse } from "@/types";
import {
  getChatRecordAction,
  sendMessageAction,
} from "@/app/(main)/chat/[slug]/action";
import { getCookie } from "@/utils/cookies";

// 定义 props 类型
interface ChatMessageProps {
  message?: string; // 指定 message 的类型为 string
  fileUrl?: string; // 文件URL
  fileName?: string; // 文件名
  fileType?: string; // 文件类型
  side?: string; // 消息位置：left或right
}

interface ChatMessageType {
  text: string;
  side: string;
  type: string;
  fileUrl?: string; // 文件URL
  fileName?: string; // 文件名
  fileType?: string; // 文件类型：image, video, document
}

export default function Page({ params }: { params: { slug: string } }) {
  const divRef = useRef<HTMLDivElement | null>(null); // 创建 ref
  // 从 ChatContext 获取 WebSocket 状态
  const { resetChatList, chatList } = useGetChatContext();

  /**
   * 输入框绑定
   */
  const [inputValue, setInputValue] = useState("");
  const [messages, setMessages] = useState<ChatMessageType[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // 文件上传相关状态
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [fileType, setFileType] = useState<string>("");
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const { isOpen, onOpen, onClose } = useDisclosure();

  // 添加一个状态来跟踪输入法状态
  const [isComposing, setIsComposing] = useState(false);
  // 添加发送消息加载状态
  const [isSending, setIsSending] = useState(false);

  // 1. 修改 handleResetChatList 为异步函数
  const handleResetChatList = useCallback(async () => {
    await resetChatList();
  }, [resetChatList]);

  // 初始化时手动获取chatList
  useEffect(() => {
    const initializeChat = async () => {
      try {
        // 当chatList为空时，手动触发一次resetChatList
        if (!chatList || chatList.length === 0) {
          await handleResetChatList();
        }
        setIsLoading(false);
      } catch (error) {
        setIsLoading(false);
      }
    };

    initializeChat().then((r) => {});
  }, [handleResetChatList]);

  // 文件上传处理函数
  const handleFileUpload = (type: string) => {
    const input = document.createElement('input');
    input.type = 'file';
    
    // 根据类型设置接受的文件格式
    switch(type) {
      case 'image':
        input.accept = 'image/*';
        break;
      case 'video':
        input.accept = 'video/*';
        break;
      case 'document':
        input.accept = '.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt';
        break;
      default:
        input.accept = '*/*';
    }
    
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        // 检查文件大小(限制为20MB)
        if (file.size > 20 * 1024 * 1024) {
          toast.error("文件大小不能超过20MB");
          return;
        }

        setSelectedFile(file);
        setFileType(type);
        
        // 创建预览（仅对图片和视频）
        if (type === 'image') {
          const reader = new FileReader();
          reader.onload = () => {
            setFilePreview(reader.result as string);
          };
          reader.readAsDataURL(file);
        } else if (type === 'video') {
          setFilePreview(URL.createObjectURL(file));
        } else {
          setFilePreview(null);
        }
        
        onOpen();
      }
    };
    
    input.click();
  };

  // 发送文件函数
  const sendFile = async () => {
    if (!selectedFile) return;
    
    setIsSending(true);
    setUploadProgress(0);
    
    try {
      // 模拟上传进度
      const interval = setInterval(() => {
        setUploadProgress((prev) => {
          const next = prev + 10;
          if (next >= 100) {
            clearInterval(interval);
            return 100;
          }
          return next;
        });
      }, 300);
      
      // 创建FormData对象，用于上传文件
      const formData = new FormData();
      formData.append('file', selectedFile);
      
      // 确保ID值存在
      const userId = getCookie()?.id;
      if (userId) {
        formData.append('fromId', userId.toString());
      } else {
        formData.append('fromId', 'anonymous');
      }
      
      formData.append('toId', params.slug);
      
      // TODO: 实际的文件上传API调用
      // const response = await uploadFileAction(formData);
      // 假设上传成功，模拟返回的文件URL
      await new Promise(resolve => setTimeout(resolve, 2000));
      const fileUrl = URL.createObjectURL(selectedFile);

      // 即时确定source值
      let messageSource = "user";
      if (chatList && chatList.length > 0) {
        const currentChat = chatList.find((chat) => chat.toId === params.slug);
        if (currentChat && currentChat.sourceType) {
          messageSource = currentChat.sourceType;
        }
      }

      // 更新消息UI
      setMessages(prev => [...prev, {
        text: selectedFile.name,
        side: "right",
        type: fileType,
        fileUrl: fileUrl,
        fileName: selectedFile.name,
        fileType: fileType
      }]);
      
      // 构建发送消息请求
      const sendMessageRequest = {
        fromId: userId ? userId.toString() : 'anonymous',
        toId: params.slug,
        source: messageSource,
        messageType: "file",
        chatMessageContent: {
          formUserId: userId ? userId.toString() : 'anonymous',
          formUserName: getCookie()?.username?.toString() || 'Anonymous',
          formUserPortrait: getCookie()?.avatar?.toString() || '',
          type: fileType,
          content: JSON.stringify({
            fileName: selectedFile.name,
            fileUrl: fileUrl,
            fileType: fileType
          })
        },
      };

      // 实际上传
      const res: BaseResponse<any> = await sendMessageAction(sendMessageRequest);

      if (res.success) {
        await handleResetChatList();
        toast.success("文件发送成功");
      } else {
        toast.error("文件发送失败");
      }
      
      // 清理状态
      clearInterval(interval);
      onClose();
      setSelectedFile(null);
      setFilePreview(null);
      setIsSending(false);
      setUploadProgress(0);
      
    } catch (error) {
      toast.error("文件上传失败，请重试");
      setIsSending(false);
      setUploadProgress(0);
    }
  };

  /**
   * 发送消息
   * @param event
   */
  const sendTextMessage = async () => {
    if (inputValue.trim()) {
      setIsSending(true);
      const messageText = inputValue;

      setInputValue("");

      // 更新消息UI
      setMessages((prev) => [
        ...prev,
        {
          text: messageText,
          side: "right",
          type: "text",
        },
      ]);

      // 即时确定source值
      let messageSource = "user"; // 默认值

      // 如果chatList可用，立即查找匹配项
      if (chatList && chatList.length > 0) {
        // 使用双等号比较，因为一个可能是字符串，一个可能是数字
        const currentChat = chatList.find((chat) => {
          return chat.toId === params.slug;
        });

        if (currentChat && currentChat.sourceType) {
          messageSource = currentChat.sourceType;
        }
      }

      const sendMessageRequest = {
        fromId: getCookie()?.id.toString(),
        toId: params.slug,
        source: messageSource, // 使用即时确定的值
        messageType: "message",
        chatMessageContent: {
          formUserId: getCookie()?.id.toString(),
          formUserName: getCookie()?.username.toString(),
          formUserPortrait: getCookie()?.avatar.toString(),
          type: "text",
          content: messageText,
        },
      };

      try {
        const res: BaseResponse<any> =
          await sendMessageAction(sendMessageRequest);

        if (res.success) {
          await handleResetChatList();
        } else {
          toast.error("消息发送失败，请重试");
        }
      } catch (error) {
        toast.error("网络错误，请稍后重试");
      } finally {
        setIsSending(false);
      }
    } else {
      toast.error("不能发送空消息！");
    }
  };

  const handleKeyDown = async (event: any) => {
    // 如果是在组合状态下按回车，不要触发发送
    if (event.key === "Enter" && isComposing) {
      return;
    }

    if (event.key === "Enter" && !event.shiftKey && !isComposing) {
      event.preventDefault();
      sendTextMessage();
    }
  };

  // 每次消息更新时滚动到底部
  useEffect(() => {
    if (divRef.current) {
      divRef.current.scrollTop = divRef.current.scrollHeight; // 滚动到最新消息
    }
  }, [messages]); // 依赖 messages，确保每次消息更新时滚动

  const userInfo = getCookie();

  // 页面初始化
  useEffect(() => {
    fetchData().then(() => {});

    // 组件卸载时清理
    return () => {
      // 清理所有URL.createObjectURL创建的对象
      if (filePreview && filePreview.startsWith('blob:')) {
        URL.revokeObjectURL(filePreview);
      }
    };
  }, []);

  // 构建获取聊天内容请求
  const getChatRecordRequest: GetChatRecordRequest = {
    pageNo: 1,
    pageSize: 10,
    isDesc: "0", // 0 为倒序
    fromId: "", // 登录用户 id
    targetId: "0", // 目标用户 id
  };

  // 获取聊天内容
  const fetchData = async () => {
    if (userInfo?.id) {
      getChatRecordRequest.fromId = userInfo.id;
      getChatRecordRequest.targetId = params.slug;
      const res: BaseResponse<BasePage<GetChatRecordResponse>> =
        await getChatRecordAction(getChatRecordRequest);

      if (res.success) {
        if (res.data && res.data.records.length > 0) {
          // 有数据
          const responseData = res.data.records;

          responseData.map((response) => {
            if (
              response.chatMessageContent &&
              response.chatMessageContent.content.startsWith('{\"content\":')
            ) {
              let obj = JSON.parse(response.chatMessageContent.content);

              response.chatMessageContent.content = obj.content.text;
            }

            return response;
          });

          // 区分消息内容是自己发的，还是其他人发的，或者是系统消息
          for (let i = responseData.length - 1; i >= 0; i--) {
            if (responseData[i].chatMessageContent.content) {
              if (
                userInfo.id === responseData[i].chatMessageContent.formUserId &&
                responseData[i].chatMessageContent.type === "text"
              ) {
                setMessages((prevMessages) => [
                  ...prevMessages,
                  {
                    text: responseData[i].chatMessageContent.content,
                    side: "right",
                    type: "text",
                  },
                ]);
              } else {
                if (responseData[i].chatMessageContent.type === "text") {
                  setMessages((prevMessages) => [
                    ...prevMessages,
                    {
                      text: responseData[i].chatMessageContent.content,
                      side: "left",
                      type: "text",
                    },
                  ]);
                } else {
                  setMessages((prevMessages) => [
                    ...prevMessages,
                    {
                      text: responseData[i].chatMessageContent.content,
                      side: "left",
                      type: "system",
                    },
                  ]);
                }
              }
            }
          }
        } else {
          // TODO 无数据
        }
      }
    }
  };

  // 文本消息组件
  const LeftChat: React.FC<ChatMessageProps> = ({ message }) => (
    <div className="justify-start grid mt-3 mb-3 ml-6">
      <Card isPressable className="w-full bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 shadow-sm hover:shadow-md transition-shadow duration-200">
        <CardBody className="w-full p-3">
          <span>{message}</span>
        </CardBody>
      </Card>
    </div>
  );

  const RightChat: React.FC<ChatMessageProps> = ({ message }) => (
    <div className="w-full justify-end grid mt-3 mb-3">
      <Card isPressable className="w-full bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900 dark:to-blue-800 shadow-sm hover:shadow-md transition-shadow duration-200">
        <CardBody className="w-full p-3">
          <span>{message}</span>
        </CardBody>
      </Card>
    </div>
  );

  // 图片消息组件
  const ImageMessage: React.FC<ChatMessageProps> = ({ fileUrl, fileName, side }) => (
    <div className={`flex ${side === "left" ? "justify-start ml-6" : "justify-end"} mt-3 mb-3`}>
      <Card isPressable className="max-w-xs overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 shadow-sm hover:shadow-lg transition-all duration-200">
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
          {fileName && <p className="text-xs text-gray-500 mt-2 truncate text-center">{fileName}</p>}
        </CardBody>
      </Card>
    </div>
  );

  // 视频消息组件
  const VideoMessage: React.FC<ChatMessageProps> = ({ fileUrl, fileName, side }) => (
  <div className={`flex ${side === "left" ? "justify-start ml-6" : "justify-end"} mt-3 mb-3`}>
    <Card isPressable className="max-w-xs overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 shadow-sm hover:shadow-lg transition-all duration-200">
      <CardBody className="p-2">
        <video 
          src={fileUrl} 
          controls 
          className="rounded-lg w-full object-cover max-h-60"
        >
          <track kind="captions" src="" label="中文" />
        </video>
        {fileName && <p className="text-xs text-gray-500 mt-2 truncate text-center">{fileName}</p>}
      </CardBody>
    </Card>
  </div>
);

  // 文档消息组件
  const DocumentMessage: React.FC<ChatMessageProps> = ({ fileName, side }) => (
    <div className={`flex ${side === "left" ? "justify-start ml-6" : "justify-end"} mt-3 mb-3`}>
      <Card isPressable className="max-w-xs overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 shadow-sm hover:shadow-lg transition-all duration-200">
        <CardBody className="p-3">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600 dark:text-blue-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
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

  // 常用表情列表
  const emojiList = ["😊", "😂", "🥰", "😎", "🙄", "👍", "❤️", "🎉", "🔥", "✨", "🤔", "😅", "😍", "🙏", "👏", "💯"];

  return (
    <div className="w-full flex flex-col h-[calc(100vh-60px)] bg-background overflow-hidden rounded-xl transition-all duration-300 animate-in fade-in-50">
      {/* 聊天历史记录区域 */}
      <div
        ref={divRef}
        className="flex-1 overflow-y-auto scroll-hidden p-2"
      >
        <div className="flex flex-col">
          {messages.map((msg, index) =>
            msg.side === "left" && msg.type === "text" ? (
              <LeftChat key={index} message={msg.text} />
            ) : msg.side === "right" && msg.type === "text" ? (
              <RightChat key={index} message={msg.text} />
            ) : msg.type === "image" ? (
              <ImageMessage key={index} fileUrl={msg.fileUrl} fileName={msg.fileName} side={msg.side} />
            ) : msg.type === "video" ? (
              <VideoMessage key={index} fileUrl={msg.fileUrl} fileName={msg.fileName} side={msg.side} />
            ) : msg.type === "document" ? (
              <DocumentMessage key={index} fileName={msg.fileName} side={msg.side} />
            ) : (
              <div key={index} className="flex justify-center my-2 animate-in fade-in-50 duration-300">
                <div className="text-sm bg-default-100 px-3 py-1 rounded-full text-foreground-500">{msg.text}</div>
              </div>
            )
          )}
        </div>
      </div>
      
      {/* 输入区域 */}
      <div className="px-4 py-3 bg-background border-t border-divider shrink-0">
        {/* 工具栏 */}
        <div className="flex mb-2 gap-2">
          <div className="flex gap-1">
            <Tooltip content="发送图片" placement="top">
              <Button 
                isIconOnly 
                variant="light" 
                radius="full"
                className="text-lg hover:bg-default-200 transition-all duration-200"
                onPress={() => handleFileUpload('image')}
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
                onPress={() => handleFileUpload('video')}
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
                onPress={() => handleFileUpload('document')}
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
                    onPress={() => setInputValue(prev => prev + emoji)}
                  >
                    {emoji}
                  </Button>
                ))}
              </div>
            </PopoverContent>
          </Popover>
        </div>
        
        {/* 消息输入区域 */}
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
              inputWrapper: "bg-default-50 hover:bg-default-100 dark:bg-default-100/20 dark:hover:bg-default-100/30 transition-colors duration-150",
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
        
        <div className="text-xs text-foreground-500 mt-1 px-1">
          按Enter发送，Shift+Enter换行
        </div>
      </div>
      
      {/* 文件预览模态框 */}
      <Modal isOpen={isOpen} onClose={!isSending ? onClose : undefined} size="2xl" classNames={{
        base: "bg-background",
        header: "border-b border-divider",
        footer: "border-t border-divider",
        closeButton: "hover:bg-default-100",
      }}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                {fileType === 'image' ? '发送图片' : 
                 fileType === 'video' ? '发送视频' : '发送文件'}
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
                      value: "bg-gradient-to-r from-primary to-secondary transition-all duration-1000",
                    }}
                  />
                )}
                
                {filePreview && fileType === 'image' && (
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
                
                {filePreview && fileType === 'video' && (
                  <div className="flex justify-center">
                    <video 
                      src={filePreview} 
                      controls 
                      className="max-h-96 w-full rounded-lg"
                    >
                      <track kind="captions" src="" label="中文" />
                    </video>
                  </div>
                )}
                
                {selectedFile && !filePreview && (
                  <div className="flex flex-col items-center py-8">
                    <div className="p-6 rounded-full bg-primary-100 dark:bg-primary-900/30 mb-4 animate-pulse">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-primary dark:text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
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
                  onPress={onClose}
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
