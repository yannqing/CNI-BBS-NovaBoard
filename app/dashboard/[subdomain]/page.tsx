'use client'
import ContributionGraph from "@/components/myself/contribution-graph";
import DashBoardHomeOverView from "@/components/dashboard/home-overview";
import { title } from "@/components/primitives";
import { getCookie } from "@/utils/cookies";
import { useEffect, useState } from "react";
import { FrequencyAction } from "@/app/dashboard/[subdomain]/action";
import { FrequencyRequest,FrequencyVo } from "@/types/dashboard/myself"

export default function SubdomainPage({
  params,
}: {
  params: { subdomain: string };
}) {

  const userId = getCookie()?.id as string;
  const [frequencyList,setFrequencyList] = useState<FrequencyVo[]>([]);
  const fetchFrequency = async () => {
    const request : FrequencyRequest = { userId };
    const res = await FrequencyAction(request)
    debugger
    setFrequencyList(res.data);
  }
  useEffect(() => {
    fetchFrequency();
  }, []); 
  return (
    <div className={"w-full"}>
      <div className={title()}>个人主页，仪表盘：{params.subdomain}</div>
      <DashBoardHomeOverView />
      <ContributionGraph frequencyList = {frequencyList}/>
    </div>
  );
}
