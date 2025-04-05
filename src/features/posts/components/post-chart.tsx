"use client";

import * as React from "react";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";
import {
  format,
  addYears,
  addDays,
  addHours,
  addMinutes,
  addMonths,
  addWeeks,
} from "date-fns";
import { useMemo, useState } from "react";

import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

interface TimeBucket {
  start: Date;
  end: Date;
  label: string;
}

interface Vote {
  value: number;
  updatedAt?: Date;
  createdAt: Date;
}

interface ChartData {
  label: string;
  upvotes: number;
  downvotes: number;
}

type TimeRange = "hour" | "day" | "week" | "month" | "year";

function getStartDateFromRange(range: TimeRange): Date {
  const now = new Date();
  switch (range) {
    case "hour":
      return addHours(now, -1);
    case "day":
      return addDays(now, -1);
    case "week":
      return addWeeks(now, -1);
    case "month":
      return addMonths(now, -1);
    case "year":
      return addYears(now, -1);
  }
}

export function generateTimeBucketsFromRange(range: TimeRange): TimeBucket[] {
  const startDate = getStartDateFromRange(range);
  const now = new Date();

  const setting =
    range === "hour"
      ? { add: (d: Date) => addMinutes(d, 1), format: "HH:mm" }
      : range === "day"
      ? { add: (d: Date) => addHours(d, 1), format: "HH:00" }
      : range === "week"
      ? { add: (d: Date) => addHours(d, 6), format: "MMM dd HH:00" }
      : range === "month"
      ? { add: (d: Date) => addDays(d, 1), format: "MMM dd" }
      : range === "year"
      ? { add: (d: Date) => addWeeks(d, 1), format: "MMM dd" }
      : { add: (d: Date) => addDays(d, 1), format: "MM/dd" };

  const buckets: TimeBucket[] = [];
  let current = startDate;

  while (current <= now) {
    const end = setting.add(current);
    buckets.push({
      start: new Date(current),
      end: new Date(Math.min(+end, +now)),
      label: format(current, setting.format),
    });
    current = end;
  }

  return buckets;
}

export function generateChartData(
  timeBuckets: TimeBucket[],
  votes: Vote[]
): ChartData[] {
  return timeBuckets.map(({ start, end, label }) => {
    const { upvotes, downvotes } = votes.reduce(
      (acc, { value, updatedAt, createdAt }) => {
        const date = new Date(updatedAt ?? createdAt);
        if (date >= start && date < end) {
          if (value > 0) {
            acc.upvotes++;
          } else if (value < 0) {
            acc.downvotes++;
          }
        }
        return acc;
      },
      { upvotes: 0, downvotes: 0 }
    );

    return { label, upvotes, downvotes };
  });
}

const chartConfig = {
  upvotes: {
    label: "upvotes",
    color: "hsl(var(--support))",
  },
  downvotes: {
    label: "downvotes",
    color: "hsl(var(--oppose))",
  },
} satisfies ChartConfig;

export default function PostCharts({ votes }: { votes: Vote[] }) {
  //   const mockVotes = useMemo(
  //     () => generateMockVotes(addYears(new Date(), -1)),
  //     []
  //   );
  const [range, setRange] = useState<TimeRange>("day");

  //   const chartData = useMemo(() => {
  //     const buckets = generateTimeBucketsFromRange(range);
  //     return generateChartData(buckets, mockVotes);
  //   }, [range, mockVotes]);

  const chartData = useMemo(() => {
    const buckets = generateTimeBucketsFromRange(range);
    return generateChartData(buckets, votes);
  }, [range, votes]);

  return (
    <Card className="rounded-none shadow-none m-0 p-0 border-none">
      <CardHeader
        title="Post Votes"
        className="flex flex-row gap-4 pt-4 items-center justify-between"
      >
        <Select
          value={range}
          onValueChange={(v: string) => setRange(v as TimeRange)}
        >
          <SelectTrigger className="min-w-36 max-w-fit space-x-2">
            <span>Votes over: </span>
            <SelectValue placeholder="Last day" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="hour">last hour</SelectItem>
            <SelectItem value="day">last day</SelectItem>
            <SelectItem value="week">last week</SelectItem>
            <SelectItem value="month">last month</SelectItem>
            <SelectItem value="year">last year</SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-48 w-full">
          <AreaChart
            accessibilityLayer
            data={chartData}
            margin={{ left: 12, right: 12 }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="label"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              padding={{ left: 4, right: 0 }}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="dot" />}
            />
            <Area
              dataKey="downvotes"
              type="monotone"
              fill="var(--color-downvotes)"
              fillOpacity={0.4}
              stroke="var(--color-downvotes)"
              stackId="a"
            />
            <Area
              dataKey="upvotes"
              type="monotone"
              fill="var(--color-upvotes)"
              fillOpacity={0.4}
              stroke="var(--color-upvotes)"
              stackId="a"
            />
            <ChartLegend content={<ChartLegendContent />} />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
