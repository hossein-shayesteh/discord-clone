import { redirect } from "next/navigation";
import { fetchChannel } from "@/src/lib/database/fetch-channel";
import ChatHeader from "@/src/app/(main)/(routes)/servers/[serverId]/_components/ChatHeader";

const ChannelPage = async ({
  params: { channelId },
}: {
  params: { channelId: string };
}) => {
  const channel = await fetchChannel(channelId);

  if (!channel) redirect("/");

  return (
    <div className={"flex h-full flex-col bg-white dark:bg-[#313338]"}>
      <ChatHeader
        name={channel.name}
        type={"channel"}
        serverId={channel.serverId}
      />
    </div>
  );
};
export default ChannelPage;