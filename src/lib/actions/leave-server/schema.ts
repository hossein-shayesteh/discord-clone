import { z } from "zod";

// Define schema for action using Zod
export const leaveServerSchema = z.object({
  serverId: z.string(),
});
