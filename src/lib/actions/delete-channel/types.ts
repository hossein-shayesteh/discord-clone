import { z } from "zod";
import { Server } from "@prisma/client";

import { ActionState } from "@/src/lib/actions/create-safe-action";
import { deleteChannelSchema } from "@/src/lib/actions/delete-channel/schema";

export type InputType = z.infer<typeof deleteChannelSchema>;
export type ReturnType = ActionState<InputType, Server>;
