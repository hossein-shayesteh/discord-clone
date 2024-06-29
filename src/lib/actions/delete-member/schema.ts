import { z } from "zod";
import { MemberRole } from "@prisma/client";

// Define schema for deleting members
export const deleteMemberSchema = z.object({
  memberId: z.string(),
  serverId: z.string(),
});
