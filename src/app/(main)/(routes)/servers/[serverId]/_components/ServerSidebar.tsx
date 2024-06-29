import { fetchServer } from "@/src/lib/database/fetch-server";
import ServerSidebarHeader from "@/src/app/(main)/(routes)/servers/[serverId]/_components/ServerSidebarHeader";
import { ScrollArea } from "@/src/components/ui/scroll-area";
import ServerSearch from "@/src/app/(main)/(routes)/servers/[serverId]/_components/ServerSearch";
import { ChannelType, MemberRole } from "@prisma/client";
import { Hash, Mic, ShieldAlert, ShieldCheck, Video } from "lucide-react";

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
                type: "member",
                data: members.map((member) => ({
                  id: member.id,
                  name: member.profile.name,
                  icon: roleIconMap[member.role],
                })),
              },
            ]}
          />
        </div>
      </ScrollArea>
    </div>
  );
};
export default ServerSidebar;
