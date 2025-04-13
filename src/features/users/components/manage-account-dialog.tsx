"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";

import { UserData } from "@/lib/types";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

import { editProfileSchema } from "../lib/schemas";
import { useEditProfileMutation } from "../mutations/useEditProfileMutation";
interface EditProfileDialogProps {
  children: React.ReactNode;
  user: UserData;
}

const ManageAccountDialog = ({ children, user }: EditProfileDialogProps) => {
  const [open, setOpen] = useState(false);

  const form = useForm({
    resolver: zodResolver(editProfileSchema),
    defaultValues: {
      name: user.name,
      bio: user.bio ?? "",
      username: user.username,
    },
  });

  const mutation = useEditProfileMutation();

  const { update } = useSession();

  const router = useRouter();

  async function onSubmit(values: z.infer<typeof editProfileSchema>) {
    console.log("values", values);
    mutation.mutate(
      {
        values,
      },
      {
        onSuccess: () => {
          update({ name: values.name, username: values.username });
          router.replace(`/users/${values.username}`);
          setOpen(false);
        },
        onError: (error) => {
          if (error.message === "Username already exists") {
            form.setError("username", {
              message: "Username already exists",
              type: "manual",
            });
          } else {
            console.error(error);
          }
        },
      }
    );
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Profile</DialogTitle>
          <DialogDescription>
            Make changes to your profile here. Click save when you&apos;re done.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Display Name</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="text"
                      placeholder="Display Name"
                      className="w-full"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>User Name</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="text"
                      placeholder="User Name"
                      className="w-full"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="bio"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Bio</FormLabel>
                  <FormControl>
                    <Textarea {...field} placeholder="Bio" className="w-full" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter className="flex justify-end space-x-2">
              <Button type="submit" disabled={mutation.isPending}>
                Save
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default ManageAccountDialog;
