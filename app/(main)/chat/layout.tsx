import { Provider } from "@radix-ui/react-tooltip";

import { ChatProvider } from "./ChatContext";

import SidBar from "@/components/chat/sidbar";

export default function ChatLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-4 h-full">
      <div className="flex-row flex w-full h-full">
        <ChatProvider>
          <Provider>
            <SidBar />
            <div className="hidden md:flex w-5/6 h-full">{children}</div>
          </Provider>
        </ChatProvider>
      </div>
    </div>
  );
}
