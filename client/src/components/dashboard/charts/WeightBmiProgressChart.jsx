import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import SectionLabel from "./SectionLabel";
import { tooltipStyle } from "./chart-utils";

function WeightBmiProgressChart({ data }) {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-2">
        <SectionLabel
          title="Weight & BMI Progress"
          description="Body metrics tracked over time"
        />
      </CardHeader>
      <CardContent className="pt-1">
        {data.length > 0 ? (
          <ResponsiveContainer width="100%" height={240}>
            <LineChart data={data} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
              <XAxis dataKey="label" stroke="hsl(var(--muted-foreground))" fontSize={11} axisLine={false} tickLine={false} />
              <YAxis yAxisId="weight" stroke="hsl(var(--muted-foreground))" fontSize={11} axisLine={false} tickLine={false} domain={["auto", "auto"]} />
              <YAxis yAxisId="bmi" orientation="right" stroke="hsl(var(--chart-3))" fontSize={11} axisLine={false} tickLine={false} domain={["auto", "auto"]} />
              <Tooltip contentStyle={tooltipStyle} />
              <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: "12px", paddingTop: "8px" }} />
              <Line
                yAxisId="weight"
                type="monotone"
                dataKey="weight"
                stroke="hsl(var(--primary))"
                strokeWidth={2.5}
                dot={{ r: 4, fill: "hsl(var(--primary))", strokeWidth: 0 }}
                activeDot={{ r: 6 }}
                name="Weight (kg)"
              />
              <Line
                yAxisId="bmi"
                type="monotone"
                dataKey="bmi"
                stroke="hsl(var(--chart-3))"
                strokeWidth={2.5}
                strokeDasharray="5 4"
                dot={{ r: 4, fill: "hsl(var(--chart-3))", strokeWidth: 0 }}
                activeDot={{ r: 6 }}
                name="BMI"
              />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex flex-col items-center justify-center h-[240px] text-center gap-2">
            <p className="text-muted-foreground text-sm">No progress entries yet</p>
            <p className="text-xs text-muted-foreground">Log your weight to start tracking trends.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default WeightBmiProgressChart;