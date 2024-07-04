"use client";

import { MemberRole } from "@prisma/client";
import { ServerWithMembersWithProfiles } from "@/src/types/db";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/src/components/ui/dropdown-menu";
import {
  ChevronDown,
  LogOut,
  PlusCircle,
  Settings,
  Trash,
  UserPlus,
  Users,
} from "lucide-react";
import { useModal } from "@/src/hooks/useModal";

interface ServerSidebarHeaderProps {
  role: MemberRole;
  server: ServerWithMembersWithProfiles;
}

const ServerSidebarHeader = ({ role, server }: ServerSidebarHeaderProps) => {
  const { onOpen } = useModal();

  const isAdmin = role === MemberRole.ADMIN;
  const isModerator = isAdmin || role === MemberRole.MODERATOR;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className={"focus:outline-none"} asChild>
        <button
          className={
            "flex h-12 w-full items-center border-b-2 border-neutral-200 px-3 font-semibold transition hover:bg-zinc-700/10 dark:border-neutral-800 dark:hover:bg-zinc-700/50"
          }
        >
          {server.name}
          <ChevronDown className={"ml-auto h-5 w-5"} />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className={
          "w-56 space-y-0.5 text-xs font-medium text-black dark:text-neutral-400"
        }
      >
        {isModerator && (
          <DropdownMenuItem
            // Open invite modal
            onClick={() => onOpen("invite", { server })}
            className={
              "cursor-pointer px-3 py-2 text-sm text-indigo-600 dark:text-indigo-400"
            }
          >
            Invite People
            <UserPlus className={"ml-auto h-4 w-4"} />
          </DropdownMenuItem>
        )}
        {isAdmin && (
          <DropdownMenuItem
            // Open edit server modal
            onClick={() => onOpen("editServer", { server })}
            className={"cursor-pointer px-3 py-2 text-sm"}
          >
            Server Settings
            <Settings className={"ml-auto h-4 w-4"} />
          </DropdownMenuItem>
        )}
        {isAdmin && (
          <DropdownMenuItem
            // Open server members modal
            onClick={() => onOpen("serverMembers", { server })}
            className={"cursor-pointer px-3 py-2 text-sm"}
          >
            Manage Members
            <Users className={"ml-auto h-4 w-4"} />
          </DropdownMenuItem>
        )}
        {isModerator && (
          <DropdownMenuItem
            // Open server create channel modal
            onClick={() =>
              onOpen("createChannel", { server, channelType: "TEXT" })
            }
            className={"cursor-pointer px-3 py-2 text-sm"}
          >
            Create Channel
            <PlusCircle className={"ml-auto h-4 w-4"} />
          </DropdownMenuItem>
        )}
        {isModerator && <DropdownMenuSeparator />}
        {isAdmin && (
          <DropdownMenuItem
            // Open delete server modal
            onClick={() => onOpen("deleteServer", { server })}
            className={"cursor-pointer px-3 py-2 text-sm text-rose-500"}
          >
            Delete Server
            <Trash className={"ml-auto h-4 w-4"} />
          </DropdownMenuItem>
        )}
        {!isAdmin && (
          <DropdownMenuItem
            // Open leaver server modal
            onClick={() => onOpen("leaveServer", { server })}
            className={"cursor-pointer px-3 py-2 text-sm text-rose-500"}
          >
            Leave Server
            <LogOut className={"ml-auto h-4 w-4"} />
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
export default ServerSidebarHeader;
