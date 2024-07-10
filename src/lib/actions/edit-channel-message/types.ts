import { z } from "zod";
import { Message } from "@prisma/client";

import { ActionState } from "@/src/lib/actions/create-safe-action";
import { editChannelMessageSchema } from "@/src/lib/actions/edit-channel-message/schema";

export type InputType = z.infer<typeof editChannelMessageSchema>;
export type ReturnType = ActionState<InputType, Message>;
