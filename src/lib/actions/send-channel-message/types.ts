import { z } from "zod";
import { Message } from "@prisma/client";

import { ActionState } from "@/src/lib/actions/create-safe-action";
import { sendChannelMessageSchema } from "@/src/lib/actions/send-channel-message/schema";

export type InputType = z.infer<typeof sendChannelMessageSchema>;
export type ReturnType = ActionState<InputType, Message>;
