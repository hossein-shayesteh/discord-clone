"use client";

import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { cn } from "@/src/lib/utils";
import ActionTooltip from "@/src/components/ui/action-tooltip";

interface NavigationItemProps {
  id: string;
  name: string;
  imageUrl: string;
}

const NavigationItem = ({ id, imageUrl, name }: NavigationItemProps) => {
  const params = useParams();
  const route = useRouter();

  const onClick = () => {
    route.push(`/servers/${id}`);
  };

  return (
    <ActionTooltip label={name}>
      <button
        onClick={onClick}
        className={"group relative my-3 flex items-center"}
      >
        <div
          className={cn(
            "absolute left-0 w-[4px] rounded-r-full bg-primary transition-all",
            params?.serverId !== id && "group-hover:h-[20px]",
            params?.serverId === id ? "h-[36px]" : "h-[8px]",
          )}
        />
        <div
          className={cn(
            "group relative mx-3 flex h-[48px] w-[48px] overflow-hidden rounded-[24px] transition-all group-hover:rounded-[16px]",
            params?.serverId === id &&
              "rounded-[16px] bg-primary/10 text-primary",
          )}
        >
          <Image
            src={imageUrl}
            alt={"Channel"}
            className={"object-cover"}
            fill
          />
        </div>
      </button>
    </ActionTooltip>
  );
};
export default NavigationItem;
