import { db } from "@/src/lib/database/db";
import { currentProfile } from "@/src/lib/auth/current-profile";

export const fetchServers = async () => {
  const profile = await currentProfile();

  return db.server.findMany({
    where: { members: { some: { profileId: profile.id } } },
  });
};
