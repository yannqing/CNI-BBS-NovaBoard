export type LoginVo = {
  username?: string;
  password?: string;
  loginType?: string;
  rememberMe?: string;
};

export type LoginDTO = {
  avatar: string;
  id: string;
  roles: string[];
  token: string;
  username: string;
};
