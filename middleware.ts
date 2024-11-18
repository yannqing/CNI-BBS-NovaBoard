import type { NextRequest } from "next/server";

import { NextResponse } from "next/server";

import { userInfoCookie } from "@/common/auth/constant";

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  const token = request.cookies.get(userInfoCookie);

  if (request.nextUrl.pathname === "/about") {
    return new Response("Not Found", {
      status: 404,
      statusText: "Not Found",
      headers: { "Content-Type": "text/plain" },
    });
  }

  if (!token) {
    return NextResponse.redirect(
      new URL(
        "/login?message=您还未登录，无法访问对应资源，请返回登录！",
        request.url,
      ),
    );
  }

  return NextResponse.next(); // 继续处理请求
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: "/chat/:path*",
};
