export type SiteConfig = typeof siteConfig;

export const siteConfig = {
  name: "CNI-BBS",
  description: "Make beautiful websites regardless of your design experience.",
  navItems: [
    {
      label: "主页",
      href: "/",
    },
    {
      label: "关于",
      href: "/about",
    },
    {
      label: "密聊",
      href: "/chat",
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
    github: "https://github.com/nextui-org/nextui",
    twitter: "https://twitter.com/getnextui",
    docs: "https://nextui.org",
    discord: "https://discord.gg/9b6yyZKmH4",
    sponsor: "https://patreon.com/jrgarciadev",
  },
  innerLinks: {
    login: "/login",
    register: "/register",
    forgetPassword: "/forget",
    dashboard: "/dashboard/home",
    about: "/about",
  },
};
