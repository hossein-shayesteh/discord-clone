import { redirect } from "next/navigation";

import { fetchChannel } from "@/src/lib/database/fetch-channel";

import MediaRoom from "@/src/components/mediaRoom/mediaRoom";
import ChatHeader from "@/src/app/(main)/(routes)/servers/[serverId]/_components/ChatHeader";
import ChatInput from "@/src/app/(main)/(routes)/servers/[serverId]/_components/ChatInput";
import ChatMessages from "@/src/app/(main)/(routes)/servers/[serverId]/_components/ChatMessages";

interface ChannelPageProps {
  params: { channelId: string; serverId: string };
}
const ChannelPage = async ({
  params: { channelId, serverId },
}: ChannelPageProps) => {
  const channel = await fetchChannel(channelId);

  if (!channel) redirect("/");

  return (
    <div className={"flex h-full flex-col bg-white dark:bg-[#313338]"}>
      <ChatHeader
        name={channel.name}
        type={"channel"}
        serverId={channel.serverId}
      />
      {channel.type == "TEXT" && (
        <>
          <ChatMessages
            type={"channel"}
            name={channel.name}
            chatId={channelId}
            serverId={serverId}
          />
          <ChatInput
            channelId={channelId}
            serverId={serverId}
            type={"channel"}
            name={channel.name}
          />
        </>
      )}
      {channel.type === "AUDIO" && (
        <MediaRoom
          chatId={channelId}
          video={false}
          audio={true}
          serverId={serverId}
        />
      )}
      {channel.type === "VIDEO" && (
        <MediaRoom
          chatId={channelId}
          video={true}
          audio={true}
          serverId={serverId}
        />
      )}
    </div>
  );
};
export default ChannelPage;
