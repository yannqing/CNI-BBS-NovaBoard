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
    wechat: "http://us.shumei.gq:8999/auth/render/wechat_open",
    gitee: "http://us.shumei.gq:8999/auth/render/gitee",
    google: "http://us.shumei.gq:8999/auth/render/google",
    // wechat: "http://localhost:8080/auth/render/wechat_open",
    // gitee: "http://localhost:8080/auth/render/gitee",
    // google: "http://localhost:8080/auth/render/google",

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
