import { z } from "zod";
import { ChannelType } from "@prisma/client";

// Define schema for action using Zod
export const createChannelSchema = z.object({
  title: z
    .string({
      required_error: "Channel name is required", // Error message if 'title' is missing
      invalid_type_error: "Channel name is required", // Error message if 'title' is not a string
    })
    .min(3, {
      message: "Channel name is too short", // Error message if 'title' is too short
    })
    .refine((name) => name !== "general", {
      message: "Channel name can't be 'general'", // Error channel name is 'general'
    }),

  serverId: z.string(),

  type: z.nativeEnum(ChannelType),
});
