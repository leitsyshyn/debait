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
  FormField,
  FormItem,
  FormMessage,
} from "../ui/form";
import { Button } from "../ui/button";
import TextEditor from "./text-editor";
import { createPostSchema } from "@/lib/schemas";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useSubmitPostMutation } from "@/mutations/mutations";
import { useRef } from "react";

const CreatePostForm = () => {
  const mutation = useSubmitPostMutation();
  const editorRef = useRef<{ clearContent: () => void } | null>(null);
  const form = useForm<z.infer<typeof createPostSchema>>({
    resolver: zodResolver(createPostSchema),
    defaultValues: { content: "" },
    mode: "onTouched",
  });

  const onSubmit = (data: z.infer<typeof createPostSchema>) => {
    if (!data.content.trim()) return;
    mutation.mutate(data.content);
    form.reset();
    editorRef.current?.clearContent();
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
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <TextEditor
                      ref={editorRef}
                      content={field.value}
                      onChange={(value) => form.setValue("content", value)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              variant="default"
              className="w-full"
              disabled={mutation.isPending}
            >
              {mutation.isPending ? "Creating..." : "Create post"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default CreatePostForm;
