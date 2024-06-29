"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/src/lib/database/db";
import { InputType, ReturnType } from "@/src/lib/actions/create-channel/types";
import { createChannelSchema } from "@/src/lib/actions/create-channel/schema";
import createSafeAction from "@/src/lib/actions/create-safe-action";
import { MemberRole } from "@prisma/client";

// Handler function for creating a server
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
    // Return error if server creation fails
    return { error: "Failed to create" };
  }

  // Revalidating the cache for path
  revalidatePath(`/servers/${server.id}`);

  // Return created server data upon success
  return { data: server };
};

export const createChannel = createSafeAction(createChannelSchema, handler);
