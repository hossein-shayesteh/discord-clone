import { z } from "zod";

// Define schema for action using Zod
export const updateInviteLinkSchema = z.object({
  serverId: z.string(),
});
