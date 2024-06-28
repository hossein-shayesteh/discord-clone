import { z } from "zod";

// Define schema for editing a server using Zod
export const editServerSchema = z.object({
  // Define 'id' property with validation
  id: z.string(),

  // Define 'title' property with validation
  title: z
    .string({
      required_error: "Server name is required", // Error message if 'title' is missing
      invalid_type_error: "Server name is required", // Error message if 'title' is not a string
    })
    .min(3, {
      message: "Server name is too short", // Error message if 'title' is too short
    }),

  // Define 'imageUrl' property with validation
  imageUrl: z.string({
    required_error: "Server image is required", // Error message if 'imageUrl' is missing
    invalid_type_error: "Server image is required", // Error message if 'imageUrl' is not a string
  }),
});
