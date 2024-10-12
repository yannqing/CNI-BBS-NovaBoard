import clsx from "clsx";
import { Button } from "@nextui-org/button";
import { User } from "@nextui-org/user";
import { Tooltip } from "@nextui-org/tooltip";
import { Card, CardBody, CardFooter, CardHeader } from "@nextui-org/card";
import { Avatar } from "@nextui-org/avatar";
import { useState } from "react";

import { fontMono } from "@/config/fonts";
import { recommendUsers } from "@/app/home/action";

export default function RightSideBar() {
  const [isFollowed, setIsFollowed] = useState(false);

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
                          {recommendUser.name}
                        </h4>
                        <h5 className="text-small tracking-tight text-default-500">
                          {recommendUser.email}
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
                    <p className="text-small pl-px text-default-500">
                      {recommendUser.introduction}
                    </p>
                  </CardBody>
                  <CardFooter className="gap-3">
                    <div className="flex gap-1">
                      <p className="font-semibold text-default-600 text-small">
                        {recommendUser.followingNumber}
                      </p>
                      <p className=" text-default-500 text-small">Following</p>
                    </div>
                    <div className="flex gap-1">
                      <p className="font-semibold text-default-600 text-small">
                        {recommendUser.followersNumber}
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
                      {recommendUser.description}
                    </span>
                  }
                  name={recommendUser.name}
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
