"use client";

import clsx from "clsx";
import { Button } from "@nextui-org/button";
import { User } from "@nextui-org/user";
import { Tooltip } from "@nextui-org/tooltip";
import { Card, CardBody, CardFooter, CardHeader } from "@nextui-org/card";
import { Avatar } from "@nextui-org/avatar";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { fontMono } from "@/config/fonts";
import { getRecommendUsersAction } from "@/app/(main)/home/action";
import { BaseResponse } from "@/types";
import { RecommendUsers } from "@/types/auth/user";
import { siteConfig } from "@/config/site";
import { BuildFollowRequest,RemoveFollowRequest,FollowStatus } from "@/types/follow/follow";
import { buildFollowAction,removeFollowAction } from "./action";
import { getCookie } from "@/utils/cookies";
import { useGetUserContext } from "@/app/UserContext";
import { toast } from "sonner";
import { ErrorCode } from "@/types/error/ErrorCode";
export default function RightSideBar() {
  const router = useRouter();
  const { isCookiePresent } = useGetUserContext();

  // 推荐作者
  const [recommendUsers, setRecommendUsers] = useState<RecommendUsers[]>([]);

  const userId = getCookie()?.id as string ;
  // 页面初始化
  useEffect(() => {
    const fetchRecommendUsersData = async () => {
      const res: BaseResponse<RecommendUsers[]> =
      userId != null ?  
      await getRecommendUsersAction(userId) :
      await getRecommendUsersAction();

      console.log(res);

      if (res.success && res.data) {
        setRecommendUsers(res.data);
      }
    };

    fetchRecommendUsersData().then(() => {});
  }, []);
//关注
const handleFollowToggle = async (targetUserId : string,followStatus : string) => {
  try {
    if(!isCookiePresent){
      toast.error(ErrorCode.NOT_LOGIN.message);
      router.push(siteConfig.innerLinks.login);
      return;
    }
    // 调用后端接口更新关注状态
    if(userId === null || userId === undefined){
      toast.error(ErrorCode.NOT_LOGIN.message);
      return;
    }
    // 根据followStatus更新关注状态
    const updatedUsers = recommendUsers.map((user) =>
      user.userId === targetUserId
        ? {
            ...user,
            followStatus:
              followStatus === FollowStatus.CONFIRMED
                ? FollowStatus.NONE
                : FollowStatus.CONFIRMED,
          }
        : user
    );
    // 更新状态
    setRecommendUsers(updatedUsers);

    if(followStatus === FollowStatus.CONFIRMED){
      const request : RemoveFollowRequest = {
        userId: userId,
        followerId: targetUserId,
      }
      const res : BaseResponse<null> = await removeFollowAction(request);
      toast.success("取消关注成功!");
    }else if(followStatus === FollowStatus.NONE){
      const request : BuildFollowRequest = {
        userId: userId,
        followerId: targetUserId,
        groupId: "1",
      }
      const res : BaseResponse<null> = await buildFollowAction(request);
      toast.success("请求发送成功!");
    }
  } catch (error) {
    console.error("Failed to update follow status:", error);
    // 如果失败，可以在这里恢复状态或者提示用户
  }
};
  return (
    <div className="w-full mt-10">
      <div className="min-h-44 relative">
        <div className="blur-sm flex">xxxxxxxxxxxxxxxx</div>
        <div className="blur-sm flex justify-end">xxxxxxxx</div>
        <div className="blur-sm flex">xxx</div>
        <div className="blur-sm flex justify-end">xxxxxxxx</div>
        <div className="blur-sm flex">xxxxxxxx</div>
        <div className="blur-sm flex justify-end">xxxxxxxxxxxxxxxx</div>
        <div className="blur-sm flex">xxxx</div>
        <Button
          className={clsx(
            "absolute top-1/3 left-10 inner text-fuchsia-400 hover:bg-gradient-to-r from-purple-500 to-pink-500 font-bold",
            fontMono.variable,
          )}
          color="primary"
          variant="light"
          onPress={() => {
            router.push(siteConfig.innerLinks.chat);
          }}
        >
          936 人正在热聊，点击加入
        </Button>
      </div>
      <div className={"mt-10"}>
        <div>推荐作者如下：</div>
        <div>
          {recommendUsers.map((recommendUser) => (
            // eslint-disable-next-line react/jsx-key
            <Tooltip
              key={recommendUser.userName}
              content={
                <Card
                  className="max-w-[300px] border-none bg-transparent"
                  shadow="none"
                >
                  <CardHeader className="justify-between">
                    <div className="flex gap-3">
                      <Avatar
                        isBordered
                        color="danger"
                        radius="full"
                        size="md"
                        src={recommendUser.avatar}
                      />
                      <div className="flex flex-col items-start justify-center">
                        <h4 className="text-small font-semibold leading-none text-default-600">
                          {recommendUser.userName}
                        </h4>
                        <h5 className="text-small tracking-tight text-default-500">
                          {recommendUser.email}
                        </h5>
                      </div>
                    </div>
                    <Button
                      className={`${
                        recommendUser.followStatus === FollowStatus.CONFIRMED
                          ? "bg-gray-100"
                          : recommendUser.followStatus === FollowStatus.NONE
                          ? "bg-blue-900"
                          : ""
                      } ${recommendUser.followStatus === FollowStatus.REJECTED ? "bg-red-400" : ""}
                      ml-10`}
                      color="primary"
                      radius="full"
                      size="sm"
                      variant={recommendUser.followStatus ===FollowStatus.CONFIRMED ? "bordered" : "solid"}
                      onPress={() => handleFollowToggle(recommendUser.userId, recommendUser.followStatus || FollowStatus.NONE)}
                    >
                      {recommendUser.followStatus === FollowStatus.PENDING
                      ? "未通过"
                      : recommendUser.followStatus === FollowStatus.CONFIRMED
                      ? "取消关注"
                      : recommendUser.followStatus === FollowStatus.REJECTED
                      ? "重新请求"
                      : "关注"} 
                    </Button>
                  </CardHeader>
                  <CardBody className="px-3 py-0">
                    <p className="text-small pl-px text-default-500">
                      {recommendUser.bio}
                    </p>
                  </CardBody>
                  <CardFooter className="gap-3">
                    <div className="flex gap-1">
                      <p className="font-semibold text-default-600 text-small">
                        {recommendUser.followingCount}
                      </p>
                      <p className=" text-default-500 text-small">Following</p>
                    </div>
                    <div className="flex gap-1">
                      <p className="font-semibold text-default-600 text-small">
                        {recommendUser.fansCount}
                      </p>
                      <p className="text-default-500 text-small">Followers</p>
                    </div>
                  </CardFooter>
                </Card>
              }
            >
              <div className={""}>
                <User
                  avatarProps={{
                    src: recommendUser.avatar,
                    size: "md",
                    color: "danger",
                    isBordered: true,
                  }}
                  className="transition-transform mt-5"
                  description={
                    <span className={" block ellipsis"}>
                      {recommendUser.bio}
                    </span>
                  }
                  name={recommendUser.userName}
                />
              </div>
            </Tooltip>
          ))}
        </div>
        <div className={"w-full flex justify-center mt-5"}>
          <Button variant="light">查看更多</Button>
        </div>
      </div>
    </div>
  );
}
