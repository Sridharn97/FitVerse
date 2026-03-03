import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useFitness } from "@/contexts/FitnessContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dumbbell, TrendingUp, Flame, Target } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { endOfMonth, format, isAfter, isWithinInterval, startOfMonth, subDays, subMonths } from "date-fns";
const Dashboard = () => {
  const [dateFilter, setDateFilter] = useState("this-month");
    const { user } = useAuth();
    const { workouts, progress, meals, goal } = useFitness();
  const now = new Date();
  const filterMonth = dateFilter === "this-month" ? now : subMonths(now, 1);
  const rangeStart = startOfMonth(filterMonth);
  const rangeEnd = endOfMonth(filterMonth);
  const filteredWorkouts = workouts.filter(w => isWithinInterval(new Date(w.date), { start: rangeStart, end: rangeEnd }));
  const filteredMeals = meals.filter(m => isWithinInterval(new Date(m.date), { start: rangeStart, end: rangeEnd }));
  const filteredProgress = progress.filter(p => isWithinInterval(new Date(p.date), { start: rangeStart, end: rangeEnd }));
  const completedInRange = filteredWorkouts.filter(w => w.completed).length;
  const totalInRange = filteredWorkouts.length;
  const rangeCalories = filteredMeals.reduce((sum, m) => sum + m.calories, 0);
  const latestWeight = filteredProgress.length > 0 ? filteredProgress[filteredProgress.length - 1].weight : null;
  const latestBmi = filteredProgress.length > 0 ? filteredProgress[filteredProgress.length - 1].bmi : null;
  const chartEnd = dateFilter === "this-month" ? now : rangeEnd;
    const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = format(subDays(chartEnd, 6 - i), "yyyy-MM-dd");
    const label = format(subDays(chartEnd, 6 - i), "EEE");
    const completed = filteredWorkouts.filter(w => w.date === date && w.completed).length;
    const cals = filteredMeals.filter(m => m.date === date).reduce((sum, m) => sum + m.calories, 0);
        return { label, completed, calories: cals };
    });
  const totalWorkoutsThisWeek = filteredWorkouts.filter(w => {
        const d = new Date(w.date);
    return w.completed && isAfter(d, subDays(chartEnd, 7));
    }).length;
    const stats = [
    { label: "Workouts", value: `${completedInRange}/${totalInRange || 0}`, icon: Dumbbell, color: "text-primary" },
    { label: "Calories", value: rangeCalories.toLocaleString(), icon: Flame, color: "text-destructive" },
        { label: "Current Weight", value: latestWeight ? `${latestWeight} kg` : "N/A", icon: TrendingUp, color: "text-primary" },
    { label: "Workouts (7d)", value: totalWorkoutsThisWeek, icon: Target, color: "text-accent-foreground" },
    ];
    return (<div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground md:text-3xl">
            Welcome back, <span className="text-primary">{user?.name}</span> 💪
          </h1>
          <p className="text-muted-foreground mt-1">Here's your fitness overview</p>
        </div>
        <Select value={dateFilter} onValueChange={setDateFilter}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Date filter" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="this-month">This month</SelectItem>
            <SelectItem value="last-month">Last month</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map(({ label, value, icon: Icon, color }) => (<Card key={label}>
            <CardContent className="flex items-center gap-4 p-5">
              <div className={`flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 ${color}`}>
                <Icon className="h-6 w-6"/>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{label}</p>
                <p className="text-2xl font-bold text-foreground">{value}</p>
              </div>
            </CardContent>
          </Card>))}
      </div>

      {goal && (<Card>
          <CardHeader>
            <CardTitle className="text-lg">Goal Progress</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground capitalize">{goal.type.replace("_", " ")}</span>
              <span className="text-foreground">{rangeCalories} / {goal.targetCalories} kcal</span>
            </div>
            <Progress value={Math.min((rangeCalories / goal.targetCalories) * 100, 100)} className="h-3"/>
          </CardContent>
        </Card>)}

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Weekly Workout Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={last7Days}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))"/>
                <XAxis dataKey="label" stroke="hsl(var(--muted-foreground))" fontSize={12}/>
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12}/>
                <Tooltip contentStyle={{
            backgroundColor: "hsl(var(--card))",
            border: "1px solid hsl(var(--border))",
            borderRadius: "8px",
            color: "hsl(var(--foreground))",
        }}/>
                <Bar dataKey="completed" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} name="Workouts"/>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Calorie Intake (7 Days)</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={last7Days}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))"/>
                <XAxis dataKey="label" stroke="hsl(var(--muted-foreground))" fontSize={12}/>
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12}/>
                <Tooltip contentStyle={{
            backgroundColor: "hsl(var(--card))",
            border: "1px solid hsl(var(--border))",
            borderRadius: "8px",
            color: "hsl(var(--foreground))",
        }}/>
                <Bar dataKey="calories" fill="hsl(var(--destructive))" radius={[4, 4, 0, 0]} name="Calories"/>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {latestBmi && (<Card>
          <CardContent className="flex items-center gap-4 p-5">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent">
              <TrendingUp className="h-6 w-6 text-accent-foreground"/>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Current BMI</p>
              <p className="text-2xl font-bold text-foreground">{latestBmi}</p>
            </div>
          </CardContent>
        </Card>)}
    </div>);
};
export default Dashboard;
