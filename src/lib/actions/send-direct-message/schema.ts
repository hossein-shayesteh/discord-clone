import { z } from "zod";

// Define schema for action using Zod
export const sendDirectMessageSchema = z.object({
  content: z.string().min(1),
  serverId: z.string(),
  conversationId: z.string(),
  imageUrl: z.string().optional(),
});
