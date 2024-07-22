"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { socket } from "@/src/socket";

interface UseSocket {
  isConnected: boolean;
  connect: () => void;
  disconnect: () => void;
  emit: (event: string, data: any) => void;
  subscribeToEvent: (
    event: string,
    callback: (data: any) => void,
  ) => () => void;
}

export const useSocket = (): UseSocket => {
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const eventCallbacks = useRef(new Map<string, (data: any) => void>());

  useEffect(() => {
    const onConnect = () => {
      setIsConnected(true);
    };

    const onDisconnect = () => {
      setIsConnected(false);
    };

    // Capture the current value of eventCallbacks.current
    const currentEventCallbacks = eventCallbacks.current;

    // Initialize the connection status
    setIsConnected(socket.connected);

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);

    currentEventCallbacks.forEach((callback, event) => {
      socket.on(event, callback);
    });

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);

      currentEventCallbacks.forEach((callback, event) => {
        socket.off(event, callback);
      });
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

  const subscribeToEvent = useCallback(
    (event: string, callback: (data: any) => void) => {
      eventCallbacks.current.set(event, callback);
      socket.on(event, callback);

      return () => {
        eventCallbacks.current.delete(event);
        socket.off(event, callback);
      };
    },
    [],
  );

  return { isConnected, connect, disconnect, emit, subscribeToEvent };
};
