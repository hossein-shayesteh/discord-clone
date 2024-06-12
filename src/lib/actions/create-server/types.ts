import { z } from "zod";
import { Server } from "@prisma/client";

import { ActionState } from "@/src/lib/actions/create-safe-action";
import { createServerSchema } from "@/src/lib/actions/create-server/schema";

export type InputType = z.infer<typeof createServerSchema>;
export type ReturnType = ActionState<InputType, Server>;
