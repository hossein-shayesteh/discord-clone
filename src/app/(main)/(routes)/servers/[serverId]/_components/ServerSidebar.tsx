import { fetchServer } from "@/src/lib/database/fetch-server";
import ServerSidebarHeader from "@/src/app/(main)/(routes)/servers/[serverId]/_components/ServerSidebarHeader";

interface ServerSidebarProps {
  serverId: string;
}

const ServerSidebar = async ({ serverId }: ServerSidebarProps) => {
  const { server, role } = await fetchServer(serverId);

  return (
    <div
      className={
        "flex h-full w-full flex-col bg-[#F2F3F5] text-primary dark:bg-[#2B2D31]"
      }
    >
      <ServerSidebarHeader role={role!} server={server} />
    </div>
  );
};
export default ServerSidebar;
