import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Cell, PieChart, Pie, Tooltip, ResponsiveContainer } from "recharts";
import SectionLabel from "./SectionLabel";
import { macroColors, tooltipStyle } from "./chart-utils";

const renderCustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
  if (percent < 0.05) return null;
  const RADIAN = Math.PI / 180;
  const r = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + r * Math.cos(-midAngle * RADIAN);
  const y = cy + r * Math.sin(-midAngle * RADIAN);
  return (
    <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central" fontSize={11} fontWeight={600}>
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

function MacronutrientBreakdownChart({ data, totalMacros }) {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-2">
        <SectionLabel
          title="Macronutrient Breakdown"
          description="Protein · Carbohydrates · Fat split this period"
        />
      </CardHeader>
      <CardContent className="pt-1">
        {data.length > 0 ? (
          <div className="flex items-center gap-4">
            <ResponsiveContainer width="55%" height={240}>
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={95}
                  paddingAngle={3}
                  dataKey="value"
                  labelLine={false}
                  label={renderCustomLabel}
                >
                  {data.map((_, index) => (
                    <Cell key={index} fill={macroColors[index % macroColors.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={tooltipStyle} formatter={(value) => [`${value}g`, ""]} />
              </PieChart>
            </ResponsiveContainer>

            <div className="flex flex-col gap-3 flex-1">
              {data.map((item, index) => (
                <div key={item.name} className="flex items-center gap-2">
                  <span
                    className="inline-block w-3 h-3 rounded-full shrink-0"
                    style={{ backgroundColor: macroColors[index % macroColors.length] }}
                  />
                  <div className="flex flex-col">
                    <span className="text-xs font-semibold text-foreground">{item.name}</span>
                    <span className="text-xs text-muted-foreground">
                      {item.value}g &nbsp;·&nbsp; {totalMacros > 0 ? Math.round((item.value / totalMacros) * 100) : 0}%
                    </span>
                  </div>
                </div>
              ))}
              {totalMacros > 0 && (
                <p className="text-[11px] text-muted-foreground mt-1 border-t border-border pt-2">
                  Total: {totalMacros}g
                </p>
              )}
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-[240px] text-center gap-2">
            <p className="text-muted-foreground text-sm">No meals logged yet</p>
            <p className="text-xs text-muted-foreground">Add meals with macros to see breakdown.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default MacronutrientBreakdownChart;