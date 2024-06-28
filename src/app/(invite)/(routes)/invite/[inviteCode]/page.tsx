import { auth } from "@clerk/nextjs/server";
import { currentProfile } from "@/src/lib/auth/current-profile";
import { redirect } from "next/navigation";
import { db } from "@/src/lib/database/db";

interface InvitePageProps {
  params: {
    inviteCode: string;
  };
}

const InvitePage = async ({ params: { inviteCode } }: InvitePageProps) => {
  const profile = await currentProfile();
  if (!profile) auth().redirectToSignIn();

  if (!inviteCode) redirect("/");

  const existingServer = await db.server.findFirst({
    where: {
      inviteCode,
      members: {
        some: {
          profileId: profile.id,
        },
      },
    },
  });

  if (existingServer) redirect(`/servers/${existingServer.id}`);

  const server = await db.server.update({
    where: {
      inviteCode,
    },
    data: {
      members: {
        create: [
          {
            profileId: profile.id,
          },
        ],
      },
    },
  });

  if (server) redirect(`/servers/${server.id}`);

  return null;
};
export default InvitePage;
