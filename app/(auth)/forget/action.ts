"use server";

import service from "@/utils/axios";
import {
  ResetPasswordRequestType,
  SendCodeRequestType,
  VerificationCodeRequestType,
} from "@/types/auth/forget";

/**
 * 检查账户是否存在
 * @param account 电话号或邮箱
 */
export async function checkUserIfExistAction(account: string) {
  return await service({
    url: "/user/open/checkUserIfExist/" + account,
    method: "get",
    headers: {
      "Content-type": "application/x-www-form-urlencoded; charset=utf-8",
    },
  });
}

/**
 * 发送验证码
 * @param sendCodeRequest
 */
export async function sendCodeAction(sendCodeRequest: SendCodeRequestType) {
  return await service({
    url: "/common/open/sendCode",
    method: "post",
    data: sendCodeRequest,
  });
}

/**
 * 校验验证码
 * @param verificationCodeRequest
 */
export async function checkUserVerificationCodeAction(
  verificationCodeRequest: VerificationCodeRequestType,
) {
  return await service({
    url: "/user/open/checkUserVerificationCode",
    method: "post",
    data: verificationCodeRequest,
  });
}

/**
 * 重置密码
 * @param resetPasswordRequest
 */
export async function resetPasswordAction(
  resetPasswordRequest: ResetPasswordRequestType,
) {
  return await service({
    url: "/user/open/resetPassword",
    method: "post",
    data: resetPasswordRequest,
  });
}
