"use client";

import { useSocket } from "@/src/hooks/use-socket";
import { Badge } from "@/src/components/ui/badge";

const SocketIndicator = () => {
  const { isConnected, connect, disconnect } = useSocket();

  if (!isConnected)
    return (
      <Badge
        onClick={() => disconnect()}
        variant={"outline"}
        className={"h-5 w-5 rounded-full border-none bg-emerald-600"}
      ></Badge>
    );

  return (
    <Badge
      onClick={() => connect()}
      variant={"outline"}
      className={"h-5 w-5 rounded-full border-none bg-emerald-600"}
    ></Badge>
  );
};

export default SocketIndicator;
