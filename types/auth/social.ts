export type SocialUserBindLocalUserRequestType = {
  phoneNumber?: string;
  emailNumber?: string;
  password?: string;
  temporaryCode?: string;
  socialUserId?: string;
  hasLocalUser?: boolean;
};
