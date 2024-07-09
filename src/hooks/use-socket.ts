"use client";

import { useState, useEffect, useCallback } from "react";
import { socket } from "@/src/socket";

const useSocket = () => {
  const [isConnected, setIsConnected] = useState<boolean>(socket.connected);

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

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
    };
  }, []);

  return { isConnected, connect, disconnect };
};
