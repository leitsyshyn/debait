"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { verifyEmailSchema } from "@/lib/schemas";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { AlertCircle, CheckCircle, Loader2 } from "lucide-react";
import { verifyEmail } from "@/actions/auth/users";
import { useRef, startTransition, useActionState, useEffect } from "react";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { useSearchParams } from "next/navigation";

export function VerifyEmailForm() {
  const searchParams = useSearchParams();
  const urlToken = searchParams.get("token") || "";

  const form = useForm<z.infer<typeof verifyEmailSchema>>({
    resolver: zodResolver(verifyEmailSchema),
    mode: "onTouched",
  });

  const [state, formAction] = useActionState(verifyEmail, null);

  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (urlToken) {
      startTransition(() => {
        const formData = new FormData();
        formData.append("token", urlToken);
        formAction(formData);
      });
    }
  }, [urlToken, formAction]);

  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Email Verification</CardTitle>
          <CardDescription>
            You may close this tab after successful verification
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form ref={formRef} action={formAction} className="grid gap-6">
              {state?.error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>{state.error}</AlertDescription>
                </Alert>
              )}

              {state?.success && (
                <Alert variant="success">
                  <CheckCircle className="h-4 w-4" />
                  <AlertTitle>Success</AlertTitle>
                  <AlertDescription>{state.success}</AlertDescription>
                </Alert>
              )}

              {!state && <Loader2 className="animate-spin w-full" />}
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
