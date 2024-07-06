import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/src/lib/database/db";
import { currentProfile } from "@/src/lib/auth/current-profile";

const fetchConversation = async (memberOneId: string, memberTwoId: string) => {
  try {
    return db.conversation.findFirst({
      where: {
        AND: [{ memberOneId }, { memberTwoId }],
      },
      include: {
        memberOne: {
          include: {
            profile: true,
          },
        },
        memberTwo: {
          include: {
            profile: true,
          },
        },
      },
    });
  } catch {
    return null;
  }
};

const createConversation = async (memberOneId: string, memberTwoId: string) => {
  try {
    return db.conversation.create({
      data: {
        memberOneId,
        memberTwoId,
      },
      include: {
        memberOne: {
          include: {
            profile: true,
          },
        },
        memberTwo: {
          include: {
            profile: true,
          },
        },
      },
    });
  } catch {
    return null;
  }
};

export const getOrCreateConversation = async (
  memberId: string,
  serverId: string,
) => {
  const profile = await currentProfile();

  if (!profile) auth().redirectToSignIn();

  const currentMember = await db.member.findFirst({
    where: {
      profileId: profile.id,
      serverId,
    },
  });

  if (!currentMember) redirect("/");

  return (
    (await fetchConversation(currentMember.id, memberId)) ||
    (await fetchConversation(memberId, currentMember.id)) ||
    (await createConversation(currentMember.id, memberId))
  );
};
