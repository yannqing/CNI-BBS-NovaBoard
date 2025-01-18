"use client";

import { Input } from "@nextui-org/input";
import { Button } from "@nextui-org/button";
import React, { useState } from "react";
import { toast } from "sonner";
// @ts-ignore
import { useRouter, useSearchParams } from "next/navigation";
import { Card, CardBody } from "@nextui-org/card";
import { Tab, Tabs } from "@nextui-org/tabs";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@nextui-org/modal";
import { EyeFilledIcon, EyeSlashFilledIcon } from "@nextui-org/shared-icons";

import { siteConfig } from "@/config/site";
import { loginAction } from "@/app/(auth)/login/action";
import { BaseResponse } from "@/types";
import { useGetUserContext } from "@/app/UserContext";
import { userInfoCookie } from "@/common/auth/constant";
import { LoginDTO, LoginVo } from "@/types/auth/login";
import { title } from "@/components/primitives";
import { checkUserIfExistAction, sendCodeAction } from "@/app/(auth)/forget/action";
import {
  ACCOUNT_NOT_EMPTY,
  ACCOUNT_NOT_EXIST,
  CAPTCHA_CODE_SEND_FAILURE,
} from "@/app/(auth)/forget/common";
import { SocialUserBindLocalUserRequestType } from "@/types/auth/social";

export default function BindPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const passcode = searchParams.get("passcode");
  const socialUserId = searchParams.get("socialUserId");

  const [accountPhone, setAccountPhone] = useState<string>("");

  const [isOpen, setIsOpen] = useState<boolean>(true);

  // 发送验证码按钮，是否被禁用
  const [isDisabled, setIsDisabled] = useState(false);

  const [isLoading, setIsLoading] = useState<boolean>(false);

  // 验证码倒数时间
  const [countdown, setCountdown] = useState(60);

  // 用户输入的验证码
  const [captchaCode, setCaptchaCode] = useState<string>("");

  const [isVisible, setIsVisible] = React.useState(false);

  const toggleVisibility = () => setIsVisible(!isVisible);

  const { updateCookie } = useGetUserContext();

  const [selected, setSelected] = React.useState("login");

  const [loginRequest, setLoginRequest] = useState<LoginVo>({
    username: "",
    password: "",
    loginType: "password",
    rememberMe: "0",
  });

  /**
   * 发送验证码
   */
  const handleButtonClick = async () => {
    setIsLoading(true);
    let accountIsExist = false;

    if (accountPhone) {
      await checkUserIfExistAction(accountPhone).then(
        (res: BaseResponse<boolean>) => {
          console.log("checkUserIfExistAction result:", res)
          if (res.data) {
            accountIsExist = true;
          }
        },
      );
      if (accountIsExist) {
        // 账号存在
        // 识别账号是否是邮箱
        const socialUserBindLocalUserRequestType: SocialUserBindLocalUserRequestType =
          accountPhone.includes("@")
            ? {
                emailNumber: accountPhone,
                temporaryCode: passcode || undefined,
                socialUserId: socialUserId || undefined,
                hasLocalUser: true,
              }
            : {
                phoneNumber: accountPhone,
                temporaryCode: passcode || undefined,
                socialUserId: socialUserId || undefined,
                hasLocalUser: true,
              };

        await sendCodeAction(socialUserBindLocalUserRequestType).then(
          (res: BaseResponse<any>) => {
            if (res.data) {
              // 验证码发送成功
              setIsLoading(false);
              setIsDisabled(true);
              setCountdown(60);

              const interval = setInterval(() => {
                setCountdown((prev) => {
                  if (prev <= 1) {
                    clearInterval(interval);
                    setIsDisabled(false);

                    return 0;
                  }

                  return prev - 1;
                });
              }, 1000);
            } else {
              // 验证码发送失败
              toast.error(CAPTCHA_CODE_SEND_FAILURE);
              setIsLoading(false);
            }
          },
        );
      } else {
        // 账号不存在
        toast.error(ACCOUNT_NOT_EXIST);
        setIsLoading(false);
      }
    } else {
      // 账号不能为空
      toast.error(ACCOUNT_NOT_EMPTY);
      setIsLoading(false);
    }
  };

  async function clickToLogin() {
    console.log("loginRequest", loginRequest);
    loginAction(loginRequest).then((res: BaseResponse<LoginDTO>) => {
      if (res.success === true) {
        // 判断后端返回数据是否有错
        if (res.data) {
          toast.success("login success");
          router.push("/");
          console.log("login result", res);
          updateCookie(userInfoCookie, JSON.stringify(res.data), false);
        } else {
          toast.error("服务器异常，请重试！");
        }
      } else {
        toast.error("登录失败，请重试");
      }
    });
  }

  function toRegisterPage() {
    router.push(siteConfig.innerLinks.register);
  }

  return (
    <Card isBlurred className="bg-transparent w-[340px]">
      <CardBody className="overflow-hidden">
        <div>
          <h1 className={title()}>绑定用户</h1>
        </div>
        <Tabs
          fullWidth
          aria-label="Tabs form"
          className={"mt-4"}
          selectedKey={selected}
          size="md"
          onSelectionChange={(value) => {
            // @ts-ignore
            setSelected(value);
          }}
        >
          <Tab key="login" title="手机号/邮箱">
            <form className="flex flex-col gap-4">
              <Input
                autoComplete="account"
                label="请输入要绑定的邮箱或手机号"
                type="text"
                value={accountPhone}
                onValueChange={(value) => setAccountPhone(value)}
              />
              <Input
                autoComplete="account"
                endContent={
                  <Button
                    isDisabled={isDisabled}
                    isLoading={isLoading}
                    onPress={handleButtonClick}
                  >
                    {isDisabled ? `${countdown}s` : "获取验证码"}
                  </Button>
                }
                label="请输入验证码"
                type="text"
                value={captchaCode}
                onValueChange={(value) => setCaptchaCode(value)}
              />
              <div className="flex gap-2 justify-end">
                <Button fullWidth color="primary">
                  进入
                </Button>
              </div>
            </form>
          </Tab>
          <Tab key="sign-up" title="账号密码">
            <form className="flex flex-col gap-4">
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
              <div className="flex gap-2 justify-end">
                <Button fullWidth color="primary">
                  进入
                </Button>
              </div>
            </form>
          </Tab>
        </Tabs>
        <div className={"flex gap-3"}>
          <Button
            onPress={() => {
              console.log("passcode", passcode);
              console.log("socialUserId", socialUserId);
            }}
          >
            test
          </Button>
          <Button
            className="capitalize"
            color="warning"
            variant="flat"
            onPress={() => setIsOpen(!isOpen)}
          >
            打开
          </Button>
        </div>
      </CardBody>
      <Modal backdrop={"blur"} hideCloseButton={true} isOpen={isOpen}>
        <ModalContent>
          <>
            <ModalHeader className="flex flex-col gap-1">首次登录</ModalHeader>
            <ModalBody>
              <p>接下来开始为您绑定系统个人信息</p>
              <p>如果已存在系统用户，那么将为您自动绑定</p>
            </ModalBody>
            <ModalFooter>
              <Button
                color="primary"
                onPress={() => {
                  setIsOpen(false);
                }}
              >
                确定
              </Button>
            </ModalFooter>
          </>
        </ModalContent>
      </Modal>
    </Card>
  );
}
