import { auth } from "@clerk/nextjs/server";
import { db } from "@/src/lib/database/db";
import { currentProfile } from "@/src/lib/auth/current-profile";

export const fetchChannelMessages = async (channelId: string) => {
  const profile = await currentProfile();

  if (!profile) auth().redirectToSignIn();

  try {
    return db.message.findMany({
      where: {
        channelId,
      },
      include: {
        member: {
          include: {
            profile: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  } catch {
    return null;
  }
};
