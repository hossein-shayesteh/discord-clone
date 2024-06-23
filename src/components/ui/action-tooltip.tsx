import React from "react";

import {
  TooltipProvider,
  TooltipContent,
  Tooltip,
  TooltipTrigger,
} from "@/src/components/ui/tooltip";

interface ActionTooltipProps {
  children: React.ReactNode;
  label: string;
  side?: "top" | "right" | "left" | "bottom";
  align?: "start" | "center" | "end";
}

const ActionTooltip = ({
  align = "center",
  children,
  label,
  side = "right",
}: ActionTooltipProps) => {
  return (
    <TooltipProvider>
      <Tooltip delayDuration={50}>
        <TooltipTrigger asChild>{children}</TooltipTrigger>
        <TooltipContent side={side} align={align}>
          <p className={"text-sm font-semibold capitalize"}>
            {label.toLowerCase()}
          </p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
export default ActionTooltip;
