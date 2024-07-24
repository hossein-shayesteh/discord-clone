"use client";

import { useEffect } from "react";
import { Member, Message } from "@prisma/client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { useSocket } from "@/src/hooks/use-socket";
import { MessagesWithProfile } from "@/src/types/db";
import { fetcher } from "@/src/lib/utils";
import ChatWelcome from "@/src/app/(main)/(routes)/servers/[serverId]/_components/ChatWelcome";
import ChatItem from "@/src/app/(main)/(routes)/servers/[serverId]/_components/ChatItem";

interface ChatMessagesProps {
  name: string;
  chatId: string;
  serverId: string;
  type: "channel" | "conversation";
}

const ChatMessages = ({ name, type, chatId, serverId }: ChatMessagesProps) => {
  const { subscribeToEvent } = useSocket();
  const queryClient = useQueryClient();

  const { data: currentMember, isLoading: isCurrentMemberLoading } =
    useQuery<Member>({
      queryKey: ["current-member", serverId],
      queryFn: () => fetcher(`/api/currentMember/${serverId}`),
    });

  const { data: messages, isLoading: isMessagesLoading } = useQuery<
    MessagesWithProfile[]
  >({
    queryKey: ["messages", chatId],
    queryFn: () => fetcher(`/api/message/${chatId}`),
  });

  // This useEffect hook sets up a subscription to a Socket.IO message event for the current chatId.
  // When a new message is received, it triggers an invalidation of the query for messages associated with the current chatId
  useEffect(() => {
    const unsubscribe = subscribeToEvent(
      `message:${chatId}`,
      async (data: Message) => {
        await queryClient.invalidateQueries({ queryKey: ["messages", chatId] });
      },
    );
    return () => {
      unsubscribe();
    };
  }, [subscribeToEvent, chatId, queryClient]);

  if (isCurrentMemberLoading || isMessagesLoading) {
    return (
      <div className={"flex flex-1 items-center justify-center"}>
        <Loader2 className={"animate-spin"} />
      </div>
    );
  }

  if (messages && currentMember) {
    return (
      <div className={"flex flex-1 flex-col overflow-y-auto py-4"}>
        <div className={"flex-1"} />
        <ChatWelcome type={type} name={name} />
        <div className={"mt-auto flex flex-col-reverse"}>
          {messages?.map((message: MessagesWithProfile) => (
            <ChatItem
              key={message.id}
              serverId={serverId}
              currentMember={currentMember}
              message={message}
            />
          ))}
        </div>
      </div>
    );
  }

  return null;
};

export default ChatMessages;
