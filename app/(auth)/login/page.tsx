"use client";

import { Input } from "@nextui-org/input";
import { Link } from "@nextui-org/link";
import { Checkbox } from "@nextui-org/checkbox";
import { Button } from "@nextui-org/button";
import React, { useEffect, useState, useCallback } from "react";
import { EyeFilledIcon, EyeSlashFilledIcon } from "@nextui-org/shared-icons";
import { toast } from "sonner";
// @ts-ignore
import { useRouter, useSearchParams } from "next/navigation";
import { Card } from "@nextui-org/card";

import { title } from "@/components/primitives";
import { siteConfig } from "@/config/site";
import { loginAction } from "@/app/(auth)/login/action";
import GoogleIcon from "@/public/logo/GoogleIcon.svg";
import WeChatIcon from "@/public/logo/WeChatIcon.svg";
import GiteeIcon from "@/public/logo/GiteeIcon.svg";
import { BaseResponse } from "@/types";
import { useGetUserContext } from "@/app/UserContext";
import { userInfoCookie } from "@/common/auth/constant";
import { LoginDTO, LoginVo } from "@/types/auth/login";
import { ThemeSwitch } from "@/components/home/theme-switch";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const passcode = searchParams.get("passcode");
  const socialUserId = searchParams.get("socialUserId");

  const [isVisible, setIsVisible] = React.useState(false);

  const toggleVisibility = () => setIsVisible(!isVisible);

  const { updateCookie } = useGetUserContext();

  const [loginRequest, setLoginRequest] = useState<LoginVo>({
    username: "",
    password: "",
    loginType: "password",
    rememberMe: "0",
  });

  useEffect(() => {
    const message = searchParams.get("message");

    if (message) {
      toast.error(message);
    }
  }, []);

  const fetchLoginData = async () => {
    try {
      const res: BaseResponse<LoginDTO> = await loginAction(loginRequest);

      if (res.success && res.data) {
        // 将所有状态更新和副作用放在一个 Promise 中处理，确保状态更新完成
        await new Promise<void>((resolve) => {
          // 先更新 localStorage
          localStorage.setItem("token", res.data?.token || "");
          // 更新 cookie
          updateCookie(userInfoCookie, JSON.stringify(res.data), false);
          // 确保状态更新完成
          resolve();
        });

        // 使用 requestAnimationFrame 确保在下一帧渲染前完成状态更新
        requestAnimationFrame(() => {
          toast.success("登录成功");
          router.push("/");
        });
      } else {
        toast.error(res.success ? "服务器异常，请重试！" : "登录失败，请重试");
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error("登录过程发生错误，请重试");
    }
  };

  // useCallback 对函数进行缓存(loginRequest 变化的时候重新缓存)
  const clickToLogin = useCallback(async () => {
    await fetchLoginData();
  }, [loginRequest]); // 添加依赖项

  function toRegisterPage() {
    router.push(siteConfig.innerLinks.register);
  }

  return (
    <Card isBlurred className={"bg-transparent"}>
      <div className="flex flex-row gap-5 m-5">
        <div className="">
          <div>
            <h1 className={title()}>欢迎</h1>
            <div className="max-w-80 mb-5 mt-5">
              为了保持联系，请使用电子邮件地址和密码登录您的个人信息
            </div>
          </div>
          <div className="flex max-w-[300px] flex-wrap gap-4">
            <form className="flex max-w-[300px] flex-wrap gap-4">
              <Input
                autoComplete="username"
                label="账户"
                type="text"
                value={loginRequest.username}
                onValueChange={(value) => {
                  setLoginRequest((prev) => ({
                    ...prev,
                    username: value,
                  }));
                }}
              />
              <Input
                autoComplete="current-password"
                endContent={
                  <button
                    aria-label="toggle password visibility"
                    className="focus:outline-none"
                    type="button"
                    onClick={toggleVisibility}
                  >
                    {isVisible ? (
                      <EyeSlashFilledIcon className="text-2xl text-default-400 pointer-events-none" />
                    ) : (
                      <EyeFilledIcon className="text-2xl text-default-400 pointer-events-none" />
                    )}
                  </button>
                }
                label="密码"
                type={isVisible ? "text" : "password"}
                value={loginRequest.password}
                onValueChange={(value) => {
                  setLoginRequest((prev) => ({
                    ...loginRequest,
                    password: value,
                  }));
                }}
              />
            </form>
            <Checkbox
              className="size-1/11"
              isSelected={loginRequest.rememberMe === "1"}
              onValueChange={(value) => {
                setLoginRequest((prev) => ({
                  ...loginRequest,
                  rememberMe: value ? "1" : "0",
                }));
              }}
            >
              记住我
            </Checkbox>
            <Link
              className="size-1/11"
              href={siteConfig.innerLinks.forgetPassword}
            >
              忘记密码？
            </Link>
            <Button color="primary" onPress={clickToLogin}>
              登入
            </Button>
            <Button color="primary" variant="bordered" onPress={toRegisterPage}>
              注册
            </Button>
            <ThemeSwitch />
          </div>
          <div className="flex-col mt-2">
            <div>第三方登入平台</div>
            <div className={"flex gap-3 mt-2"}>
              <Link href={siteConfig.links.google}>
                <GoogleIcon className="text-default-500" />
              </Link>
              <Link isExternal href={siteConfig.links.gitee}>
                <GiteeIcon className="text-default-500 w-[24px] h-[24px]" />
              </Link>
              <Link isExternal href={siteConfig.links.wechat}>
                <WeChatIcon className="w-[24px] h-[24px]" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
