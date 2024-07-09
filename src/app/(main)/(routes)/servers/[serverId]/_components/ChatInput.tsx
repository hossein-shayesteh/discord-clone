"use client";

import { ElementRef, useRef } from "react";
import { Plus, Smile } from "lucide-react";
import { FormInput } from "@/src/components/form/FormInput";
import { useAction } from "@/src/hooks/use-action";
import { sendChannelMessage } from "@/src/lib/actions/send-channel-message";

type ChatInputProps = {
  name: string;
  serverId: string;
} & (
  | {
      type: "channel";
      channelId: string;
      memberId?: never;
    }
  | {
      type: "conversation";
      memberId: string;
      channelId?: never;
    }
);

const ChatInput = ({
  channelId,
  memberId,
  name,
  serverId,
  type,
}: ChatInputProps) => {
  const formRef = useRef<ElementRef<"form">>(null);

  const { execute } = useAction(sendChannelMessage, {
    onSuccess: (data) => console.log(data),
  });

  const onSubmit = async (formData: FormData) => {
    const message = formData.get("message") as string;
    formRef.current?.reset();

    if (type === "channel") {
      await execute({ channelId, serverId, message });
    }
  };

  return (
    <form action={onSubmit} ref={formRef}>
      <div className={"relative w-full p-4 pb-6"}>
        <button
          type={"button"}
          onClick={() => {}}
          className={
            "absolute bottom-9 left-7 flex h-6 w-6 items-center justify-center rounded-full bg-zinc-500 p-1 transition hover:bg-zinc-600 dark:bg-zinc-400 dark:hover:bg-zinc-300"
          }
        >
          <Plus className={"text-white dark:text-[#313338]"} />
        </button>
        <FormInput
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
          <Smile />
        </button>
      </div>
    </form>
  );
};
export default ChatInput;
