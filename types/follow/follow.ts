// 获取关注列表
export type GetFollowListRequest = {
  userId: string;
  isCheckFollower: boolean;
  friendsInfo?: string;
};
// 建立关注
export type BuildFollowRequest = {
  userId: string;
  followerId: string;
  groupId: string;
};
// 取消关注彼此
export type RemoveFollowRequest = {
  userId: string;
  followerId: string;
};
// 改变关注状态
export type ChangeFollowStatusRequest = {
  userId: string;
  followerId: string;
  groupId?: string;
  remark?: string;
  isAcceptRequested?: string;
  isBlocked?: boolean;
};
// 关注状态枚举
export enum FollowStatus {
  PENDING = "pending",
  CONFIRMED = "confirmed",
  REJECTED = "rejected",
  NONE = "none",
}
