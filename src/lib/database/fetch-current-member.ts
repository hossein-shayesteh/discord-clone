import { auth } from "@clerk/nextjs/server";
import { db } from "@/src/lib/database/db";
import { currentProfile } from "@/src/lib/auth/current-profile";

export const fetchCurrentMember = async (serverId: string) => {
  const profile = await currentProfile();

  if (!profile) auth().redirectToSignIn();

  try {
    return db.member.findFirst({
      where: {
        profileId: profile.id,
        serverId,
      },
    });
  } catch {
    return null;
  }
};
