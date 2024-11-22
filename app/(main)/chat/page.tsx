import { Chip } from "@nextui-org/chip";

export default function ChatPage() {
  return (
    <div className={"w-full flex justify-center items-center"}>
      <Chip className={"bg-red-400 "}>请选择一个聊天对话开始聊天</Chip>
    </div>
  );
}
