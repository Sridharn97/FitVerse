import { useState } from "react";
import { useFitness } from "@/contexts/FitnessContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Plus, Trash2, Dumbbell } from "lucide-react";
import { endOfMonth, format, isWithinInterval, startOfMonth, subMonths } from "date-fns";
const EXERCISE_LIBRARY = [
  { name: "Bench Press", category: "Chest" },
  { name: "Squats", category: "Legs" },
  { name: "Deadlift", category: "Back" },
  { name: "Shoulder Press", category: "Shoulders" },
  { name: "Bicep Curls", category: "Arms" },
  { name: "Tricep Dips", category: "Arms" },
  { name: "Lat Pulldown", category: "Back" },
  { name: "Leg Press", category: "Legs" },
  { name: "Plank", category: "Core" },
  { name: "Crunches", category: "Core" },
  { name: "Lunges", category: "Legs" },
  { name: "Pull-ups", category: "Back" },
  { name: "Push-ups", category: "Chest" },
  { name: "Rowing", category: "Back" },
  { name: "Running", category: "Cardio" },
  { name: "Cycling", category: "Cardio" },
];
const ALL_DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
const Workouts = () => {
  const { workouts, addWorkout, deleteWorkout, toggleWorkoutComplete } = useFitness();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [day, setDay] = useState("");
  const [date, setDate] = useState(format(new Date(), "yyyy-MM-dd"));
  const [exercises, setExercises] = useState([]);
  const [filterDay, setFilterDay] = useState("all");
  const [dateFilter, setDateFilter] = useState("this-month");
  const addExercise = (exName, category) => {
    setExercises(prev => [...prev, { name: exName, category, sets: 3, reps: 10 }]);
  };
  const removeExercise = (idx) => {
    setExercises(prev => prev.filter((_, i) => i !== idx));
  };
  const updateExercise = (idx, field, value) => {
    setExercises(prev => prev.map((e, i) => i === idx ? { ...e, [field]: value } : e));
  };
  const handleCreate = () => {
    if (!name || !day || exercises.length === 0)
      return;
    addWorkout({
      name,
      day,
      date,
      exercises: exercises.map(e => ({ ...e, id: crypto.randomUUID() })),
      completed: false,
    });
    setName("");
    setDay("");
    setExercises([]);
    setOpen(false);
  };
  const now = new Date();
  const filterMonth = dateFilter === "this-month" ? now : subMonths(now, 1);
  const rangeStart = startOfMonth(filterMonth);
  const rangeEnd = endOfMonth(filterMonth);
  const dateFiltered = workouts.filter(w => isWithinInterval(new Date(w.date), { start: rangeStart, end: rangeEnd }));
  const filtered = filterDay === "all" ? dateFiltered : dateFiltered.filter(w => w.day === filterDay);

  const customDaysStr = localStorage.getItem("fitverse_chart_days");
  const activeDaysRaw = customDaysStr ? JSON.parse(customDaysStr) : ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  // map "Mon" to "Monday"
  const activeDaysMap = {
    Sun: "Sunday", Mon: "Monday", Tue: "Tuesday", Wed: "Wednesday", Thu: "Thursday", Fri: "Friday", Sat: "Saturday"
  };
  const activeDays = activeDaysRaw.map(d => activeDaysMap[d] || d);
  const DAYS = ALL_DAYS.filter(d => activeDays.includes(d));

  return (<div className="space-y-6">
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="text-2xl font-bold text-foreground md:text-3xl">Workouts</h1>
        <p className="text-muted-foreground mt-1">Manage your workout plans</p>
      </div>
      <div className="flex items-center gap-2">
        <Select value={dateFilter} onValueChange={setDateFilter}>
          <SelectTrigger className="w-[150px]"><SelectValue placeholder="Date filter" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="this-month">This month</SelectItem>
            <SelectItem value="last-month">Last month</SelectItem>
          </SelectContent>
        </Select>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button><Plus className="mr-2 h-4 w-4" /> New Workout</Button>
          </DialogTrigger>
          <DialogContent className="max-h-[80vh] overflow-y-auto sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>Create Workout</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Workout Name</Label>
                <Input placeholder="e.g. Upper Body Day" value={name} onChange={e => setName(e.target.value)} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Day</Label>
                  <Select value={day} onValueChange={setDay}>
                    <SelectTrigger><SelectValue placeholder="Select day" /></SelectTrigger>
                    <SelectContent>
                      {DAYS.map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Date</Label>
                  <Input type="date" value={date} onChange={e => setDate(e.target.value)} />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Add Exercises</Label>
                <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto">
                  {EXERCISE_LIBRARY.map(ex => (<Button key={ex.name} variant="outline" size="sm" onClick={() => addExercise(ex.name, ex.category)} className="justify-start text-xs">
                    <Plus className="mr-1 h-3 w-3" /> {ex.name}
                  </Button>))}
                </div>
              </div>

              {exercises.length > 0 && (<div className="space-y-2">
                <Label>Selected Exercises</Label>
                {exercises.map((ex, idx) => (<div key={idx} className="flex items-center gap-2 rounded-lg border border-border p-2">
                  <span className="flex-1 text-sm font-medium text-foreground">{ex.name}</span>
                  <Input type="number" className="w-16" placeholder="Sets" value={ex.sets} onChange={e => updateExercise(idx, "sets", +e.target.value)} />
                  <span className="text-xs text-muted-foreground">×</span>
                  <Input type="number" className="w-16" placeholder="Reps" value={ex.reps} onChange={e => updateExercise(idx, "reps", +e.target.value)} />
                  <Button variant="ghost" size="icon" onClick={() => removeExercise(idx)}>
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>))}
              </div>)}

              <Button onClick={handleCreate} className="w-full" disabled={!name || !day || exercises.length === 0}>
                Create Workout
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>

    <div className="flex gap-2 overflow-x-auto pb-2">
      <Button variant={filterDay === "all" ? "default" : "outline"} size="sm" onClick={() => setFilterDay("all")}>All</Button>
      {DAYS.map(d => (<Button key={d} variant={filterDay === d ? "default" : "outline"} size="sm" onClick={() => setFilterDay(d)}>
        {d.slice(0, 3)}
      </Button>))}
    </div>

    {filtered.length === 0 ? (<Card>
      <CardContent className="flex flex-col items-center justify-center py-12">
        <Dumbbell className="h-12 w-12 text-muted-foreground mb-4" />
        <p className="text-muted-foreground">No workouts yet. Create your first one!</p>
      </CardContent>
    </Card>) : (<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {filtered.map(w => (<Card key={w.id} className={w.completed ? "border-primary/50" : ""}>
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-base">{w.name}</CardTitle>
              <div className="flex gap-2 mt-1">
                <Badge variant="secondary">{w.day}</Badge>
                <Badge variant="outline">{w.date}</Badge>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Checkbox checked={w.completed} onCheckedChange={() => toggleWorkoutComplete(w.id)} />
              <Button variant="ghost" size="icon" onClick={() => deleteWorkout(w.id)}>
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-1">
            {w.exercises.map(ex => (<div key={ex.id} className="flex justify-between text-sm">
              <span className="text-foreground">{ex.name}</span>
              <span className="text-muted-foreground">{ex.sets}×{ex.reps}</span>
            </div>))}
          </div>
          {w.completed && (<Badge className="mt-3 bg-primary/20 text-primary">✓ Completed</Badge>)}
        </CardContent>
      </Card>))}
    </div>)}
  </div>);
};
export default Workouts;
