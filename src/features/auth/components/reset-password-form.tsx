"use client";

import { startTransition, useActionState, useRef } from "react";
import { z } from "zod";
import { useSearchParams } from "next/navigation";
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
import { resetPasswordSchema } from "@/features/auth/lib/schemas";
import { resetPassword } from "@/features/auth/actions/reset-password";

export function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const urlToken = searchParams.get("token") || "";

  const form = useForm<z.infer<typeof resetPasswordSchema>>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: "",
      token: urlToken,
    },
    mode: "onTouched",
  });

  const [state, formAction, isPending] = useActionState(resetPassword, null);

  const formRef = useRef<HTMLFormElement>(null);

  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Reset Password</CardTitle>
          <CardDescription>Enter your new password</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              ref={formRef}
              action={formAction}
              onSubmit={(e) => {
                e.preventDefault();
                form.handleSubmit(() => {
                  startTransition(() => {
                    const newFormData = new FormData(formRef.current!);
                    newFormData.append("token", urlToken);
                    for (const [key, value] of newFormData.entries()) {
                      console.log(key, value);
                    }
                    formAction(newFormData);
                  });
                })(e);
              }}
              className="grid gap-6"
            >
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>New password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="" {...field} />
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
              <Button
                type="submit"
                className="w-full"
                disabled={isPending || !urlToken}
              >
                {isPending ? (
                  <>
                    <Loader2 className="animate-spin" /> Please wait
                  </>
                ) : (
                  "Reset password"
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
