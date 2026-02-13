/**
 * 统一的 API 配置管理
 * 所有后端 API 地址、WebSocket 地址都在这里集中管理
 */

// 从环境变量获取后端地址，fallback 到默认值
const DEFAULT_BACKEND_URL = "http://localhost:8080";
const DEFAULT_WEBSOCKET_URL = "ws://localhost:9100";

// 服务端使用的后端地址（Server Component / API Routes）
export const BACKEND_URL = process.env.BackEndUrl || DEFAULT_BACKEND_URL;

// 客户端使用的后端地址（Client Component）
export const CLIENT_BACKEND_URL = process.env.NEXT_PUBLIC_BackEndUrl || DEFAULT_BACKEND_URL;

// WebSocket 地址
export const WEBSOCKET_URL = process.env.NEXT_PUBLIC_BACKEND_WEBSOCKET_URL || DEFAULT_WEBSOCKET_URL;

/**
 * API 路径配置
 * 注意：客户端请求应该使用 API_PREFIX 前缀，通过 Next.js rewrites 代理到后端
 */
export const API_PREFIX = "/api";

/**
 * 获取完整的 API URL
 * @param path - API 路径（如：/user/info）
 * @param useProxy - 是否使用 Next.js 代理（客户端建议使用）
 * @returns 完整的 API URL
 */
export function getApiUrl(path: string, useProxy: boolean = true): string {
  // 确保 path 以 / 开头
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;

  if (useProxy) {
    // 使用 Next.js 代理，避免跨域问题
    return `${API_PREFIX}${normalizedPath}`;
  }

  // 直接请求后端（仅用于服务端或特殊场景）
  return `${CLIENT_BACKEND_URL}${normalizedPath}`;
}

/**
 * OAuth 认证地址配置
 */
export const AUTH_URLS = {
  wechat: `${CLIENT_BACKEND_URL}/auth/render/wechat_open`,
  gitee: `${CLIENT_BACKEND_URL}/auth/render/gitee`,
  google: `${CLIENT_BACKEND_URL}/auth/render/google`,
};

/**
 * 导出配置对象（用于兼容旧代码）
 */
export const apiConfig = {
  backendUrl: BACKEND_URL,
  clientBackendUrl: CLIENT_BACKEND_URL,
  websocketUrl: WEBSOCKET_URL,
  apiPrefix: API_PREFIX,
  authUrls: AUTH_URLS,
  getApiUrl,
};

export default apiConfig;
