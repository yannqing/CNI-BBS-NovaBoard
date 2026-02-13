"use client";

import React, { useState } from "react";
import { createTemporaryUrlAction } from "@/app/(main)/privacy-cloud/action";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  RadioGroup,
  Radio,
  Input,
  Spinner
} from "@nextui-org/react";
import { Copy, Download } from "lucide-react";
import { toast } from "sonner";

interface ShareModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  fileName: string;
  userId: string;
}

export default function ShareModal({
  isOpen,
  onOpenChange,
  fileName,
  userId
}: ShareModalProps) {
  const [expiresIn, setExpiresIn] = useState("7");
  const [isLoading, setIsLoading] = useState(false);
  const [generatedUrl, setGeneratedUrl] = useState("");
  const [copied, setCopied] = useState(false);

  const handleGenerateLink = async () => {
    setIsLoading(true);
    try {
      const data = {
        fileName,
        userId,
        expiresIn: parseInt(expiresIn),
        isPrivate: '0'
      };
      const response = await createTemporaryUrlAction(data);
      if (response.data) {
        setGeneratedUrl(response.data);
      } else {
        toast.error("生成链接失败");
      }
    } catch (error) {
      console.error("生成链接出错:", error);
      toast.error("生成链接出错");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedUrl);
    setCopied(true);
    toast.success("已复制到剪贴板");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    window.open(generatedUrl, "_blank");
  };

  const handleClose = () => {
    setGeneratedUrl("");
    setExpiresIn("7");
    setCopied(false);
    onOpenChange(false);
  };

  return (
    <Modal isOpen={isOpen} onOpenChange={handleClose}>
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              分享文件
            </ModalHeader>
            <ModalBody>
              <div className="flex flex-col gap-4">
                <p className="text-sm text-default-500">
                  文件: {fileName}
                </p>

                <RadioGroup
                  label="选择分享有效期"
                  orientation="horizontal"
                  value={expiresIn}
                  onValueChange={setExpiresIn}
                >
                  <Radio value="1">1天</Radio>
                  <Radio value="3">3天</Radio>
                  <Radio value="7">7天</Radio>
                </RadioGroup>

                {isLoading ? (
                  <div className="flex justify-center py-4">
                    <Spinner />
                  </div>
                ) : generatedUrl ? (
                  <div className="flex flex-col gap-2">
                    <p className="text-sm font-medium">分享链接:</p>
                    <Input
                      isReadOnly
                      value={generatedUrl}
                      endContent={
                        <button
                          className="focus:outline-none"
                          onClick={handleCopy}
                        >
                          <Copy className="text-default-400" size={18} />
                        </button>
                      }
                    />
                  </div>
                ) : (
                  <Button
                    color="primary"
                    onClick={handleGenerateLink}
                    isLoading={isLoading}
                  >
                    生成分享链接
                  </Button>
                )}
              </div>
            </ModalBody>
            <ModalFooter>
              {generatedUrl && (
                <>
                  <Button
                    variant="light"
                    onPress={onClose}
                  >
                    关闭
                  </Button>
                  <Button
                    color="primary"
                    startContent={<Download size={16} />}
                    onPress={handleDownload}
                  >
                    下载
                  </Button>
                  <Button
                    color="secondary"
                    startContent={<Copy size={16} />}
                    onPress={handleCopy}
                    isDisabled={copied}
                  >
                    {copied ? "已复制" : "复制链接"}
                  </Button>
                </>
              )}
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
