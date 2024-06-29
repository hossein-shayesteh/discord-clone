"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/src/lib/database/db";
import { InputType, ReturnType } from "@/src/lib/actions/edit-role/types";
import { editRoleSchema } from "@/src/lib/actions/edit-role/schema";
import createSafeAction from "@/src/lib/actions/create-safe-action";
import { MemberRole } from "@prisma/client";

// Handler function for action
const handler = async (data: InputType): Promise<ReturnType> => {
  // Extracting userId from authentication
  const { userId } = auth();

  // Return error if userId is not found
  if (!userId)
    return {
      error: "Unauthorized",
    };

  const { memberId, serverId, role } = data;

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
              in: [MemberRole.ADMIN],
            },
          },
        },
      },
      data: {
        members: {
          update: {
            where: {
              id: memberId,
              serverId: serverId,
            },
            data: {
              role,
            },
          },
        },
      },
      include: {
        channels: {
          orderBy: {
            createdAt: "desc",
          },
        },
        members: {
          include: {
            profile: true,
          },
          orderBy: {
            role: "asc",
          },
        },
      },
    });
  } catch (e) {
    // Return error if action fails
    return { error: "Failed to edit" };
  }

  // Revalidating the cache for path
  revalidatePath(`/servers/${server.id}`);

  // Return created server data upon success
  return { data: server };
};

export const editRole = createSafeAction(editRoleSchema, handler);
