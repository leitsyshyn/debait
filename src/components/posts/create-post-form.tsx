"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormMessage,
} from "../ui/form";
import TextEditor from "./text-editor";
import { createPostSchema } from "@/lib/schemas";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { startTransition, useActionState } from "react";
import { submitPost } from "@/actions/feed/posts";
import { Button } from "../ui/button";

const CreatePostForm = () => {
  const form = useForm<z.infer<typeof createPostSchema>>({
    resolver: zodResolver(createPostSchema),
    defaultValues: {
      content: "",
    },
    mode: "onTouched",
  });

  const [_, formAction, isPending] = useActionState(submitPost, null);

  const onSubmit = (data: { content: string }) => {
    console.log(data);
    startTransition(() => {
      if (data.content.trim() !== "") {
        const formData = new FormData();
        formData.append("content", data.content);

        formAction(formData);
      }
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create a post</CardTitle>
        <CardDescription>Start a new discussion</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-6">
            <input
              type="hidden"
              name="content"
              value={form.getValues("content")}
            />
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <TextEditor
                      content={field.value}
                      onChange={(value) => field.onChange(value)}
                    />
                  </FormControl>
                  <FormDescription></FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              variant="default"
              className="w-full"
              disabled={isPending}
            >
              {isPending ? "Creating..." : "Create post"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default CreatePostForm;
