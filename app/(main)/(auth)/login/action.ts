import service from "@/utils/axios";
import { LoginVo } from "@/types/auth/login";
import { RegisterVo } from "@/types/auth/register";

export async function loginAction(loginRequest: LoginVo) {
  return await service({
    url: "/user/open/login",
    method: "post",
    data: loginRequest,
  });
}

export async function logoutAction(id: string) {
  return await service({
    url: "/user/open/logout/" + id,
    method: "get",
  });
}

export async function registerAction(registerRequest: RegisterVo) {

}
