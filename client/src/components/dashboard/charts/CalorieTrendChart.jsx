import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import SectionLabel from "./SectionLabel";
import { tooltipStyle } from "./chart-utils";

function CalorieTrendChart({ data }) {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-2">
        <SectionLabel
          title="Calorie Intake Trend"
          description="Daily caloric consumption — last 7 days"
        />
      </CardHeader>
      <CardContent className="pt-1">
        <ResponsiveContainer width="100%" height={240}>
          <AreaChart data={data} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="calorieGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(var(--destructive))" stopOpacity={0.3} />
                <stop offset="95%" stopColor="hsl(var(--destructive))" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
            <XAxis dataKey="label" stroke="hsl(var(--muted-foreground))" fontSize={12} axisLine={false} tickLine={false} />
            <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={tooltipStyle} />
            <Area
              type="monotone"
              dataKey="calories"
              stroke="hsl(var(--destructive))"
              strokeWidth={2.5}
              fill="url(#calorieGrad)"
              dot={{ r: 4, fill: "hsl(var(--destructive))", strokeWidth: 0 }}
              activeDot={{ r: 6 }}
              name="Calories"
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

export default CalorieTrendChart;