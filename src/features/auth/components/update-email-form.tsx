"use client";

import { startTransition, useActionState, useEffect, useRef } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { updateEmailSchema } from "@/features/auth/lib/schemas";

import { updateEmail } from "../actions/update-email";

export function UpdateEmailForm() {
  const form = useForm<z.infer<typeof updateEmailSchema>>({
    resolver: zodResolver(updateEmailSchema),
    defaultValues: {
      email: "",
    },
    mode: "onTouched",
  });

  const [state, formAction, isPending] = useActionState(updateEmail, null);

  useEffect(() => {
    if (state) {
      if (state.error) {
        toast.error(state.error);
      } else if (state.success) {
        toast.success(state.success);
      }
    }
  }, [state]);

  const formRef = useRef<HTMLFormElement>(null);

  return (
    <Form {...form}>
      <form
        ref={formRef}
        action={formAction}
        onSubmit={(e) => {
          e.preventDefault();
          form.handleSubmit(() => {
            startTransition(() => formAction(new FormData(formRef.current!)));
          })(e);
        }}
        className="p-4"
      >
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>Email</FormLabel>
              <div className="flex gap-4">
                <FormControl>
                  <Input
                    type="email"
                    placeholder="user@example.com"
                    {...field}
                  />
                </FormControl>
                <Button type="submit" className="" disabled={isPending}>
                  {isPending ? (
                    <>
                      <Loader2 className="animate-spin" /> Please wait
                    </>
                  ) : (
                    "Change email"
                  )}
                </Button>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />{" "}
      </form>
    </Form>
  );
}
