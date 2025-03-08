"use client";

import { Input } from "@nextui-org/input";
import { Button } from "@nextui-org/button";
import React, { useState, useCallback } from "react";
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
import {
  checkUserIfExistAction,
  sendCodeAction,
  checkUserVerificationCodeAction
} from "@/app/(auth)/forget/action";
import {
  ACCOUNT_NOT_EMPTY,
  ACCOUNT_NOT_EXIST,
  CAPTCHA_CODE_SEND_FAILURE,
} from "@/app/(auth)/forget/common";
import { SocialUserBindLocalUserRequestType } from "@/types/auth/social";
import {
  SendCodeRequestType,
  VerificationCodeRequestType,
  VerificationCodeResponseType
} from "@/types/auth/common";
import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
interface NextType {
  canNext: boolean;
  message: string;
}

import { SocialUserBindLocalUserRequestTypeAction } from "@/app/(auth)/bind/action";
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

  // carousel 对应 api，用于切换下一步
  const [api, setApi] = React.useState<CarouselApi>();

  //是否有本地用户
  const [hasLocalUser, setHasLocalUser] = React.useState(false);

  const [temporaryCode, setTemporaryCode] = useState<string>('');
  const [password, setPassword] = useState<string>();


  const { updateCookie } = useGetUserContext();



  /**
   * 发送验证码
   */
  const handleButtonClick = async () => {
    setIsLoading(true);
    let accountIsExist = false;

    if (accountPhone) {
      await checkUserIfExistAction(accountPhone).then(
        (res: BaseResponse<boolean>) => {
          if (res.data) {
            accountIsExist = true;
          }
        },
      );
      if (accountIsExist) {
        setHasLocalUser(true);
      } else {
        // 账号不存在
        setHasLocalUser(false);
        setIsLoading(false);
      }
    } else {
      // 本地账号不存在
      setHasLocalUser(false);
      setIsLoading(false);
    }
    // 账号存在
    const sendCodeRequestType: SendCodeRequestType =
      accountPhone.includes("@")
        ? {
          emailNumber: accountPhone,
          captchaType: 'email',
          isRegister: 1,
        }
        : {
          phoneNumber: accountPhone,
          captchaType: 'phone',
          isRegister: 1,
        };

    await sendCodeAction(sendCodeRequestType).then(
      (res: BaseResponse<any>) => {
        if (res.data) {
          // 验证码发送成功
          setIsLoading(false);
          setIsDisabled(true);
          setCountdown(60);
          toast.success('验证码发送成功!')
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

  };
  const bindSocailUser = async (accountTemporaryCode: string) => {
    let socialUserBindLocalUserRequestType: SocialUserBindLocalUserRequestType;
    if (accountTemporaryCode == '') {
      accountTemporaryCode = temporaryCode as string
    }
    socialUserBindLocalUserRequestType = accountPhone.includes("@")
      ? {
        emailNumber: accountPhone,
        accountTemporaryCode: accountTemporaryCode,
        socialTemporaryCode: passcode ?? '',
        password: password ?? '',
        socialUserId: socialUserId ?? '',
        hasLocalUser: hasLocalUser,
      }
      : {
        phoneNumber: accountPhone,
        accountTemporaryCode: accountTemporaryCode,
        socialTemporaryCode: passcode ?? '',
        password: password ?? '',
        socialUserId: socialUserId ?? '',
        hasLocalUser: hasLocalUser,
      };
    try {
      const res = await SocialUserBindLocalUserRequestTypeAction(socialUserBindLocalUserRequestType);
      let data = res.data;
      if (data != null && data.status) {
        clickToLogin(accountTemporaryCode);
      } else {
        toast.error("绑定失败，请重试");
        router.push("/login");
      }
    } catch (error) {
      toast.error("绑定失败，请重试");
      router.push("/login");
    }
  }
  const handleVerification = async () => {
    // 校验验证码是否正确
    const verificationCodeRequest: VerificationCodeRequestType =
      accountPhone.includes("@")
        ? {
          emailNumber: accountPhone,
          code: captchaCode,
        }
        : {
          phoneNumber: accountPhone,
          code: captchaCode,
        };

    await checkUserVerificationCodeAction(verificationCodeRequest).then(
      (res: BaseResponse<VerificationCodeResponseType>) => {
        if (res.success && res.data?.passed && res.data.temporaryCode) {
          let temporaryCode = String(res.data.temporaryCode);
          setTemporaryCode(temporaryCode)
          // 校验验证码通过，可以进入下一步
          if (hasLocalUser) {
            bindSocailUser(temporaryCode);
          } else {
            toNext({
              canNext: true,
              message: "",
            });
          }
        } else {
          toast.error('验证码不正确!');
        }
      },
    );
  };
  const clickToLogin = async (temporaryCode: string) => {
    const loginRequest: LoginVo = {
      loginType: "t_code",
      rememberMe: "0",
      phoneNumber: accountPhone?.includes("@") ? "" : accountPhone,
      emailNumber: accountPhone?.includes("@") ? accountPhone : "",
      captchaType: accountPhone?.includes("@") ? "email" : "phone",
      captchaCode: temporaryCode,
    };

    try {
      const res: BaseResponse<LoginDTO> = await loginAction(loginRequest);
      debugger
      if (res.success && res.data) {
        // 确保状态更新
        await new Promise<void>((resolve) => {
          localStorage.setItem("token", res.data?.token || "");
          updateCookie(userInfoCookie, JSON.stringify(res.data), false);
          resolve();
        });
        requestAnimationFrame(() => {
          toast.success("登录成功");
          router.push("/");
        });
      } else {
        toast.error("登录失败，请重试");
      }
    } catch (error) {
      console.error("登录请求失败:", error);
      toast.error("网络错误，请稍后重试");
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
  const stepArray: React.JSX.Element[] = [
    <div key={0} className={" flex flex-col"}>
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
          <Button
            fullWidth
            className={""}
            color={"primary"}
            onPress={() => handleVerification()}
          >
            进入
          </Button>
        </div>
      </form>
    </div>,

    <div key={1} className={""}>
      <form className="flex flex-col gap-4">
        <Input
          autoComplete="account"
          label="请创建新密码"
          type="text"
          value={password}
          onValueChange={(value) => setPassword(value)}
        />
        <div className="flex gap-2 justify-end">
          <Button
            fullWidth
            className={""}
            color={"primary"}
            onPress={() => bindSocailUser('')}
          >
            提交
          </Button>
        </div>
      </form>
    </div>
  ]

  return (
    <Card isBlurred className="bg-transparent w-[340px]">
      <CardBody className="overflow-hidden">
        <div>
          <h1 className={title()}>绑定用户</h1>
        </div>
        <Carousel className=" mt-10 w-full max-w-xs" setApi={setApi}>
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
        <div className={"flex gap-3"}>
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
