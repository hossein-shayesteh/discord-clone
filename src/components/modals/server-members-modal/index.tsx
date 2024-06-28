"use client";

import { useState } from "react";
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
import { useModal } from "@/src/hooks/useModal";
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

const roleIconMap = {
  ADMIN: <ShieldAlert className={"ml-2 h-4 w-4 text-rose-500"} />,
  MODERATOR: <ShieldCheck className={"ml-2 h-4 w-4 text-indigo-500"} />,
  GUEST: null,
};

const ServerMembersModal = () => {
  const [loadingId, setLoadingId] = useState("");
  const { isOpen, onClose, type, data } = useModal();

  const { server } = data as { server: ServerWithMembersWithProfiles };

  // Function to handle modal closure
  const handleClose = () => {
    onClose();
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
          {server?.members?.map((member) => (
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
              {server.profileId !== member.profileId &&
                loadingId !== member.id && (
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
                              <DropdownMenuItem>
                                <Shield className={"mr-2 h-4 w-4"} />
                                Guest
                                {member.role === "GUEST" && (
                                  <Check className={"ml-auto h-4 w-4"} />
                                )}
                              </DropdownMenuItem>
                              <DropdownMenuItem>
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
                        <DropdownMenuItem className={""}>
                          <Gavel className={"mr-2 h-4 w-4"} />
                          Kick
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                )}
              {loadingId === member.id && (
                <Loader2
                  className={"ml-auto h-4 w-4 animate-spin text-zinc-500"}
                />
              )}
            </div>
          ))}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};
export default ServerMembersModal;
