"use client";

import { Button, ButtonGroup } from "@nextui-org/button";
import { Grid2x2, Menu } from "lucide-react";
import { useState } from "react";

import SelectButton from "@/components/privacy-cloud/SelectButton";
import ShowData from "@/components/privacy-cloud/ShowData";

export default function PrivacyCloudPage() {
  const [isList, setIsList] = useState(false);

  return (
    <div className="w-full p-4">
      <div className="w-full flex justify-between items-center">
        <div className="text-3xl">我的云端硬盘</div>
        <div>
          <ButtonGroup>
            <Button>
              <Menu />
            </Button>
            <Button>
              <Grid2x2 />
            </Button>
          </ButtonGroup>
        </div>
      </div>
      <div className={"mt-5"}>
        <div className={"gap-3 flex"}>
          <SelectButton> 类型 </SelectButton>
          <SelectButton> 相关人员 </SelectButton>
          <SelectButton> 修改时间 </SelectButton>
          <SelectButton> 来源 </SelectButton>
        </div>
      </div>
      <div>
        <ShowData />
      </div>
    </div>
  );
}
