"use client";

import * as React from "react";
import {
  BookOpen,
  Bot,
  Brain,
  Command,
  LayoutGrid,
  LifeBuoy,
  Map,
  PieChart,
  Send,
  Settings2,
  SquareTerminal,
} from "lucide-react";
import { ScrollShadow } from "@nextui-org/scroll-shadow";

import { NavMain } from "@/components/dashboard/nav-main";
import { NavProjects } from "@/components/dashboard/nav-projects";
import { NavSecondary } from "@/components/dashboard/nav-secondary";
import { NavUser } from "@/components/dashboard/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { siteConfig } from "@/config/site";
import { userInfoCookie } from "@/common/auth/constant";
import { getCookie } from "@/utils/cookies";

const userInfo = getCookie(userInfoCookie);

const data = {
  user: {
    name: "yanking",
    email: "67121851@qq.com",
    avatar:
      "https://blogback.yannqing.com/api/v2/objects/avatar/0vqxqul8pu2skmwokn.jpg",
  },
  navMain: [
    {
      title: "仪表板",
      url: "/dashboard/" + userInfo?.username,
      icon: LayoutGrid,
      isActive: true,
    },
    {
      title: "文章",
      url: "#",
      icon: SquareTerminal,
      isActive: false,
      items: [
        {
          title: "发布",
          url: "/dashboard/" + userInfo?.username + "/photoes",
        },
        {
          title: "管理",
          url: "#",
        },
      ],
    },
    {
      title: "互动",
      icon: Bot,
      isActive: false,
      items: [
        {
          title: "未读通知",
          url: "/dashboard/yannqing/home",
        },
        {
          title: "评论",
          url: "#",
        },
        {
          title: "成就",
          url: "#",
        },
      ],
    },
    {
      title: "其他",
      url: "#",
      icon: BookOpen,
      items: [
        {
          title: "文件导入",
          url: "#",
        },
        {
          title: "新活动",
          url: "#",
        },
        {
          title: "作品集",
          url: "#",
        },
        {
          title: "朋友们",
          url: "#",
        },
      ],
    },
    {
      title: "附加功能",
      url: "#",
      icon: Send,
      items: [
        {
          title: "订阅",
          url: "#",
        },
        {
          title: "配置函数",
          url: "#",
        },
        {
          title: "WebHooks",
          url: "#",
        },
        {
          title: "模板编辑",
          url: "#",
        },
      ],
    },
  ],
  navSecondary: [
    {
      title: "代币",
      url: "#",
      icon: LifeBuoy,
    },
    {
      title: "设置",
      url: "#",
      icon: Settings2,
    },
  ],
  projects: [
    {
      name: "AI",
      url: "#",
      icon: Brain,
    },
    {
      name: "应用商店",
      url: "#",
      icon: PieChart,
    },
    {
      name: "数据统计",
      url: "#",
      icon: Map,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild size="lg">
              <a href={siteConfig.innerLinks.about}>
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                  <Command className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">CNI-BBS</span>
                  <span className="truncate text-xs">Enterprise</span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <ScrollShadow hideScrollBar className="">
          <NavMain items={data.navMain} />
          <NavProjects projects={data.projects} />
          <NavSecondary className="mt-auto" items={data.navSecondary} />
        </ScrollShadow>
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  );
}
