import { z } from "zod";
import { Server } from "@prisma/client";

import { ActionState } from "@/src/lib/actions/create-safe-action";
import { updateInviteLinkSchema } from "@/src/lib/actions/update-invite-link/schema";

export type InputType = z.infer<typeof updateInviteLinkSchema>;
export type ReturnType = ActionState<InputType, Server>;
