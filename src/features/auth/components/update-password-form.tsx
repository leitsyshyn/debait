"use client";

import { toast } from "sonner";
import { startTransition, useActionState, useEffect, useRef } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";

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
import { updatePasswordSchema } from "@/features/auth/lib/schemas";
import { updatePassword } from "@/features/auth/actions/update-password";

export function UpdatePasswordForm() {
  const form = useForm<z.infer<typeof updatePasswordSchema>>({
    resolver: zodResolver(updatePasswordSchema),
    defaultValues: {
      password: "",
    },
    mode: "onTouched",
  });

  const [state, formAction, isPending] = useActionState(updatePassword, null);

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
            startTransition(() => {
              const newFormData = new FormData(formRef.current!);
              for (const [key, value] of newFormData.entries()) {
                console.log(key, value);
              }
              formAction(newFormData);
            });
          })(e);
        }}
        className="p-4"
      >
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>New password</FormLabel>
              <div className="flex gap-4">
                <FormControl>
                  <Input type="password" placeholder="••••••••" {...field} />
                </FormControl>
                <Button type="submit">
                  {isPending ? (
                    <>
                      <Loader2 className="animate-spin" /> Please wait
                    </>
                  ) : (
                    "Reset password"
                  )}
                </Button>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
}
