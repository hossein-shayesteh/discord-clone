"use client";

import { Plus, Settings } from "lucide-react";
import { ChannelType, MemberRole } from "@prisma/client";
import { ServerWithMembersWithProfiles } from "@/src/types/db";
import { useModal } from "@/src/hooks/use-modal";
import ActionTooltip from "@/src/components/ui/action-tooltip";

interface ServerSectionProps {
  label: string;
  sectionType: "members" | "channel";
  role?: MemberRole;
  channelType?: ChannelType;
  server?: ServerWithMembersWithProfiles;
}

const ServerSection = ({
  channelType,
  label,
  role,
  sectionType,
  server,
}: ServerSectionProps) => {
  const { onOpen } = useModal();

  return (
    <div className={"flex items-center justify-between py-2"}>
      <p
        className={
          "text-xs font-semibold uppercase text-zinc-500 dark:text-zinc-400"
        }
      >
        {label}
      </p>
      {role !== MemberRole.GUEST && sectionType === "channel" && (
        <ActionTooltip label={"Create Channel"} side={"top"}>
          <button
            onClick={() => onOpen("createChannel", { server, channelType })}
            className={
              "text-zinc-500 hover:text-zinc-600 dark:text-zinc-400 dark:hover:text-zinc-300"
            }
          >
            <Plus className={"h-4 w-4"} />
          </button>
        </ActionTooltip>
      )}
      {role === MemberRole.ADMIN && sectionType === "members" && (
        <ActionTooltip label={"Manage Members"} side={"top"}>
          <button
            onClick={() => onOpen("serverMembers", { server })}
            className={
              "text-zinc-500 hover:text-zinc-600 dark:text-zinc-400 dark:hover:text-zinc-300"
            }
          >
            <Settings className={"h-4 w-4"} />
          </button>
        </ActionTooltip>
      )}
    </div>
  );
};
export default ServerSection;
