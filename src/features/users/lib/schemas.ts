import { z } from "zod";

export const editProfileSchema = z.object({
  username: z
    .string({ required_error: "Username required" })
    .max(50, "Must be at most 50 characters")
    .min(1, "Must be at least 1 character")
    .regex(
      /^[a-zA-Z0-9_]+$/,
      "Only alphanumeric characters and underscores are allowed"
    ),
  name: z
    .string({ required_error: "Display name required" })
    .max(50, "Must be at most 50 characters")
    .min(1, "Must be at least 1 character"),

  bio: z.string().max(200, "Must be at most 200 characters"),
});
export const updateCredentialsSchema = z.object({
  email: z
    .string({ required_error: "Email is required" })
    .min(1, "Email is required")
    .email("Invalid email"),
  password: z
    .string({ required_error: "Password is required" })
    .min(1, "Password is required")
    .min(8, "Password must be more than 8 characters")
    .max(32, "Password must be less than 32 characters"),
});
