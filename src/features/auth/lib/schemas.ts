import { object, string } from "zod";

export const loginSchema = object({
  email: string({ required_error: "Email is required" })
    .min(1, "Email is required")
    .email("Invalid email"),
  password: string({ required_error: "Password is required" }).min(
    1,
    "Password is required"
  ),
  secret: string().optional(),
});

export const registerSchema = object({
  email: string({ required_error: "Email is required" })
    .min(1, "Email is required")
    .email("Invalid email"),
  password: string({ required_error: "Password is required" })
    .min(1, "Password is required")
    .min(8, "Password must be more than 8 characters")
    .max(32, "Password must be less than 32 characters"),
  name: string({ required_error: "Name is required" }).min(
    1,
    "Name is required"
  ),
  username: string({ required_error: "Username is required" })
    .min(1, "Username is required")
    .max(50, "Must be at most 50 characters")
    .regex(
      /^[a-zA-Z0-9_]+$/,
      "Only alphanumeric characters and underscores are allowed"
    ),
});

export const verifyEmailSchema = object({
  token: string({ required_error: "Token is required" }).min(
    1,
    "Token is required"
  ),
});

export const forgotPasswordSchema = object({
  email: string({ required_error: "Email is required" })
    .min(1, "Email is required")
    .email("Invalid email"),
});

export const resetPasswordSchema = object({
  password: string({ required_error: "Password is required" })
    .min(1, "Password is required")
    .min(8, "Password must be more than 8 characters")
    .max(32, "Password must be less than 32 characters"),
  token: string({ required_error: "Token is required" }).min(
    1,
    "Token is required"
  ),
});
export const updatePasswordSchema = object({
  password: string({ required_error: "Password is required" })
    .min(1, "Password is required")
    .min(8, "Password must be more than 8 characters")
    .max(32, "Password must be less than 32 characters"),
});
export const updateEmailSchema = object({
  email: string({ required_error: "Email is required" })
    .min(1, "Email is required")
    .email("Invalid email"),
});
