import axios from "axios";
import { headers } from "next/headers";

import { ErrorCode } from "@/types/error/ErrorCode";
import { decrypt, encrypt, generateRandomIV, matchPath } from "@/utils/tools";
import { getCookie } from "@/utils/cookies";
import { userInfoCookie, whiteList } from "@/common/auth/constant";
import { CustomError } from "@/types/error/Error";

const BaseURL = "http://localhost:8080";
// create an axios instance
const service = axios.create({
  baseURL: process.env.BackEndUrl || BaseURL, // url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 50000, // request timeout
});

service.defaults.withCredentials = true;
service.defaults.headers.post["Content-Type"] =
  "application/json;charset=UTF-8";

// Add a request interceptor 请求拦截器
service.interceptors.request.use(
  function (config) {
    const url = (config.baseURL || "") + (config.url || "");

    console.log("Request URL:", url);

    // 系统错误
    if (!config.headers) {
      throw new Error(
        `Expected 'config' and 'config.headers' not to be undefined`,
      );
    }
    // 1. 判断用户是否登录
    // 从 cookie 中取出数据
    let userInfo;

    if (typeof window === "undefined") {
      // 服务端环境
      const headersList = headers();
      const cookies = headersList.get("cookie") || "";
      // 解析 cookie 字符串
      const cookieObj = Object.fromEntries(
        cookies.split(";").map((cookie) => {
          const [key, value] = cookie.split("=").map((c) => c.trim());

          try {
            return [key, JSON.parse(decodeURIComponent(value))];
          } catch {
            return [key, decodeURIComponent(value)];
          }
        }),
      );

      userInfo = cookieObj[userInfoCookie];
    } else {
      // 客户端环境
      userInfo = getCookie(userInfoCookie);
    }
    console.log("===============------------userInfo", userInfo);
    // 存在数据，则已登录
    if (userInfo) {
      // 用户已登录，则把 token 放入请求头
      config.headers["token"] = userInfo.token;
    } else {
      // 用户未登录，判断请求路径是否在白名单内
      // 不在白名单内，直接重定向到登录页
      if (config.url && !matchPath(whiteList, config.url)) {
        console.log("refuse into===================");

        // 拒绝继续请求
        return Promise.reject(
          new CustomError(
            ErrorCode.NOT_LOGIN.message,
            ErrorCode.NOT_LOGIN.code,
          ),
        );
      }
    }
    // 2. 给 post 请求数据加密 TODO 目前默认所有 post 请求体都加密
    if (
      config.method === "post" &&
      config.url &&
      config.data &&
      !(config.data instanceof FormData)
    ) {
      const ivBase64 = generateRandomIV();

      console.log("===============------------ivBase64", ivBase64);
      config.headers["iv"] = ivBase64;
      const jsonData = JSON.stringify(config.data);
      const encryptData = encrypt(jsonData, ivBase64);

      // 用加密后���数据替换原始请求体
      config.data = encryptData.replace(/^"|"$/g, "");
    }

    return config;
  },
  function (error) {
    // Do something with request error
    return Promise.reject(error);
  },
);

// Add a response interceptor 响应拦截器
service.interceptors.response.use(
  function (response) {
    // 获取响应状态码和数据
    const status = response.status;
    const data = response.data;

    // 检查响应状态码
    if (status === 200) {
      // 如果需要解密响应数据
      if (data) {
        // 假设响应数据中包含加密数据和 IV
        let ivBase64 = response.headers["iv"]; // 从响应头中获取 IV

        // 如果取到 iv 则解密。
        if (ivBase64) {
          let decryptedData = decrypt(data, ivBase64); // 解密数据

          // return { ...response, data: jsonData }; // 返回解密后的数据
          response.data = JSON.parse(decryptedData);
        }

        // 解密后，判断后端错误代码
        // 1). token 过期
        if (response.data.errorCode == ErrorCode.TOKEN_EXPIRE.code) {
          // toast.error(ErrorCode.TOKEN_EXPIRE.message);

          return Promise.reject(
            new CustomError(
              ErrorCode.TOKEN_EXPIRE.message,
              ErrorCode.TOKEN_EXPIRE.code,
            ),
          );
        }

        return response.data;
      } else {
        // 后端返回数据为空 TODO 其他处理
        // toast.error(ErrorCode.SERVER_ERROR.message);

        return Promise.reject(
          new CustomError(
            ErrorCode.SERVER_ERROR.message,
            ErrorCode.SERVER_ERROR.code,
          ),
        );
      }
    } else {
      // 响应码不是 200 TODO 其他处理
      // toast.error(ErrorCode.SERVER_ERROR.message);

      throw Promise.reject(
        new CustomError(
          ErrorCode.SERVER_ERROR.message,
          ErrorCode.SERVER_ERROR.code,
        ),
      );
    }
  },
  function (error) {
    console.log("=======================error", error);
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    // toast.error(ErrorCode.SERVER_ERROR.message);

    if (error instanceof CustomError) {
      console.log("1111212121");
      throw error;
    }
    throw new CustomError(
      ErrorCode.SERVER_ERROR.message,
      ErrorCode.SERVER_ERROR.code,
    );
  },
);

export default service;
