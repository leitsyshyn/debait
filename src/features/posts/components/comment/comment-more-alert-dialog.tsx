import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { DropdownMenu } from "@radix-ui/react-dropdown-menu";
import { Flag, Info, MoreHorizontal, Trash } from "lucide-react";
import {
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useDeleteCommentMutation } from "@/features/posts/mutations/delete-comment-mutation";
import { useSession } from "next-auth/react";

const CommentMore = ({
  commentId,
  userId,
  className,
}: {
  commentId: string;
  userId: string;
  className?: string;
}) => {
  const mutation = useDeleteCommentMutation();
  const session = useSession();
  return (
    <AlertDialog>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className={className}>
            <MoreHorizontal />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          {userId == session?.data?.user.id ? (
            <DropdownMenuItem asChild>
              <AlertDialogTrigger asChild>
                <Button variant="ghost" className="w-full">
                  <Trash /> Delete
                </Button>
              </AlertDialogTrigger>
            </DropdownMenuItem>
          ) : (
            <DropdownMenuItem asChild>
              <AlertDialogTrigger asChild>
                <Button variant="ghost" className="w-full">
                  <Flag /> Report
                </Button>
              </AlertDialogTrigger>
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete your
            comment.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction asChild>
            <Button
              variant="destructive"
              onClick={() => mutation.mutate(commentId)}
            >
              Delete
            </Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default CommentMore;
