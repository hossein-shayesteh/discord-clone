import { z } from "zod";

// Define schema for leaving server
export const leaveServerSchema = z.object({
  serverId: z.string(),
});
