import { useState } from "react";
import { useFitness } from "@/contexts/FitnessContext";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Plus, Target, Flame, Coffee, Sun, Moon, Cookie, Beef, Wheat, Droplets, TrendingUp, AlertTriangle, CheckCircle, } from "lucide-react";
import { endOfMonth, format, isWithinInterval, startOfMonth, subMonths } from "date-fns";
const mealTypeConfig = {
    breakfast: { label: "Breakfast", icon: Coffee },
    lunch: { label: "Lunch", icon: Sun },
    dinner: { label: "Dinner", icon: Moon },
    snack: { label: "Snack", icon: Cookie },
};
const goalLabels = {
    weight_loss: "Weight Loss",
    muscle_gain: "Muscle Gain",
    maintenance: "Maintenance",
};
const Diet = () => {
    const { meals, addMeal, goal, setGoal } = useFitness();
    const [mealOpen, setMealOpen] = useState(false);
    const [goalOpen, setGoalOpen] = useState(false);
    const [mealName, setMealName] = useState("");
    const [calories, setCalories] = useState("");
    const [protein, setProtein] = useState("");
    const [carbs, setCarbs] = useState("");
    const [fat, setFat] = useState("");
    const [mealType, setMealType] = useState("breakfast");
    const [goalType, setGoalType] = useState("maintenance");
    const [targetCals, setTargetCals] = useState("");
    const [dateFilter, setDateFilter] = useState("this-month");
    const today = format(new Date(), "yyyy-MM-dd");
    const now = new Date();
    const filterMonth = dateFilter === "this-month" ? now : subMonths(now, 1);
    const rangeStart = startOfMonth(filterMonth);
    const rangeEnd = endOfMonth(filterMonth);
    const filteredMeals = meals.filter(m => isWithinInterval(new Date(m.date), { start: rangeStart, end: rangeEnd }));
    const periodCalories = filteredMeals.reduce((s, m) => s + m.calories, 0);
    const periodProtein = filteredMeals.reduce((s, m) => s + m.protein, 0);
    const periodCarbs = filteredMeals.reduce((s, m) => s + m.carbs, 0);
    const periodFat = filteredMeals.reduce((s, m) => s + m.fat, 0);
    const handleAddMeal = () => {
        if (!mealName || !calories)
            return;
        addMeal({ name: mealName, calories: +calories, protein: +protein || 0, carbs: +carbs || 0, fat: +fat || 0, date: today, mealType });
        setMealName("");
        setCalories("");
        setProtein("");
        setCarbs("");
        setFat("");
        setMealType("breakfast");
        setMealOpen(false);
    };
    const handleSetGoal = () => {
        if (!targetCals)
            return;
        setGoal({ type: goalType, targetCalories: +targetCals });
        setGoalOpen(false);
    };
    const caloriePercent = goal ? Math.min((periodCalories / goal.targetCalories) * 100, 100) : 0;
    const isOverTarget = goal ? periodCalories > goal.targetCalories : false;
    const remaining = goal ? goal.targetCalories - periodCalories : 0;
    const getMealsByType = (type) => filteredMeals.filter(m => m.mealType === type);
    const macroStats = [
      { label: "Protein", value: periodProtein, unit: "g", icon: Beef, target: goal ? Math.round(goal.targetCalories * 0.3 / 4) : null },
      { label: "Carbs", value: periodCarbs, unit: "g", icon: Wheat, target: goal ? Math.round(goal.targetCalories * 0.45 / 4) : null },
      { label: "Fat", value: periodFat, unit: "g", icon: Droplets, target: goal ? Math.round(goal.targetCalories * 0.25 / 9) : null },
    ];
    return (<div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground md:text-3xl">Diet & Goals</h1>
          <p className="text-muted-foreground mt-1">Manage your nutrition and track daily intake</p>
        </div>
        <div className="flex gap-2">
          <Select value={dateFilter} onValueChange={(v) => setDateFilter(v)}>
            <SelectTrigger className="w-[150px]"><SelectValue placeholder="Date filter" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="this-month">This month</SelectItem>
              <SelectItem value="last-month">Last month</SelectItem>
            </SelectContent>
          </Select>
          <Dialog open={goalOpen} onOpenChange={setGoalOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm"><Target className="mr-2 h-4 w-4"/> Set Goal</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Set Fitness Goal</DialogTitle>
              </DialogHeader>
              <div className="space-y-5 pt-2">
                <div className="space-y-2">
                  <Label>Goal Type</Label>
                  <Select value={goalType} onValueChange={(v) => setGoalType(v)}>
                    <SelectTrigger className="h-11"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="weight_loss">
                        <span className="flex items-center gap-2"><TrendingUp className="h-4 w-4"/> Weight Loss</span>
                      </SelectItem>
                      <SelectItem value="muscle_gain">
                        <span className="flex items-center gap-2"><Beef className="h-4 w-4"/> Muscle Gain</span>
                      </SelectItem>
                      <SelectItem value="maintenance">
                        <span className="flex items-center gap-2"><Target className="h-4 w-4"/> Maintenance</span>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Daily Calorie Target (kcal)</Label>
                  <Input type="number" placeholder="e.g. 2000" className="h-11" value={targetCals} onChange={e => setTargetCals(e.target.value)}/>
                </div>
                <Button onClick={handleSetGoal} className="w-full h-11" disabled={!targetCals}>Save Goal</Button>
              </div>
            </DialogContent>
          </Dialog>
          <Dialog open={mealOpen} onOpenChange={setMealOpen}>
            <DialogTrigger asChild>
              <Button size="sm"><Plus className="mr-2 h-4 w-4"/> Log Meal</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Log a Meal</DialogTitle>
              </DialogHeader>
              <div className="space-y-5 pt-2">
                <div className="space-y-2">
                  <Label>Meal Type</Label>
                  <div className="grid grid-cols-4 gap-2">
                    {["breakfast", "lunch", "dinner", "snack"].map(type => {
            const config = mealTypeConfig[type];
            const Icon = config.icon;
            return (<button key={type} type="button" onClick={() => setMealType(type)} className={`flex flex-col items-center gap-1.5 rounded-lg border p-3 text-xs font-medium transition-colors ${mealType === type
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border bg-card text-muted-foreground hover:border-primary/40"}`}>
                          <Icon className="h-4 w-4"/>
                          {config.label}
                        </button>);
        })}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Meal Name</Label>
                  <Input placeholder="e.g. Grilled Chicken Salad" className="h-11" value={mealName} onChange={e => setMealName(e.target.value)}/>
                </div>
                <Separator />
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label className="flex items-center gap-1.5"><Flame className="h-3.5 w-3.5 text-primary"/> Calories *</Label>
                    <Input type="number" placeholder="500" className="h-11" value={calories} onChange={e => setCalories(e.target.value)}/>
                  </div>
                  <div className="space-y-2">
                    <Label className="flex items-center gap-1.5"><Beef className="h-3.5 w-3.5"/> Protein (g)</Label>
                    <Input type="number" placeholder="30" className="h-11" value={protein} onChange={e => setProtein(e.target.value)}/>
                  </div>
                  <div className="space-y-2">
                    <Label className="flex items-center gap-1.5"><Wheat className="h-3.5 w-3.5"/> Carbs (g)</Label>
                    <Input type="number" placeholder="50" className="h-11" value={carbs} onChange={e => setCarbs(e.target.value)}/>
                  </div>
                  <div className="space-y-2">
                    <Label className="flex items-center gap-1.5"><Droplets className="h-3.5 w-3.5"/> Fat (g)</Label>
                    <Input type="number" placeholder="15" className="h-11" value={fat} onChange={e => setFat(e.target.value)}/>
                  </div>
                </div>
                <Button onClick={handleAddMeal} className="w-full h-11" disabled={!mealName || !calories}>Log Meal</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Goal Progress Card */}
      {goal ? (<Card className="border-primary/20 bg-card">
          <CardContent className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                  <Target className="h-5 w-5 text-primary"/>
                </div>
                <div>
                  <p className="font-semibold text-foreground">Daily Calorie Goal</p>
                  <p className="text-sm text-muted-foreground">{goalLabels[goal.type]}</p>
                </div>
              </div>
              <Badge variant={isOverTarget ? "destructive" : "secondary"} className="text-xs">
                {isOverTarget ? "Over Target" : remaining > 0 ? `${remaining} kcal left` : "Goal Reached"}
              </Badge>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Progress</span>
                <span className="font-medium text-foreground">{periodCalories} / {goal.targetCalories} kcal</span>
              </div>
              <Progress value={caloriePercent} className="h-2.5"/>
              <p className="text-xs text-muted-foreground text-right">{Math.round(caloriePercent)}% of daily target</p>
            </div>
            {isOverTarget && (<div className="flex items-center gap-2 mt-3 rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
                <AlertTriangle className="h-4 w-4 shrink-0"/>
                <span>You have exceeded your calorie target by {periodCalories - goal.targetCalories} kcal.</span>
              </div>)}
          </CardContent>
        </Card>) : (<Card className="border-dashed border-border">
          <CardContent className="flex flex-col items-center justify-center py-10 text-center">
            <Target className="h-10 w-10 text-muted-foreground mb-3"/>
            <p className="font-medium text-foreground">No goal set yet</p>
            <p className="text-sm text-muted-foreground mt-1 max-w-xs">Set a daily calorie goal to track your progress and stay on target.</p>
            <Button variant="outline" className="mt-4" onClick={() => setGoalOpen(true)}>
              <Target className="mr-2 h-4 w-4"/> Set Your Goal
            </Button>
          </CardContent>
        </Card>)}

      {/* Macro Overview */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-3">
        {macroStats.map(({ label, value, unit, icon: Icon, target }) => {
            const pct = target ? Math.min((value / target) * 100, 100) : 0;
            return (<Card key={label}>
              <CardContent className="p-5">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Icon className="h-4 w-4 text-primary"/>
                    <span className="text-sm font-medium text-foreground">{label}</span>
                  </div>
                  <span className="text-lg font-bold text-foreground">{value}{unit}</span>
                </div>
                {target && (<>
                    <Progress value={pct} className="h-1.5"/>
                    <p className="text-xs text-muted-foreground mt-1.5">Target: {target}{unit}</p>
                  </>)}
              </CardContent>
            </Card>);
        })}
      </div>

      {/* Meals by Category */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-foreground">Meals</h2>
        {["breakfast", "lunch", "dinner", "snack"].map(type => {
            const config = mealTypeConfig[type];
            const Icon = config.icon;
            const typeMeals = getMealsByType(type);
            const typeCals = typeMeals.reduce((s, m) => s + m.calories, 0);
            return (<Card key={type}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                      <Icon className="h-4 w-4 text-primary"/>
                    </div>
                    <div>
                      <CardTitle className="text-sm font-semibold">{config.label}</CardTitle>
                      {typeMeals.length > 0 && (<CardDescription className="text-xs">{typeMeals.length} item{typeMeals.length > 1 ? "s" : ""} — {typeCals} kcal</CardDescription>)}
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" className="h-8 text-xs" onClick={() => { setMealType(type); setMealOpen(true); }}>
                    <Plus className="mr-1 h-3.5 w-3.5"/> Add
                  </Button>
                </div>
              </CardHeader>
              {typeMeals.length > 0 && (<CardContent className="pt-0">
                  <div className="space-y-2">
                    {typeMeals.map(m => (<div key={m.id} className="flex items-center justify-between rounded-md bg-muted/10 border border-border/50 px-3 py-2.5">
                        <div className="flex items-center gap-2.5">
                          <CheckCircle className="h-4 w-4 text-primary/60"/>
                          <span className="text-sm font-medium text-foreground">{m.name}</span>
                        </div>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <span className="font-medium text-foreground">{m.calories} kcal</span>
                          <span className="hidden sm:inline">P: {m.protein}g</span>
                          <span className="hidden sm:inline">C: {m.carbs}g</span>
                          <span className="hidden sm:inline">F: {m.fat}g</span>
                        </div>
                      </div>))}
                  </div>
                </CardContent>)}
              {typeMeals.length === 0 && (<CardContent className="pt-0">
                  <p className="text-xs text-muted-foreground py-2">No {config.label.toLowerCase()} logged yet.</p>
                </CardContent>)}
            </Card>);
        })}
      </div>
    </div>);
};
export default Diet;
