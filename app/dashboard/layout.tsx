import { Card, CardBody } from "@nextui-org/card";

import SideBar from "@/components/dashboard/sidebar";


export default function DashBoardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={"flex flex-row w-full h-full"}>
      <div className="flex flex-col w-full h-full">
        <Card className="max-w-full w-full h-full">
          <CardBody className="h-full flex flex-row">
            <SideBar />
            <div className={"w-full ml-6"}>
              {children}
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  )
}