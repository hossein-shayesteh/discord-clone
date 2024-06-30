"use client";

import React from "react";
import { useRouter, useParams } from "next/navigation";
import { Member, MemberRole, Profile, Server } from "@prisma/client";
import { ShieldAlert, ShieldCheck } from "lucide-react";
import { cn } from "@/src/lib/utils";
import UserAvatar from "@/src/components/modals/server-members-modal/UserAvatar";

interface ServerMemberProps {
  member: Member & { profile: Profile };
  server: Server;
}

const roleIconMap = {
  [MemberRole.GUEST]: null,
  [MemberRole.MODERATOR]: <ShieldCheck className={"h-4 w-4 text-indigo-500"} />,
  [MemberRole.ADMIN]: <ShieldAlert className={"h-4 w-4 text-rose-500"} />,
};

const ServerMember = ({ member, server }: ServerMemberProps) => {
  const router = useRouter();
  const params = useParams();

  // Function to handle click on command items
  const onClick = (id: string) => {
    router.push(`/servers/${params.serverId}/conversation/${id}`);
  };

  return (
    <button
      onClick={() => onClick(member.id)}
      className={cn(
        "group mb-1 flex w-full items-center gap-x-2 rounded-md p-2 transition hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50",
        params?.memberId === member.id && "bg-zinc-700/20 dark:bg-zinc-700",
      )}
    >
      <UserAvatar
        src={member.profile.imageUrl}
        className={"h-8 w-8 md:h-8 md:w-8"}
      />
      {roleIconMap[member.role]}
      <p
        className={cn(
          "text-sm font-semibold text-zinc-500 transition group-hover:text-zinc-600 dark:text-zinc-400 dark:group-hover:text-zinc-300",
          params?.memberId === member.id &&
            "text-primary dark:text-zinc-200 dark:group-hover:text-white",
        )}
      >
        {member.profile.name}
      </p>
    </button>
  );
};
export default ServerMember;
