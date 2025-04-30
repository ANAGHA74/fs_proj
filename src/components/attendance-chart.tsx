"use client"

import { TrendingUp } from "lucide-react"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Tooltip } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

// Placeholder data - replace with actual data fetching and processing
const chartData = [
  { day: "Mon", present: 140, absent: 10 },
  { day: "Tue", present: 145, absent: 5 },
  { day: "Wed", present: 138, absent: 12 },
  { day: "Thu", present: 148, absent: 2 },
  { day: "Fri", present: 142, absent: 8 },
  { day: "Sat", present: 150, absent: 0 }, // Assuming full attendance or no class
  { day: "Sun", present: 150, absent: 0 }, // Assuming full attendance or no class
]

const chartConfig = {
  present: {
    label: "Present",
    color: "hsl(var(--chart-2))", // Use theme color
  },
  absent: {
    label: "Absent",
    color: "hsl(var(--chart-5))", // Use theme color
  },
} satisfies ChartConfig

export function AttendanceChart() {
  return (
      <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
        <BarChart accessibilityLayer data={chartData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
          <CartesianGrid vertical={false} />
           <XAxis
            dataKey="day"
            tickLine={false}
            tickMargin={10}
            axisLine={false}
            tickFormatter={(value) => value.slice(0, 3)} // Shorten day names if needed
          />
          <YAxis tickLine={false} axisLine={false} tickMargin={10} />
          <ChartTooltip
            cursor={false}
            content={<ChartTooltipContent indicator="dashed" />}
          />
          <Bar dataKey="present" fill="var(--color-present)" radius={4} />
          <Bar dataKey="absent" fill="var(--color-absent)" radius={4} />
        </BarChart>
      </ChartContainer>
  )
}
