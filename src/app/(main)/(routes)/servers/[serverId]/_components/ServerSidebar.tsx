import React from "react";
import { ChannelType, MemberRole } from "@prisma/client";
import { Hash, Mic, ShieldAlert, ShieldCheck, Video } from "lucide-react";
import { fetchServer } from "@/src/lib/database/fetch-server";
import { ScrollArea } from "@/src/components/ui/scroll-area";
import { Separator } from "@/src/components/ui/separator";
import ServerSidebarHeader from "@/src/app/(main)/(routes)/servers/[serverId]/_components/ServerSidebarHeader";
import ServerSearch from "@/src/app/(main)/(routes)/servers/[serverId]/_components/ServerSearch";
import ServerSection from "@/src/app/(main)/(routes)/servers/[serverId]/_components/ServerSection";
import ServerChannel from "@/src/app/(main)/(routes)/servers/[serverId]/_components/ServerChannel";
import ServerMember from "@/src/app/(main)/(routes)/servers/[serverId]/_components/ServerMember";

interface ServerSidebarProps {
  serverId: string;
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

const ServerSidebar = async ({ serverId }: ServerSidebarProps) => {
  const { server, role, audioChannels, members, textChannels, videoChannels } =
    await fetchServer(serverId);

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
