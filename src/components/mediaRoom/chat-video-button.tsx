"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

import qs from "query-string";
import { Video, VideoOff } from "lucide-react";

import ActionTooltip from "@/src/components/ui/action-tooltip";

const ChatVideoButton = () => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const isVideo = searchParams.get("video");

  const Icon = isVideo ? VideoOff : Video;
  const tooltipLabel = isVideo ? "End video call" : "Start video call";

  const onClick = () => {
    const url = qs.stringifyUrl(
      {
        url: pathname || "",
        query: {
          video: isVideo ? undefined : true,
        },
      },
      { skipNull: true },
    );
    router.push(url);
  };
  return (
    <ActionTooltip label={tooltipLabel} side={"bottom"}>
      <button onClick={onClick} className={"mr-4 transition hover:opacity-70"}>
        <Icon className={"h-6 w-6 text-zinc-500 dark:text-zinc-400"} />
      </button>
    </ActionTooltip>
  );
};

export default ChatVideoButton;
