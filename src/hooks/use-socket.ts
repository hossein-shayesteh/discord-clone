"use client";

import { useState, useEffect, useCallback } from "react";
import { socket } from "@/src/socket";

export const useSocket = () => {
  const [isConnected, setIsConnected] = useState<boolean>(socket.connected);

  useEffect(() => {
    const onConnect = () => {
      setIsConnected(true);
    };

    const onDisconnect = () => {
      setIsConnected(false);
    };

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.disconnect();
    };
  }, []);

  const connect = useCallback(() => {
    socket.connect();
  }, []);

  const disconnect = useCallback(() => {
    socket.disconnect();
  }, []);

  const emit = useCallback((event: any, data: any) => {
    socket.emit(event, data);
  }, []);

  return { isConnected, connect, disconnect, emit };
};
