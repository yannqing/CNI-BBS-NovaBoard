import { Tooltip } from "@nextui-org/tooltip";
import clsx from "clsx";
import { FrequencyVo } from "@/types/dashboard/myself";
interface ContributionGraphProps {
  frequencyList: FrequencyVo[];
}
export default function ContributionGraph({ frequencyList }: ContributionGraphProps) {

  if (!frequencyList || frequencyList.length === 0) {
    return <div>Loading...</div>;
  }
  function getDateArray() {
    return frequencyList;
  }

  const MonthArray: string[] = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const getBgColor = (postCount: number) => {
    if (postCount === 0) return "bg-gray-300"; // 0 投稿
    if (postCount <= 2) return "bg-green-200"; // 小量投稿
    if (postCount <= 3) return "bg-yellow-200"; // 中量投稿
    return "bg-red-300"; // 大量投稿
  };
  /**
   * 贡献图小方格
   * @param children
   */
  const square = ({ children }: { children: FrequencyVo  }) => (
    <Tooltip content={children.postDate + " submit times:" + children.postCount}>
      <div
        key={children.postDate}
        className={clsx(
          "w-3 h-3 m-0.5 rounded",
          getBgColor(children.postCount),
        )}
      />
    </Tooltip>
  );

 
  const dateList: FrequencyVo[] = getDateArray();

  // 索引遍历获取月份
  let i: number = 0;
  let total: number = 0;

  getDateArray().map((children) => {
    total += children.postCount;
  });

  return (
    <div className={"mt-10 mx-3"}>
      <div className={""}>
        {Array.from({ length: 13 }).map((_, index) => (
          <span
            key={index}
            className={clsx(
              "w-5 h-5 text-xs",
              { "ml-14": index !== 0 && index !== 1 },
              { "ml-8": index === 0 },
              { "ml-1": index === 1 },
            )}
          >
           {dateList[0]?.postDate &&
              MonthArray[(new Date(dateList[0].postDate).getMonth() + i++) % 12]}
          </span>
        ))}
      </div>
      <div className="grid grid-flow-col grid-rows-7">
        <div className={"col-span-7 w-5 h-5 text-xs"} />
        <div className={"col-span-7 w-5 h-5 text-xs"}>Mon</div>
        <div className={"col-span-7 w-5 h-5 text-xs"} />
        <div className={"col-span-7 w-5 h-5 text-xs"}>Wed</div>
        <div className={"col-span-7 w-5 h-5 text-xs"} />
        <div className={"col-span-7 w-5 h-5 text-xs"}>Fri</div>
        <div className={"col-span-7 w-5 h-5 text-xs"} />
        {Array.from({ length: new Date(dateList[0]?.postDate).getDay() }).map(
          (_, index) => (
            <div key={index} className={clsx("w-3 h-3 m-0.5 rounded")} />
          ),
        )}
        {dateList.map((date) => date && square({ children: date }))}
      </div>
      <div className={"text-xs ml-8"}>
        the submit total in after year is:
        <span className={"font-bold"}>{total}</span>
      </div>
    </div>
  );
}
