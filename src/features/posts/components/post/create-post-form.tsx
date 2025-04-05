"use client";

import { useRef } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Send } from "lucide-react";

import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { createPostSchema } from "@/features/posts/lib/schemas";
import { useSubmitPostMutation } from "@/features/posts/mutations/submit-post-mutation";
import TextEditor from "@/features/posts/components/post/tiptap-text-editor";
import { cn } from "@/lib/utils";

const CreatePostForm = ({ className }: { className?: string }) => {
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
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className={cn("flex flex-row gap-2 p-4 ", className)}
      >
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem className="flex-1">
              <FormControl>
                <TextEditor
                  ref={editorRef}
                  content={field.value}
                  onChange={(value) => form.setValue("content", value)}
                />
              </FormControl>
            </FormItem>
          )}
        />
        <Button
          className="h-full"
          type="submit"
          variant="default"
          disabled={mutation.isPending}
        >
          {mutation.isPending ? <Loader2 className="animate-spin" /> : <Send />}
        </Button>
      </form>
    </Form>
  );
};

export default CreatePostForm;
