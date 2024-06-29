"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@clerk/nextjs/server";
import { v4 as uuid } from "uuid";
import { db } from "@/src/lib/database/db";
import {
  InputType,
  ReturnType,
} from "@/src/lib/actions/update-invite-link/types";
import { updateInviteLinkSchema } from "@/src/lib/actions/update-invite-link/schema";
import createSafeAction from "@/src/lib/actions/create-safe-action";
import { MemberRole } from "@prisma/client";

// Handler function for updating a server invite link
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
    // Creating a new server record in the database
    server = await db.server.update({
      where: {
        id: serverId,
        members: {
          some: {
            profile: {
              id: profile.id,
            },
            role: {
              in: [MemberRole.ADMIN, MemberRole.MODERATOR],
            },
          },
        },
      },
      data: {
        inviteCode: uuid(),
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

export const updateInviteLink = createSafeAction(
  updateInviteLinkSchema,
  handler,
);
