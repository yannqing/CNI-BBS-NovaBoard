"use client";
import { Link } from "@nextui-org/link";
import { useTheme } from "next-themes";

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { theme, setTheme } = useTheme();

  return (
    <div
      className={
        "w-full h-full dark:bg-[url('/login/DarkLoginBackground.jpg')] bg-[url('/login/SunLoginBackground.jpg')]"
      }
      style={{
        // backgroundImage: "url('/login/DarkLoginBackground.jpg')",
        // backgroundImage:
        //   theme === "light"
        //     ? "url('/login/SunLoginBackground.jpg')"
        //     : "url('/login/DarkLoginBackground.jpg')",
        backgroundSize: "cover", // 使背景图覆盖整个 div
        backgroundPosition: "center", // 使背景图居中
      }}
    >
      <div className="flex h-[90%] w-full items-center justify-center">
        {children}
      </div>
      <footer className="w-full flex flex-row items-center justify-center py-3 h-[10%]">
        <div>
          Copyright © 2024. All rights reserved. Provided by：
          <Link
            isExternal
            className="gap-1 text-current"
            href="https://www.nradiowifi.com/"
            title="nextui.org homepage"
          >
            <span className={"text-primary"}>NRadio鲲鹏无限.</span>
          </Link>
        </div>
        &nbsp; &nbsp;
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
