"use client";

import { Input } from "@nextui-org/input";
import { Link } from "@nextui-org/link";
import { Checkbox } from "@nextui-org/checkbox";
import { Button } from "@nextui-org/button";
import React, { useEffect, useState } from "react";
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

  async function clickToLogin() {
    fetchLoginData().then(() => {});
    console.log("loginRequest", loginRequest);
  }

  /**
   * 登录接口
   */
  const fetchLoginData = async () => {
    const res: BaseResponse<LoginDTO> = await loginAction(loginRequest);

    if (res.success === true) {
      // 判断后端返回数据是否有错
      if (res.data) {
        toast.success("login success");
        router.push("/");
        console.log("login result", res);
        updateCookie(userInfoCookie, JSON.stringify(res.data), false);
        localStorage.setItem("token", res.data.token);
      } else {
        toast.error("服务器异常，请重试！");
      }
    } else {
      toast.error("登录失败，请重试");
    }
  };

  function toRegisterPage() {
    router.push(siteConfig.innerLinks.register);
  }

  return (
    <Card isBlurred className={"bg-transparent"}>
      <div className="flex flex-row gap-5 m-5">
        <div className="">
          <div>
            <h1 className={title()}>Welcome</h1>
            <div className="max-w-80 mb-5 mt-5">
              To Keep connected with up please login with your personal
              information by email address and password
            </div>
          </div>
          <div className="flex max-w-[300px] flex-wrap gap-4">
            <form className="flex max-w-[300px] flex-wrap gap-4">
              <Input
                autoComplete="username"
                label="Username"
                type="text"
                value={loginRequest.username}
                onValueChange={(value) => {
                  setLoginRequest({
                    ...loginRequest,
                    username: value,
                  });
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
                label="Password"
                type={isVisible ? "text" : "password"}
                value={loginRequest.password}
                onValueChange={(value) => {
                  setLoginRequest({
                    ...loginRequest,
                    password: value,
                  });
                }}
              />
            </form>
            <Checkbox
              className="size-1/11"
              isSelected={loginRequest.rememberMe === "1"}
              onValueChange={(value) => {
                setLoginRequest({
                  ...loginRequest,
                  rememberMe: value ? "1" : "0",
                });
              }}
            >
              Remember Me
            </Checkbox>
            <Link
              className="size-1/11"
              href={siteConfig.innerLinks.forgetPassword}
            >
              Forget Password？
            </Link>
            <Button color="primary" onPress={clickToLogin}>
              Login
            </Button>
            <Button color="primary" variant="bordered" onPress={toRegisterPage}>
              Registry
            </Button>
            <ThemeSwitch />
          </div>
          <div className="flex-col mt-2">
            <div>Or you can login with</div>
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
              <Button
                onPress={() => {
                  console.log("passcode", passcode);
                  console.log("socialUserId", socialUserId);
                }}
              >
                test
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
