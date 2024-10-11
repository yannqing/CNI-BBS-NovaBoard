import { SVGProps } from "react";

export type IconSvgProps = SVGProps<SVGSVGElement> & {
  size?: number;
};

export type BaseResponse<Object> = {
  success?: boolean;
  message?: string;
  errorCode?: string;
  data?: Object;
};
