export class ErrorCode {
  static readonly TOKEN_EXPIRE = new ErrorCode(
    11041,
    "用户已过期，请重新登录！",
  );

  static readonly SERVER_ERROR = new ErrorCode(500, "服务器异常，请联系管理员");

  static readonly NOT_LOGIN = new ErrorCode(501, "您已退出，请重新登录");

  static readonly NOT_KNOWN = new ErrorCode(599, "未知的错误，请联系管理员");

  code: number;

  message: string;

  constructor(code: number, message: string) {
    this.code = code;
    this.message = message;
  }
}
