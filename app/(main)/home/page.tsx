"use client";

import { Card, CardBody, CardFooter, CardHeader } from "@nextui-org/card";
import { Image } from "@nextui-org/image";
import { useState, useEffect } from "react";
import { Tooltip } from "@nextui-org/tooltip";
import { User } from "@nextui-org/user";
import { Button } from "@nextui-org/button";
import { Avatar } from "@nextui-org/avatar";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { buildFollowAction, removeFollowAction } from "./action";

import { useGetPostContext } from "@/app/(main)/PostContext";
import { useGetUserContext } from "@/app/UserContext";
import { siteConfig } from "@/config/site";
import {
  BuildFollowRequest,
  RemoveFollowRequest,
  FollowStatus,
} from "@/types/follow/follow";
import { BaseResponse } from "@/types";
import { getCookie } from "@/utils/cookies";
import { ErrorCode } from "@/types/error/ErrorCode";

export default function HomePage() {
  const router = useRouter();
  const { isCookiePresent } = useGetUserContext();
  const [followStatuses, setFollowStatuses] = useState<
    Record<string, FollowStatus>
  >({});
  // 标签
  const { postList } = useGetPostContext();

  //初始化关注状态
  useEffect(() => {
    const initialFollowStatuses: Record<string, FollowStatus> = {};

    postList.forEach((item) => {
      initialFollowStatuses[item.userVo.userId] = item.userVo
        .followStatus as FollowStatus;
    });
    setFollowStatuses(initialFollowStatuses);
  }, [postList]); // 每当 postList 改变时，重新初始化状态
  //关注
  const handleFollowToggle = async (
    targetUserId: string,
    followStatus: string,
  ) => {
    try {
      if (!isCookiePresent) {
        toast.error(ErrorCode.NOT_LOGIN.message);
        router.push(siteConfig.innerLinks.login);
      }
      // 调用后端接口更新关注状态

      const userId = getCookie()?.id as string;

      if (userId === null || userId === undefined) {
        toast.error(ErrorCode.NOT_LOGIN.message);

        return;
      }
      if(userId == targetUserId){
        return;
      }
      if (followStatus === FollowStatus.CONFIRMED) {
        const request: RemoveFollowRequest = {
          userId: userId,
          followerId: targetUserId,
        };
        const res: BaseResponse<null> = await removeFollowAction(request);

        toast.success("取消关注成功!");
      } else if (followStatus === FollowStatus.NONE) {
        const request: BuildFollowRequest = {
          userId: userId,
          followerId: targetUserId,
          groupId: "1",
        };
        const res: BaseResponse<null> = await buildFollowAction(request);

        toast.success("请求发送成功!");
      }
      // 更新关注状态
      setFollowStatuses((prev) => ({
        ...prev,
        [targetUserId]:
          followStatus === FollowStatus.CONFIRMED
            ? FollowStatus.NONE
            : FollowStatus.CONFIRMED,
      }));
    } catch (error) {
      console.error("Failed to update follow status:", error);
      // 如果失败，可以在这里恢复状态或者提示用户
    }
  };

  return (
    <>
      <div className="gap-2 grid grid-cols-2 sm:grid-cols-4 m-4">
        {postList.map((item, index) => (
          <Card
            key={index}
            isPressable
            shadow="sm"
            onPress={() =>
              router.push(siteConfig.innerLinks.postMsg + item.postId)
            }
          >
            <CardBody className="overflow-visible p-0">
              {/*TODO 这里头像默认取的数组第一个*/}
              <Image
                alt={item.title}
                className="w-full object-cover h-[140px]"
                radius="lg"
                shadow="sm"
                src={item.urls[0]?.mediaUrl}
                width="100%"
              />
            </CardBody>
            <CardFooter className="text-small flex flex-col items-start gap-y-1">
              <div className="font-bold text-base text-left">{item.title}</div>
              <Tooltip
                className="max-w-[300px] break-words"
                content={item.summary}
                showArrow={true}
              >
                <div className="text-xs text-left ellipsis w-full ">
                  {item.summary}
                </div>
              </Tooltip>
              <Tooltip
                content={
                  <Card
                    className="max-w-[300px] border-none bg-transparent"
                    shadow="none"
                  >
                    <CardHeader className="justify-between">
                      <div className="flex gap-3">
                        <Avatar
                          isBordered
                          radius="full"
                          size="md"
                          src={item.userVo.avatar}
                        />
                        <div className="flex flex-col items-start justify-center">
                          <h4 className="text-small font-semibold leading-none text-default-600">
                            {item.userVo.userName}
                          </h4>
                        </div>
                      </div>
                      <Button
                        className={`${
                          followStatuses[item.userVo.userId] ===
                          FollowStatus.CONFIRMED
                            ? "bg-gray-100"
                            : followStatuses[item.userVo.userId] ===
                                FollowStatus.NONE
                              ? "bg-blue-900"
                              : ""
                        } ${followStatuses[item.userVo.userId] === FollowStatus.REJECTED ? "bg-red-400" : ""}
                    ml-10`}
                        color="primary"
                        isDisabled={
                          followStatuses[item.userVo.userId] ===
                          FollowStatus.PENDING
                        }
                        radius="md"
                        size="sm"
                        variant={
                          followStatuses[item.userVo.userId] ===
                          FollowStatus.CONFIRMED
                            ? "ghost"
                            : "solid"
                        }
                        onPress={() =>
                          handleFollowToggle(
                            item.userVo.userId,
                            followStatuses[item.userVo.userId] ||
                              FollowStatus.NONE,
                          )
                        }
                      >
                        {followStatuses[item.userVo.userId] ===
                        FollowStatus.PENDING
                          ? "未通过"
                          : followStatuses[item.userVo.userId] ===
                              FollowStatus.CONFIRMED
                            ? "取消关注"
                            : followStatuses[item.userVo.userId] ===
                                FollowStatus.REJECTED
                              ? "重新请求"
                              : "关注"}
                      </Button>
                    </CardHeader>
                    <CardBody className="px-3 py-0">
                      <p className="text-small pl-px text-default-500">
                        {item.userVo.bio}
                      </p>
                    </CardBody>
                    <CardFooter className="gap-3">
                      <div className="flex gap-1">
                        <p className="font-semibold text-default-600 text-small">
                          {item.userVo.followingCount}
                        </p>
                        <p className=" text-default-500 text-small">正在关注</p>
                      </div>
                      <div className="flex gap-1">
                        <p className="font-semibold text-default-600 text-small">
                          {item.userVo.fansCount}
                        </p>
                        <p className="text-default-500 text-small">关注我</p>
                      </div>
                    </CardFooter>
                  </Card>
                }
              >
                <div>
                  <User
                    avatarProps={{
                      src: item.userVo.avatar,
                      size: "sm",
                    }}
                    className="transition-transform mt-1"
                    name={item.userVo.userName}
                  />
                </div>
              </Tooltip>
            </CardFooter>
          </Card>
        ))}
      </div>
    </>
  );
}
