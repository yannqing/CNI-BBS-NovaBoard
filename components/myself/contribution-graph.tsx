import { Tooltip } from "@nextui-org/tooltip";
import clsx from "clsx";

interface node {
  date: string;
  times: number;
}

export default function ContributionGraph() {
  /**
   * 返回一个根据当前日期往前数 365 天的数组（造假数据）
   */
  function getDateArray() {
    // 创建一个长度为365的数组
    const dates: node[] = [];
    // 获取当前日期
    const currentDate = new Date();

    // 填充数组
    for (let i = 0; i < 365; i++) {
      // 创建一个新的日期对象，并减去相应的天数
      const pastDate = new Date(currentDate);

      pastDate.setDate(currentDate.getDate() - (364 - i));

      // 将日期格式化为 yyyy-MM-dd
      const formattedDate = pastDate.toISOString().split("T")[0];

      dates.push({
        date: formattedDate,
        times: i % 10,
      });
    }

    return dates;
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

  /**
   * 贡献图小方格
   * @param children
   */
  const square = ({ children }: { children: node }) => (
    <Tooltip content={children.date + " submit times:" + children.times}>
      <div
        key={children.date}
        className={clsx(
          "w-3 h-3 m-0.5 rounded",
          `bg-contribution-graph-${children.times}`,
        )}
      />
    </Tooltip>
  );

  const dateList: node[] = getDateArray();

  // 索引遍历获取月份
  let i: number = 0;
  let total: number = 0;

  getDateArray().map((children) => {
    total += children.times;
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
            {MonthArray[(new Date(dateList[0].date).getMonth() + i++) % 12]}
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
        {Array.from({ length: new Date(dateList[0].date).getDay() }).map(
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
