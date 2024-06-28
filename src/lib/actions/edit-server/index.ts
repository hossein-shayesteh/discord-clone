"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@clerk/nextjs/server";
import { v4 as uuid } from "uuid";
import { MemberRole } from "@prisma/client";
import { db } from "@/src/lib/database/db";
import { InputType, ReturnType } from "@/src/lib/actions/edit-server/types";
import { editServerSchema } from "@/src/lib/actions/edit-server/schema";
import createSafeAction from "@/src/lib/actions/create-safe-action";

// Handler function for editing a server
const handler = async (data: InputType): Promise<ReturnType> => {
  // Extracting userId from authentication
  const { userId } = auth();

  // Return error if userId is not found
  if (!userId)
    return {
      error: "Unauthorized",
    };

  const { id, title, imageUrl } = data;

  // Declaring variable to hold server data
  let server;

  // Fetching user profile from the database
  const profile = await db.profile.findUnique({
    where: { userId },
  });

  // Return error if user profile is not found
  if (!profile) return { error: "User not found" };

  try {
    // Edit server record in the database
    server = await db.server.update({
      where: {
        id,
        members: {
          some: {
            profileId: profile.id,
          },
        },
      },
      data: {
        imageUrl,
        name: title,
      },
    });
  } catch (e) {
    // Return error if server editing fails
    return { error: "Failed to edit" };
  }

  // Revalidating the cache for the board path
  revalidatePath(`/servers/${server.id}`);

  // Return created server data upon success
  return { data: server };
};

export const editServer = createSafeAction(editServerSchema, handler);