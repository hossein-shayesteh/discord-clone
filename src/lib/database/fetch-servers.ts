import { db } from "@/src/lib/database/db";
import { currentProfile } from "@/src/lib/auth/current-profile";
import { auth } from "@clerk/nextjs/server";

export const fetchServers = async () => {
  const profile = await currentProfile();

  if (!profile) auth().redirectToSignIn();

  try {
    return db.server.findMany({
      where: { members: { some: { profileId: profile.id } } },
    });
  } catch {
    return null;
  }
};
