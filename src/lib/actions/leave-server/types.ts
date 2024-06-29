import { z } from "zod";
import { Server } from "@prisma/client";

import { ActionState } from "@/src/lib/actions/create-safe-action";
import { leaveServerSchema } from "@/src/lib/actions/leave-server/schema";

export type InputType = z.infer<typeof leaveServerSchema>;
export type ReturnType = ActionState<InputType, Server>;
