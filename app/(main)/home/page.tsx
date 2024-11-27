"use client";

import { Card, CardBody, CardFooter, CardHeader } from "@nextui-org/card";
import { Image } from "@nextui-org/image";
import { useState } from "react";
import { Tooltip } from "@nextui-org/tooltip";
import { User } from "@nextui-org/user";
import { Button } from "@nextui-org/button";
import { Avatar } from "@nextui-org/avatar";
import { useRouter } from "next/navigation";

import { useGetPostContext } from "@/app/(main)/PostContext";
import { useGetUserContext } from "@/app/UserContext";
import { siteConfig } from "@/config/site";

export default function HomePage() {
  const router = useRouter();
  const [isFollowed, setIsFollowed] = useState(false);

  const { isCookiePresent } = useGetUserContext();

  // 标签
  const { postList } = useGetPostContext();

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
              <Tooltip content={item.summary} showArrow={true}>
                <div className="text-xs text-left ellipsis w-full">
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
                          <h5 className="text-small tracking-tight text-default-500">
                            {item.userVo.bio}
                          </h5>
                        </div>
                      </div>
                      <Button
                        className={
                          isFollowed
                            ? "bg-transparent text-foreground border-default-200"
                            : ""
                        }
                        color="primary"
                        radius="full"
                        size="sm"
                        variant={isFollowed ? "bordered" : "solid"}
                        onPress={() => setIsFollowed(!isFollowed)}
                      >
                        {isFollowed ? "Unfollow" : "Follow"}
                      </Button>
                    </CardHeader>
                    <CardBody className="px-3 py-0">
                      {/*TODO 目前写死，需要根据后端内容来调整*/}
                      <p className="text-small pl-px text-default-500">
                        Full-stack developer, @getnextui lover she/her
                        <span aria-label="confetti" role="img">
                          🎉
                        </span>
                      </p>
                    </CardBody>
                    <CardFooter className="gap-3">
                      <div className="flex gap-1">
                        <p className="font-semibold text-default-600 text-small">
                          {item.userVo.followingCount}
                        </p>
                        <p className=" text-default-500 text-small">
                          Following
                        </p>
                      </div>
                      <div className="flex gap-1">
                        <p className="font-semibold text-default-600 text-small">
                          {item.userVo.fansCount}
                        </p>
                        <p className="text-default-500 text-small">Followers</p>
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
                    description={item.userVo.bio}
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
