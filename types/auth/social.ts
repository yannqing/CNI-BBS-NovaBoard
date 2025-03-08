export type SocialUserBindLocalUserRequestType = {
  phoneNumber?: string;
  emailNumber?: string;
  accountTemporaryCode?: string;
  password?: string;
  socialTemporaryCode: string;
  socialUserId: string;
  hasLocalUser: boolean;
};
