import { z } from "zod";
import { Message } from "@prisma/client";

import { ActionState } from "@/src/lib/actions/create-safe-action";
import { deleteChannelMessageSchema } from "@/src/lib/actions/delete-channel-message/schema";

export type InputType = z.infer<typeof deleteChannelMessageSchema>;
export type ReturnType = ActionState<InputType, Message>;
