import type { Selection } from "@nextui-org/react";

import { useEffect } from "react";
import { Chip } from "@nextui-org/chip";
import { Select, SelectItem } from "@nextui-org/select";
import React from "react";

import { GetTagsResponse } from "@/types/post/tags";

// 通知父组件的回调函数
interface TagInputProps {
  onTagsChange: (tags: GetTagsResponse[]) => void;
  initialTags?: GetTagsResponse[];
}

// 接受一个 props 是函数类型的
const TagInput: React.FC<TagInputProps> = ({
  onTagsChange,
  initialTags = [],
}) => {
  const [values, setValues] = React.useState<Selection>(new Set([]));

  // 只在组件挂载时初始化 values
  useEffect(() => {
    const initialValues = new Set(initialTags.map((tag) => tag.id));

    setValues(initialValues);
  }, []); // 空依赖数组，只在挂载时执行

  // 当 values 变化时，通知父组件
  //   useEffect(() => {
  //     if (typeof values === "object" && values instanceof Set) {
  //       const selectedTags = Array.from(values).map(id => {
  //         return initialTags.find(tag => tag.id === id);
  //       }).filter((tag): tag is GetTagsResponse => tag !== undefined);

  //       onTagsChange(selectedTags);
  //     }
  //   }, [values, initialTags, onTagsChange]);

  const handleRemoveTag = (tagToRemove: string) => {
    if (typeof values === "object" && values instanceof Set) {
      const newValues = new Set(values);
      const tagToRemoveId = initialTags.find(
        (tag) => tag.tagName === tagToRemove,
      )?.id;

      if (tagToRemoveId) {
        newValues.delete(tagToRemoveId);
        setValues(newValues);
      }
    }
  };

  return (
    <div className="flex flex-col gap-2 w-1/2">
      <Select
        className="max-w-xs"
        label="选择标签"
        placeholder="请选择标签"
        selectedKeys={values}
        selectionMode="multiple"
        onSelectionChange={(value) => {
          setValues(value);
          const selectedTags = Array.from(value)
            .map((id) => initialTags.find((tag) => tag.id === id))
            .filter((tag): tag is GetTagsResponse => tag !== undefined);

          onTagsChange(selectedTags);
        }}
      >
        {initialTags.map((tag) => (
          <SelectItem key={tag.id}>{tag.tagName}</SelectItem>
        ))}
      </Select>
      <div className="flex flex-row flex-wrap gap-1">
        {Array.from(values).map((id) => {
          const tag = initialTags.find((t) => t.id === id);

          if (!tag) return null;

          return (
            <Chip key={tag.id} onClose={() => handleRemoveTag(tag.tagName)}>
              {tag.tagName}
            </Chip>
          );
        })}
      </div>
    </div>
  );
};

export default TagInput;
