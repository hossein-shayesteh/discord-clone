import { z } from "zod";
import { Server } from "@prisma/client";

import { ActionState } from "@/src/lib/actions/create-safe-action";
import { editChannelSchema } from "@/src/lib/actions/edit-channel/schema";

export type InputType = z.infer<typeof editChannelSchema>;
export type ReturnType = ActionState<InputType, Server>;
