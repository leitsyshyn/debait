"use client";

import { PolarAngleAxis, PolarGrid, Radar, RadarChart } from "recharts";
import { Prisma } from "@prisma/client";

import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { getUserDataSelect } from "@/lib/types";

const chartConfig = {
  data: {
    label: "data",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig;

export function UserChart({
  user,
  supportCount,
  opposeCount,
  clarifyCount,
}: {
  user: Prisma.UserGetPayload<{
    select: ReturnType<typeof getUserDataSelect>;
  }>;
  supportCount: number;
  opposeCount: number;
  clarifyCount: number;
}) {
  const chartData = [
    { type: "Takes", data: user._count.posts },
    { type: "Votes", data: user._count.votes },
    { type: "Support", data: supportCount },
    { type: "Oppose", data: opposeCount },
    { type: "Clarify", data: clarifyCount },
  ];

  return (
    <div>
      <ChartContainer config={chartConfig} className="min-h-44">
        <RadarChart data={chartData}>
          <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
          <PolarAngleAxis dataKey="type" />
          <PolarGrid />
          <Radar dataKey="data" fill="var(--color-data)" fillOpacity={0.6} />
        </RadarChart>
      </ChartContainer>
    </div>
  );
}
