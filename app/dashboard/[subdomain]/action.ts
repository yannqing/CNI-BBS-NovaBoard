"use server";

import service from "@/utils/axios";
import { FrequencyRequest } from "@/types/dashboard/myself"

/**
 * 查询用户发帖频率数据
 * @param request 
 * @returns 
 */
export async function FrequencyAction(request: FrequencyRequest) {
    return service({
      url: "/post/frequency",
      method: "get",
      params: request,
    });
  }
  