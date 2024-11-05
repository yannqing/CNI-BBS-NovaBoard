"use client";

import { Input } from "@nextui-org/input";
import { Button } from "@nextui-org/button";
import React, { useState } from "react";
import { EyeFilledIcon, EyeSlashFilledIcon } from "@nextui-org/shared-icons";
// @ts-ignore
import { useRouter } from "next/navigation";
import { Card } from "@nextui-org/card";

import { title } from "@/components/primitives";
import { siteConfig } from "@/config/site";
import { useGetUserContext } from "@/app/UserContext";
import { LoginVo } from "@/types/auth/login";
import { ThemeSwitch } from "@/components/home/theme-switch";

export default function LoginPage() {
  const router = useRouter();

  const [isVisible, setIsVisible] = React.useState(false);

  const toggleVisibility = () => setIsVisible(!isVisible);

  const { updateCookie } = useGetUserContext();

  const [loginRequest, setLoginRequest] = useState<LoginVo>({
    username: "",
    password: "",
    loginType: "password",
    rememberMe: "0",
  });

  function toLoginPage() {
    router.push(siteConfig.innerLinks.login);
  }

  return (
    <Card isBlurred className={"bg-transparent"}>
      <div className="flex flex-row gap-5 m-5">
        <div className="">
          <div>
            <h1 className={title()}>Register</h1>
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
            <Button color="primary" onPress={toLoginPage}>
              Return Login
            </Button>
            <Button color="primary" variant="bordered">
              Registry
            </Button>
            <ThemeSwitch />
          </div>
        </div>
      </div>
    </Card>
  );
}
