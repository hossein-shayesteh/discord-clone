import { z } from "zod";
import { DirectMessage, Message } from "@prisma/client";

import { ActionState } from "@/src/lib/actions/create-safe-action";
import { sendDirectMessageSchema } from "@/src/lib/actions/send-direct-message/schema";

export type InputType = z.infer<typeof sendDirectMessageSchema>;
export type ReturnType = ActionState<InputType, DirectMessage>;
