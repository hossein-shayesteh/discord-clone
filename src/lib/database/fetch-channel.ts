import { auth } from "@clerk/nextjs/server";
import { db } from "@/src/lib/database/db";
import { currentProfile } from "@/src/lib/auth/current-profile";

export const fetchChannel = async (id: string) => {
  const profile = await currentProfile();

  if (!profile) auth().redirectToSignIn();

  try {
    return db.channel.findUnique({
      where: {
        id,
        profile: {
          id: profile.id,
        },
      },
    });
  } catch {
    return null;
  }
};
