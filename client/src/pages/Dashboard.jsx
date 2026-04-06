import { useState, useMemo } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useFitness } from "@/contexts/FitnessContext";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format, isAfter, isWithinInterval, subDays, differenceInDays, differenceInCalendarDays, startOfDay, isBefore } from "date-fns";
import { CheckCircle2, Circle, Clock, Dumbbell, Flame, TrendingUp, Zap } from "lucide-react";
import { DateFilter } from "@/components/shared/DateFilter";
import { getDateRange, formatFilterLabel } from "@/lib/date-utils";
import DashboardCharts from "@/components/dashboard/charts/DashboardCharts";
import StreakCalendar from "@/components/dashboard/StreakCalendar";
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


const Dashboard = () => {
  const [dateFilter, setDateFilter] = useState("this-month");
  const { user } = useAuth();
  const { workouts, progress, meals } = useFitness();

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


  const weightData = useMemo(() => {
    const sorted = [...filteredProgress].sort((a, b) => new Date(a.date) - new Date(b.date));
    return sorted.slice(-10).map((p) => ({
      label: format(new Date(p.date), "MMM d"),
      weight: p.weight,
      bmi: p.bmi,
    }));
  }, [filteredProgress]);


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

  // Category breakdown — how many exercises per muscle group
  const categoryData = useMemo(() => {
    const counts = {};
    filteredWorkouts.forEach((w) => {
      (w.exercises || []).forEach((ex) => {
        const cat = ex.category || "General";
        counts[cat] = (counts[cat] || 0) + 1;
      });
    });
    return Object.entries(counts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count);
  }, [filteredWorkouts]);

  // Avg daily protein
  const avgProtein = useMemo(() => {
    const total = filteredMeals.reduce((s, m) => s + (m.protein || 0), 0);
    return daysCount > 0 ? Math.round(total / daysCount) : 0;
  }, [filteredMeals, daysCount]);

  // Workout streak (consecutive days with completed workout ending today)
  const streak = useMemo(() => {
    const completedDates = new Set(
      workouts.filter((w) => w.completed).map((w) => w.date)
    );
    let count = 0;
    let check = new Date();
    while (true) {
      const key = format(check, "yyyy-MM-dd");
      if (completedDates.has(key)) {
        count++;
        check = subDays(check, 1);
      } else {
        break;
      }
    }
    return count;
  }, [workouts]);

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
      sub: "Daily calorie intake",
      accent: "hsl(var(--destructive))",
    },
    {
      label: "Current Weight",
      value: latestWeight ? `${latestWeight} kg` : "—",
      sub: latestBmi ? `BMI: ${latestBmi}` : "Log progress to track",
      accent: "hsl(var(--chart-3))",
    },
    {
      label: "Current Streak",
      value: `${streak}`,
      sub: streak === 1 ? "Consecutive day" : "Consecutive days",
      accent: "hsl(var(--chart-4))",
    },
  ];
  // Muscle group last-trained freshness
  const MUSCLE_GROUPS = [
    { name: "Chest",     icon: "💪" },
    { name: "Back",      icon: "🔙" },
    { name: "Shoulders", icon: "🏋️" },
    { name: "Legs",      icon: "🦵" },
    { name: "Arms",      icon: "💪" },
    { name: "Core",      icon: "🔥" },
    { name: "Cardio",    icon: "🏃" },
  ];

  const muscleStatus = useMemo(() => {
    const today = startOfDay(new Date());
    const lastTrained = {};
    workouts.forEach((w) => {
      (w.exercises || []).forEach((ex) => {
        const cat = ex.category || "General";
        const d = startOfDay(new Date(w.date));
        if (!lastTrained[cat] || d > lastTrained[cat]) {
          lastTrained[cat] = d;
        }
      });
    });
    return MUSCLE_GROUPS.map(({ name, icon }) => {
      const last = lastTrained[name];
      const daysAgo = last ? differenceInCalendarDays(today, last) : null;
      let status = "never";
      if (daysAgo === 0) status = "today";
      else if (daysAgo === 1) status = "yesterday";
      else if (daysAgo !== null && daysAgo <= 3) status = "recent";
      else if (daysAgo !== null && daysAgo <= 7) status = "moderate";
      else if (daysAgo !== null) status = "stale";
      return { name, icon, daysAgo, status };
    });
  }, [workouts]);

  // Recent 5 workouts for the activity feed
  const recentWorkouts = useMemo(() => {
    return [...workouts]
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 5);
  }, [workouts]);

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
      {/* ── Row 1: Calendar & Recent Activity ── */}
      <div className="grid gap-4 lg:grid-cols-2 items-stretch">
        <div className="lg:col-span-1">
          <StreakCalendar workouts={workouts} currentStreak={streak} />
        </div>
        <div className="lg:col-span-1">
          <Card className="overflow-hidden h-full flex flex-col">
            <CardHeader className="pb-2 p-4">
          <SectionLabel
            title="Recent Activity"
            description="Your 5 latest workout sessions"
          />
        </CardHeader>
        <CardContent className="pt-0 p-4 pb-4">
          {recentWorkouts.length > 0 ? (
            <div className="flex flex-col gap-2">
              {recentWorkouts.map((w) => {
                const exerciseCount = (w.exercises || []).length;
                const categories = [...new Set((w.exercises || []).map((e) => e.category).filter(Boolean))];
                const daysAgo = differenceInCalendarDays(startOfDay(new Date()), startOfDay(new Date(w.date)));
                const dateLabel = daysAgo === 0 ? "Today" : daysAgo === 1 ? "Yesterday" : `${daysAgo}d ago`;
                return (
                  <div
                    key={w.id}
                    className="group flex items-center justify-between rounded-xl border border-border/60 bg-muted/10 p-3 transition-colors hover:bg-muted/30 hover:border-primary/20"
                  >
                    {/* Left: Icon + Text */}
                    <div className="flex items-center gap-3">
                      <div className={`flex shrink-0 h-9 w-9 items-center justify-center rounded-full ${
                        w.completed ? "bg-primary/15 text-primary" : "bg-muted/60 text-muted-foreground"
                      }`}>
                        {w.completed ? <CheckCircle2 className="h-4 w-4" /> : <Circle className="h-4 w-4" />}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-foreground leading-snug">{w.name}</p>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground mt-0.5">
                          <span>{w.day}</span>
                          {exerciseCount > 0 && (
                            <>
                              <span className="text-border">·</span>
                              <span className="flex items-center gap-0.5">
                                <Dumbbell className="h-2.5 w-2.5" /> {exerciseCount} ex
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Right: Date + Categories */}
                    <div className="flex flex-col items-end gap-1.5">
                      <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                        <Clock className="h-3 w-3" />{dateLabel}
                      </span>
                      {categories.length > 0 && (
                        <div className="flex gap-1">
                          {categories.slice(0, 2).map((cat) => (
                            <span
                              key={cat}
                              className="inline-block text-[10px] font-medium px-1.5 py-0.5 rounded-md bg-primary/8 text-primary/80 border border-primary/10"
                            >
                              {cat}
                            </span>
                          ))}
                          {categories.length > 2 && (
                            <span className="text-[10px] text-muted-foreground">+{categories.length - 2}</span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-[140px] text-center gap-3">
              <div className="h-12 w-12 rounded-full bg-muted/40 flex items-center justify-center">
                <Dumbbell className="h-6 w-6 text-muted-foreground" />
              </div>
              <p className="text-muted-foreground text-sm">No workouts logged yet</p>
              <p className="text-xs text-muted-foreground">Start logging to see your activity feed.</p>
            </div>
          )}
        </CardContent>
      </Card>
        </div>
      </div>

      {/* ── Row 2 & 3: Charts (Handled by DashboardCharts components) ── */}
      <DashboardCharts last7Days={last7Days} weightData={weightData} macroData={macroData} totalMacros={totalMacros} />

    </div>
  );
};

export default Dashboard;
