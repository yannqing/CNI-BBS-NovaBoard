"use client";

import { Button, ButtonGroup } from "@nextui-org/button";
import { Grid2x2, Menu, Upload } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { getCookie } from "@/utils/cookies";

import SelectButton from "@/components/privacy-cloud/SelectButton";
import FileTable from "@/components/privacy-cloud/FileTable";
import { uploadFileAction } from "@/app/(main)/privacy-cloud/action";

import { toast } from "sonner";
import { BaseResponse } from "@/types";

import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from "@nextui-org/modal";
import { Progress } from "@nextui-org/progress";
import { Image } from "@nextui-org/image";

export default function PrivacyCloudPage() {
  const [viewMode, setViewMode] = useState<"list" | "grid">("grid");
  const router = useRouter();
  const currentUser = getCookie();
  const currentId = currentUser?.id;
  const token = currentUser?.token;
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [fileType, setFileType] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [reloadKey, setReloadKey] = useState(0);

  // 动态创建文件选择器，支持多种文件类型，根据需求修改accept
  const handleFileSelect = () => {
    const input = document.createElement("input");
    input.type = "file";
    // 如果限制类型，比如只允许图片上传，改这里 input.accept = 'image/*'
    input.accept = "*/*";

    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;

      // 检查文件大小限制 —— 示例：1G
      if (file.size > 1024 * 1024 * 1024) {
        toast.error("文件大小不能超过1G");
        return;
      }

      setSelectedFile(file);

      // 根据文件 MIME 类型判断是图片时生成预览
      if (file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onload = () => {
          setFilePreview(reader.result as string);
        };
        reader.readAsDataURL(file);
        setFileType("image");
      } else if (file.type.startsWith("video/")) {
        setFilePreview(URL.createObjectURL(file));
        setFileType("video");
      } else {
        setFilePreview(null);
        setFileType("document");
      }

      setIsModalOpen(true);
    };

    input.click();
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

  if (!currentId || !token) {
      toast.error("请先登录");
      router.push("/login");
      return;
    }


    setIsUploading(true);
    setUploadProgress(0);

    try {
      // 这里可改成根据实际上传接口更新进度，示例用定时器模拟
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

      // 组装上传请求参数
      const formData = new FormData();
      formData.append("file", selectedFile); 
      formData.append("userId", currentId); 
      formData.append("token", token);    
  

      const res: BaseResponse<any> = await uploadFileAction(formData);

      clearInterval(interval);

      if (res.success) {
        toast.success("上传成功");
        setIsModalOpen(false);
        setSelectedFile(null);
        setFilePreview(null);
        setIsUploading(false);
        setUploadProgress(0);
        // 强制重新获取文件列表
        setReloadKey(prev => prev + 1); // 触发FileTable重新加载
      } else {
        toast.error(res.message || "上传失败");
        setIsUploading(false);
        setUploadProgress(0);
      }
    } catch (error) {
      toast.error("上传异常，请重试");
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  // 关闭模态框时清理预览URL，防止内存泄漏
  const handleModalClose = () => {
    if (filePreview && (fileType === "video")) {
      URL.revokeObjectURL(filePreview);
    }
    setSelectedFile(null);
    setFilePreview(null);
    setIsModalOpen(false);
  };

  return (
    <div className="w-full p-4">
      <div className="w-full flex justify-between items-center">
        <div className="text-3xl">我的云端硬盘</div>
        <div className="flex gap-2">
          <Button
            color="primary"
            startContent={<Upload size={17} />}
            onClick={handleFileSelect}
          >
            上传
          </Button>
          <ButtonGroup>
            <Button
              onPress={() => setViewMode("list")}
              className={viewMode === "list" ? "bg-gray-200" : ""}
            >
              <Menu />
            </Button>
            <Button
              onPress={() => setViewMode("grid")}
              className={viewMode === "grid" ? "bg-gray-200" : ""}
            >
              <Grid2x2 />
            </Button>
          </ButtonGroup>
        </div>
      </div>
      <div className="mt-4">
        <FileTable 
          isList={viewMode === "list"} 
          currentId={currentId} 
          key={reloadKey} 
        />
      </div>

      {/* 上传确认模态框 */}
      <Modal
        isOpen={isModalOpen}
        onClose={!isUploading ? handleModalClose : undefined}
        size="2xl"
        classNames={{
          base: "bg-background",
          header: "border-b border-divider",
          footer: "border-t border-divider",
          closeButton: "hover:bg-default-100",
        }}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>{fileType === "image" ? "发送图片" : fileType === "video" ? "发送视频" : "发送文件"}</ModalHeader>
              <ModalBody>
                {isUploading && (
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

                {filePreview && fileType === "image" && (
                  <div className="flex justify-center">
                    <Image
                      src={filePreview}
                      alt={selectedFile?.name || "图片"}
                      className="max-h-96 object-contain rounded-lg"
                      radius="lg"
                      shadow="md"
                    />
                  </div>
                )}

                {filePreview && fileType === "video" && (
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
                  isDisabled={isUploading}
                  className="hover:bg-default-200 transition-colors duration-200"
                >
                  取消
                </Button>
                <Button 
                  color="primary" 
                  onPress={handleUpload}
                  isLoading={isUploading}
                  isDisabled={isUploading}
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
