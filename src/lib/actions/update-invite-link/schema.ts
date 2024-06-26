import { z } from "zod";

// Define schema for updating a server invite code
export const updateInviteLinkSchema = z.object({
  // Define 'serverId' property with validation
  serverId: z.string(),
});
