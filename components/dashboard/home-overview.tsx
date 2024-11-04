import { Card, CardBody } from "@nextui-org/card";
import {
  CircleDollarSign,
  Eye,
  FilePenLine,
  LucideIcon,
  MessagesSquare,
  ThumbsUp,
  Trophy,
  UsersRound,
} from "lucide-react";

interface OverviewCard {
  name: string;
  count: string;
  icon: LucideIcon;
}

export default function DashBoardHomeOverView() {
  const date: OverviewCard[] = [
    {
      name: "创作",
      count: "89",
      icon: FilePenLine,
    },
    {
      name: "评论",
      count: "326",
      icon: MessagesSquare,
    },
    {
      name: "打赏",
      count: "35",
      icon: CircleDollarSign,
    },
    {
      name: "点赞",
      count: "699.1k",
      icon: ThumbsUp,
    },
    {
      name: "关注者",
      count: "23",
      icon: UsersRound,
    },
    {
      name: "成就",
      count: "18",
      icon: Trophy,
    },
    {
      name: "浏览量",
      count: "12.4k",
      icon: Eye,
    },
  ];

  return (
    <div className={"flex flex-wrap flex-row mt-10"}>
      {date.map((item) => (
        <Card
          key={item.name}
          isPressable
          className="w-[300px] bg-overview-card m-3"
        >
          <CardBody>
            <div className="flex flex-col">
              <span className={"flex flex-row"}>
                <item.icon />
                <div className={"ml-2"}>{item.name}</div>
              </span>
            </div>
            <p className={"ml-2 text-xl"}>{item.count}</p>
          </CardBody>
        </Card>
      ))}
    </div>
  );
}
