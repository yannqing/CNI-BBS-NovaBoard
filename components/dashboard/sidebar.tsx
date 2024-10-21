"use client";
import { Tab, Tabs } from "@nextui-org/tabs";
import { useRouter, usePathname } from "next/navigation";

export default function SideBar() {

  const router = useRouter()
  const path = usePathname()

  return(
    <div className={"h-full"}>
      <Tabs aria-label="Tabs" className={""} isVertical={true} selectedKey={path}>
        <Tab
          className={"w-52"}
          href="/dashboard/home"
          key="/dashboard/home"
          title={<div>仪表盘</div>}
        />
        <Tab key="/dashboard/photoes" href="/dashboard/photoes" title="Photos" />
        <Tab key="/music" href="/music" title="Music" />
        <Tab key="/videos" href="/videos" title="Videos" />
      </Tabs>
    </div>
  )
}