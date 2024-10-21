"use client";

import * as React from "react";
import {
  BookOpen,
  Bot,
  Command,
  Frame,
  LayoutGrid,
  LifeBuoy,
  Map,
  PieChart,
  Send,
  Settings2,
  SquareTerminal,
} from "lucide-react";

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
      url: "/dashboard/yannqing",
      icon: LayoutGrid,
      isActive: false,
    },
    {
      title: "发布",
      url: "#",
      icon: SquareTerminal,
      isActive: true,
      items: [
        {
          title: "文章",
          url: "/dashboard/yannqing/home",
        },
        {
          title: "页面",
          url: "#",
        },
        {
          title: "图文",
          url: "#",
        },
      ],
    },
    {
      title: "互动",
      url: "#",
      icon: Bot,
      items: [
        {
          title: "未读通知",
          url: "#",
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
      icon: Frame,
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
        <NavMain items={data.navMain} />
        <NavProjects projects={data.projects} />
        <NavSecondary className="mt-auto" items={data.navSecondary} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  );
}
