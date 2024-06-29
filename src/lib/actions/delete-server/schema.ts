import { z } from "zod";

// Define schema for action using Zod
export const deleteServerSchema = z.object({
  serverId: z.string(),
});
