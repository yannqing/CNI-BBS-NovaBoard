"use client";

import { Card, CardBody, CardFooter, CardHeader } from "@nextui-org/card";
import { Image } from "@nextui-org/image";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Tooltip } from "@nextui-org/tooltip";
import { User } from "@nextui-org/user";
import { Button } from "@nextui-org/button";
import { Avatar } from "@nextui-org/avatar";

import { ErrorCode } from "@/types/error/ErrorCode";
import { BaseResponse } from "@/types";
import { externalPost, GetPostListRequest, Post } from "@/types/post/post";
import { queryPostList } from "@/app/home/action";
import HomeLayout from "@/app/home/layout";

export default function HomePage() {
  const request: GetPostListRequest = {
    pageNo: 1,
    pageSize: 10,
    postId: "",
    categoryId: "",
    tagIds: [],
  };

  const [isFollowed, setIsFollowed] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res: BaseResponse<externalPost> = await queryPostList(request);

        if (res.data) {
          setList(res.data.records);
        } else {
          // 后端返回无数据
          toast.error(ErrorCode.SERVER_ERROR.message);
        }
      } catch (error) {
        console.error("err--->", error);
      }
    };

    fetchData();
  }, []);

  const [list, setList] = useState<Post[]>([]);

  return (
    <HomeLayout>
      <div className="gap-2 grid grid-cols-2 sm:grid-cols-4 m-4">
        {list.map((item, index) => (
          <Card
            key={index}
            isPressable
            shadow="sm"
            onPress={() => console.log("item pressed")}
          >
            <CardBody className="overflow-visible p-0">
              <Image
                alt={item.title}
                className="w-full object-cover h-[140px]"
                radius="lg"
                shadow="sm"
                src={item.urls[0].mediaUrl}
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
                          src="https://blogback.yannqing.com/api/v2/objects/avatar/0vqxqul8pu2skmwokn.jpg"
                        />
                        <div className="flex flex-col items-start justify-center">
                          <h4 className="text-small font-semibold leading-none text-default-600">
                            yanKing
                          </h4>
                          <h5 className="text-small tracking-tight text-default-500">
                            @zoeylang
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
                        Full-stack developer, @getnextui lover she/her
                        <span aria-label="confetti" role="img">
                          🎉
                        </span>
                      </p>
                    </CardBody>
                    <CardFooter className="gap-3">
                      <div className="flex gap-1">
                        <p className="font-semibold text-default-600 text-small">
                          4
                        </p>
                        <p className=" text-default-500 text-small">
                          Following
                        </p>
                      </div>
                      <div className="flex gap-1">
                        <p className="font-semibold text-default-600 text-small">
                          97.1K
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
                      src: "https://blogback.yannqing.com/api/v2/objects/avatar/0vqxqul8pu2skmwokn.jpg",
                      size: "sm",
                    }}
                    className="transition-transform mt-1"
                    description="Product Designer"
                    name="yanKing"
                  />
                </div>
              </Tooltip>
            </CardFooter>
          </Card>
        ))}
      </div>
    </HomeLayout>
  );
}
