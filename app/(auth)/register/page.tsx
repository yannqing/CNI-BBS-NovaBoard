"use client";

import { Input, Textarea } from "@nextui-org/input";
import { Button } from "@nextui-org/button";
import React, { useState } from "react";
import { EyeFilledIcon, EyeSlashFilledIcon } from "@nextui-org/shared-icons";
// @ts-ignore
import { useRouter } from "next/navigation";
import { Card } from "@nextui-org/card";
import { Radio, RadioGroup } from "@nextui-org/radio";
import { Spacer } from "@nextui-org/spacer";
import { ScrollShadow } from "@nextui-org/scroll-shadow";
import { Link } from "@nextui-org/link";
import { toast } from "sonner";

import { title } from "@/components/primitives";
import { siteConfig } from "@/config/site";
import { ThemeSwitch } from "@/components/home/theme-switch";
import { RegisterRequestType } from "@/types/auth/register";
import {
  validatePassword,
  validatePhoneNumber,
  validEmail,
} from "@/utils/tools";
import { checkUserIfExistAction } from "@/app/(auth)/forget/action";
import { BaseResponse } from "@/types";
import { registerAction } from "@/app/(auth)/register/action";

export default function LoginPage() {
  const router = useRouter();

  const [isVisible, setIsVisible] = React.useState(false);

  const [nickName, setNickName] = useState<string>("");

  const [account, setAccount] = useState<string>("");

  const [email, setEmail] = React.useState("");

  const [phone, setPhone] = useState<string>("");

  const [sex, setSex] = useState<number>(0);

  const [remark, setRemark] = useState<string>("2");

  const [bio, setBio] = useState<string>("");

  const [inviteUrl, setInviteUrl] = useState<string>("");

  const [isPrivate, setIsPrivate] = useState<number>(0);

  const [password, setPassword] = useState<string>("");

  const [againPassword, setAgainPassword] = useState<string>("");

  const isEmailInvalid = React.useMemo(() => {
    if (email === "") return false;

    return !validEmail(email);
  }, [email]);

  const isPasswordInvalid = React.useMemo(() => {
    if (password === "") return false;

    return !validatePassword(password);
  }, [password]);

  const isAgainPasswordInvalid = React.useMemo(() => {
    if (againPassword === "") return false;

    return !validatePassword(againPassword);
  }, [againPassword]);

  const isPhoneInvalid = React.useMemo(() => {
    if (phone === "") return false;

    return !validatePhoneNumber(phone);
  }, [phone]);

  const toggleVisibility = () => setIsVisible(!isVisible);

  // 请求参数
  // const [registerRequest, setRegisterRequest] = useState<RegisterRequestType>({
  //   loginName: "",
  //   userName: "",
  //   sex: 0,
  //   password: "",
  //   phoneNumber: "",
  //   emailNumber: "",
  //   bio: "",
  //   inviteUrl: "",
  //   isPrivate: 0,
  //   remark: "2",
  // });

  /**
   * 返回登录页
   */
  function toLoginPage() {
    router.push(siteConfig.innerLinks.login);
  }

  /**
   * 注册逻辑
   */
  async function clickToRegister() {
    // 1. **判空：**判断除了 bio 和 inviteUrl 之外的字段均不能为空
    if (!account) {
      toast.error("账号不能为空，请重试");

      return;
    }
    if (!nickName) {
      toast.error("昵称不能为空，请重试");

      return;
    }
    if (!password) {
      toast.error("密码不能为空，请重试");

      return;
    }
    if (!againPassword) {
      toast.error("第二次输入的密码不能为空，请重试");

      return;
    }
    if (!email) {
      toast.error("邮箱不能为空，请重试");

      return;
    }
    if (!phone) {
      toast.error("手机号不能为空，请重试");

      return;
    }
    // 2. **有效判断：**账号，密码，电话，邮箱，邀请码（不为空的话），是否勾选
    // TODO 账号，昵称，邀请码校验
    if (remark === "2") {
      toast.error("请阅读并勾选后才能继续");

      return;
    }
    if (isPhoneInvalid) {
      toast.error("手机号格式错误，请重试");

      return;
    }
    if (isEmailInvalid) {
      toast.error("邮箱格式错误，请重试");

      return;
    }
    if (isPasswordInvalid) {
      toast.error(
        "密码格式错误，密码必须包含：大写字母，小写字母，数字，特殊字符，且8位以上",
      );

      return;
    }
    if (isAgainPasswordInvalid) {
      toast.error(
        "第二次输入的密码格式错误，密码必须包含：大写字母，小写字母，数字，特殊字符，且8位以上",
      );

      return;
    }
    if (password !== againPassword) {
      toast.error("两次输入密码不同，请重试");

      return;
    }
    await checkUserIfExistAction(account).then((res: BaseResponse<any>) => {
      if (res.data) {
        // 账号存在
        toast.error("账号已存在，请重试！");

        return;
      }
    });
    // 3. 构建请求参数
    const registerRequest: RegisterRequestType = {
      userName: nickName,
      loginName: account,
      password: password,
      emailNumber: email,
      phoneNumber: phone,
      sex: sex,
      inviteUrl: inviteUrl,
      bio: bio,
      isPrivate: isPrivate,
      remark: remark,
    };

    // 4. 是否勾选**同意协议**（放第二步了）
    // 5. 发送请求
    await registerAction(registerRequest).then((res: BaseResponse<any>) => {
      if (res.success) {
        // 注册成功！
        toast.success("注册成功，即将返回登录");
        setTimeout(() => {
          router.push(siteConfig.innerLinks.login);
        }, 3000);
      } else {
        // 注册失败
        console.log("register result", res);
        toast.error(res.message);
      }
    });
  }

  return (
    <Card isBlurred className={"bg-transparent"}>
      <div className="flex flex-row gap-5 m-5">
        <div className="">
          <div>
            <h1 className={title()}>注册</h1>
            <div className="max-w-80 mb-5 mt-5">
              为了保持联系，请使用电子邮件地址和密码注册您的个人信息
            </div>
          </div>
          <div className="flex max-w-[300px] flex-wrap gap-4">
            <ScrollShadow hideScrollBar className="w-[300px] h-[300px]">
              <form className="flex max-w-[300px] flex-wrap gap-4">
                <Input
                  isRequired
                  autoComplete="userName"
                  label="昵称"
                  type="text"
                  value={nickName}
                  variant="bordered"
                  onValueChange={(value) => {
                    setNickName(value);
                  }}
                />
                <Input
                  isRequired
                  autoComplete="account"
                  label="账号"
                  type="text"
                  value={account}
                  variant="bordered"
                  onValueChange={(value) => {
                    setAccount(value);
                  }}
                />
                <Input
                  isRequired
                  autoComplete="phone"
                  color={isPhoneInvalid ? "danger" : "success"}
                  isInvalid={isPhoneInvalid}
                  label="手机号"
                  type="text"
                  value={phone}
                  variant="bordered"
                  onValueChange={(value) => {
                    setPhone(value);
                  }}
                />
                <Input
                  isRequired
                  autoComplete="email"
                  color={isEmailInvalid ? "danger" : "success"}
                  isInvalid={isEmailInvalid}
                  label="邮箱"
                  type="text"
                  value={email}
                  variant="bordered"
                  onValueChange={(value) => {
                    setEmail(value);
                  }}
                />
                <Input
                  isRequired
                  autoComplete="password"
                  color={isPasswordInvalid ? "danger" : "success"}
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
                  isInvalid={isPasswordInvalid}
                  label="密码"
                  type={isVisible ? "text" : "password"}
                  value={password}
                  variant="bordered"
                  onValueChange={(value: string) => {
                    setPassword(value);
                  }}
                />
                <Input
                  isRequired
                  autoComplete="current-password"
                  color={isAgainPasswordInvalid ? "danger" : "success"}
                  isInvalid={isAgainPasswordInvalid}
                  label="再次输入密码"
                  type={isVisible ? "text" : "password"}
                  value={againPassword}
                  variant="bordered"
                  onValueChange={(value) => {
                    setAgainPassword(value);
                  }}
                />
                <RadioGroup
                  className={"flex flex-row ml-3"}
                  label="性别"
                  value={sex.toString()}
                  onValueChange={(value) => {
                    setSex(Number(value));
                  }}
                >
                  <div className={"flex flex-row"}>
                    <Spacer x={3} />
                    <Radio value="0">男</Radio>
                    <Spacer x={3} />
                    <Radio value="1">女</Radio>
                  </div>
                </RadioGroup>
                <Textarea
                  className="max-w-xs"
                  label="个人简介"
                  placeholder="你好，世界"
                  value={bio}
                  variant="bordered"
                  onValueChange={(value) => {
                    setBio(value);
                  }}
                />
                <RadioGroup
                  className={"flex flex-row ml-3"}
                  label="账号性质"
                  value={isPrivate.toString()}
                  onValueChange={(value) => {
                    setIsPrivate(Number(value));
                  }}
                >
                  <div className={"flex flex-row"}>
                    <Spacer x={3} />
                    <Radio value="0">隐私</Radio>
                    <Spacer x={3} />
                    <Radio value="1">公开</Radio>
                  </div>
                </RadioGroup>
                <Input
                  autoComplete="inviteUrl"
                  label="邀请码（选填）"
                  type="text"
                  value={inviteUrl}
                  variant="bordered"
                  onValueChange={(value) => {
                    setInviteUrl(value);
                  }}
                />
                <RadioGroup
                  className={"flex flex-row ml-3"}
                  value={remark}
                  onValueChange={(value) => {
                    setRemark(value);
                  }}
                >
                  <div className={"flex flex-row"}>
                    <Radio className={""} value="1">
                      <span className={"text-sm"}>
                        我同意
                        <Link className={"text-sm"} href="#">
                          CHI-BBS 用户隐私保护
                        </Link>
                        许可
                      </span>
                    </Radio>
                  </div>
                </RadioGroup>
              </form>
            </ScrollShadow>
            <Button color="primary" onPress={toLoginPage}>
              返回登入
            </Button>
            <Button
              color="primary"
              variant="bordered"
              onPress={clickToRegister}
            >
              注册
            </Button>
            <ThemeSwitch />
          </div>
        </div>
      </div>
    </Card>
  );
}
