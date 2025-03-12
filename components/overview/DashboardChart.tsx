"use client";

import React from "react";
import { useQuery } from "@tanstack/react-query";
import { TrendingUp } from "lucide-react";
import { CartesianGrid, Line, LineChart, XAxis } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

// Configure chart colors for shipment data
const chartConfig = {
  delivered: {
    label: "Delivered",
    color: "hsl(var(--chart-1))",
  },
  inTransit: {
    label: "In Transit",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig;

const DashboardChart = () => {
  // Fetch real chart data from your API endpoint
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["shipmentsOverviewChartData"],
    queryFn: async () => {
      const res = await fetch("/api/dashboard/shipments-overview");
      if (!res.ok) {
        throw new Error("Failed to fetch chart data");
      }
      return res.json();
    },
  });

  if (isLoading) {
    return (
      <Card className="rounded-sm">
        <CardHeader>
          <CardTitle>Shipments Overview</CardTitle>
          <CardDescription>Loading chart data…</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  if (isError) {
    return (
      <Card className="rounded-sm">
        <CardHeader>
          <CardTitle>Shipments Overview</CardTitle>
          <CardDescription>Error loading chart data</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  // Assume the API returns an object with a "data" property that is an array of objects
  const chartData = data.data;

  return (
    <Card className="rounded-sm">
      <CardHeader>
        <CardTitle>Shipments Overview</CardTitle>
        <CardDescription>January - June 2024</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <LineChart data={chartData} margin={{ left: 12, right: 12 }}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
            <Line
              dataKey="delivered"
              type="monotone"
              stroke="var(--color-delivered)"
              strokeWidth={2}
              dot={false}
            />
            <Line
              dataKey="inTransit"
              type="monotone"
              stroke="var(--color-inTransit)"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
      <CardFooter>
        <div className="flex w-full items-start gap-2 text-sm">
          <div className="grid gap-2">
            <div className="flex items-center gap-2 font-medium leading-none">
              Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
            </div>
            <div className="text-muted-foreground flex items-center gap-2 leading-none">
              Showing shipment statistics for the last 6 months
            </div>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
};

export default DashboardChart;
