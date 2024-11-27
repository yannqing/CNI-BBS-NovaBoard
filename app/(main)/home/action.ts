import service from "@/utils/axios";
import { GetAllCategoryRequest } from "@/types/post/category";
import { GetPostListRequest } from "@/types/post/post";

/**
 * 查询分类标签
 * @param getAllCategoryRequest
 */
export async function getAllCategoryAction(
  getAllCategoryRequest: GetAllCategoryRequest,
) {
  return await service({
    url: "/category/open/list",
    method: "post",
    data: getAllCategoryRequest,
  });
}

/**
 * 查询所有帖子列表
 * @param getPostListRequest
 */
export async function queryPostListAction(
  getPostListRequest: GetPostListRequest,
) {
  return await service({
    url: "/post/open/queryPostList",
    method: "post",
    data: getPostListRequest,
  });
}

/**
 * 查询推荐作者列表
 */
export async function getRecommendUsersAction() {
  return await service({
    url: "/user/open/recommendedUser",
    method: "get",
  });
}

export const recommendUsers = [
  {
    name: "yanKing1",
    introduction: "Full-stack developer, @getnextui lover she/her 🎉",
    // description: "In case you need to customize the avatar even further, you can use the useAvatar hook to create your own implementation.",
    description: "Product Designer",
    followingNumber: "3",
    followersNumber: "923.1k",
    email: "67121851@qq.com",
    avatar:
      "https://blogback.yannqing.com/api/v2/objects/avatar/0vqxqul8pu2skmwokn.jpg",
  },
  {
    name: "yanKing2",
    introduction: "Full-stack developer, @getnextui lover she/her 🎉",
    description: "Product Designer",
    followingNumber: "76",
    followersNumber: "6.1k",
    email: "43232323@qq.com",
    avatar: "https://i.pravatar.cc/150?u=a042581f4e29026024d",
  },
  {
    name: "yanKing3",
    introduction: "Full-stack developer, @getnextui lover she/her 🎉",
    description: "Product Designer",
    followingNumber: "34",
    followersNumber: "5.1k",
    email: "12323513@qq.com",
    avatar: "https://i.pravatar.cc/150?u=a04258a2462d826712d",
  },
  {
    name: "yanKing4",
    introduction: "Full-stack developer, @getnextui lover she/her 🎉",
    description: "Product Designer",
    followingNumber: "44",
    followersNumber: "4.1k",
    email: "94534432@qq.com",
    avatar: "https://i.pravatar.cc/150?u=a042581f4e29026704d",
  },
  {
    name: "yanKing5",
    introduction: "Full-stack developer, @getnextui lover she/her 🎉",
    description: "Product Designer",
    followingNumber: "2.3k",
    followersNumber: "3.1k",
    email: "72342446@qq.com",
    avatar: "https://i.pravatar.cc/150?u=a04258114e29026702d",
  },
];
