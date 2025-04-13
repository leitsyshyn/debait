import { QueryKey } from "@tanstack/react-query";
import { HeartHandshake, Swords } from "lucide-react";

import { Button } from "@/components/ui/button";
import { VoteData } from "@/lib/types";
import { Tooltip } from "@/components/ui/tooltip";
import {
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useVote } from "@/hooks/use-vote";

interface VoteButtonsProps {
  value: number;
  initialData: VoteData;
  queryKey: QueryKey;
  voteUrl: string;
}

export const VoteButton = ({
  value,
  initialData,
  queryKey,
  voteUrl,
}: VoteButtonsProps) => {
  const { data, voteMutation } = useVote<VoteData>({
    queryKey,
    voteUrl,
    initialData,
  });

  return (
    <div>
      {value == 1 ? (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                onClick={() => voteMutation.mutate(1)}
                className="group/vote"
              >
                {data.userVote === 1 ? (
                  <HeartHandshake color="hsl(var(--support))" />
                ) : (
                  <HeartHandshake className="group-hover/vote:text-[hsl(var(--support))]" />
                )}
                {data.upvotes}
              </Button>
            </TooltipTrigger>
            <TooltipContent>Support</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      ) : (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                className="group/vote"
                variant="ghost"
                onClick={() => voteMutation.mutate(-1)}
              >
                {data.userVote === -1 ? (
                  <Swords color="hsl(var(--oppose))" />
                ) : (
                  <Swords className="group-hover/vote:text-[hsl(var(--oppose))]" />
                )}
                {data.downvotes}
              </Button>
            </TooltipTrigger>
            <TooltipContent>Oppose</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}
    </div>
  );
};
