"use server";

import { auth } from "@clerk/nextjs/server";
import { db } from "@/src/lib/database/db";
import { MemberRole } from "@prisma/client";

import { InputType, ReturnType } from "@/src/lib/actions/create-channel/types";
import { createChannelSchema } from "@/src/lib/actions/create-channel/schema";
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

  const { title, type, serverId } = data;

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
          create: {
            profileId: profile.id,
            name: title,
            type,
          },
        },
      },
    });
  } catch (e) {
    // Return error if action fails
    return { error: "Failed to create" };
  }

  // Return created server data upon success
  return { data: server };
};

export const createChannel = createSafeAction(createChannelSchema, handler);
