import { useState, useMemo } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useFitness } from "@/contexts/FitnessContext";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  BarChart, Bar,
  LineChart, Line,
  AreaChart, Area,
  PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from "recharts";
import { format, isAfter, isWithinInterval, subDays, differenceInDays, startOfDay, isBefore } from "date-fns";
import { DateFilter } from "@/components/shared/DateFilter";
import { getDateRange, formatFilterLabel } from "@/lib/date-utils";


const tooltipStyle = {
  backgroundColor: "hsl(var(--card))",
  border: "1px solid hsl(var(--border))",
  borderRadius: "10px",
  color: "hsl(var(--foreground))",
  fontSize: "13px",
  padding: "10px 14px",
  boxShadow: "0 4px 20px rgba(0,0,0,0.12)",
};


function StatCard({ label, value, sub, accent }) {
  return (
    <Card className="relative overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5">
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{ background: `radial-gradient(circle at top right, ${accent}, transparent 70%)` }}
      />
      <CardContent className="flex flex-col justify-between p-5 h-full">
        <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-2">{label}</p>
        <p className="text-3xl font-bold text-foreground leading-none">{value}</p>
        {sub && <p className="text-xs text-muted-foreground mt-2">{sub}</p>}
      </CardContent>
    </Card>
  );
}

function SectionLabel({ title, description }) {
  return (
    <div className="mb-1">
      <h2 className="text-base font-semibold text-foreground">{title}</h2>
      {description && <p className="text-xs text-muted-foreground mt-0.5">{description}</p>}
    </div>
  );
}

/* ─────────────────────────────────────────────
   Macro Pie custom label
───────────────────────────────────────────── */
const MACRO_COLORS = [
  "hsl(var(--chart-1))",
  "hsl(var(--chart-2))",
  "hsl(var(--chart-3))",
];

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

/* ─────────────────────────────────────────────
   Dashboard
───────────────────────────────────────────── */
const Dashboard = () => {
  const [dateFilter, setDateFilter] = useState("this-month");
  const { user } = useAuth();
  const { workouts, progress, meals, goal } = useFitness();

  const now = useMemo(() => new Date(), []);
  const range = useMemo(() => getDateRange(dateFilter, now), [dateFilter, now]);

  const rangeStart = range.start;
  const rangeEnd = range.end;

  const filteredWorkouts = useMemo(
    () => workouts.filter((w) => isWithinInterval(new Date(w.date), { start: rangeStart, end: rangeEnd })),
    [workouts, rangeStart, rangeEnd]
  );
  const filteredMeals = useMemo(
    () => meals.filter((m) => isWithinInterval(new Date(m.date), { start: rangeStart, end: rangeEnd })),
    [meals, rangeStart, rangeEnd]
  );
  const filteredProgress = useMemo(
    () => progress.filter((p) => isWithinInterval(new Date(p.date), { start: rangeStart, end: rangeEnd })),
    [progress, rangeStart, rangeEnd]
  );

  const completedInRange = filteredWorkouts.filter((w) => w.completed).length;
  const totalInRange = filteredWorkouts.length;
  const rangeCalories = filteredMeals.reduce((sum, m) => sum + m.calories, 0);
  const latestWeight = filteredProgress.length > 0 ? filteredProgress[filteredProgress.length - 1].weight : null;
  const latestBmi = filteredProgress.length > 0 ? filteredProgress[filteredProgress.length - 1].bmi : null;

  const todayStr = format(now, "yyyy-MM-dd");
  const todayCalories = meals.filter(m => m.date === todayStr).reduce((sum, m) => sum + m.calories, 0);
  const effectiveEnd = isBefore(now, rangeEnd) ? now : rangeEnd;
  const daysCount = Math.max(1, differenceInDays(startOfDay(effectiveEnd), startOfDay(rangeStart)) + 1);

  const chartEnd = dateFilter === "this-month" ? now : rangeEnd;

  /* Chart 1 & 2 – last 7 days data */
  const last7Days = useMemo(() =>
    Array.from({ length: 7 }, (_, i) => {
      const date = format(subDays(chartEnd, 6 - i), "yyyy-MM-dd");
      const label = format(subDays(chartEnd, 6 - i), "EEE");
      const completed = filteredWorkouts.filter((w) => w.date === date && w.completed).length;
      const cals = filteredMeals.filter((m) => m.date === date).reduce((sum, m) => sum + m.calories, 0);
      return { label, completed, calories: cals };
    }),
    [filteredWorkouts, filteredMeals, chartEnd]
  );

  /* Chart 3 – Weight progress (up to last 10 entries in range) */
  const weightData = useMemo(() => {
    const sorted = [...filteredProgress].sort((a, b) => new Date(a.date) - new Date(b.date));
    return sorted.slice(-10).map((p) => ({
      label: format(new Date(p.date), "MMM d"),
      weight: p.weight,
      bmi: p.bmi,
    }));
  }, [filteredProgress]);

  /* Chart 4 – Macronutrient breakdown */
  const macroData = useMemo(() => {
    const totals = filteredMeals.reduce(
      (acc, m) => ({
        protein: acc.protein + (m.protein || 0),
        carbs: acc.carbs + (m.carbs || 0),
        fat: acc.fat + (m.fat || 0),
      }),
      { protein: 0, carbs: 0, fat: 0 }
    );
    return [
      { name: "Protein", value: Math.round(totals.protein) },
      { name: "Carbs", value: Math.round(totals.carbs) },
      { name: "Fat", value: Math.round(totals.fat) },
    ].filter((d) => d.value > 0);
  }, [filteredMeals]);

  const totalMacros = macroData.reduce((s, d) => s + d.value, 0);

  const completionRate = totalInRange > 0 ? Math.round((completedInRange / totalInRange) * 100) : 0;

  const totalWorkoutsThisWeek = filteredWorkouts.filter((w) => {
    const d = new Date(w.date);
    return w.completed && isAfter(d, subDays(chartEnd, 7));
  }).length;

  const stats = [
    {
      label: "Workouts Done",
      value: `${completedInRange}/${totalInRange || 0}`,
      sub: `${completionRate}% completion rate`,
      accent: "hsl(var(--primary))",
    },
    {
      label: dateFilter === "today" ? "Today's Calories" : `${formatFilterLabel(dateFilter)} (Daily Avg)`,
      value: (dateFilter === "today" ? todayCalories : Math.round(rangeCalories / daysCount)).toLocaleString(),
      sub: goal ? `Target: ${goal.targetCalories.toLocaleString()} kcal/day` : "No goal set",
      accent: "hsl(var(--destructive))",
    },
    {
      label: "Current Weight",
      value: latestWeight ? `${latestWeight} kg` : "—",
      sub: latestBmi ? `BMI: ${latestBmi}` : "Log progress to track",
      accent: "hsl(var(--chart-3))",
    },
    {
      label: "Active This Week",
      value: totalWorkoutsThisWeek,
      sub: "Workouts in last 7 days",
      accent: "hsl(var(--chart-4))",
    },
  ];

  return (
    <div className="space-y-8 px-1 pb-8">
      {/* ── Header ── */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between pt-1">
        <div>
          <h1 className="text-2xl font-bold text-foreground md:text-3xl">
            Welcome back, <span className="text-primary">{user?.name}</span>
          </h1>
          <p className="text-muted-foreground mt-1 text-sm">
            {formatFilterLabel(dateFilter)} — Your fitness overview at a glance
          </p>
        </div>
        <DateFilter value={dateFilter} onValueChange={setDateFilter} />
      </div>

      {/* ── Stat Cards ── */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <StatCard key={s.label} {...s} />
        ))}
      </div>

      {/* ── Goal Progress ── */}
      {goal && (() => {
        const isToday = dateFilter === "today";
        const activeCals = isToday ? todayCalories : (rangeCalories / daysCount);
        const activeTarget = goal.targetCalories;
        const caloriePercent = Math.min((activeCals / activeTarget) * 100, 100);
        const isCompleted = activeCals >= activeTarget;
        const isOverTarget = activeCals > activeTarget;
        const CheckCircle = ({ className }) => (
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" />
          </svg>
        );

        return (
          <Card className={`relative overflow-hidden transition-all duration-300 ${isCompleted ? 'border-primary/30 bg-primary/5' : ''}`}>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div>
                  <CardTitle className="text-base flex items-center gap-2">
                    {isToday ? "Today's Goal" : `${formatFilterLabel(dateFilter)} (Daily Avg)`} {isCompleted && <CheckCircle className="h-4 w-4 text-primary" />}
                  </CardTitle>
                  <CardDescription className="mt-0.5 capitalize">{goal.type.replace("_", " ")} • {goal.trackingMode || 'Static'}</CardDescription>
                </div>
                <Badge variant={isOverTarget ? "destructive" : isCompleted ? "default" : "secondary"} className={isCompleted && !isOverTarget ? "bg-primary text-primary-foreground" : ""}>
                  {isOverTarget ? "Over Target" : isCompleted ? "Goal Met" : `${Math.round(activeTarget - activeCals)} kcal remaining`}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>{Math.round(activeCals).toLocaleString()} kcal daily avg</span>
                <span>{activeTarget.toLocaleString()} kcal target</span>
              </div>
              <Progress value={caloriePercent} className={`h-2.5 ${isOverTarget ? '[&>div]:bg-destructive' : ''}`} />
            </CardContent>
          </Card>
        );
      })()}

      {/* ── Charts Row 1: Bar + Area ── */}
      <div>
        <div className="grid gap-4 lg:grid-cols-2">
          {/* Chart 1 – Weekly Workout Activity (Bar) */}
          <Card className="overflow-hidden">
            <CardHeader className="pb-2">
              <SectionLabel
                title="Weekly Workout Activity"
                description="Completed sessions per day — last 7 days"
              />
            </CardHeader>
            <CardContent className="pt-1">
              <ResponsiveContainer width="100%" height={240}>
                <BarChart data={last7Days} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                  <XAxis dataKey="label" stroke="hsl(var(--muted-foreground))" fontSize={12} axisLine={false} tickLine={false} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} axisLine={false} tickLine={false} allowDecimals={false} />
                  <Tooltip contentStyle={tooltipStyle} cursor={{ fill: "hsl(var(--muted))", opacity: 0.3 }} />
                  <Bar dataKey="completed" fill="hsl(var(--primary))" radius={[5, 5, 0, 0]} name="Workouts" maxBarSize={40} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Chart 2 – Calorie Intake Trend (Area) */}
          <Card className="overflow-hidden">
            <CardHeader className="pb-2">
              <SectionLabel
                title="Calorie Intake Trend"
                description="Daily caloric consumption — last 7 days"
              />
            </CardHeader>
            <CardContent className="pt-1">
              <ResponsiveContainer width="100%" height={240}>
                <AreaChart data={last7Days} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
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
        </div>
      </div>

      {/* ── Charts Row 2: Line + Pie ── */}
      <div className="grid gap-4 lg:grid-cols-2">
        {/* Chart 3 – Weight / BMI Progress (Line) */}
        <Card className="overflow-hidden">
          <CardHeader className="pb-2">
            <SectionLabel
              title="Weight & BMI Progress"
              description="Body metrics tracked over time"
            />
          </CardHeader>
          <CardContent className="pt-1">
            {weightData.length > 0 ? (
              <ResponsiveContainer width="100%" height={240}>
                <LineChart data={weightData} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
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

        {/* Chart 4 – Macronutrient Breakdown (Pie) */}
        <Card className="overflow-hidden">
          <CardHeader className="pb-2">
            <SectionLabel
              title="Macronutrient Breakdown"
              description="Protein · Carbohydrates · Fat split this period"
            />
          </CardHeader>
          <CardContent className="pt-1">
            {macroData.length > 0 ? (
              <div className="flex items-center gap-4">
                <ResponsiveContainer width="55%" height={240}>
                  <PieChart>
                    <Pie
                      data={macroData}
                      cx="50%"
                      cy="50%"
                      innerRadius={55}
                      outerRadius={95}
                      paddingAngle={3}
                      dataKey="value"
                      labelLine={false}
                      label={renderCustomLabel}
                    >
                      {macroData.map((_, index) => (
                        <Cell key={index} fill={MACRO_COLORS[index % MACRO_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={tooltipStyle} formatter={(v) => [`${v}g`, ""]} />
                  </PieChart>
                </ResponsiveContainer>

                {/* Legend */}
                <div className="flex flex-col gap-3 flex-1">
                  {macroData.map((d, i) => (
                    <div key={d.name} className="flex items-center gap-2">
                      <span
                        className="inline-block w-3 h-3 rounded-full shrink-0"
                        style={{ backgroundColor: MACRO_COLORS[i % MACRO_COLORS.length] }}
                      />
                      <div className="flex flex-col">
                        <span className="text-xs font-semibold text-foreground">{d.name}</span>
                        <span className="text-xs text-muted-foreground">
                          {d.value}g &nbsp;·&nbsp; {totalMacros > 0 ? Math.round((d.value / totalMacros) * 100) : 0}%
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
      </div>
    </div>
  );
};

export default Dashboard;
