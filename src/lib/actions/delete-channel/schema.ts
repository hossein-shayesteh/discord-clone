import { z } from "zod";

// Define schema for action using Zod
export const deleteChannelSchema = z.object({
  serverId: z.string(),
  channelId: z.string(),
});
