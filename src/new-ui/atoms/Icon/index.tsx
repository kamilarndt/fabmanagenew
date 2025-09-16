import { cn } from "@/new-ui/utils/cn";
import * as React from "react";

export interface IconProps extends React.SVGAttributes<SVGElement> {
  as?: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  size?: number;
}

export function Icon({
  as: Svg,
  size = 16,
  className,
  ...props
}: IconProps): React.ReactElement | null {
  if (!Svg) return null;
  return (
    <Svg
      width={size}
      height={size}
      className={cn("tw-inline-block", className)}
      {...props}
    />
  );
}
