"use client";
// eslint-disable-next-line import/order
import { createContext, useContext, useEffect, useState, useCallback, useMemo } from "react";

import { getCookie, removeCookie, setCookie } from "@/utils/cookies";

// 用户上下文提供者
interface UserProvider {
  isCookiePresent: Boolean;
  updateCookie: (key: string, value: string, rememberMe: boolean) => void;
  deleteCookie: (key?: string) => void;
}

// 用户上下文
export const UserContext = createContext<UserProvider | undefined>(undefined);

// 获取用户上下文
export const useGetUserContext = () => {
  const userContext = useContext(UserContext);

  // 如果用户上下文未定义，则抛出错误
  if (userContext === undefined) {
    throw new Error("user context undefined!");
  }

  return userContext;
};

// 用户上下文提供者
export function UserProvider({ children }: { children: React.ReactNode }) {
  const [isCookiePresent, setIsCookiePresent] = useState(false);

  const checkCookie = useCallback(() => {
    const cookieExists = getCookie() !== null;
    if (cookieExists !== isCookiePresent) {
      setIsCookiePresent(cookieExists);
    }
  }, [isCookiePresent]);

  const updateCookie = useCallback((key: string, value: string, rememberMe: boolean) => {
    setCookie(key, value, rememberMe);
    setIsCookiePresent(true);
  }, []);

  const deleteCookie = useCallback((key?: string) => {
    removeCookie(key);
    setIsCookiePresent(false);
  }, []);

  useEffect(() => {
    checkCookie();
    
    const handleStorageChange = () => {
      checkCookie();
    };
    // 添加事件监听器（localStorage，sessionStorage）
    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [checkCookie]);

  const contextValue = useMemo(
    () => ({
      isCookiePresent,
      updateCookie,
      deleteCookie,
    }),
    [isCookiePresent, updateCookie, deleteCookie]
  );

  return (
    <UserContext.Provider value={contextValue}>
      {children}
    </UserContext.Provider>
  );
}
