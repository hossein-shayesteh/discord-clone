import { z } from "zod";

// Define schema for action using Zod
export const sendChannelMessageSchema = z.object({
  message: z.string().min(1),
  serverId: z.string(),
  channelId: z.string(),
  imageUrl: z.string().optional(),
});
