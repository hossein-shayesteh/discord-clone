"use server";

import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { db } from "@/src/lib/database/db";
import { InputType, ReturnType } from "@/src/lib/actions/create-server/types";
import { createServerSchema } from "@/src/lib/actions/create-server/schema";
import createSafeAction from "@/src/lib/actions/create-safe-action";

const handler = async (data: InputType): Promise<ReturnType> => {
  const { userId, orgId } = auth();

  if (!userId || !orgId)
    return {
      error: "Unauthorized.",
    };

  const { title } = data;

  let server;

  try {
  } catch (e) {
    return { error: "Failed to copy." };
  }

  return { data: server };
};

export const createServer = createSafeAction(createServerSchema, handler);
