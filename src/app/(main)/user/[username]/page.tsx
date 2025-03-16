import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import UserAvatar from "@/components/user/user-avatar";
import { db } from "@/lib/prisma";
import { User } from "lucide-react";
const Page = async ({ params }: { params: Promise<{ username: string }> }) => {
  const user = await db.user.findFirst({
    where: { username: (await params).username },
  });

  return (
    <div className="flex flex-1 min-h-svh flex-col items-center justify-center gap-6 bg-muted p-6">
      <div className="flex w-full max-w-md flex-col gap-6">
        <Card>
          <CardHeader>
            <UserAvatar
              username={user?.username ?? ""}
              image={user?.image ?? ""}
            />
            <CardTitle>{user?.name}</CardTitle>
            <CardDescription>@{user?.username}</CardDescription>
          </CardHeader>
        </Card>
      </div>
    </div>
  );
};

export default Page;
