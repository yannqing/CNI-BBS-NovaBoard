"use client";

import { Input } from "@nextui-org/input";
import { Link } from "@nextui-org/link";
import { Checkbox } from "@nextui-org/checkbox";
import { Button } from "@nextui-org/button";
import React, { useState } from "react";
import { EyeFilledIcon, EyeSlashFilledIcon } from "@nextui-org/shared-icons";
import { toast } from "sonner";
// @ts-ignore
import { useRouter } from "next/navigation";

import LoginLayout from "@/app/auth/login/layout";
import { title } from "@/components/primitives";
import { DiscordIcon, GithubIcon, TwitterIcon } from "@/components/icons";
import { siteConfig } from "@/config/site";
import { registerAction } from "@/app/auth/login/action";
import { useGetUserContext } from "@/app/UserContext";
import { RegisterVo } from "@/types/auth/register";

export default function RegisterPage() {
  const router = useRouter();

  const [isVisible, setIsVisible] = React.useState(false);

  const toggleVisibility = () => setIsVisible(!isVisible);

  const { isCookiePresent, updateCookie, deleteCookie } = useGetUserContext();

  const [registerRequest, setLoginRequest] = useState<RegisterVo>({
    username: "",
    password: "",
    loginType: "password",
    rememberMe: "0",
  });

  async function clickToRegister() {
  }

  return (
    <LoginLayout>
      <div className="flex flex-row gap-5">
        <div className="animate__animated animate__lightSpeedInRight">
          <div>
            <h1 className={title()}>Welcome Register</h1>
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
                value={registerRequest.username}
                onValueChange={(value) => {
                  setLoginRequest({
                    ...registerRequest,
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
                value={registerRequest.password}
                onValueChange={(value) => {
                  setLoginRequest({
                    ...registerRequest,
                    password: value,
                  });
                }}
              />
            </form>
            <Checkbox className="size-1/11">Remember Me</Checkbox>
            <Link className="size-1/11" href="#">
              Forget Password？
            </Link>
            <Button color="primary" onPress={clickToRegister}>
              Login
            </Button>
            <Button color="primary" variant="bordered">
              Registry
            </Button>
            <div className="flex-col">
              <div>Or you can login with</div>
              <br />
              <div>
                <Link isExternal href={siteConfig.links.twitter}>
                  <TwitterIcon className="text-default-500" />
                </Link>
                <Link isExternal href={siteConfig.links.discord}>
                  <DiscordIcon className="text-default-500 ml-2" />
                </Link>
                <Link isExternal href={siteConfig.links.github}>
                  <GithubIcon className="text-default-500 ml-2" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </LoginLayout>
  );
}
