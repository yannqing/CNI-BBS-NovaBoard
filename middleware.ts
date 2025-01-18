import type { NextRequest } from "next/server";

import { NextResponse } from "next/server";

import { userInfoCookie } from "@/common/auth/constant";

// 中间件：可以使用 async，运行在服务端
export function middleware(request: NextRequest) {
  console.log("================ 中间件开始执行 ================");
  console.log("当前路径:", request.nextUrl.pathname);
  console.log("完整URL:", request.url);
  console.log("请求方法:", request.method);
  console.log("Cookie:", request.cookies.getAll());
  
  const token = request.cookies.get(userInfoCookie);

  if (request.nextUrl.pathname === "/about") {
    return new Response("Not Found", {
      status: 404,
      statusText: "Not Found",
      headers: { "Content-Type": "text/plain" },
    });
  }
  // 主页重定向
  if (request.nextUrl.pathname === "/") {
    return NextResponse.redirect(new URL("/home", request.url));
  }
  console.log("token", token);
  console.log("request.nextUrl.pathname", request.nextUrl.pathname);
  // 未登录阻止访问资源
  if (!token && request.nextUrl.pathname === "/chat") { 
    console.log("into:", token);
    return NextResponse.redirect(
      new URL(
        "/login?message=您还未登录，无法访问对应资源，请返回登录！",
        request.url,
      ),
    );
  }

  console.log("================ 中间件执行结束 ================");
  return NextResponse.next(); // 继续处理请求
}

// 路由匹配
export const config = {
  matcher: ["/chat/:path*", "/"],
};
