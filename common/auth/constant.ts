/**
 * 与后端约定好的 加密字符串
 */
export const keyOne = "eW1awsJiSLH7CGnmPGvBQZyPmACHTQYImNJPAu34fzs=";

/**
 * cookie 过期时间
 * - 记住我 7d
 * - 不记住我 1d
 */
export const cookieExpireWithRememberMe = 7;
export const cookieExpireWithoutRememberMe = 1;

/**
 * 用户信息的 cookie key 键，包含了 token
 */
export const userInfoCookie = "userInfo";

/**
 * 后端请求白名单（不需要登录可以访问的 api）
 */
export const whiteList = [
  "/category/open/**",
  "/post/open/**",
  "/user/open/**",
  "/common/open/**",

  "/system/verif/gen/random",
  "/system/verif/check3",
];

export const template =
  "### 页面\n" +
  "\n" +
  "#### 侧边栏\n" +
  "\n" +
  "> ps：使用 shadcn-ui 中的 sidebar\n" +
  "\n" +
  "步骤：\n" +
  "\n" +
  "1. 安装 shadcn `npm install shadcn`\n" +
  "2. 安装 shadcn-ui `npm install shadcn-ui`\n" +
  '3. 设置包管理器为 pnpm ：在 package.json 中添加 `"packageManager": "pnpm@9.12.2"`\n' +
  "4. 初始化 `pnpm dlx shadcn@latest init`\n" +
  "5. 使用 sidebar 组件 `pnpm dlx shadcn@latest add sidebar`";
