"use client";

import { useState } from "react";
import Image from "next/image";
import { Edit, ShieldAlert, ShieldCheck, Trash } from "lucide-react";
import { Member, MemberRole, Profile } from "@prisma/client";
import { cn } from "@/src/lib/utils";
import ActionTooltip from "@/src/components/ui/action-tooltip";
import UserAvatar from "@/src/components/modals/server-members-modal/UserAvatar";

interface ChatItemProps {
  id: string;
  member: Member & { profile: Profile };
  deleted: boolean;
  content: string;
  imageUrl: null | string;
  timestamp: string;
  isUpdated: boolean;
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
  id,
  member,
  deleted,
  content,
  imageUrl,
  timestamp,
  isUpdated,
  currentMember,
}: ChatItemProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleted, setIsDeleted] = useState(false);

  const isAdmin = currentMember.role === MemberRole.ADMIN;
  const isModerator = currentMember.role === MemberRole.MODERATOR;
  const isOwner = currentMember.id === member.id;
  const canDeleteMessage = !deleted && (isAdmin || isModerator || isOwner);
  const canEditedMessage = !deleted && isOwner && !imageUrl;
  const isImage = imageUrl !== null;

  return (
    <div
      className={
        "group relative flex w-full items-center p-4 transition hover:bg-black/5"
      }
    >
      <div className={"group flex w-full items-start gap-x-2"}>
        <div className={"cursor-pointer transition hover:drop-shadow-md"}>
          <UserAvatar src={member.profile.imageUrl} className={""} />
        </div>
        <div className={"flex w-full flex-col"}>
          <div className={"flex items-center gap-x-2"}>
            <div className={"flex items-center"}>
              <p
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
                alt={content}
                fill
                className={"object-cover"}
              />
            </a>
          )}
          {!imageUrl && !isEditing && (
            <p
              className={cn(
                "mt-1 text-sm text-zinc-600 dark:text-zinc-300",
                deleted &&
                  "mt-1 text-xs italic text-zinc-500 dark:text-zinc-400",
              )}
            >
              {content}
              {isUpdated && !deleted && (
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
                onClick={() => setIsEditing(true)}
                className={
                  "ml-auto h-4 w-4 cursor-pointer text-zinc-500 transition hover:text-zinc-600 dark:hover:text-zinc-300"
                }
              />
            </ActionTooltip>
          )}
          <ActionTooltip label={"Delete"} side={"top"}>
            <Trash
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
