"use client";

import React, { useEffect, useState } from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Chip,
  Tooltip,
  Image,
  Card,
  CardBody,
  CardFooter,
  Divider,
  Button,
} from "@nextui-org/react";
import { Download, Trash2 } from "lucide-react";
import {
  queryFileListAction,
  createTemporaryUrlAction,
  deleteFileAction,
} from "@/app/(main)/privacy-cloud/action";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

import { BaseResponse } from "@/types";
import {
    CreateTemporaryUrlRequest,
    DeleteFileRequest
  } from '@/types/cloud/cloudfile';
  
interface FileItem {
  etag?: string;
  fileName?: string;
  fileType?: string;
  fileSize?: string;
  lastModified?: string;
  storageClass?: string;
  filePath?: string;
}
interface FileListVo {
    userId: string;
    userName: string;
    files?: [FileItem];
  }

const columns = [
  { name: "名称", uid: "name" },
  { name: "类型", uid: "type" },
  { name: "大小", uid: "size" },
  { name: "修改时间", uid: "modified" },
  { name: "操作", uid: "actions" },
];

const fileTypeMap: Record<string, string> = {
  pdf: "PDF文档",
  doc: "Word文档",
  docx: "Word文档",
  xls: "Excel文档",
  xlsx: "Excel文档",
  ppt: "PPT文档",
  pptx: "PPT文档",
  jpg: "图片",
  jpeg: "图片",
  png: "图片",
  gif: "图片",
  mp4: "视频",
  mov: "视频",
  mp3: "音频",
  zip: "压缩文件",
  rar: "压缩文件",
  default: "文件",
};

const getFileType = (fileName: string) => {
  const ext = fileName.split(".").pop()?.toLowerCase() || "";
  return fileTypeMap[ext] || fileTypeMap.default;
};
interface FileTableProps {
    isList: boolean;
    currentId?: string;
  }
  export default function FileTable({ isList, currentId }: FileTableProps) {
  const [files, setFiles] = useState<FileItem[]>([]);
  const router = useRouter();

  useEffect(() => {
    const fetchFiles = async () => {
      if (!currentId) {
        toast.error("请先登录");
        router.push("/login");
        return;
      }
      try {
        const response: BaseResponse<FileListVo> = await queryFileListAction(currentId);
        setFiles(response.data?.files || []);
      } catch (error) {
        toast.error("获取文件列表失败");
        console.error(error);
      }
    };
    fetchFiles();
  }, [currentId, router]);

  const handleDownload = async (file: FileItem) => {
    if (!currentId) {
        toast.error("请先登录");
        router.push("/login");
        return;
      }
    try {
      const data : CreateTemporaryUrlRequest = {
        fileName: file.fileName,
        userId: currentId,
        expiresIn: 7,
        isPrivate: '0'
      };
      const response = await createTemporaryUrlAction(data);
      debugger
      if (response.data) {
        window.open(response.data, "_blank");
      } else {
        console.error("No download URL returned");
      }
    } catch (error) {
      console.error("Download failed:", error);
    }
  };

  const handleDelete = async (file: FileItem) => {
    if (!currentId) {
        toast.error("请先登录");
        router.push("/login");
        return;
      }
    try {
      const data : DeleteFileRequest = {
        fileName: file.fileName,
        userId: currentId,
        path: file.filePath,
        private: true
      };

      const res : BaseResponse<boolean>=await deleteFileAction(data);
      if (res.data) {
        toast.success("删除成功");
        
      setFiles((prev) => prev.filter((fileprev) => fileprev.etag !== file.etag));
      } else {
        toast.error("删除失败");
      }
    } catch (error) {
      console.error("Delete failed:", error);
    }
  };

  const renderCell = (file: FileItem, columnKey: React.Key) => {
    switch (columnKey) {
      case "name":
        return (
          <div className="flex items-center gap-2">
            <Image
              alt="file icon"
              className="w-6 h-6"
             src={`/icons/${(file.fileType ?? "file").split(" ")[0].toLowerCase()}.png`}
            />
            <span>{file.fileName}</span>
          </div>
        );
      case "type":
        return <Chip variant="flat">{file.fileType}</Chip>;
      case "size":
        return <span>{file.fileSize}</span>;
      case "modified":
        return <span>{file.lastModified}</span>;
      case "actions":
        return (
          <div className="flex gap-2">
            <Tooltip content="下载">
              <Button
                isIconOnly
                size="sm"
                variant="light"
                onPress={() => handleDownload(file)}
              >
                <Download size={16} />
              </Button>
            </Tooltip>
            <Tooltip content="删除" color="danger">
              <Button
                isIconOnly
                size="sm"
                variant="light"
                color="danger"
                onPress={() => handleDelete(file)}
              >
                <Trash2 size={16} />
              </Button>
            </Tooltip>
          </div>
        );
      default:
        return String(file[columnKey as keyof FileItem] ?? "");
    }
  };

  if (!isList) {
    // Grid 卡片视图
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {files.map((file) => (
          <Card key={file.etag} className="max-w-[240px]">
            <CardBody className="flex flex-col items-center justify-center p-4">
              <Image
                alt="file icon"
                className="w-16 h-16"
                src={`/icons/${(file.fileType ?? "file").split(" ")[0].toLowerCase()}.png`}
              />
              <p className="text-sm font-medium mt-2 text-center truncate w-full">
                {file.fileName}
              </p>
            </CardBody>
            <Divider />
            <CardFooter className="flex justify-between">
              <Tooltip content="下载">
                <Button
                  isIconOnly
                  size="sm"
                  variant="light"
                  onPress={() => handleDownload(file)}
                >
                  <Download size={16} />
                </Button>
              </Tooltip>
              <Tooltip content="删除" color="danger">
                <Button
                  isIconOnly
                  size="sm"
                  variant="light"
                  color="danger"
                  onPress={() => handleDelete(file)}
                >
                  <Trash2 size={16} />
                </Button>
              </Tooltip>
            </CardFooter>
          </Card>
        ))}
      </div>
    );
  }

  // List 表格视图
  return (
    <Table aria-label="文件列表">
      <TableHeader columns={columns}>
        {(column) => (
          <TableColumn
            key={column.uid}
            align={column.uid === "actions" ? "center" : "start"}
          >
            {column.name}
          </TableColumn>
        )}
      </TableHeader>
      <TableBody items={files}>
        {(item) => (
          <TableRow key={item.etag}>
            {(columnKey) => <TableCell>{renderCell(item, columnKey)}</TableCell>}
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}