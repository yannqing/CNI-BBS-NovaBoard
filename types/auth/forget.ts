export type SendCodeRequestType = {
  phoneNumber?: string;
  emailNumber?: string;
  captchaType?: string;
  captchaCode?: string;
  isRegister?: number; // 注册是 0，其余均为 1
};

export type VerificationCodeRequestType = {
  phoneNumber?: string;
  emailNumber?: string;
  code: string;
};

export type VerificationCodeResponseType = {
  emailNumber?: string;
  phoneNumber?: string;
  passed?: boolean;
  temporaryCode?: number;
};

export type ResetPasswordRequestType = {
  emailNumber?: string;
  phoneNumber?: string;
  temporaryCode: number;
  newPassword: string;
};
