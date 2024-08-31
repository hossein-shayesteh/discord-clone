"use server";

import { auth } from "@clerk/nextjs/server";
import { MemberRole } from "@prisma/client";
import { db } from "@/src/lib/database/db";

import { InputType, ReturnType } from "@/src/lib/actions/delete-channel/types";
import { deleteChannelSchema } from "@/src/lib/actions/delete-channel/schema";
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

  const { serverId, channelId } = data;

  // Declaring variable to hold server data
  let server;

  // Fetching user profile from the database
  const profile = await db.profile.findUnique({
    where: { userId },
  });

  // Return error if user profile is not found
  if (!profile) return { error: "User not found" };

  try {
    server = await db.server.update({
      where: {
        id: serverId,
        members: {
          some: {
            profile: {
              id: profile.id,
            },
            role: {
              in: [MemberRole.MODERATOR, MemberRole.ADMIN],
            },
          },
        },
      },
      data: {
        channels: {
          delete: {
            id: channelId,
            name: {
              not: "general",
            },
          },
        },
      },
    });
  } catch (e) {
    // Return error if action fails
    return { error: "Failed to delete" };
  }

  // Return created server data upon success
  return { data: server };
};

export const deleteChannel = createSafeAction(deleteChannelSchema, handler);
