import { z } from "zod";

// Define schema for action using Zod
export const editChannelMessageSchema = z.object({
  id: z.string(),
  content: z.string().min(1),
  serverId: z.string(),
  channelId: z.string(),
});
