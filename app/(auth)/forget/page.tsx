"use client";

import { Input } from "@nextui-org/input";
import { Button } from "@nextui-org/button";
import React, { useCallback, useState } from "react";
// @ts-ignore
import { useRouter } from "next/navigation";
import { Card } from "@nextui-org/card";
import { Spacer } from "@nextui-org/spacer";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";

import { title } from "@/components/primitives";
import { ThemeSwitch } from "@/components/home/theme-switch";
import { siteConfig } from "@/config/site";
import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import {
  checkUserIfExistAction,
  checkUserVerificationCodeAction,
  resetPasswordAction,
  sendCodeAction,
} from "@/app/(auth)/forget/action";
import { BaseResponse } from "@/types";
import {
  ResetPasswordRequestType,
  SendCodeRequestType,
  VerificationCodeRequestType,
  VerificationCodeResponseType,
} from "@/types/auth/forget";
import { validatePassword } from "@/utils/tools";
import {
  ACCOUNT_NOT_EMPTY,
  ACCOUNT_NOT_EMPTY_RETURN,
  ACCOUNT_NOT_EXIST,
  CAPTCHA_CODE_SEND_FAILURE,
  PASSWORD_NOT_EQUALS,
  PASSWORD_NOT_VALID,
  RESET_PASSWORD_FAILURE,
  RESET_PASSWORD_SUCCESS,
  TEMPORARY_CODE_NOT_VALID,
} from "@/app/(auth)/forget/common";

interface NextType {
  canNext: boolean;
  message: string;
}

export default function LoginPage() {
  const router = useRouter();

  // 用户输入的账号
  const [account, setAccount] = useState<string>("");

  // 发送验证码按钮，是否被禁用
  const [isDisabled, setIsDisabled] = useState(false);

  const [isLoading, setIsLoading] = useState<boolean>(false);

  // 验证码倒数时间
  const [countdown, setCountdown] = useState(60);

  // 用户输入的验证码
  const [captchaCode, setCaptchaCode] = useState<string>("");

  // carousel 对应 api，用于切换下一步
  const [api, setApi] = React.useState<CarouselApi>();

  // 用户输入的密码
  const [password, setPassword] = useState<string>("");

  // 用户重复输入的密码
  const [newPassword, setNewPassword] = useState<string>("");

  // 验证码校验过后的临时通行码
  const [temporaryCode, setTemporaryCode] = useState<number>(0);

  /**
   * 发送验证码
   */
  const handleButtonClick = async () => {
    setIsLoading(true);
    let accountIsExist = false;

    if (account) {
      await checkUserIfExistAction(account).then(
        (res: BaseResponse<boolean>) => {
          if (res.data) {
            accountIsExist = true;
          }
        },
      );
      if (accountIsExist) {
        // 账号存在
        // 识别账号是否是邮箱
        const sendCodeRequest: SendCodeRequestType = account.includes("@")
          ? {
              isRegister: 1,
              emailNumber: account,
              captchaType: "email",
            }
          : {
              isRegister: 1,
              phoneNumber: account,
              captchaType: "phone",
            };

        await sendCodeAction(sendCodeRequest).then((res: BaseResponse<any>) => {
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
        });
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

  /**
   * 点击下一步
   */
  const toNext = useCallback(
    (next: NextType) => {
      if (api && next.canNext) {
        api.scrollNext();
      } else {
        toast.error(next.message);
      }
    },
    [api],
  );

  /**
   * 点击上一步
   */
  const toPre = useCallback(() => {
    if (api) {
      api.scrollPrev();
    }
  }, [api]);

  /**
   * 修改密码实现
   */
  async function clickToForgetPassword() {
    //1. 确认两次输入密码是否相同
    if (password !== newPassword) {
      toast.error(PASSWORD_NOT_EQUALS);

      return;
    }
    //2. 判断密码逻辑（大小写+数字+特殊字符 +8位以上）
    if (!validatePassword(password)) {
      toast.error(PASSWORD_NOT_VALID);

      return;
    }
    //3. 判断用户输入的 account 是否为空
    if (!account) {
      toast.error(ACCOUNT_NOT_EMPTY_RETURN);
    }
    //4. 判断临时通行码是否为默认值（0）是的话，让用户重新获取验证码
    if (temporaryCode === 0) {
      toast.error(TEMPORARY_CODE_NOT_VALID);

      return;
    }
    //5. 发送请求，重置密码
    const resetPasswordRequest: ResetPasswordRequestType = account.includes("@")
      ? {
          emailNumber: account,
          temporaryCode: temporaryCode,
          newPassword: newPassword,
        }
      : {
          phoneNumber: account,
          temporaryCode: temporaryCode,
          newPassword: newPassword,
        };

    await resetPasswordAction(resetPasswordRequest).then(
      (res: BaseResponse<any>) => {
        if (res.success) {
          toast.success(RESET_PASSWORD_SUCCESS);
          toLoginPage();
        } else {
          toast.error(RESET_PASSWORD_FAILURE);
        }
      },
    );
  }

  /**
   * 返回登录页
   */
  function toLoginPage() {
    router.push(siteConfig.innerLinks.login);
  }

  const stepArray: React.JSX.Element[] = [
    <div key={0} className={"mt-7 flex flex-col"}>
      <Input
        autoComplete="account"
        label="请输入绑定的邮箱或手机号"
        type="text"
        value={account}
        onValueChange={(value) => setAccount(value)}
      />
      <Spacer y={3} />
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
      <div className={"w-full justify-center flex mt-3"}>
        <Button
          className={""}
          color={"primary"}
          onPress={async () => {
            // 校验验证码是否正确
            const verificationCodeRequest: VerificationCodeRequestType =
              account.includes("@")
                ? {
                    emailNumber: account,
                    code: captchaCode,
                  }
                : {
                    phoneNumber: account,
                    code: captchaCode,
                  };

            await checkUserVerificationCodeAction(verificationCodeRequest).then(
              (res: BaseResponse<VerificationCodeResponseType>) => {
                if (res.success && res.data?.passed && res.data.temporaryCode) {
                  setTemporaryCode(res.data.temporaryCode);
                  // 校验验证码通过，可以进入下一步
                  toNext({
                    canNext: true,
                    message: "",
                  });
                }
              },
            );
          }}
        >
          下一步
        </Button>
      </div>
    </div>,
    <div key={1} className={""}>
      <Input
        autoComplete="password"
        label="New Password"
        type="password"
        value={password}
        onValueChange={(value) => setPassword(value)}
      />
      <Input
        autoComplete="password"
        className={"mt-3"}
        label="Again Password"
        type="password"
        value={newPassword}
        onValueChange={(value) => setNewPassword(value)}
      />
      <div className={"w-full justify-center flex mt-3"}>
        <Button
          color="primary"
          variant="bordered"
          onPress={clickToForgetPassword}
        >
          修改密码
        </Button>
      </div>
    </div>,
  ];

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
