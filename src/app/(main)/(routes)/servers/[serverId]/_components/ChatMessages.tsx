"use client";

import { MessagesWithProfile } from "@/src/types/db";
import ChatWelcome from "@/src/app/(main)/(routes)/servers/[serverId]/_components/ChatWelcome";
import ChatItem from "@/src/app/(main)/(routes)/servers/[serverId]/_components/ChatItem";
import { useQuery } from "@tanstack/react-query";
import { fetcher } from "@/src/lib/utils";
import { Member } from "@prisma/client";
import { Loader2 } from "lucide-react";

interface ChatMessagesProps {
  name: string;
  chatId: string;
  serverId: string;
  type: "channel" | "conversation";
}

const ChatMessages = ({ name, type, chatId, serverId }: ChatMessagesProps) => {
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
