export type LoginVo = {
  username?: string;
  password?: string;
  loginType?: string;
  rememberMe?: string;
  phoneNumber?: string;
  emailNumber?: string;
  captchaType?: string;
  captchaCode?: string;
};

export type LoginDTO = {
  avatar: string;
  id: string;
  roles: string[];
  token: string;
  username: string;
};
