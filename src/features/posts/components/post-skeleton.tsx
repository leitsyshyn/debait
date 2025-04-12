import { CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const PostSkeleton = () => {
  return (
    <div className="border-t flex flex-col gap-4">
      <div className="p-4 pb-0 flex flex-row gap-2 items-center ">
        <div className="flex flex-row gap-2 items-start flex-1">
          <div className="flex flex-row gap-2 items-center">
            <Skeleton className="h-10 w-10 rounded-full" />
            <div className="flex flex-col gap-2">
              <Skeleton className="h-4 w-48" />
              <Skeleton className="h-4 w-24" />
            </div>
          </div>
        </div>
      </div>
      <CardContent className="flex flex-col gap-2 px-4 pb-11">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
        <Skeleton className="h-4 w-24" />
      </CardContent>
    </div>
  );
};

export default PostSkeleton;
