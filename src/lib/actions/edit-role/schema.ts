import { z } from "zod";
import { MemberRole } from "@prisma/client";

// Define schema for action using Zod
export const editRoleSchema = z.object({
  memberId: z.string(),
  serverId: z.string(),
  role: z.nativeEnum(MemberRole),
});
