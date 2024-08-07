"use client";

import {
  Check,
  Gavel,
  Loader2,
  MoreVertical,
  Shield,
  ShieldAlert,
  ShieldCheck,
  ShieldQuestion,
} from "lucide-react";
import { MemberRole } from "@prisma/client";
import { useModal } from "@/src/hooks/use-modal";
import { useAction } from "@/src/hooks/use-action";
import { editRole } from "@/src/lib/actions/edit-role";
import { ServerWithMembersWithProfiles } from "@/src/types/db";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/src/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuPortal,
  DropdownMenuItem,
  DropdownMenuSubContent,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/src/components/ui/dropdown-menu";
import { ScrollArea } from "@/src/components/ui/scroll-area";
import UserAvatar from "@/src/components/modals/server-members-modal/UserAvatar";
import { deleteMember } from "@/src/lib/actions/delete-member";
import { useState } from "react";

const roleIconMap = {
  ADMIN: <ShieldAlert className={"ml-2 h-4 w-4 text-rose-500"} />,
  MODERATOR: <ShieldCheck className={"ml-2 h-4 w-4 text-indigo-500"} />,
  GUEST: null,
};

const ServerMembersModal = () => {
  const [editedUser, setEditedUser] = useState("");

  const { onOpen, isOpen, onClose, type, data } = useModal();

  const { server } = data as { server: ServerWithMembersWithProfiles };

  // Hook for executing 'editRole' action
  const { execute: executeEditRole, isLoading: editRoleLoading } = useAction(
    editRole,
    {
      onSuccess: (data) => {
        setEditedUser("");
        onOpen("serverMembers", { server: data });
      },
    },
  );

  // Hook for executing "deleteMember" action
  const { execute: executeDeleteMember, isLoading: deleteMemberLoading } =
    useAction(deleteMember, {
      onSuccess: (data) => {
        setEditedUser("");
        onOpen("serverMembers", { server: data });
      },
    });

  // Function to handle modal closure
  const handleClose = () => {
    onClose();
  };

  // Function to handle role changes
  const onRoleChange = async (
    memberId: string,
    serverId: string,
    role: MemberRole,
  ) => {
    setEditedUser(memberId);
    await executeEditRole({ role, memberId, serverId });
  };

  // Function to handle member delete
  const onDeleteMember = async (memberId: string, serverId: string) => {
    setEditedUser(memberId);
    await executeDeleteMember({ memberId, serverId });
  };

  return (
    <Dialog
      open={isOpen && type === "serverMembers"}
      onOpenChange={handleClose}
    >
      <DialogContent className={"overflow-hidden bg-white text-black"}>
        <DialogHeader className={"px-6 pt-8"}>
          <DialogTitle className={"text-center text-2xl font-bold"}>
            Manage Members
          </DialogTitle>
          <DialogDescription className={"text-center text-zinc-500"}>
            {server?.members?.length} Members
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className={"mt-8 max-h-[420px] pr-6"}>
          {server?.members?.map((member) => {
            const isCurrentUserServerOwner =
              server.profileId === member.profileId;
            const isLoading = editRoleLoading || deleteMemberLoading;
            const isBeingEdited = editedUser === member.id;

            const showLoadingSpinner = isLoading && isBeingEdited;
            const showDropdownMenu = !isCurrentUserServerOwner && !isLoading;

            return (
              <div key={member.id} className={"mb-6 flex items-center gap-x-2"}>
                <UserAvatar src={member.profile.imageUrl} />
                <div className={"flex flex-col gap-y-1"}>
                  <div className={"flex items-center text-xs font-semibold"}>
                    {member.profile.name}
                    {roleIconMap[member.role]}
                  </div>
                  <p className={"text-xs text-zinc-500"}>
                    {member.profile.email}
                  </p>
                </div>
                {showDropdownMenu && (
                  <div className={"ml-auto"}>
                    <DropdownMenu>
                      <DropdownMenuTrigger>
                        <MoreVertical className={"h-4 w-4 text-zinc-500"} />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent side={"left"}>
                        <DropdownMenuSub>
                          <DropdownMenuSubTrigger
                            className={"flex items-center"}
                          >
                            <ShieldQuestion className={"mr-2 h-4 w-4"} />
                            <span>Role</span>
                          </DropdownMenuSubTrigger>
                          <DropdownMenuPortal>
                            <DropdownMenuSubContent>
                              <DropdownMenuItem
                                onClick={() =>
                                  onRoleChange(member.id, server.id, "GUEST")
                                }
                              >
                                <Shield className={"mr-2 h-4 w-4"} />
                                Guest
                                {member.role === "GUEST" && (
                                  <Check className={"ml-auto h-4 w-4"} />
                                )}
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() =>
                                  onRoleChange(
                                    member.id,
                                    server.id,
                                    "MODERATOR",
                                  )
                                }
                              >
                                <ShieldCheck className={"mr-2 h-4 w-4"} />
                                Moderator
                                {member.role === "MODERATOR" && (
                                  <Check className={"ml-auto h-4 w-4"} />
                                )}
                              </DropdownMenuItem>
                            </DropdownMenuSubContent>
                          </DropdownMenuPortal>
                        </DropdownMenuSub>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => onDeleteMember(member.id, server.id)}
                        >
                          <Gavel className={"mr-2 h-4 w-4"} />
                          Kick
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                )}
                {showLoadingSpinner && (
                  <Loader2 className={"ml-auto h-4 w-4 animate-spin"} />
                )}
              </div>
            );
          })}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default ServerMembersModal;
