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
  "/user/getUserInfoByToken",
  "/common/open/**",
  "/tag/open/**",

  "/system/verif/gen/random",
  "/system/verif/check3",
];
