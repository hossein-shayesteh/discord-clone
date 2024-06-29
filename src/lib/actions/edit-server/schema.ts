import { z } from "zod";

// Define schema for action using Zod
export const editServerSchema = z.object({
  id: z.string(),

  title: z
    .string({
      required_error: "Server name is required", // Error message if 'title' is missing
      invalid_type_error: "Server name is required", // Error message if 'title' is not a string
    })
    .min(3, {
      message: "Server name is too short", // Error message if 'title' is too short
    }),

  imageUrl: z.string({
    required_error: "Server image is required", // Error message if 'imageUrl' is missing
    invalid_type_error: "Server image is required", // Error message if 'imageUrl' is not a string
  }),
});
