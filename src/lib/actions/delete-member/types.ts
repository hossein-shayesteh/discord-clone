import { z } from "zod";
import { Server } from "@prisma/client";

import { ActionState } from "@/src/lib/actions/create-safe-action";
import { deleteMemberSchema } from "@/src/lib/actions/delete-member/schema";

export type InputType = z.infer<typeof deleteMemberSchema>;
export type ReturnType = ActionState<InputType, Server>;
