"use client";

import { ElementRef, useRef, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

import { format } from "date-fns";
import { Member, MemberRole } from "@prisma/client";
import { useEventListener, useOnClickOutside } from "usehooks-ts";
import { Edit, ShieldAlert, ShieldCheck, Trash } from "lucide-react";

import { cn } from "@/src/lib/utils";
import { useAction } from "@/src/hooks/use-action";
import { useSocket } from "@/src/hooks/use-socket";
import { MessagesWithProfile } from "@/src/types/db";
import { editChannelMessage } from "@/src/lib/actions/edit-channel-message";
import { deleteChannelMessage } from "@/src/lib/actions/delete-channel-message";

import ActionTooltip from "@/src/components/ui/action-tooltip";
import UserAvatar from "@/src/components/modals/server-members-modal/UserAvatar";
import { FormInput } from "@/src/components/form/FormInput";
import { Button } from "@/src/components/ui/button";

interface ChatItemProps {
  message: MessagesWithProfile;
  serverId: string;
  currentMember: Member;
}

const roleIconMap = {
  [MemberRole.GUEST]: null,
  [MemberRole.MODERATOR]: (
    <ShieldCheck className={"ml-2 h-4 w-4 text-indigo-500"} />
  ),
  [MemberRole.ADMIN]: <ShieldAlert className={"ml-2 h-4 w-4 text-rose-500"} />,
};

const ChatItem = ({
  message: {
    id,
    content,
    deleted,
    channelId,
    imageUrl,
    createdAt,
    updatedAt,
    member,
  },
  serverId,
  currentMember,
}: ChatItemProps) => {
  const createdAtDate = new Date(createdAt);
  const updatedAtDate = new Date(updatedAt);

  const [isEditing, setIsEditing] = useState(false);
  const [isDeleted, setIsDeleted] = useState(deleted);
  const [isUpdated, setIsUpdated] = useState(
    createdAtDate.getTime() !== updatedAtDate.getTime(),
  );
  const [messageContent, setMessageContent] = useState(content);

  const inputRef = useRef<ElementRef<"input">>(null);
  const formRef = useRef<ElementRef<"form">>(null);

  const { emit } = useSocket();
  const router = useRouter();

  const isAdmin = currentMember.role === MemberRole.ADMIN;
  const isModerator = currentMember.role === MemberRole.MODERATOR;
  const isOwner = currentMember.id === member.id;
  const canDeleteMessage = !isDeleted && (isAdmin || isModerator || isOwner);
  const canEditedMessage = !isDeleted && isOwner && !imageUrl;
  const isImage = imageUrl !== null;

  const timestamp = format(new Date(createdAt), "dd MMM yyyy, HH:mm");

  const { execute: executeEditMessage } = useAction(editChannelMessage, {
    onSuccess: (data) => {
      disableEditing();
      setIsUpdated(true);
      setMessageContent(data.content);

      emit("message", data);
    },
  });

  const { execute: executeDeleteMessage } = useAction(deleteChannelMessage, {
    onSuccess: (data) => {
      setIsDeleted(true);
      setMessageContent(data.content);

      emit("message", data);
    },
  });

  const enableEditing = () => {
    setIsEditing(true);
    setTimeout(() => {
      inputRef.current?.focus();
      inputRef.current?.select();
    });
  };

  const disableEditing = () => {
    setIsEditing(false);
  };

  const onKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Escape") disableEditing();
  };

  // Event listener for keydown events
  useEventListener("keydown", onKeyDown);
  useOnClickOutside(formRef, disableEditing);

  const OnEditMessage = async (formData: FormData) => {
    const content = formData.get("content") as string;

    await executeEditMessage({ content, id, channelId, serverId });
  };

  const onDeleteMessage = async () => {
    await executeDeleteMessage({ id, serverId, channelId });
  };

  const onOpenConversation = () => {
    if (currentMember.id === id) return;

    router.push(`/servers/${serverId}/conversation/${member.id}`);
  };

  return (
    <div
      className={
        "group relative flex w-full items-center p-4 transition hover:bg-black/5"
      }
    >
      <div className={"group flex w-full items-start gap-x-2"}>
        <div className={"cursor-pointer transition hover:drop-shadow-md"}>
          <UserAvatar
            onClick={onOpenConversation}
            src={member.profile.imageUrl}
            className={""}
          />
        </div>
        <div className={"flex w-full flex-col"}>
          <div className={"flex items-center gap-x-2"}>
            <div className={"flex items-center"}>
              <p
                onClick={onOpenConversation}
                className={
                  "cursor-pointer text-sm font-semibold hover:underline"
                }
              >
                {member.profile.name}
              </p>
              <ActionTooltip label={member.role} side={"top"}>
                {roleIconMap[member.role]}
              </ActionTooltip>
            </div>
            <span className={"text-xs text-zinc-500 dark:text-zinc-400"}>
              {timestamp}
            </span>
          </div>
          {isImage && (
            <a
              href={imageUrl}
              target={"_blank"}
              rel={"noreferrer noopener"}
              className={
                "relative mt-2 flex aspect-square h-48 w-48 items-center overflow-hidden rounded-md border bg-secondary"
              }
            >
              <Image
                src={imageUrl}
                alt={messageContent}
                fill
                className={"object-cover"}
              />
            </a>
          )}
          {!imageUrl && !isEditing && (
            <p
              className={cn(
                "mt-1 text-sm text-zinc-600 dark:text-zinc-300",
                isDeleted &&
                  "mt-1 text-xs italic text-zinc-500 dark:text-zinc-400",
              )}
            >
              {messageContent}
              {isUpdated && !isDeleted && (
                <span
                  className={
                    "mx-2 text-[10px] text-zinc-500 dark:text-zinc-400"
                  }
                >
                  (edited)
                </span>
              )}
            </p>
          )}
          {!imageUrl && isEditing && (
            <form
              ref={formRef}
              action={OnEditMessage}
              className={"flex items-center gap-x-2 pt-2"}
            >
              <FormInput
                ref={inputRef}
                id={"content"}
                autoComplete={"off"}
                defaultValue={messageContent}
                className={
                  "border-0 border-none bg-zinc-200/90 p-2 text-zinc-600 focus-visible:ring-0 focus-visible:ring-offset-0 dark:bg-zinc-700/75 dark:text-zinc-200"
                }
              />
              <Button variant={"primary"} size={"sm"}>
                Save
              </Button>
            </form>
          )}
        </div>
      </div>
      {canDeleteMessage && (
        <div
          className={
            "absolute -top-2 right-5 hidden items-center gap-x-2 rounded-sm border bg-white p-1 group-hover:flex dark:bg-zinc-800"
          }
        >
          {canEditedMessage && (
            <ActionTooltip label={"Edit"} side={"top"}>
              <Edit
                onClick={() => enableEditing()}
                className={
                  "ml-auto h-4 w-4 cursor-pointer text-zinc-500 transition hover:text-zinc-600 dark:hover:text-zinc-300"
                }
              />
            </ActionTooltip>
          )}
          <ActionTooltip label={"Delete"} side={"top"}>
            <Trash
              onClick={onDeleteMessage}
              className={
                "ml-auto h-4 w-4 cursor-pointer text-zinc-500 transition hover:text-zinc-600 dark:hover:text-zinc-300"
              }
            />
          </ActionTooltip>
        </div>
      )}
    </div>
  );
};
export default ChatItem;
