import { z } from "zod";

// Define schema for action using Zod
export const deleteMemberSchema = z.object({
  memberId: z.string(),
  serverId: z.string(),
});
