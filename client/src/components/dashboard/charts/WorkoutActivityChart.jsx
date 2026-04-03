import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import SectionLabel from "./SectionLabel";
import { tooltipStyle } from "./chart-utils";

function WorkoutActivityChart({ data }) {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-2">
        <SectionLabel
          title="Weekly Workout Activity"
          description="Completed sessions per day — last 7 days"
        />
      </CardHeader>
      <CardContent className="pt-1">
        <ResponsiveContainer width="100%" height={240}>
          <BarChart data={data} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
            <XAxis dataKey="label" stroke="hsl(var(--muted-foreground))" fontSize={12} axisLine={false} tickLine={false} />
            <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} axisLine={false} tickLine={false} allowDecimals={false} />
            <Tooltip contentStyle={tooltipStyle} cursor={{ fill: "hsl(var(--muted))", opacity: 0.3 }} />
            <Bar dataKey="completed" fill="hsl(var(--primary))" radius={[5, 5, 0, 0]} name="Workouts" maxBarSize={40} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

export default WorkoutActivityChart;