import { z } from "zod";
import { MemberRole } from "@prisma/client";

// Define schema for editing member roles
export const editRoleSchema = z.object({
  memberId: z.string(),
  serverId: z.string(),
  role: z.nativeEnum(MemberRole),
});
