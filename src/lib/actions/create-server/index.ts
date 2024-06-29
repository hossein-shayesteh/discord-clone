"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@clerk/nextjs/server";
import { v4 as uuid } from "uuid";
import { MemberRole } from "@prisma/client";
import { db } from "@/src/lib/database/db";
import { InputType, ReturnType } from "@/src/lib/actions/create-server/types";
import { createServerSchema } from "@/src/lib/actions/create-server/schema";
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

  const { title, imageUrl } = data;

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
    server = await db.server.create({
      data: {
        imageUrl,
        profileId: profile.id,
        name: title,
        inviteCode: uuid(),
        channels: {
          create: {
            name: "general",
            profileId: profile.id,
          },
        },
        members: {
          create: {
            profileId: profile.id,
            role: MemberRole.ADMIN,
          },
        },
      },
    });
  } catch (e) {
    // Return error if action fails
    return { error: "Failed to create" };
  }

  // Revalidating the cache for path
  revalidatePath(`/servers/${server.id}`);

  // Return created server data upon success
  return { data: server };
};

export const createServer = createSafeAction(createServerSchema, handler);
