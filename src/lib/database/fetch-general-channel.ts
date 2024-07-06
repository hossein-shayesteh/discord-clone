import { auth } from "@clerk/nextjs/server";
import { db } from "@/src/lib/database/db";
import { currentProfile } from "@/src/lib/auth/current-profile";

export const fetchGeneralChannel = async (serverId: string) => {
  const profile = await currentProfile();

  if (!profile) auth().redirectToSignIn();

  try {
    const server = await db.server.findUnique({
      where: {
        id: serverId,
        members: {
          some: {
            profile: {
              id: profile.id,
            },
          },
        },
      },
      include: {
        channels: {
          where: {
            name: "general",
          },
          orderBy: {
            createdAt: "asc",
          },
        },
      },
    });

    return server?.channels[0];
  } catch {
    return null;
  }
};
