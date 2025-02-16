"use client";

import React, { useState } from "react";
import ReactMarkdown from "react-markdown";
import "react-markdown-editor-lite/lib/index.css";
import markdownIt from "markdown-it";
import { toast } from "sonner";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";

import { uploadFileAction } from "@/app/dashboard/[subdomain]/photoes/action";
import { BaseResponse } from "@/types";
import { siteConfig } from "@/config/site";
import { ErrorCode } from "@/types/error/ErrorCode";

const mdParser = new markdownIt();

// 动态导入编辑器组件
const MdEditor = dynamic(() => import("react-markdown-editor-lite"), {
  ssr: false, // 禁用服务端渲染
});

// 获取markdown内容，并传递给父组件
const MarkdownEditor = ({
  getContent,
}: {
  getContent: (content: string) => void;
}) => {
  const router = useRouter();

  const [content, setContent] = useState("");

  const handleEditorChange = ({ text }: { text: string }) => {
    setContent(text);
    // 获取markdown内容，并传递给父组件
    getContent(text);
  };

  async function onImageUpload(file: File) {
    try {
      // 创建请求数据
      const formData = new FormData();

      formData.append("file", file);
      formData.append("userId", "1");
      formData.append("type", "image");

      const response: BaseResponse<any> = await uploadFileAction(formData);

      if (response.success) {
        return response.data;
      } else {
        toast.error(response.message || "上传失败");
      }

      return "";
      // return url; // 返回图片URL，编辑器会自动将其转换为 ![]() 格式
    } catch (error) {
      if (error && typeof error === "object" && "message" in error) {
        toast.error(error.message as string);
        if (
          error.message === ErrorCode.NOT_LOGIN.message ||
          error.message === ErrorCode.TOKEN_EXPIRE.message
        ) {
          router.push(siteConfig.innerLinks.login);
        }
      } else {
        toast.error("服务器异常，请联系管理员");
      }
      // if(error instanceof CustomError) {
      //   toast.error(error.message);
      // } else {
      //   console.log("=======================error", error instanceof CustomError);
      //   toast.error("请返回重新登录！")
      //   console.log("=======================error", error);
      // }
    }
  }

  return (
    <div>
      <MdEditor
        config={{
          view: {
            menu: true,
            md: true,
            html: true,
            fullScreen: true,
            hideMenu: false,
          },
          language: {
            titleItem: {
              h1: "标题 1",
              h2: "标题 2",
              h3: "标题 3",
              h4: "标题 4",
              h5: "标题 5",
              h6: "标题 6",
            },
          },
        }}
        renderHTML={(text) => mdParser.render(text)}
        style={{ height: "500px" }}
        value={content}
        onChange={handleEditorChange}
        onImageUpload={onImageUpload}
      />
      <h2>Preview</h2>
      <ReactMarkdown>{content}</ReactMarkdown>
    </div>
  );
};

export default MarkdownEditor;
