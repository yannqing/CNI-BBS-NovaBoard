import { AUTH_URLS } from "./api";

export type SiteConfig = typeof siteConfig;

export const siteConfig = {
  name: "CNI-BBS",
  description: "Make beautiful websites regardless of your design experience.",
  navItems: [
    {
      label: "主页",
      href: "/home",
    },
    {
      label: "关于",
      href: "/about",
    },
    {
      label: "密聊",
      href: "/chat",
    },
    {
      label: "私云",
      href: "/privacy-cloud",
    },
  ],
  navMenuItems: [
    {
      label: "Profile",
      href: "/profile",
    },
    {
      label: "Dashboard",
      href: "/dashboard",
    },
    {
      label: "Projects",
      href: "/projects",
    },
    {
      label: "Team",
      href: "/team",
    },
    {
      label: "Calendar",
      href: "/calendar",
    },
    {
      label: "Settings",
      href: "/settings",
    },
    {
      label: "Help & Feedback",
      href: "/help-feedback",
    },
    {
      label: "Logout",
      href: "/logout",
    },
  ],
  links: {
    // OAuth 认证链接从统一配置获取
    wechat: AUTH_URLS.wechat,
    gitee: AUTH_URLS.gitee,
    google: AUTH_URLS.google,

    githubproject: "https://github.com/patricleehua/CNI-BBS-TitanCore"
  },
  innerLinks: {
    login: "/login",
    register: "/register",
    forgetPassword: "/forget",

    chat: "/chat",
    about: "/about",
    postMsg: "/mdx-page/",

    dashboard: "/dashboard",
  },
};
