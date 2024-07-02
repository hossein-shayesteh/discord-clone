"use client";

import React from "react";
import { useRouter, useParams } from "next/navigation";
import { Channel, ChannelType, MemberRole, Server } from "@prisma/client";
import { Edit, Hash, Lock, Mic, Trash, Video } from "lucide-react";
import ActionTooltip from "@/src/components/ui/action-tooltip";
import { cn } from "@/src/lib/utils";
import { useModal } from "@/src/hooks/useModal";

interface ServerChannelProps {
  channel: Channel;
  server: Server;
  role?: MemberRole;
}

const channelTypeIconMap = {
  [ChannelType.TEXT]: (
    <Hash
      className={"h-5 w-5 flex-shrink-0 text-zinc-500 dark:text-zinc-400"}
    />
  ),
  [ChannelType.AUDIO]: (
    <Mic className={"h-5 w-5 flex-shrink-0 text-zinc-500 dark:text-zinc-400"} />
  ),
  [ChannelType.VIDEO]: (
    <Video
      className={"h-5 w-5 flex-shrink-0 text-zinc-500 dark:text-zinc-400"}
    />
  ),
};

const ServerChannel = ({ channel, role, server }: ServerChannelProps) => {
  const { onOpen } = useModal();

  const router = useRouter();
  const params = useParams();

  // // Function to handle click on command items
  // const onClick = (id: string) => {
  //   router.push(`/servers/${params.serverId}/channels/${id}`);
  // };

  return (
    <button
      // onClick={() => onClick(channel.id)}
      className={cn(
        "group mb-1 flex w-full items-center gap-x-2 rounded-md p-2 transition hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50",
        params?.channelId === channel.id && "bg-zinc-700/20 dark:bg-zinc-700",
      )}
    >
      {channelTypeIconMap[channel.type]}
      <p
        className={cn(
          "line-clamp-1 text-sm font-semibold text-zinc-500 transition group-hover:text-zinc-600 dark:text-zinc-400 dark:group-hover:text-zinc-300",
          params?.channelId === channel.id &&
            "text-primary dark:text-zinc-200 dark:group-hover:text-white",
        )}
      >
        {channel.name}
      </p>
      {channel.name !== "general" && role !== MemberRole.GUEST && (
        <div className={"ml-auto flex items-center gap-x-2"}>
          <ActionTooltip label={"Edit"} side={"top"}>
            <Edit
              className={
                "hidden h-4 w-4 text-zinc-500 transition hover:text-zinc-600 group-hover:block dark:text-zinc-400 dark:hover:text-zinc-300"
              }
            />
          </ActionTooltip>
          <ActionTooltip label={"Delete"} side={"top"}>
            <Trash
              // Open delete channel modal
              onClick={() => onOpen("deleteChannel", { channel, server })}
              className={
                "hidden h-4 w-4 text-zinc-500 transition hover:text-zinc-600 group-hover:block dark:text-zinc-400 dark:hover:text-zinc-300"
              }
            />
          </ActionTooltip>
        </div>
      )}
      {channel.name === "general" && (
        <div className={"ml-auto flex items-center gap-x-2"}>
          <Lock className={"h-4 w-4 text-zinc-500 dark:text-zinc-400"} />
        </div>
      )}
    </button>
  );
};
export default ServerChannel;
