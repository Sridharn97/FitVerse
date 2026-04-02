import { useEffect, useRef, useState } from "react";
import { useFitness } from "@/contexts/FitnessContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Plus, Trash2, Dumbbell, TimerReset, Play, Pause, Info, ChevronRight } from "lucide-react";
import { format, isWithinInterval } from "date-fns";
import { DateFilter } from "@/components/shared/DateFilter";
import { getDateRange } from "@/lib/date-utils";
import { 
  EXERCISE_LIBRARY, 
  ALL_DAYS, 
  BUILDER_MODES, 
  EXERCISE_CATEGORIES 
} from "@/data/workoutData";
import { formatSeconds } from "@/lib/workout-utils";

// Text-based exercise instructions replace video demos.

const Workouts = () => {
  const { workouts, addWorkout, updateWorkout, deleteWorkout, toggleWorkoutComplete } = useFitness();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [day, setDay] = useState("");
  const [date, setDate] = useState(format(new Date(), "yyyy-MM-dd"));
  const [builderMode, setBuilderMode] = useState("standard");
  const [stagedExercise, setStagedExercise] = useState(null);
  const [workoutNotes, setWorkoutNotes] = useState("");
  const [defaultRestSeconds, setDefaultRestSeconds] = useState(90);
  const [exercises, setExercises] = useState([]);
  const [filterDay, setFilterDay] = useState("all");
  const [dateFilter, setDateFilter] = useState("this-month");
  const [timers, setTimers] = useState({});
  const [notesByWorkout, setNotesByWorkout] = useState({});
  const [detailsDrawerOpen, setDetailsDrawerOpen] = useState(false);
  const [detailsWorkoutId, setDetailsWorkoutId] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [activeExerciseInstructions, setActiveExerciseInstructions] = useState(null);

  const addExercise = (exercise) => {
    if (builderMode === "superset" || builderMode === "circuit") {
      if (!stagedExercise) {
        setStagedExercise(exercise);
        return;
      }

      const groupId = `grp-${crypto.randomUUID()}`;
      setExercises((prev) => [
        ...prev,
        {
          ...stagedExercise,
          setType: builderMode,
          groupId,
          sets: 3,
          reps: 10,
          weight: 0,
          restSeconds: defaultRestSeconds,
          notes: "",
        },
        {
          ...exercise,
          setType: builderMode,
          groupId,
          sets: 3,
          reps: 10,
          weight: 0,
          restSeconds: defaultRestSeconds,
          notes: "",
        },
      ]);
      setStagedExercise(null);
      return;
    }

    setExercises((prev) => [
      ...prev,
      {
        ...exercise,
        setType: builderMode,
        groupId: "",
        sets: 3,
        reps: 10,
        weight: 0,
        restSeconds: defaultRestSeconds,
        notes: builderMode === "drop-set" ? "Drop weight by 15-20% on each drop." : "",
      },
    ]);
  };

  const removeExercise = (idx) => {
    setExercises((prev) => prev.filter((_, i) => i !== idx));
  };

  const updateExercise = (idx, field, value) => {
    setExercises((prev) => prev.map((e, i) => (i === idx ? { ...e, [field]: value } : e)));
  };

  useEffect(() => {
    const interval = window.setInterval(() => {
      setTimers((prev) => {
        let changed = false;
        const next = { ...prev };

        Object.keys(next).forEach((workoutId) => {
          const timer = next[workoutId];
          if (!timer.running || timer.remaining <= 0) {
            return;
          }
          const remaining = timer.remaining - 1;
          next[workoutId] = { ...timer, remaining, running: remaining > 0 };
          changed = true;
        });

        return changed ? next : prev;
      });
    }, 1000);

    return () => window.clearInterval(interval);
  }, []);

  useEffect(() => {
    setNotesByWorkout((prev) => {
      const next = { ...prev };
      workouts.forEach((workout) => {
        if (next[workout.id] === undefined) {
          next[workout.id] = workout.notes || "";
        }
      });
      return next;
    });
  }, [workouts]);

// Exercise instructions are displayed in a dedicated section or modal.

  const startTimer = (workout) => {
    setTimers((prev) => {
      const previous = prev[workout.id];
      return {
        ...prev,
        [workout.id]: {
          remaining: previous?.remaining ?? Number(workout.restSeconds || 60),
          running: true,
        },
      };
    });
  };

  const pauseTimer = (workoutId) => {
    setTimers((prev) => ({
      ...prev,
      [workoutId]: { ...(prev[workoutId] || { remaining: 0 }), running: false },
    }));
  };

  const resetTimer = (workout) => {
    setTimers((prev) => ({
      ...prev,
      [workout.id]: { remaining: Number(workout.restSeconds || 60), running: false },
    }));
  };

  const handleCreate = () => {
    if (!name || !day || exercises.length === 0) {
      return;
    }

    addWorkout({
      name,
      day,
      date,
      restSeconds: Number(defaultRestSeconds || 60),
      notes: workoutNotes,
      exercises: exercises.map((e) => ({ ...e, id: crypto.randomUUID() })),
      completed: false,
    });
    setName("");
    setDay("");
    setDefaultRestSeconds(90);
    setWorkoutNotes("");
    setExercises([]);
    setStagedExercise(null);
    setSelectedCategory("all");
    setActiveExerciseInstructions(null);
    setOpen(false);
  };

  const saveWorkoutNotes = async (workout) => {
    await updateWorkout(workout.id, { notes: notesByWorkout[workout.id] || "" });
  };

  const now = new Date();
  const range = getDateRange(dateFilter, now);
  const rangeStart = range.start;
  const rangeEnd = range.end;
  const dateFiltered = workouts.filter((w) => isWithinInterval(new Date(w.date), { start: rangeStart, end: rangeEnd }));
  const filtered = filterDay === "all" ? dateFiltered : dateFiltered.filter((w) => w.day === filterDay);

  const selectedWorkout = detailsWorkoutId ? workouts.find((w) => w.id === detailsWorkoutId) : null;
  const selectedTimer = selectedWorkout
    ? (timers[selectedWorkout.id] || { remaining: Number(selectedWorkout.restSeconds || 60), running: false })
    : null;

  const customDaysStr = localStorage.getItem("fitverse_chart_days");
  const activeDaysRaw = customDaysStr ? JSON.parse(customDaysStr) : ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const activeDaysMap = {
    Sun: "Sunday",
    Mon: "Monday",
    Tue: "Tuesday",
    Wed: "Wednesday",
    Thu: "Thursday",
    Fri: "Friday",
    Sat: "Saturday",
  };
  const activeDays = activeDaysRaw.map((d) => activeDaysMap[d] || d);
  const DAYS = ALL_DAYS.filter((d) => activeDays.includes(d));

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground md:text-3xl">Workouts</h1>
          <p className="mt-1 text-muted-foreground">Manage your workout plans and track personal records</p>
        </div>
        <div className="flex items-center gap-2">
          <DateFilter value={dateFilter} onValueChange={setDateFilter} />
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" /> New Workout
              </Button>
            </DialogTrigger>
            <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-3xl">
              <DialogHeader>
                <DialogTitle>Create Workout</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Workout Name</Label>
                    <Input placeholder="e.g. Upper Body Day" value={name} onChange={(e) => setName(e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label>Default Rest Timer (seconds)</Label>
                    <Input
                      type="number"
                      min={15}
                      value={defaultRestSeconds}
                      onChange={(e) => setDefaultRestSeconds(Number(e.target.value || 60))}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Day</Label>
                    <Select value={day} onValueChange={setDay}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select day" />
                      </SelectTrigger>
                      <SelectContent>
                        {DAYS.map((d) => (
                          <SelectItem key={d} value={d}>
                            {d}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Date</Label>
                    <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Workout Notes</Label>
                  <Textarea
                    rows={3}
                    value={workoutNotes}
                    onChange={(e) => setWorkoutNotes(e.target.value)}
                    placeholder="Warm-up plan, intensity target, or coaching cues"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Set Builder</Label>
                  <Select value={builderMode} onValueChange={setBuilderMode}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select builder mode" />
                    </SelectTrigger>
                    <SelectContent>
                      {BUILDER_MODES.map((mode) => (
                        <SelectItem key={mode.value} value={mode.value}>
                          {mode.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {(builderMode === "superset" || builderMode === "circuit") && (
                    <p className="text-xs text-muted-foreground">
                      Choose two exercises in sequence to create one {builderMode} group.
                    </p>
                  )}
                  {stagedExercise && (
                    <p className="text-xs font-medium text-primary">
                      First exercise selected: {stagedExercise.name}. Pick the second one to complete the pair.
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label>Exercise Library</Label>
                  <div className="flex flex-col gap-2 rounded-lg border bg-muted/30 p-3 sm:flex-row sm:items-center sm:justify-between">
                    <p className="text-xs text-muted-foreground">
                      {EXERCISE_LIBRARY.filter((exercise) => selectedCategory === "all" || exercise.category === selectedCategory).length} exercises
                    </p>
                    <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                      <SelectTrigger className="w-full sm:w-44">
                        <SelectValue placeholder="Filter by category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Categories</SelectItem>
                        {EXERCISE_CATEGORIES.map((category) => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    {EXERCISE_LIBRARY.filter((exercise) => selectedCategory === "all" || exercise.category === selectedCategory).map((exercise) => (
                      <div key={exercise.name} className="flex flex-col rounded-lg border bg-card p-3 shadow-sm transition-colors hover:bg-muted/30">
                        <div className="flex flex-1 flex-col">
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex-1">
                              <p className="text-sm font-semibold leading-5">{exercise.name}</p>
                              <p className="text-xs text-muted-foreground">{exercise.category}</p>
                            </div>
                            <Button size="sm" variant="outline" className="h-8 w-8 p-0" onClick={() => addExercise(exercise)}>
                              <Plus className="h-3 w-3" />
                            </Button>
                          </div>
                          <p className="mt-2 text-xs text-muted-foreground line-clamp-2">{exercise.formCue}</p>

                          <Button
                            type="button"
                            size="sm"
                            variant="link"
                            className="mt-2 h-auto justify-start p-0 text-xs font-medium text-primary"
                            onClick={() => setActiveExerciseInstructions(exercise)}
                          >
                            <Info className="mr-1 h-3 w-3" /> View Instructions
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Instructions Pop-up Dialog */}
                  <Dialog open={!!activeExerciseInstructions} onOpenChange={(open) => !open && setActiveExerciseInstructions(null)}>
                    <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl border-primary/20 ring-1 ring-primary/5">
                      {activeExerciseInstructions && (
                        <div className="space-y-6 pt-2">
                          <div className="space-y-2">
                            <DialogHeader className="text-left px-0 pb-2 border-b border-primary/10">
                              <DialogTitle className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-3">
                                <span className="bg-primary/10 p-2 rounded-xl">
                                  <Dumbbell className="h-6 w-6 text-primary" />
                                </span>
                                {activeExerciseInstructions.name}
                              </DialogTitle>
                              <Badge variant="secondary" className="w-fit mt-1 bg-primary/5 text-primary border-primary/20 hover:bg-primary/10">
                                {activeExerciseInstructions.category}
                              </Badge>
                            </DialogHeader>
                          </div>

                          <div className="grid gap-8 md:grid-cols-2">
                            <div className="space-y-5">
                              <h4 className="text-sm font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                                <ChevronRight className="h-4 w-4 text-primary" />
                                Steps to Perform
                              </h4>
                              <ol className="space-y-4 pr-2">
                                {activeExerciseInstructions.steps.map((step, i) => (
                                  <li key={i} className="flex gap-4 text-sm leading-relaxed text-foreground/90 group">
                                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                                      {i + 1}
                                    </span>
                                    <p className="pt-0.5">{step}</p>
                                  </li>
                                ))}
                              </ol>
                            </div>

                            <div className="space-y-6">
                              <div className="space-y-4">
                                <h4 className="text-sm font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                                  <Plus className="h-4 w-4 text-primary" />
                                  Requirements
                                </h4>
                                <div className="flex flex-wrap gap-2">
                                  {activeExerciseInstructions.requirements.map((req) => (
                                    <Badge key={req} variant="outline" className="bg-muted/50 border-primary/10 font-medium px-3 py-1 text-xs">
                                      {req}
                                    </Badge>
                                  ))}
                                </div>
                              </div>

                              <div className="rounded-xl bg-gradient-to-br from-primary/5 to-transparent p-4 border border-primary/10 shadow-sm relative overflow-hidden group">
                                <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:scale-110 transition-transform">
                                  <Info className="h-12 w-12 text-primary" />
                                </div>
                                <h4 className="text-[10px] font-black uppercase tracking-widest text-primary/70 mb-2">Coach's Pro Tip</h4>
                                <p className="text-sm italic text-foreground/80 leading-relaxed font-medium">"{activeExerciseInstructions.formCue}"</p>
                              </div>

                              <Button onClick={() => setActiveExerciseInstructions(null)} className="w-full mt-2 sm:hidden">
                                Close Instructions
                              </Button>
                            </div>
                          </div>
                        </div>
                      )}
                    </DialogContent>
                  </Dialog>
                </div>

                {exercises.length > 0 && (
                  <div className="space-y-2">
                    <Label>Selected Exercises</Label>
                    <div className="space-y-2">
                      {exercises.map((exercise, idx) => (
                        <div key={`${exercise.name}-${idx}`} className="space-y-2 rounded-lg border p-3">
                          <div className="flex items-center justify-between gap-2">
                            <div className="flex flex-wrap items-center gap-2">
                              <span className="text-sm font-semibold">{exercise.name}</span>
                              <Badge variant="outline" className="text-xs capitalize">
                                {exercise.setType}
                              </Badge>
                              {exercise.groupId && <Badge variant="secondary">Group</Badge>}
                            </div>
                            <Button variant="ghost" size="icon" onClick={() => removeExercise(idx)}>
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </div>

                          <div className="grid grid-cols-2 gap-2 sm:grid-cols-5">
                            <Input
                              type="number"
                              placeholder="Sets"
                              value={exercise.sets}
                              onChange={(e) => updateExercise(idx, "sets", Number(e.target.value || 0))}
                            />
                            <Input
                              type="number"
                              placeholder="Reps"
                              value={exercise.reps}
                              onChange={(e) => updateExercise(idx, "reps", Number(e.target.value || 0))}
                            />
                            <Input
                              type="number"
                              placeholder="Weight"
                              value={exercise.weight}
                              onChange={(e) => updateExercise(idx, "weight", Number(e.target.value || 0))}
                            />
                            <Input
                              type="number"
                              placeholder="Rest sec"
                              value={exercise.restSeconds}
                              onChange={(e) => updateExercise(idx, "restSeconds", Number(e.target.value || 0))}
                            />
                            <Input
                              placeholder="Set type"
                              value={exercise.setType}
                              disabled
                            />
                          </div>
                          <Textarea
                            rows={2}
                            placeholder="Exercise notes"
                            value={exercise.notes}
                            onChange={(e) => updateExercise(idx, "notes", e.target.value)}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <Button onClick={handleCreate} className="w-full" disabled={!name || !day || exercises.length === 0}>
                  Create Workout
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2">
        <Button variant={filterDay === "all" ? "default" : "outline"} size="sm" onClick={() => setFilterDay("all")}>
          All
        </Button>
        {DAYS.map((d) => (
          <Button key={d} variant={filterDay === d ? "default" : "outline"} size="sm" onClick={() => setFilterDay(d)}>
            {d.slice(0, 3)}
          </Button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Dumbbell className="mb-4 h-12 w-12 text-muted-foreground" />
            <p className="text-muted-foreground">No workouts yet. Create your first one!</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((workout) => {
            return (
              <Card key={workout.id} className={workout.completed ? "border-primary/50" : ""}>
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-base">{workout.name}</CardTitle>
                      <div className="mt-1 flex gap-2">
                        <Badge variant="secondary">{workout.day}</Badge>
                        <Badge variant="outline">{workout.date}</Badge>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Checkbox checked={workout.completed} onCheckedChange={() => toggleWorkoutComplete(workout.id)} />
                      <Button variant="ghost" size="icon" onClick={() => deleteWorkout(workout.id)}>
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="rounded-md border bg-muted/20 px-3 py-2">
                    <p className="text-sm text-muted-foreground">
                      {workout.exercises.length} exercise{workout.exercises.length === 1 ? "" : "s"}
                    </p>
                    <Button
                      className="mt-2 h-auto p-0 text-left"
                      variant="link"
                      onClick={() => {
                        setDetailsWorkoutId(workout.id);
                        setDetailsDrawerOpen(true);
                      }}
                    >
                      View Details
                    </Button>
                  </div>

                  {workout.completed && <Badge className="bg-primary/20 text-primary">Completed</Badge>}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      <Sheet
        open={detailsDrawerOpen}
        onOpenChange={(nextOpen) => {
          setDetailsDrawerOpen(nextOpen);
          if (!nextOpen) {
            setDetailsWorkoutId(null);
          }
        }}
      >
        <SheetContent
          side="right"
          className="w-[92vw] sm:w-[40vw] md:w-[35vw] lg:w-[32vw] sm:max-w-none"
        >
          {!selectedWorkout ? (
            <div className="text-sm text-muted-foreground">Select a workout to view details.</div>
          ) : (
            <div className="flex h-full flex-col gap-4">
              <SheetHeader className="text-left">
                <SheetTitle>{selectedWorkout.name}</SheetTitle>
                <div className="mt-2 flex flex-wrap gap-2">
                  <Badge variant="secondary">{selectedWorkout.day}</Badge>
                  <Badge variant="outline">{selectedWorkout.date}</Badge>
                  {selectedWorkout.completed && <Badge className="bg-primary/20 text-primary">Completed</Badge>}
                </div>
              </SheetHeader>

              <div className="flex-1 space-y-4 overflow-y-auto pr-1">
                <div className="rounded-lg border p-3">
                  <p className="text-xs font-medium text-muted-foreground">Rest Timer</p>
                  <div className="mt-2 flex items-center justify-between">
                    <span className="text-2xl font-bold tabular-nums">
                      {formatSeconds(selectedTimer?.remaining ?? 0)}
                    </span>
                    <div className="flex items-center gap-1">
                      {selectedTimer?.running ? (
                        <Button size="icon" variant="outline" onClick={() => pauseTimer(selectedWorkout.id)}>
                          <Pause className="h-4 w-4" />
                        </Button>
                      ) : (
                        <Button size="icon" variant="outline" onClick={() => startTimer(selectedWorkout)}>
                          <Play className="h-4 w-4" />
                        </Button>
                      )}
                      <Button size="icon" variant="outline" onClick={() => resetTimer(selectedWorkout)}>
                        <TimerReset className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <p className="text-xs font-medium text-muted-foreground">Exercises</p>
                  <div className="space-y-2">
                    {selectedWorkout.exercises.map((exercise) => (
                      <div key={exercise.id} className="rounded-md border p-3 text-sm">
                        <div className="flex items-center justify-between gap-2">
                          <span className="font-medium text-foreground">{exercise.name}</span>
                          <Badge variant="outline" className="capitalize">
                            {exercise.setType || "standard"}
                          </Badge>
                        </div>
                        <p className="mt-1 text-xs text-muted-foreground">
                          {exercise.sets} x {exercise.reps} | {exercise.weight || 0} kg
                        </p>
                        {exercise.formCue && <p className="mt-1 text-xs text-muted-foreground">Cue: {exercise.formCue}</p>}
                        {exercise.steps && exercise.steps.length > 0 && (
                          <Button
                            size="sm"
                            variant="link"
                            className="h-auto p-0 text-xs text-primary mt-2"
                            onClick={() => setActiveExerciseInstructions(exercise)}
                          >
                            <Info className="mr-1 h-3 w-3" /> View Instructions
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-3">
                  <Label className="text-sm font-medium">In-workout Notes</Label>
                  <Textarea
                    rows={3}
                    className="min-h-[110px]"
                    value={notesByWorkout[selectedWorkout.id] ?? selectedWorkout.notes ?? ""}
                    onChange={(e) =>
                      setNotesByWorkout((prev) => ({
                        ...prev,
                        [selectedWorkout.id]: e.target.value,
                      }))
                    }
                  />
                  <Button size="sm" variant="outline" className="w-fit" onClick={() => saveWorkoutNotes(selectedWorkout)}>
                    Save Notes
                  </Button>
                </div>
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
};
export default Workouts;
