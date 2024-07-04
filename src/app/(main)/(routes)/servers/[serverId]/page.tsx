import { redirect } from "next/navigation";
import { fetchGeneralChannel } from "@/src/lib/database/fetch-general-channel";

const ServerIdPage = async ({
  params: { serverId },
}: {
  params: { serverId: string };
}) => {
  const channel = await fetchGeneralChannel(serverId);

  if (channel?.name !== "general") return null;

  redirect(`/servers/${serverId}/channels/${channel?.id}`);
};
export default ServerIdPage;
