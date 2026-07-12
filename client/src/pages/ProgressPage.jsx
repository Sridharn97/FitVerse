import { useState } from "react";
import { useFitness } from "@/contexts/FitnessContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Plus, TrendingUp, Scale, Ruler, Activity } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tooltip as UITooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { format, isWithinInterval, subDays, startOfDay, getDaysInYear, startOfYear, addDays, isAfter } from "date-fns";
import { DateFilter } from "@/components/shared/DateFilter";
import { getDateRange } from "@/lib/date-utils";
function getBmiCategory(bmi) {
    if (bmi < 18.5)
        return { label: "Underweight", color: "text-chart-4" };
    if (bmi < 25)
        return { label: "Normal", color: "text-chart-2" };
    if (bmi < 30)
        return { label: "Overweight", color: "text-chart-1" };
    return { label: "Obese", color: "text-destructive" };
}
const ProgressPage = () => {
    const { progress, addProgress, workouts, meals, goal } = useFitness();
    const [dateFilter, setDateFilter] = useState("this-month");
    const [graphYear, setGraphYear] = useState("last-365");
    const [open, setOpen] = useState(false);
    const [weight, setWeight] = useState("");
    const [height, setHeight] = useState("175");
    const [chest, setChest] = useState("");
    const [waist, setWaist] = useState("");
    const [arms, setArms] = useState("");
    const [date, setDate] = useState(format(new Date(), "yyyy-MM-dd"));
    const handleAdd = () => {
        if (!weight)
            return;
        addProgress({
            date,
            weight: +weight,
            chest: chest ? +chest : undefined,
            waist: waist ? +waist : undefined,
            arms: arms ? +arms : undefined,
        });
        setWeight("");
        setChest("");
        setWaist("");
        setArms("");
        setOpen(false);
    };
    const now = new Date();
    const range = getDateRange(dateFilter, now);
    const rangeStart = range.start;
    const rangeEnd = range.end;
    const filteredProgress = progress.filter(p => isWithinInterval(new Date(p.date), { start: rangeStart, end: rangeEnd }));
    const chartData = filteredProgress.map(p => ({
        date: format(new Date(p.date), "MMM dd"),
        weight: p.weight,
        bmi: p.bmi,
    }));
    const latest = filteredProgress.length > 0 ? filteredProgress[filteredProgress.length - 1] : null;
    const latestOverall = progress.length > 0 ? progress[progress.length - 1] : null;
    // Live BMI calculation
    const liveWeight = weight ? +weight : latest?.weight ?? latestOverall?.weight;
    const liveHeight = height ? +height / 100 : 1.75;
    const liveBmi = liveWeight ? +(liveWeight / (liveHeight * liveHeight)).toFixed(1) : null;
    const bmiCategory = liveBmi ? getBmiCategory(liveBmi) : null;
    const bmiPercent = liveBmi ? Math.min((liveBmi / 40) * 100, 100) : 0;

    const generateYearlyData = () => {
        const data = [];
        const today = startOfDay(new Date());
        
        let startDate, totalDays;
        if (graphYear === "last-365") {
            startDate = subDays(today, 364);
            totalDays = 365;
        } else {
            const yearNum = parseInt(graphYear);
            startDate = startOfYear(new Date(yearNum, 0, 1));
            totalDays = getDaysInYear(startDate);
        }

        for (let i = 0; i < totalDays; i++) {
            const date = addDays(startDate, i);
            const dateStr = format(date, "yyyy-MM-dd");
            
            let intensity = 0;
            let workoutDone = false;
            let goalMet = false;
            let dayCals = 0;

            if (!isAfter(date, today) || graphYear === "last-365") {
                const dayWorkouts = workouts.filter(w => w.date === dateStr);
                workoutDone = dayWorkouts.some(w => w.completed);
                
                const dayMeals = meals.filter(m => m.date === dateStr);
                dayCals = dayMeals.reduce((s, m) => s + m.calories, 0);
                
                if (goal && goal.targetCalories > 0) {
                    if (goal.type === "weight_loss") {
                        goalMet = dayCals > 0 && dayCals <= goal.targetCalories;
                    } else {
                        goalMet = dayCals >= goal.targetCalories;
                    }
                } else {
                     goalMet = dayCals > 0;
                }

                if (workoutDone && goalMet) intensity = 3;
                else if (workoutDone || goalMet) intensity = 2;
                else if (dayWorkouts.length > 0 || dayCals > 0) intensity = 1;
            }

            data.push({ date, dateStr, intensity, workoutDone, goalMet, dayCals });
        }
        return data;
    };
    
    const yearlyData = generateYearlyData();
    const getIntensityColor = (intensity) => {
        switch(intensity) {
            case 3: return "bg-primary shadow-[0_0_4px_rgba(var(--primary),0.6)]";
            case 2: return "bg-primary/70";
            case 1: return "bg-primary/30";
            default: return "bg-muted/50 dark:bg-muted/20";
        }
    };
    return (<div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground md:text-3xl">Progress</h1>
          <p className="text-muted-foreground mt-1">Track your body metrics</p>
        </div>
        <div className="flex items-center gap-2">
          <DateFilter value={dateFilter} onValueChange={setDateFilter} />
          <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button><Plus className="mr-2 h-4 w-4"/> Log Progress</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Log Progress</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Date</Label>
                <Input type="date" value={date} onChange={e => setDate(e.target.value)}/>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Weight (kg) *</Label>
                  <Input type="number" placeholder="75" value={weight} onChange={e => setWeight(e.target.value)}/>
                </div>
                <div className="space-y-2">
                  <Label>Height (cm)</Label>
                  <Input type="number" placeholder="175" value={height} onChange={e => setHeight(e.target.value)}/>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Chest (cm)</Label>
                  <Input type="number" placeholder="95" value={chest} onChange={e => setChest(e.target.value)}/>
                </div>
                <div className="space-y-2">
                  <Label>Waist (cm)</Label>
                  <Input type="number" placeholder="80" value={waist} onChange={e => setWaist(e.target.value)}/>
                </div>
                <div className="space-y-2">
                  <Label>Arms (cm)</Label>
                  <Input type="number" placeholder="35" value={arms} onChange={e => setArms(e.target.value)}/>
                </div>
              </div>
              <Button onClick={handleAdd} className="w-full" disabled={!weight}>Log Progress</Button>
            </div>
          </DialogContent>
          </Dialog>
        </div>
      </div>


      {/* BMI Calculator Card */}
      <Card className="border-primary/20">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Activity className="h-5 w-5 text-primary"/> BMI Calculator
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">Height (cm)</Label>
              <Input type="number" placeholder="175" value={height} onChange={e => setHeight(e.target.value)}/>
            </div>
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">Weight (kg)</Label>
              <Input type="number" placeholder="75" value={weight || (latest?.weight?.toString() ?? "")} onChange={e => setWeight(e.target.value)}/>
            </div>
          </div>
          {liveBmi && bmiCategory && (<div className="space-y-3 pt-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-3xl font-bold text-foreground">{liveBmi}</span>
                  <Badge variant="secondary" className={bmiCategory.color}>{bmiCategory.label}</Badge>
                </div>
                <span className="text-sm text-muted-foreground">BMI</span>
              </div>
              <Progress value={bmiPercent} className="h-2"/>
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Underweight &lt;18.5</span>
                <span>Normal 18.5-25</span>
                <span>Overweight 25-30</span>
                <span>Obese 30+</span>
              </div>
            </div>)}
        </CardContent>
      </Card>

      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardContent className="flex flex-col justify-center p-5">
            <p className="text-sm font-medium text-muted-foreground">Current Weight</p>
            <p className="text-3xl font-bold text-foreground mt-1">{latest?.weight ?? "N/A"} kg</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex flex-col justify-center p-5">
            <p className="text-sm font-medium text-muted-foreground">BMI</p>
            <p className="text-3xl font-bold text-foreground mt-1">{latest?.bmi ?? "N/A"}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex flex-col justify-center p-5">
            <p className="text-sm font-medium text-muted-foreground">Entries</p>
            <p className="text-3xl font-bold text-foreground mt-1">{filteredProgress.length}</p>
          </CardContent>
        </Card>
      </div>

      {chartData.length > 0 && (<Card>
          <CardHeader>
            <CardTitle className="text-lg">Weight Over Time</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))"/>
                <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" fontSize={12}/>
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12}/>
                <Tooltip contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px", color: "hsl(var(--foreground))" }}/>
                <Line type="monotone" dataKey="weight" stroke="hsl(var(--primary))" strokeWidth={2} dot={{ fill: "hsl(var(--primary))" }}/>
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>)}

      {filteredProgress.length > 0 && (<Card>
          <CardHeader>
            <CardTitle className="text-lg">History</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {[...filteredProgress].reverse().map(p => (<div key={p.id} className="flex items-center justify-between rounded-lg border border-border p-3 hover:bg-muted/10 transition-colors">
                  <span className="text-sm text-muted-foreground">{format(new Date(p.date), "MMM dd, yyyy")}</span>
                  <div className="flex gap-4 text-sm">
                    <span className="text-foreground font-medium">{p.weight} kg</span>
                    {p.bmi && (<Badge variant="outline" className="text-xs">
                        BMI: {p.bmi}
                      </Badge>)}
                    {p.chest && <span className="hidden sm:inline text-muted-foreground">Chest: {p.chest}cm</span>}
                    {p.waist && <span className="hidden sm:inline text-muted-foreground">Waist: {p.waist}cm</span>}
                  </div>
                </div>))}
            </div>
          </CardContent>
        </Card>)}

      {/* Consistency Graph Card (Moved to bottom) */}
      <Card className="border-primary/20">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2">
              <Activity className="h-5 w-5 text-primary"/> Consistency
            </CardTitle>
            <Select value={graphYear} onValueChange={setGraphYear}>
              <SelectTrigger className="w-[140px] h-8 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="last-365">Last 365 Days</SelectItem>
                <SelectItem value="2026">2026</SelectItem>
                <SelectItem value="2025">2025</SelectItem>
                <SelectItem value="2024">2024</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <ScrollArea className="w-full pb-4">
            {/* 7 rows * 16px (12px square + 4px gap) = 112px height */}
            <TooltipProvider delayDuration={0}>
              <div className="flex flex-col flex-wrap gap-1 content-start h-[108px]">
                {yearlyData.map((day) => (
                  <UITooltip key={day.dateStr}>
                    <TooltipTrigger asChild>
                      <div className={`w-3 h-3 rounded-[2px] transition-all duration-300 hover:ring-2 hover:ring-primary/50 ${getIntensityColor(day.intensity)}`} />
                    </TooltipTrigger>
                    <TooltipContent side="top" className="text-xs space-y-1 p-2">
                      <p className="font-bold text-[13px] border-b pb-1 mb-1">{format(day.date, "MMM dd, yyyy")}</p>
                      {day.intensity === 0 ? (
                        <p className="text-muted-foreground">No activity logged.</p>
                      ) : (
                        <>
                          {day.workoutDone && <p className="flex items-center gap-1 text-primary"><TrendingUp className="h-3 w-3"/> Workout completed</p>}
                          {day.goalMet && <p className="flex items-center gap-1 text-primary"><Activity className="h-3 w-3"/> Goal met ({day.dayCals} kcal)</p>}
                          {day.intensity === 1 && <p className="text-muted-foreground">Partial activity (missed goals)</p>}
                        </>
                      )}
                    </TooltipContent>
                  </UITooltip>
                ))}
              </div>
            </TooltipProvider>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
          <div className="flex items-center justify-end gap-2 mt-2 text-[10px] text-muted-foreground font-medium">
            <span>Less</span>
            <div className={`w-3 h-3 rounded-[2px] ${getIntensityColor(0)}`} />
            <div className={`w-3 h-3 rounded-[2px] ${getIntensityColor(1)}`} />
            <div className={`w-3 h-3 rounded-[2px] ${getIntensityColor(2)}`} />
            <div className={`w-3 h-3 rounded-[2px] ${getIntensityColor(3)}`} />
            <span>More</span>
          </div>
        </CardContent>
      </Card>
    </div>);
};
export default ProgressPage;
