import { useState, useCallback, useEffect } from "react";
import { socket } from "@/src/socket";

interface FooEvent {
  message: string;
}

export const useSocket = () => {
  const [isConnected, setIsConnected] = useState<boolean>(socket.connected);
  const [fooEvents, setFooEvents] = useState<FooEvent[]>([]);

  const connect = useCallback(() => {
    socket.connect();
  }, []);

  const disconnect = useCallback(() => {
    socket.disconnect();
  }, []);

  useEffect(() => {
    const onConnect = () => {
      setIsConnected(true);
    };

    const onDisconnect = () => {
      setIsConnected(false);
    };

    const onFooEvent = (value: FooEvent) => {
      setFooEvents((previous) => [...previous, value]);
    };

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on("foo", onFooEvent);

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off("foo", onFooEvent);
    };
  }, []);

  return { isConnected, fooEvents, connect, disconnect };
};
