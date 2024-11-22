"use client";
// eslint-disable-next-line import/order
import { createContext, useContext, useEffect, useState } from "react";

import { getCookie, removeCookie, setCookie } from "@/utils/cookies";

interface UserProvider {
  isCookiePresent: Boolean;
  updateCookie: (key: string, value: string, rememberMe: boolean) => void;
  deleteCookie: (key?: string) => void;
}

export const UserContext = createContext<UserProvider | undefined>(undefined);

export const useGetUserContext = () => {
  const userContext = useContext(UserContext);

  if (userContext === undefined) {
    throw new Error("user context undefined!");
  }

  return userContext;
};

export function UserProvider({ children }: { children: React.ReactNode }) {
  // cookie 全局状态
  const [isCookiePresent, setIsCookiePresent] = useState(false);

  // 判断 cookie 是否存在，并修改 cookie 全局状态
  const checkCookie = () => {
    const cookieExists = getCookie() !== null;

    setIsCookiePresent(cookieExists);
  };

  const updateCookie = (key: string, value: string, rememberMe: boolean) => {
    setCookie(key, value, rememberMe);
    checkCookie(); // 更新状态
  };

  const deleteCookie = (key?: string) => {
    removeCookie(key);
    checkCookie();
  };

  // 类似于 mounted
  useEffect(() => {
    checkCookie(); // 初始检查
  }, []);

  return (
    <UserContext.Provider
      value={{ isCookiePresent, updateCookie, deleteCookie }}
    >
      {children}
    </UserContext.Provider>
  );
}
