import { z } from "zod";
import { Server } from "@prisma/client";

import { ActionState } from "@/src/lib/actions/create-safe-action";
import { editRoleSchema } from "@/src/lib/actions/edit-role/schema";

export type InputType = z.infer<typeof editRoleSchema>;
export type ReturnType = ActionState<InputType, Server>;
