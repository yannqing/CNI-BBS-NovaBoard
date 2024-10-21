import "@/styles/globals.css";
import { Metadata, Viewport } from "next";
import { Link } from "@nextui-org/link";
import clsx from "clsx";
import { Toaster } from "sonner";

import { Providers } from "./providers";

import { siteConfig } from "@/config/site";
import { fontSans } from "@/config/fonts";
import { Navbar } from "@/components/navbar";
import { UserProvider } from "@/app/UserContext";

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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex flex-col h-screen">
      <Toaster richColors position="top-center" />
      <UserProvider>
        <Navbar />
        <main className="container mx-auto max-w-7xl flex-grow">
          {children}
        </main>
      </UserProvider>
      <footer className="w-full flex flex-col items-center justify-center py-3">
        <div>
          Copyright © 2024. All rights reserved. Provided by：
          <Link
            isExternal
            className="gap-1 text-current"
            href="https://www.nradiowifi.com/"
            title="nextui.org homepage"
          >
            <span className={"text-primary"}>NRadio鲲鹏无限</span>
          </Link>
        </div>
        <div>
          备案号：
          <Link
            isExternal
            className="gap-1 text-current"
            href="ehttps://beian.miit.gov.cn/"
            title="nextui.org homepage"
          >
            <span className="text-primary">粤ICP备16055705号-7</span>
          </Link>
        </div>
      </footer>
    </div>
  );
}
