import ContributionGraph from "@/components/myself/contribution-graph";
import DashBoardHomeOverView from "@/components/dashboard/home-overview";
import { title } from "@/components/primitives";

export default function SubdomainPage({
  params,
}: {
  params: { subdomain: string };
}) {
  return (
    <div className={"w-full"}>
      <div className={title()}>个人主页，仪表盘：{params.subdomain}</div>
      <DashBoardHomeOverView />
      <ContributionGraph />
    </div>
  );
}
