"use client";

import React, { useEffect } from "react";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Channel, ChannelType, MemberRole } from "@prisma/client";
import { Hash, Mic, ShieldAlert, ShieldCheck, Video } from "lucide-react";

import { fetcher } from "@/src/lib/utils";
import {
  MemberWithProfile,
  ServerWithMembersWithProfiles,
} from "@/src/types/db";

import { ScrollArea } from "@/src/components/ui/scroll-area";
import { Separator } from "@/src/components/ui/separator";
import ServerSidebarHeader from "@/src/app/(main)/(routes)/servers/[serverId]/_components/ServerSidebarHeader";
import ServerSearch from "@/src/app/(main)/(routes)/servers/[serverId]/_components/ServerSearch";
import ServerSection from "@/src/app/(main)/(routes)/servers/[serverId]/_components/ServerSection";
import ServerChannel from "@/src/app/(main)/(routes)/servers/[serverId]/_components/ServerChannel";
import ServerMember from "@/src/app/(main)/(routes)/servers/[serverId]/_components/ServerMember";
import { Skeleton } from "@/src/components/ui/skeleton";
import { useSocket } from "@/src/hooks/use-socket";

interface ServerSidebarProps {
  serverId: string;
}

interface QueryData {
  server: ServerWithMembersWithProfiles;
  textChannels: Channel[];
  audioChannels: Channel[];
  videoChannels: Channel[];
  members: MemberWithProfile[];
  role: MemberRole;
}

const channelTypeIconMap = {
  [ChannelType.TEXT]: <Hash className={"mr-2 h-4 w-4"} />,
  [ChannelType.AUDIO]: <Mic className={"mr-2 h-4 w-4"} />,
  [ChannelType.VIDEO]: <Video className={"mr-2 h-4 w-4"} />,
};

const roleIconMap = {
  [MemberRole.GUEST]: null,
  [MemberRole.MODERATOR]: (
    <ShieldCheck className={"mr-2 h-4 w-4 text-indigo-500"} />
  ),
  [MemberRole.ADMIN]: <ShieldAlert className={"mr-2 h-4 w-4 text-rose-500"} />,
};

const ServerSidebar = ({ serverId }: ServerSidebarProps) => {
  const { subscribeToEvent } = useSocket();
  const queryClient = useQueryClient();

  const { data, isLoading, isError } = useQuery<QueryData>({
    queryKey: ["server", serverId],
    queryFn: () => fetcher(`/api/server/${serverId}`),
  });

  // This useEffect hook sets up a subscription to a Socket.IO.
  // When a new channel is created, it triggers an invalidation of the query for channel associated with the current serverId
  useEffect(() => {
    const unsubscribe = subscribeToEvent(`channel:${serverId}`, async () => {
      console.log("channel changed");
      await queryClient.invalidateQueries({ queryKey: ["server", serverId] });
    });
    return () => {
      unsubscribe();
    };
  }, [subscribeToEvent, serverId, queryClient]);

  if (isLoading) {
    return (
      <div className="flex h-full w-full flex-col bg-[#F2F3F5] text-primary dark:bg-[#2B2D31]">
        {/* ServerSidebarHeader skeleton */}
        <div className="flex h-12 w-full items-center border-b-2 border-neutral-200 px-3 dark:border-neutral-800">
          <Skeleton className="h-5 w-[150px] bg-zinc-700/10 dark:bg-zinc-700/50" />
          <Skeleton className="ml-auto h-5 w-5 bg-zinc-700/10 text-zinc-500 dark:bg-zinc-700/50" />
        </div>

        <ScrollArea className="flex-1 px-3">
          {/* ServerSearch skeleton */}
          <div className="mt-2">
            <Skeleton className="h-9 w-full bg-zinc-700/10 dark:bg-zinc-700/50" />
          </div>
          <Separator className="my-2 rounded-md bg-zinc-200 dark:bg-zinc-700" />
          {/* Text Channels */}
          <div className="flex items-center justify-between py-2">
            <Skeleton className="h-4 w-[80px] bg-zinc-700/10 dark:bg-zinc-700/50" />
            <Skeleton className="h-4 w-4 bg-zinc-700/10 dark:bg-zinc-700/50" />
          </div>
          <div className="mb-2">
            {[...Array(3)].map((_, i) => (
              <div
                key={`text-${i}`}
                className="mt-2 flex items-center rounded-md p-1"
              >
                <Skeleton className="h-6 w-full bg-zinc-700/10 dark:bg-zinc-700/50" />
              </div>
            ))}
          </div>

          {/* Voice Channels */}
          <div className="flex items-center justify-between py-2">
            <Skeleton className="h-4 w-[80px] bg-zinc-700/10 dark:bg-zinc-700/50" />
            <Skeleton className="h-4 w-4 bg-zinc-700/10 dark:bg-zinc-700/50" />
          </div>
          <div className="mb-2">
            {[...Array(3)].map((_, i) => (
              <div
                key={`text-${i}`}
                className="mt-2 flex items-center rounded-md p-1"
              >
                <Skeleton className="h-6 w-full bg-zinc-700/10 dark:bg-zinc-700/50" />
              </div>
            ))}
          </div>

          {/* Video Channels */}
          <div className="flex items-center justify-between py-2">
            <Skeleton className="h-4 w-[80px] bg-zinc-700/10 dark:bg-zinc-700/50" />
            <Skeleton className="h-4 w-4 bg-zinc-700/10 dark:bg-zinc-700/50" />
          </div>
          <div className="mb-2">
            {[...Array(3)].map((_, i) => (
              <div
                key={`text-${i}`}
                className="mt-2 flex items-center rounded-md p-1"
              >
                <Skeleton className="h-6 w-full bg-zinc-700/10 dark:bg-zinc-700/50" />
              </div>
            ))}
          </div>

          {/* Members */}
          <div className="flex items-center justify-between py-2">
            <Skeleton className="h-4 w-[80px] bg-zinc-700/10 dark:bg-zinc-700/50" />
            <Skeleton className="h-4 w-4 bg-zinc-700/10 dark:bg-zinc-700/50" />
          </div>
          <div className="mb-2">
            {[...Array(4)].map((_, i) => (
              <div
                key={`member-${i}`}
                className="mb-1 flex items-center gap-x-2 rounded-md p-2"
              >
                <Skeleton className="h-8 w-8 rounded-full bg-zinc-700/10 dark:bg-zinc-700/50" />
                <Skeleton className="h-4 w-[100px] bg-zinc-700/10 dark:bg-zinc-700/50" />
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>
    );
  }

  if (isError || !data) {
    return null;
  }

  const { server, textChannels, audioChannels, videoChannels, members, role } =
    data;

  return (
    <div
      className={
        "flex h-full w-full flex-col bg-[#F2F3F5] text-primary dark:bg-[#2B2D31]"
      }
    >
      <ServerSidebarHeader role={role!} server={server} />
      <ScrollArea className={"flex-1 px-3"}>
        <div className={"mt-2"}>
          <ServerSearch
            data={[
              {
                label: "Text Channels",
                type: "channel",
                data: textChannels.map((channel) => ({
                  id: channel.id,
                  name: channel.name,
                  icon: channelTypeIconMap[channel.type],
                })),
              },
              {
                label: "Audio Channels",
                type: "channel",
                data: audioChannels.map((channel) => ({
                  id: channel.id,
                  name: channel.name,
                  icon: channelTypeIconMap[channel.type],
                })),
              },
              {
                label: "Video Channels",
                type: "channel",
                data: videoChannels.map((channel) => ({
                  id: channel.id,
                  name: channel.name,
                  icon: channelTypeIconMap[channel.type],
                })),
              },
              {
                label: "Members",
                type: "members",
                data: members.map((member) => ({
                  id: member.id,
                  name: member.profile.name,
                  icon: roleIconMap[member.role],
                })),
              },
            ]}
          />
        </div>
        <Separator className={"my-2 rounded-md bg-zinc-200 dark:bg-zinc-700"} />
        {!!textChannels?.length && (
          <div className={"mb-2"}>
            <ServerSection
              role={role}
              server={server}
              label={"Text Channels"}
              sectionType={"channel"}
              channelType={ChannelType.TEXT}
            />
            {textChannels.map((channel) => (
              <ServerChannel
                key={channel.id}
                channel={channel}
                role={role}
                server={server}
              />
            ))}
          </div>
        )}
        {!!audioChannels?.length && (
          <div className={"mb-2"}>
            <ServerSection
              role={role}
              server={server}
              label={"Voice Channels"}
              sectionType={"channel"}
              channelType={ChannelType.AUDIO}
            />
            {audioChannels.map((channel) => (
              <ServerChannel
                key={channel.id}
                channel={channel}
                role={role}
                server={server}
              />
            ))}
          </div>
        )}
        {!!videoChannels?.length && (
          <div className={"mb-2"}>
            <ServerSection
              role={role}
              server={server}
              label={"Video Channels"}
              sectionType={"channel"}
              channelType={ChannelType.VIDEO}
            />
            {videoChannels.map((channel) => (
              <ServerChannel
                key={channel.id}
                channel={channel}
                role={role}
                server={server}
              />
            ))}
          </div>
        )}
        {!!members?.length && (
          <div className={"mb-2"}>
            <ServerSection
              role={role}
              server={server}
              label={"Members"}
              sectionType={"members"}
              channelType={ChannelType.TEXT}
            />
            {members.map((member) => (
              <ServerMember key={member.id} member={member} server={server} />
            ))}
          </div>
        )}
      </ScrollArea>
    </div>
  );
};
export default ServerSidebar;
