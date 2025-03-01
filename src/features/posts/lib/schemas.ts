import { object, string } from "zod";

export const createPostSchema = object({
  content: string({ required_error: "Content is required" }).min(
    1,
    "Content is required"
  ),
});
