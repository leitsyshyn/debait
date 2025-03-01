"use client";

import { startTransition, useActionState, useRef } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { forgotPassword } from "@/features/auth/actions/forgot-password";
import { forgotPasswordSchema } from "@/features/auth/lib/schemas";

export function ForgotPasswordForm() {
  const form = useForm<z.infer<typeof forgotPasswordSchema>>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
    mode: "onTouched",
  });

  const [state, formAction, isPending] = useActionState(forgotPassword, null);

  const formRef = useRef<HTMLFormElement>(null);

  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Forgot Password?</CardTitle>
          <CardDescription>
            Enter your email and we&apos;ll send you a reset link
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              ref={formRef}
              action={formAction}
              onSubmit={(e) => {
                e.preventDefault();
                form.handleSubmit(() => {
                  startTransition(() =>
                    formAction(new FormData(formRef.current!))
                  );
                })(e);
              }}
              className="grid gap-6"
            >
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="user@example.com"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {state?.error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>{state.error}</AlertDescription>
                </Alert>
              )}
              {state?.success && (
                <Alert variant="success">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Success</AlertTitle>
                  <AlertDescription>{state.success}</AlertDescription>
                </Alert>
              )}
              <Button type="submit" className="w-full" disabled={isPending}>
                {isPending ? (
                  <>
                    <Loader2 className="animate-spin" /> Please wait
                  </>
                ) : (
                  "Send reset link"
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter>
          <div className="text-center text-sm w-full">
            <a href="/auth/login" className="underline underline-offset-4">
              Return to Sign in
            </a>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
