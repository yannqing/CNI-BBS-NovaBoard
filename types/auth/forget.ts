export type ResetPasswordRequestType = {
  emailNumber?: string;
  phoneNumber?: string;
  temporaryCode: number;
  newPassword: string;
};
