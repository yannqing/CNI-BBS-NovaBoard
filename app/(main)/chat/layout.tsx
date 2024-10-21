import SidBar from "@/components/chat/sidbar";

export default function ChatLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-4 h-full">
      <div className="flex-row flex w-full h-full">
        <SidBar />
        <div className="hidden md:flex w-5/6 h-full">{children}</div>
      </div>
    </div>
  );
}
