export type RegisterRequestType = {
  loginName: string;
  userName: string;
  sex: number;
  password: string;
  phoneNumber: string;
  emailNumber: string;
  bio?: string;
  inviteUrl?: string;
  isPrivate: number;
  remark: string;
};
