"use client";

import { ElementRef, useEffect, useRef, useState } from "react";

import { Member } from "@prisma/client";
import {
  useQuery,
  useQueryClient,
  useInfiniteQuery,
} from "@tanstack/react-query";
import { Loader2 } from "lucide-react";

import { fetcher } from "@/src/lib/utils";
import { useSocket } from "@/src/hooks/use-socket";
import { MessagesWithProfile } from "@/src/types/db";

import ChatWelcome from "@/src/app/(main)/(routes)/servers/[serverId]/_components/ChatWelcome";
import ChatItem from "@/src/app/(main)/(routes)/servers/[serverId]/_components/ChatItem";
import { useChatScroll } from "@/src/hooks/use-chat-scroll";

interface ChatMessagesProps {
  name: string;
  chatId: string;
  serverId: string;
  type: "channel" | "conversation";
}

const ChatMessages = ({ name, type, chatId, serverId }: ChatMessagesProps) => {
  const chatRef = useRef<ElementRef<"div">>(null);
  const bottomRef = useRef<ElementRef<"div">>(null);

  const { subscribeToEvent } = useSocket();
  const queryClient = useQueryClient();

  const { data: currentMember, isLoading: isCurrentMemberLoading } =
    useQuery<Member>({
      queryKey: ["current-member", serverId],
      queryFn: () => fetcher(`/api/currentMember/${serverId}`),
    });

  const {
    data,
    isLoading: isMessagesLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ["messages", chatId],
    queryFn: ({ pageParam }) =>
      fetcher(
        `/api/message/${chatId}${pageParam ? `?cursor=${pageParam}` : ""}`,
      ),
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    initialPageParam: undefined,
  });

  // This hook handle scroll in chat page
  const { scrollToBottom, isNearBottom } = useChatScroll({
    chatRef,
    hasNextPage,
    fetchNextPage,
    bottomRef,
    isFetchingNextPage,
  });

  // This useEffect hook sets up a subscription to a Socket.IO message event for the current chatId.
  // When a new message is received, it triggers an invalidation of the query for messages associated with the current chatId
  useEffect(() => {
    const unsubscribe = subscribeToEvent(`message:${chatId}`, async () => {
      await queryClient.invalidateQueries({ queryKey: ["messages", chatId] });
      if (isNearBottom) {
        scrollToBottom();
      }
    });
    return () => {
      unsubscribe();
    };
  }, [subscribeToEvent, chatId, queryClient, isNearBottom, scrollToBottom]);

  if (isCurrentMemberLoading || isMessagesLoading) {
    return (
      <div className={"flex flex-1 items-center justify-center"}>
        <Loader2 className={"animate-spin"} />
      </div>
    );
  }

  const messages: MessagesWithProfile[] = data!.pages.flatMap(
    (page) => page.items,
  );

  if (messages && currentMember) {
    return (
      <div
        ref={chatRef}
        className={"flex flex-1 flex-col overflow-y-auto py-4"}
      >
        <div className={"flex-1"} />
        {!hasNextPage && <ChatWelcome type={type} name={name} />}
        {hasNextPage && (
          <div className={"flex justify-center"}>
            {isFetchingNextPage ? (
              <div className={"flex flex-1 items-center justify-center"}>
                <Loader2 className={"animate-spin"} />
              </div>
            ) : (
              <button
                onClick={() => fetchNextPage()}
                className={
                  "my-4 text-xs text-zinc-500 transition hover:text-zinc-600 dark:text-zinc-400 dark:hover:text-zinc-300"
                }
              >
                load previous message
              </button>
            )}
          </div>
        )}

        <div className={"mt-auto flex flex-col-reverse"}>
          {messages?.map((message: MessagesWithProfile) => (
            <ChatItem
              key={`${message.id + message.updatedAt}`}
              serverId={serverId}
              currentMember={currentMember}
              message={message}
            />
          ))}
        </div>
        <div ref={bottomRef} />
      </div>
    );
  }

  return null;
};

export default ChatMessages;
