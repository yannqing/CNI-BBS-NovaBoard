"use client";

import { Input } from "@nextui-org/input";
import { Button } from "@nextui-org/button";
import React, { useCallback, useState } from "react";
// @ts-ignore
import { useRouter } from "next/navigation";
import { Card } from "@nextui-org/card";
import { Spacer } from "@nextui-org/spacer";
import { ArrowLeft } from "lucide-react";

import { title } from "@/components/primitives";
import { LoginVo } from "@/types/auth/login";
import { ThemeSwitch } from "@/components/home/theme-switch";
import { siteConfig } from "@/config/site";
import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";

export default function LoginPage() {
  const router = useRouter();

  /**
   * 请求参数
   */
  const [loginRequest, setLoginRequest] = useState<LoginVo>({
    username: "",
    password: "",
    loginType: "password",
    rememberMe: "0",
  });

  const [api, setApi] = React.useState<CarouselApi>();

  const toNext = useCallback(() => {
    if (api) {
      api.scrollNext();
    }
  }, [api]);

  const toPre = useCallback(() => {
    if (api) {
      api.scrollPrev();
    }
  }, [api]);

  /**
   * 忘记密码实现
   */
  function clickToForgetPassword() {}

  function toLoginPage() {
    router.push(siteConfig.innerLinks.login);
  }

  const stepArray: React.JSX.Element[] = [];

  const stepOne: React.JSX.Element = (
    <div className={"mt-7 flex flex-col"}>
      <Input
        autoComplete="account"
        label="请输入要找回密码的账号"
        type="text"
        value={loginRequest.username}
        onValueChange={(value) => {
          setLoginRequest({
            ...loginRequest,
            username: value,
          });
        }}
      />
      <div className={"w-full justify-center flex mt-3"}>
        <Button className={""} color={"primary"} onPress={toNext}>
          下一步
        </Button>
      </div>
    </div>
  );

  const stepTwo: React.JSX.Element = (
    <div className={""}>
      <Input
        autoComplete="phone"
        label="Phone"
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
        autoComplete="phone"
        className={"mt-3"}
        label="email"
        type="text"
        value={loginRequest.username}
        onValueChange={(value) => {
          setLoginRequest({
            ...loginRequest,
            username: value,
          });
        }}
      />
      <div className={"w-full justify-center flex mt-3 gap-3"}>
        <Button className={""} color={"primary"} onPress={toPre}>
          上一步
        </Button>
        <Button className={""} color={"primary"} onPress={toNext}>
          下一步
        </Button>
      </div>
    </div>
  );

  const stepThree: React.JSX.Element = (
    <div className={"mt-7"}>
      <Input
        autoComplete="code"
        label="请输入验证码"
        type="text"
        value={loginRequest.username}
        onValueChange={(value) => {
          setLoginRequest({
            ...loginRequest,
            username: value,
          });
        }}
      />
      <div className={"w-full justify-center flex mt-3 gap-3"}>
        <Button className={""} color={"primary"} onPress={toPre}>
          上一步
        </Button>
        <Button className={""} color={"primary"} onPress={toNext}>
          下一步
        </Button>
      </div>
    </div>
  );

  const stepFour: React.JSX.Element = (
    <div className={""}>
      <Input
        autoComplete="password"
        label="New Password"
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
        autoComplete="password"
        className={"mt-3"}
        label="Again Password"
        type="text"
        value={loginRequest.username}
        onValueChange={(value) => {
          setLoginRequest({
            ...loginRequest,
            username: value,
          });
        }}
      />
      <div className={"w-full justify-center flex mt-3"}>
        <Button
          color="primary"
          variant="bordered"
          onPress={clickToForgetPassword}
        >
          ok
        </Button>
      </div>
    </div>
  );

  stepArray.push(stepOne);
  stepArray.push(stepTwo);
  stepArray.push(stepThree);
  stepArray.push(stepFour);

  return (
    <Card isBlurred className={"bg-transparent"}>
      <div className="flex flex-row gap-5 m-5">
        <div className="">
          <div>
            <h1 className={title()}>Forget Password</h1>
            <div className="max-w-96 mb-5 mt-5">
              To Keep connected with up please login with your personal
              information by email address and password
            </div>
          </div>
          <Carousel className="w-full max-w-xs ml-8" setApi={setApi}>
            <CarouselContent>
              {stepArray.map((step, index) => (
                <CarouselItem
                  key={index}
                  className={"items-center justify-center"}
                >
                  {step}
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
          <div className={"mt-3 flex flex-row"}>
            <Button color="primary" variant="light" onPress={toLoginPage}>
              <ArrowLeft /> Return Login
            </Button>
            <Spacer x={3} />
            <ThemeSwitch />
          </div>
        </div>
      </div>
    </Card>
  );
}
