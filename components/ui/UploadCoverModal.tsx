"use client"; // 仅在客户端组件中使用

import { useState, useEffect } from 'react';

export default function CoverUpload() {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  // 处理文件选择
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // 验证文件类型
    if (!file.type.startsWith('image/')) {
      alert('请选择图片文件');
      return;
    }

    setSelectedFile(file);

    // 创建对象URL用于预览
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);
  };

  // 组件卸载时释放对象URL
  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  return (
    <div className="space-y-4">
      {/* 文件上传输入 */}
      <label className="block">
        <span className="sr-only">选择封面图片</span>
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="block w-full text-sm text-gray-500
            file:mr-4 file:py-2 file:px-4
            file:rounded-full file:border-0
            file:text-sm file:font-semibold
            file:bg-blue-50 file:text-blue-700
            hover:file:bg-blue-100"
        />
      </label>

      {/* 预览区域 */}
      {previewUrl && (
        <div className="relative w-full h-64 border-2 border-dashed border-gray-200 rounded-lg overflow-hidden">
          <img
            src={previewUrl}
            alt="封面预览"
            className="w-full h-full object-cover"
            onLoad={() => URL.revokeObjectURL(previewUrl)} // 图片加载后释放对象URL
          />
        </div>
      )}
    </div>
  );
}