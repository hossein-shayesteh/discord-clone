import { z } from "zod";
import { Server } from "@prisma/client";

import { ActionState } from "@/src/lib/actions/create-safe-action";
import { editServerSchema } from "@/src/lib/actions/edit-server/schema";

export type InputType = z.infer<typeof editServerSchema>;
export type ReturnType = ActionState<InputType, Server>;
