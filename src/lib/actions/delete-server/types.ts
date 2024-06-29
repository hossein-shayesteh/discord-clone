import { z } from "zod";
import { Server } from "@prisma/client";

import { ActionState } from "@/src/lib/actions/create-safe-action";
import { deleteServerSchema } from "@/src/lib/actions/delete-server/schema";

export type InputType = z.infer<typeof deleteServerSchema>;
export type ReturnType = ActionState<InputType, Server>;
