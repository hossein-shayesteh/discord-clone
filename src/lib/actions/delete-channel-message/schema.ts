import { z } from "zod";

// Define schema for action using Zod
export const deleteChannelMessageSchema = z.object({
  id: z.string(),
  serverId: z.string(),
  channelId: z.string(),
});
