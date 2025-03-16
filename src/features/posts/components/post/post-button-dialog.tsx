import * as DialogPrimitive from "@radix-ui/react-dialog";

import { PostData, PostDataWithVotes } from "@/lib/types";
import PostDialog from "./post-dialog";
import CreateCommentForm from "../comment/create-comment-form";

export function PostButtonDialog({
  children,
  container,
  post,
}: {
  children: React.ReactNode;
  container: HTMLElement | null;
  post: PostDataWithVotes;
}) {
  return (
    <DialogPrimitive.Root modal={false}>
      <DialogPrimitive.Trigger asChild>{children}</DialogPrimitive.Trigger>
      <DialogPrimitive.Portal container={container}>
        <DialogPrimitive.Overlay />
        <DialogPrimitive.Content onOpenAutoFocus={(e) => e.preventDefault()}>
          <DialogPrimitive.DialogTitle />
          <div className="px-4 pb-4">
            <PostDialog post={post}>
              <div>
                <CreateCommentForm post={post} />
              </div>
            </PostDialog>
          </div>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
