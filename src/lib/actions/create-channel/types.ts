import { z } from "zod";
import { Server } from "@prisma/client";

import { ActionState } from "@/src/lib/actions/create-safe-action";
import { createChannelSchema } from "@/src/lib/actions/create-channel/schema";

export type InputType = z.infer<typeof createChannelSchema>;
export type ReturnType = ActionState<InputType, Server>;
