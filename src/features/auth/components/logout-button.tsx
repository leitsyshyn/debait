"use client";

import { signOut } from "next-auth/react";
import { useQueryClient } from "@tanstack/react-query";
import { LogOut } from "lucide-react";

import { Button } from "@/components/ui/button";

export default function LogoutButton() {
  const queryClient = useQueryClient();
  return (
    <Button
      variant={"ghost"}
      className="w-full"
      onClick={() => {
        signOut();
        queryClient.clear();
      }}
    >
      <LogOut />
      Sign out
    </Button>
  );
}
