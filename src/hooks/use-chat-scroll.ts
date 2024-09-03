import React, { useCallback, useEffect, useState } from "react";
import {
  FetchNextPageOptions,
  InfiniteData,
  InfiniteQueryObserverResult,
} from "@tanstack/query-core";

interface ChatScrollProps {
  chatRef: React.RefObject<HTMLDivElement>;
  bottomRef: React.RefObject<HTMLDivElement>;
  hasNextPage: boolean | undefined;
  fetchNextPage: (
    options?: FetchNextPageOptions | undefined,
  ) => Promise<InfiniteQueryObserverResult<InfiniteData<any, unknown>, Error>>;
  isFetchingNextPage: boolean;
}

export const useChatScroll = ({
  chatRef,
  bottomRef,
  hasNextPage,
  fetchNextPage,
  isFetchingNextPage,
}: ChatScrollProps) => {
  const [hasReachedTop, setHasReachedTop] = useState(false);
  const [isNearBottom, setIsNearBottom] = useState(true);

  const handleScroll = useCallback(() => {
    const container = chatRef.current;
    if (!container) return;

    const distanceFromBottom =
      container.scrollHeight - container.scrollTop - container.clientHeight;
    setIsNearBottom(distanceFromBottom <= 100);

    if (container.scrollTop === 0 && hasNextPage && !isFetchingNextPage) {
      setHasReachedTop(true);
      fetchNextPage().then();
    } else if (container.scrollTop > 0) {
      setHasReachedTop(false);
    }
  }, [chatRef, fetchNextPage, hasNextPage, isFetchingNextPage]);

  useEffect(() => {
    const container = chatRef.current;
    if (container) {
      container.addEventListener("scroll", handleScroll);
      return () => container.removeEventListener("scroll", handleScroll);
    }
  }, [chatRef, handleScroll]);

  const scrollToBottom = useCallback(() => {
    if (isNearBottom && bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [bottomRef, isNearBottom]);

  useEffect(() => {
    if (hasReachedTop) {
      const container = chatRef.current;
      if (container) {
        const previousScrollHeight = container.scrollHeight;
        const checkAndAdjustScroll = () => {
          const newScrollHeight = container.scrollHeight;
          container.scrollTop = newScrollHeight - previousScrollHeight;
        };
        requestAnimationFrame(checkAndAdjustScroll);
      }
    }
  }, [chatRef, hasReachedTop]);

  return { scrollToBottom, isNearBottom };
};
