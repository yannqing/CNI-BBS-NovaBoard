// @ts-ignore
import Cookies from "js-cookie";

import {
  cookieExpireWithRememberMe,
  cookieExpireWithoutRememberMe,
  userInfoCookie,
} from "@/common/auth/constant";
import { CustomError } from "@/types/error/Error";
import { UserInfo } from "@/types/auth/user";

/**
 * 设置 cookie
 * @param key 键
 * @param value 值
 * @param rememberMe 可选：记住我
 */
export function setCookie(key: string, value: string, rememberMe?: boolean) {
  Cookies.set(key, value, {
    expires: rememberMe
      ? cookieExpireWithRememberMe
      : cookieExpireWithoutRememberMe,
  });
}

/**
 * 获取 cookie
 * @param key 可选：键（没有则默认获取登录 cookie）
 */
export function getCookie(key?: string): UserInfo | null {
  let cookieStr: string;

  if (key) {
    cookieStr = Cookies.get(key);
  } else {
    cookieStr = Cookies.get(userInfoCookie);
  }
  let cookie = null;

  if (cookieStr) {
    // return cookieStr;

    try {
      cookie = JSON.parse(cookieStr);
    } catch (error) {
      throw new CustomError("cookie 解析错误", 500);
    }

    return cookie;
  }

  return cookie;
}

/**
 * 删除 cookie
 * @param key 可选：键（没有则默认获取登录 cookie）
 */
export function removeCookie(key?: string) {
  Cookies.remove("token");

  return Cookies.remove(key ? key : userInfoCookie);
}
