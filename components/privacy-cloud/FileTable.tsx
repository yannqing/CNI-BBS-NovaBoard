"use client";

import React, { useEffect, useState } from "react";
import { useDisclosure } from "@nextui-org/react";
import ShareModal from "./ShareModal";
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
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem
} from "@nextui-org/react";
import { Download, Trash2, Info, Filter } from "lucide-react";
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
  { name: "文件路径", uid: "path" },
  { name: "ETAG", uid: "etag" },
  { name: "存储类型", uid: "storagetype" },
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

const formatFileSize = (bytes: string) => {
  if (!bytes) return '0 B';
  const size = parseInt(bytes);
  if (size < 1024) return `${size} B`;
  if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`;
  if (size < 1024 * 1024 * 1024) return `${(size / (1024 * 1024)).toFixed(1)} MB`;
  return `${(size / (1024 * 1024 * 1024)).toFixed(1)} GB`;
};

const formatDate = (dateStr: string) => {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  return date.toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  });
};

const getFileType = (fileName: string) => {
  const ext = fileName.split(".").pop()?.toLowerCase() || "";
  return fileTypeMap[ext] || fileTypeMap.default;
};

interface FileTableProps {
  isList: boolean;
  currentId?: string;
  key?: number;
}

export default function FileTable({ isList, currentId }: FileTableProps) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [selectedFile, setSelectedFile] = useState<FileItem | null>(null);
  const [files, setFiles] = useState<FileItem[]>([]);
  const [filteredFiles, setFilteredFiles] = useState<FileItem[]>([]);
  const [filterType, setFilterType] = useState<string | null>(null);
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
        const fetchedFiles = response.data?.files || [];
        setFiles(fetchedFiles);
        setFilteredFiles(fetchedFiles);
      } catch (error) {
        toast.error("获取文件列表失败");
        console.error(error);
      }
    };
    fetchFiles();
  }, [currentId, router]);

  const applyFilters = () => {
    let result = [...files];
    
    if (filterType) {
      result = result.filter(file => getFileType(file.fileName ?? '') === filterType);
    }

    setFilteredFiles(result);
  };

  useEffect(() => {
    applyFilters();
  }, [filterType, files]);

  const handleDownload = (file: FileItem) => {
    if (!currentId) {
      toast.error("请先登录");
      router.push("/login");
      return;
    }
    setSelectedFile(file);
    onOpen();
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
        setFilteredFiles((prev) => prev.filter((fileprev) => fileprev.etag !== file.etag));
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
        return <Chip variant="flat">{getFileType(file.fileName ?? '')}</Chip>;
      case "size":
        return <span>{formatFileSize(file.fileSize ?? '0')}</span>;
      case "modified":
        return <span>{formatDate(file.lastModified ?? '')}</span>;
      case "path":
        return <span className="truncate max-w-[200px]">{file.filePath}</span>;
      case "etag":
        return <span className="truncate max-w-[100px]">{file.etag}</span>;
      case "storagetype":
        return <span>{file.storageClass}</span>;
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

  const renderFilterButtons = () => (
    <div className="flex gap-2 mb-4">
      <Dropdown>
        <DropdownTrigger>
          <Button variant="bordered" startContent={<Filter size={16} />}>
            类型筛选
          </Button>
        </DropdownTrigger>
        <DropdownMenu 
          aria-label="类型筛选"
          onAction={(key) => setFilterType(key === 'all' ? null : key as string)}
        >
          <DropdownItem key="all">全部</DropdownItem>
          <DropdownItem key="图片">图片</DropdownItem>
          <DropdownItem key="视频">视频</DropdownItem>
          <DropdownItem key="文档">文档</DropdownItem>
          <DropdownItem key="压缩文件">压缩文件</DropdownItem>
        </DropdownMenu>
      </Dropdown>
    </div>
  );

  if (!isList) {
  return (
    <>
      {selectedFile && (
        <ShareModal
          isOpen={isOpen}
          onOpenChange={onOpenChange}
          fileName={selectedFile.fileName || ""}
          userId={currentId || ""}
        />
      )}
        {renderFilterButtons()}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredFiles.map((file) => (
            <Card key={file.etag} className="max-w-[240px]">
              <CardBody className="flex flex-col items-center justify-center p-4">
                {file.fileType?.includes("图片") || file.fileType?.includes("视频") ? (
                  <Image
                    alt="file preview"
                    className="w-full h-32 object-contain"
                    src={file.filePath}
                  />
                ) : (
                  <Image
                    alt="file icon"
                    className="w-16 h-16"
                    src={`/icons/${(file.fileType ?? "file").split(" ")[0].toLowerCase()}.png`}
                  />
                )}
                <p className="text-sm font-medium mt-2 text-center truncate w-full">
                  {file.fileName}
                </p>
              </CardBody>
              <Divider />
              <CardFooter className="flex justify-between items-center">
                <Tooltip 
                  content={
                    <div className="p-2">
                      <p>文件名: {file.fileName}</p>
                      <p>类型: {getFileType(file.fileName ?? '')}</p>
                      <p>大小: {formatFileSize(file.fileSize ?? '0')}</p>
                      <p>修改时间: {formatDate(file.lastModified ?? '')}</p>
                      <p>文件路径: {file.filePath}</p>
                      <p>ETAG: {file.etag}</p>
                      <p>存储类型: {file.storageClass}</p>
                    </div>
                  }
                >
                  <Button isIconOnly size="sm" variant="light">
                    <Info size={16} />
                  </Button>
                </Tooltip>
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
      </>
    );
  }

  return (
    <>
      {selectedFile && (
        <ShareModal
          isOpen={isOpen}
          onOpenChange={onOpenChange}
          fileName={selectedFile.fileName || ""}
          userId={currentId || ""}
        />
      )}
      {renderFilterButtons()}
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
        <TableBody items={filteredFiles}>
          {(item) => (
            <TableRow key={item.etag}>
              {(columnKey) => <TableCell>{renderCell(item, columnKey)}</TableCell>}
            </TableRow>
          )}
        </TableBody>
      </Table>
    </>
  );
}
