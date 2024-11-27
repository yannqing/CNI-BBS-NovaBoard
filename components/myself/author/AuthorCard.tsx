import React from "react";
import { Card, CardBody } from "@nextui-org/card";
import { Button } from "@nextui-org/button";
import { Image } from "@nextui-org/image";
import { Spacer } from "@nextui-org/spacer";
import { Link } from "@nextui-org/link";
import { UserPlus } from "lucide-react";

import { HeartIcon } from "./HeartIcon";

import { UserVo } from "@/types/auth/user";
import { siteConfig } from "@/config/site";
import { DiscordIcon, GithubIcon, TwitterIcon } from "@/components/home/icons";

export default function AuthorCard({ userVo }: { userVo: UserVo | undefined }) {
  const [liked, setLiked] = React.useState(false);

  return (
    <Card
      isBlurred
      className="border-none bg-background/60 dark:bg-default-100/50 max-w-[910px]"
      shadow="sm"
    >
      <CardBody>
        <div className="grid grid-cols-6 md:grid-cols-12 gap-6 md:gap-4 items-center justify-center">
          <div className="relative md:col-span-4 ml-10">
            <Image
              alt="Album cover"
              className="object-cover"
              height={170}
              shadow="md"
              src={userVo?.avatar}
              width="100%"
            />
          </div>

          <div className="flex flex-col col-span-6 md:col-span-8">
            <div className="flex">
              <Button
                isIconOnly
                className="absolute right-10 top-4 w-16"
                radius="lg"
                variant="light"
                onPress={() => setLiked((v) => !v)}
              >
                <UserPlus />
                <Spacer />
                关注
              </Button>
              <div className="flex flex-col gap-0 ml-0">
                <div className="font-semibold text-foreground/90 ml-4 text-2xl">
                  {userVo?.userName}
                </div>
                <p className="text-small text-foreground/80 ml-4">
                  {userVo?.bio}
                </p>
                <div className={"flex flex-row"}>
                  <Button color="primary" variant="light">
                    {userVo?.fansCount} 关注者
                  </Button>
                  <Button color="primary" variant="light">
                    {userVo?.followingCount} 正在关注
                  </Button>
                  <Button
                    isIconOnly
                    className="data-[hover]:bg-foreground/10 h-9 w-16 mt-0.5"
                    variant="light"
                    onPress={() => setLiked((v) => !v)}
                  >
                    <HeartIcon
                      className={liked ? "[&>path]:stroke-transparent" : ""}
                      fill={liked ? "currentColor" : "red"}
                      height={undefined}
                      width={undefined}
                    />
                    <Spacer />
                    赞助
                  </Button>
                </div>
                <div className={"flex flex-row gap-2"}>
                  <Link isExternal href={siteConfig.links.google}>
                    <GithubIcon className="text-default-500 ml-4" />
                  </Link>
                  <Link isExternal href={siteConfig.links.gitee}>
                    <TwitterIcon className="text-default-500" />
                  </Link>
                  <Link isExternal href={siteConfig.links.wechat}>
                    <DiscordIcon className="text-default-500" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardBody>
    </Card>
  );
}
