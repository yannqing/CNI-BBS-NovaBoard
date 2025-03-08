"use server";

import service from "@/utils/axios";
import { SocialUserBindLocalUserRequestType } from "@/types/auth/social";

/**
 * 绑定第三方平台用户
 * @param socialUserBindLocalUserRequestType
 */
export async function SocialUserBindLocalUserRequestTypeAction(
    socialUserBindLocalUserRequestType: SocialUserBindLocalUserRequestType,
) {
  return await service({
    url: "/user/open/socialUserBindLocalUser",
    method: "post",
    data: socialUserBindLocalUserRequestType,
  });
}
