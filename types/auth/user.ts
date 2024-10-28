// 用户 Vo 封装，应用于：帖子列表的作者信息
export type UserVo = {
  avatar: string;
  bio: string;
  fansCount: string;
  followingCount: string;
  userId: string;
  userName: string;
};

// cookie 中存储的用户信息
export type UserInfo = {
  avatar: string;
  id: string;
  roles: string[];
  token: string;
  username: string;
};

// 推荐作者封装
export type RecommendUsers = {
  avatar: string;
  bio: string;
  email: string;
  fansCount: string;
  followingCount: string;
  userId: string;
  userName: string;
};
