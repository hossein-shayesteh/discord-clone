"use server";

import { auth } from "@clerk/nextjs/server";
import { db } from "@/src/lib/database/db";
import {
  InputType,
  ReturnType,
} from "@/src/lib/actions/edit-channel-message/types";
import { editChannelMessageSchema } from "@/src/lib/actions/edit-channel-message/schema";
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

  const { channelId, content, id, serverId } = data;

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

    const server = await db.server.findFirst({
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
    });
    if (!server) return { error: "Server not found" };

    message = await db.message.update({
      where: {
        id,
        channel: {
          id: channelId,
          serverId,
        },
        memberId: currentMember.id,
      },
      data: {
        content,
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

  // Return created server data upon success
  return { data: message };
};

export const editChannelMessage = createSafeAction(
  editChannelMessageSchema,
  handler,
);
