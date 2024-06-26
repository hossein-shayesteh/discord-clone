import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { ChannelType } from "@prisma/client";
import { db } from "@/src/lib/database/db";
import { currentProfile } from "@/src/lib/auth/current-profile";

export const fetchServer = async (id: string) => {
  const profile = await currentProfile();

  if (!profile) auth().redirectToSignIn();

  const server = await db.server.findUnique({
    where: {
      id,
      members: {
        some: {
          profileId: profile.id,
        },
      },
    },
    include: {
      channels: {
        orderBy: {
          createdAt: "desc",
        },
      },
      members: {
        include: {
          profile: true,
        },
        orderBy: {
          role: "asc",
        },
      },
    },
  });
  if (!server) redirect("/");

  const textChannels = server.channels.filter(
    (channel) => channel.type === ChannelType.TEXT,
  );

  const audioChannels = server.channels.filter(
    (channel) => channel.type === ChannelType.AUDIO,
  );

  const videoChannels = server.channels.filter(
    (channel) => channel.type === ChannelType.VIDEO,
  );

  const members = server.members.filter(
    (member) => member.profileId !== profile.id,
  );

  const role = server.members.find(
    (member) => member.profileId === profile.id,
  )?.role;

  return { server, textChannels, audioChannels, videoChannels, members, role };
};
