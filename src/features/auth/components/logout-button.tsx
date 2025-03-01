"use client";

import { signOut } from "next-auth/react";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";

export default function LogoutButton() {
  const queryClient = useQueryClient();
  return (
    <Button
      onClick={() => {
        signOut();
        queryClient.clear();
      }}
    >
      Sign out
    </Button>
  );
}
