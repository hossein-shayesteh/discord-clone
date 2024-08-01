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

interface ChatMessagesProps {
  name: string;
  chatId: string;
  serverId: string;
  type: "channel" | "conversation";
}

const ChatMessages = ({ name, type, chatId, serverId }: ChatMessagesProps) => {
  const chatContainerRef = useRef<ElementRef<"div">>(null);
  const [hasReachedTop, setHasReachedTop] = useState(false);

  const { subscribeToEvent } = useSocket();
  const queryClient = useQueryClient();

  const { data: currentMember, isLoading: isCurrentMemberLoading } =
    useQuery<Member>({
      queryKey: ["current-member", serverId],
      queryFn: ({ pageParam }) =>
        fetcher(`/api/message/${chatId}?cursor=${pageParam}`),
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

  console.log(data);

  // This useEffect hook sets up a subscription to a Socket.IO message event for the current chatId.
  // When a new message is received, it triggers an invalidation of the query for messages associated with the current chatId
  useEffect(() => {
    const unsubscribe = subscribeToEvent(`message:${chatId}`, async () => {
      await queryClient.invalidateQueries({ queryKey: ["messages", chatId] });
    });
    return () => {
      unsubscribe();
    };
  }, [subscribeToEvent, chatId, queryClient]);

  useEffect(() => {
    const handleScroll = () => {
      const container = chatContainerRef.current;
      if (container) {
        if (container.scrollTop === 0 && !hasReachedTop && hasNextPage) {
          fetchNextPage().then();
          setHasReachedTop(true);
        } else if (container.scrollTop > 0) {
          setHasReachedTop(false);
        }
      }
    };

    const container = chatContainerRef.current;
    if (container) {
      container.addEventListener("scroll", handleScroll);
    }

    return () => {
      if (container) {
        container.removeEventListener("scroll", handleScroll);
      }
    };
  }, [fetchNextPage, hasNextPage, hasReachedTop]);

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
        ref={chatContainerRef}
        className={"flex flex-1 flex-col overflow-y-auto py-4"}
      >
        <div className={"flex-1"} />

        {!hasNextPage && <ChatWelcome type={type} name={name} />}
        {isFetchingNextPage && (
          <div className={"flex flex-1 items-center justify-center"}>
            <Loader2 className={"animate-spin"} />
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
      </div>
    );
  }

  return null;
};

export default ChatMessages;
