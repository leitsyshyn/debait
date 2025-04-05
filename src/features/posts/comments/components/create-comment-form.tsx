"use client";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Send } from "lucide-react";

import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { createCommentSchema } from "@/features/posts/comments/lib/schemas";
import { useSubmitCommentMutation } from "@/features/posts/comments/mutations/submit-comment-mutation";
import { PostDataWithVotes } from "@/lib/types";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

const CreateCommentForm = ({
  post,
  autoFocus,
  className,
}: {
  post: PostDataWithVotes;
  autoFocus?: boolean;
  className?: string;
}) => {
  const mutation = useSubmitCommentMutation(post.id);

  const form = useForm<z.infer<typeof createCommentSchema>>({
    resolver: zodResolver(createCommentSchema),
    defaultValues: { content: "" },
    mode: "onTouched",
  });

  const onSubmit = (data: z.infer<typeof createCommentSchema>) => {
    if (!data.content.trim()) return;
    console.log("post", post);
    mutation.mutate(
      {
        post,
        content: data.content,
      },
      {
        onSuccess: () => {
          form.reset();
        },
      }
    );
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className={cn("flex flex-row gap-2", className)}
      >
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem className="flex-1">
              <FormControl>
                <Input
                  type="text"
                  placeholder="Write a comment..."
                  autoFocus={autoFocus}
                  {...field}
                />
              </FormControl>
              {/* <FormMessage /> */}
            </FormItem>
          )}
        />
        <Button type="submit" variant="default" disabled={mutation.isPending}>
          {mutation.isPending ? <Loader2 className="animate-spin" /> : <Send />}
        </Button>
      </form>
    </Form>
  );
};

export default CreateCommentForm;
