import { RegisterRequestType } from "@/types/auth/register";
import service from "@/utils/axios";

export async function registerAction(registerRequest: RegisterRequestType) {
  return service({
    url: "/user/open/register",
    method: "post",
    data: registerRequest,
  });
}
