"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/src/lib/database/db";
import { MemberRole } from "@prisma/client";
import {
  InputType,
  ReturnType,
} from "@/src/lib/actions/delete-channel-message/types";
import { deleteChannelMessageSchema } from "@/src/lib/actions/delete-channel-message/schema";
import createSafeAction from "@/src/lib/actions/create-safe-action";

// Handler function for action
const handler = async (data: InputType): Promise<ReturnType> => {
  // Extracting userId from authentication
  const { userId } = auth();

  // Return error if userId is not found
  if (!userId)
    return {
      error: "Unauthorized",
    };

  const { channelId, id, serverId } = data;

  // Declaring variable to hold message data
  let message;

  // Fetching user profile from the database
  const profile = await db.profile.findUnique({
    where: { userId },
  });

  // Return error if user profile is not found
  if (!profile) return { error: "User not found" };

  try {
    const currentMember = await db.member.findFirst({
      where: {
        profileId: profile.id,
        serverId,
      },
    });
    if (!currentMember) return { error: "Member not found in server" };

    const messageToDelete = await db.message.findUnique({
      where: {
        id,
        channel: {
          id: channelId,
          serverId,
        },
      },
      include: { member: true },
    });
    if (!messageToDelete) return { error: "Message not found" };

    // Check if the user is the owner of the message or has the required role
    const isOwner = messageToDelete.memberId === currentMember.id;
    const isAdminOrModerator =
      currentMember.role === MemberRole.ADMIN ||
      currentMember.role === MemberRole.MODERATOR;

    if (!isOwner && !isAdminOrModerator) {
      return { error: "Unauthorized to delete the message" };
    }

    message = await db.message.update({
      where: {
        id,
        channel: {
          id: channelId,
          serverId,
        },
      },
      data: {
        content: "This message has been deleted.",
        deleted: true,
      },
      include: {
        member: {
          include: {
            profile: true,
          },
        },
      },
    });
  } catch (e) {
    // Return error if action fails
    return { error: "Failed to edit" };
  }

  // Revalidating the cache for path
  revalidatePath(`/servers/${serverId}`);

  // Return created server data upon success
  return { data: message };
};

export const deleteChannelMessage = createSafeAction(
  deleteChannelMessageSchema,
  handler,
);
