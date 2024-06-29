"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@clerk/nextjs/server";
import { MemberRole } from "@prisma/client";
import { db } from "@/src/lib/database/db";
import { InputType, ReturnType } from "@/src/lib/actions/leave-server/types";
import { leaveServerSchema } from "@/src/lib/actions/leave-server/schema";
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

  const { serverId } = data;

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
              notIn: [MemberRole.ADMIN],
            },
          },
        },
      },
      data: {
        members: {
          deleteMany: {
            profileId: profile.id,
          },
        },
      },
    });
  } catch (e) {
    // Return error if action fails
    return { error: "Failed to leave" };
  }

  // Revalidating the cache for path
  revalidatePath(`/servers/${server.id}`);

  // Return created server data upon success
  return { data: server };
};

export const leaveServer = createSafeAction(leaveServerSchema, handler);
