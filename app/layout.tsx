import "@/styles/globals.css";
import { Metadata, Viewport } from "next";
import clsx from "clsx";
import { Toaster } from "sonner";
import { Suspense } from "react";
import { Inter } from "next/font/google";

import { Providers } from "./(main)/providers";

import { siteConfig } from "@/config/site";
import { fontSans } from "@/config/fonts";
import { UserProvider } from "@/app/UserContext";
import { ChatProvider } from "./(main)/chat/ChatContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s - ${siteConfig.name}`,
  },
  description: siteConfig.description,
  icons: {
    icon: "/favicon.ico",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
};

// 创建一个加载组件
const LoadingComponent = () => {
  return <div>加载中。。。</div>;
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html suppressHydrationWarning lang="en">
      <head />
      <body
        className={clsx(
          "min-h-screen bg-background font-sans antialiased",
          fontSans.variable,
          inter.className,
        )}
      >
        <Suspense fallback={<LoadingComponent />}>
          <UserProvider>
            <ChatProvider>
              <Providers themeProps={{ attribute: "class", defaultTheme: "dark" }}>
                <div className="relative flex flex-col h-screen">
                  <Toaster richColors position="top-center" />
                  <main className="container mx-auto max-w-7xl flex-grow">
                    {children}
                  </main>
                </div>
              </Providers>
            </ChatProvider>
          </UserProvider>
        </Suspense>
      </body>
    </html>
  );
}
