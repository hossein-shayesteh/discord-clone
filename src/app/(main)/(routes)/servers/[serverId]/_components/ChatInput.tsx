"use client";

import { useState } from "react";

import { Plus } from "lucide-react";

import { useSocket } from "@/src/hooks/use-socket";
import { useModal } from "@/src/hooks/use-modal";
import { useAction } from "@/src/hooks/use-action";
import { sendDirectMessage } from "@/src/lib/actions/send-direct-message";
import { sendChannelMessage } from "@/src/lib/actions/send-channel-message";

import { FormInput } from "@/src/components/form/FormInput";
import EmojiPicker from "@/src/app/(main)/(routes)/servers/[serverId]/_components/EmojiPicker";

type ChatInputProps = {
  name: string;
  serverId: string;
  type: "channel" | "conversation";
  channelId?: string;
  conversationId?: string;
};

const ChatInput = ({
  channelId,
  name,
  serverId,
  type,
  conversationId,
}: ChatInputProps) => {
  const [content, setContent] = useState<string>("");

  const { onOpen } = useModal();

  const { emit } = useSocket();

  const { execute: executeSendChannelMessage } = useAction(sendChannelMessage, {
    onSuccess: (data) => {
      emit("message", data);
    },
  });

  const { execute: executeSendDirectMessage } = useAction(sendDirectMessage, {
    onSuccess: (data) => {
      emit("message", data);
    },
  });

  const onSubmit = async () => {
    if (type === "channel" && channelId)
      await executeSendChannelMessage({ channelId, serverId, content });
    if (type === "conversation" && conversationId) {
      await executeSendDirectMessage({ serverId, content, conversationId });
    }
    setContent("");
  };

  return (
    <form action={onSubmit}>
      <div className={"relative w-full p-4 pb-6"}>
        <button
          type={"button"}
          onClick={() => {
            onOpen("sendFile", { serverId, channelId });
          }}
          className={
            "absolute bottom-9 left-7 flex h-6 w-6 items-center justify-center rounded-full bg-zinc-500 p-1 transition hover:bg-zinc-600 dark:bg-zinc-400 dark:hover:bg-zinc-300"
          }
        >
          <Plus className={"text-white dark:text-[#313338]"} />
        </button>
        <FormInput
          value={content}
          onChange={(e) => setContent(e.target.value)}
          id={"message"}
          autoComplete={"off"}
          placeHolder={`Message ${type === "conversation" ? name : "#" + name}`}
          className={
            "border-0 border-none bg-zinc-200/90 px-14 py-6 text-zinc-600 focus-visible:ring-0 focus-visible:ring-offset-0 dark:bg-zinc-700/75 dark:text-zinc-200"
          }
        />
        <button
          type={"button"}
          onClick={() => {}}
          className={"absolute bottom-9 right-7"}
        >
          <EmojiPicker
            onChange={(emoji) => setContent((prev) => prev + emoji)}
          />
        </button>
      </div>
    </form>
  );
};
export default ChatInput;
