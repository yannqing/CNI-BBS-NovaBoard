import { Link } from "@nextui-org/link";
import { Snippet } from "@nextui-org/snippet";
import { Code } from "@nextui-org/code";
import { button as buttonStyles } from "@nextui-org/theme";

import { siteConfig } from "@/config/site";
import { title, subtitle } from "@/components/primitives";
import { GithubIcon } from "@/components/home/icons";
export default function AboutPage() {
  return (
    <div>
      <div className="inline-block max-w-xl text-center justify-center">
        <h1 className={title()}>欢迎使用&nbsp;</h1>
        <h1 className={title({ color: "violet" })}>CNI-BBS&nbsp;</h1>
        <br />
        <h1 className={title()}>
          一个现代化的论坛
        </h1>
        <h4 className={subtitle({ class: "mt-4" })}>
         Welcome to CNI-BBS
        </h4>
      </div>

 
    </div>
  );
}
