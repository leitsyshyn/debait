"use client";

import { signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { useQueryClient } from "@tanstack/react-query";

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
