import { redirect } from "next/navigation";
import { fetchChannel } from "@/src/lib/database/fetch-channel";
import ChatHeader from "@/src/app/(main)/(routes)/servers/[serverId]/_components/ChatHeader";
import ChatInput from "@/src/app/(main)/(routes)/servers/[serverId]/_components/ChatInput";

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
      <div className={"flex-1"}>Future messages</div>
      <ChatInput
        channelId={channelId}
        serverId={serverId}
        type={"channel"}
        name={channel.name}
      />
    </div>
  );
};
export default ChannelPage;
