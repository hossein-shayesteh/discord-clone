import React from "react";
import { fetchServer } from "@/src/lib/database/fetch-server";
import ServerSidebar from "@/src/app/(main)/(routes)/servers/[serverId]/_components/ServerSidebar";

interface ServerIdLayoutProps {
  children: React.ReactNode;
  params: { serverId: string };
}

const ServerIdLayout = async ({
  children,
  params: { serverId },
}: Readonly<ServerIdLayoutProps>) => {
  const { server } = await fetchServer(serverId);

  return (
    <div className={"h-full"}>
      <div
        className={"fixed inset-y-0 z-20 hidden h-full w-60 flex-col md:flex"}
      >
        <ServerSidebar serverId={serverId} />
      </div>
      <main className={"h-full md:pl-60"}>{children}</main>
    </div>
  );
};
export default ServerIdLayout;
