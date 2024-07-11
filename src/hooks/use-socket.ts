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
    };
  }, []);

  const connect = useCallback(() => {
    socket.connect();
  }, []);

  const disconnect = useCallback(() => {
    socket.disconnect();
  }, []);

  const emit = useCallback((event: string, data: any) => {
    socket.emit(event, data);
  }, []);

  const on = useCallback((event: string, callback: (data: any) => void) => {
    socket.on(event, callback);
    return () => {
      socket.off(event, callback);
    };
  }, []);

  return { isConnected, connect, disconnect, emit, on };
};
