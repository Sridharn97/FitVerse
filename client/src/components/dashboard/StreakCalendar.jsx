import { useMemo, useState } from "react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { 
  format, 
  startOfMonth, 
  endOfMonth, 
  eachDayOfInterval, 
  isSameMonth, 
  isSameDay, 
  startOfWeek, 
  endOfWeek,
  addMonths,
  subMonths,
  isBefore,
  startOfDay
} from "date-fns";
import { ChevronLeft, ChevronRight, Hexagon, Trophy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";

export function StreakCalendar({ workouts, currentStreak }) {
  const [currentDate, setCurrentDate] = useState(new Date());
  
  const firstDayOfMonth = startOfMonth(currentDate);
  const startDate = startOfWeek(firstDayOfMonth, { weekStartsOn: 0 });
  const endDate = endOfWeek(endOfMonth(currentDate), { weekStartsOn: 0 });
  const today = new Date();

  const days = eachDayOfInterval({ start: startDate, end: endDate });

  const completedDates = useMemo(() => {
    const set = new Set();
    workouts?.forEach((w) => {
      if (w.completed) {
        set.add(format(new Date(w.date), "yyyy-MM-dd"));
      }
    });
    return set;
  }, [workouts]);

  const daysOfWeek = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

  const nextMonth = () => setCurrentDate(addMonths(currentDate, 1));
  const prevMonth = () => setCurrentDate(subMonths(currentDate, 1));

  return (
    <Card className="h-full border-border/60 shadow-md flex flex-col relative overflow-hidden bg-gradient-to-br from-card/80 to-card">
      <CardHeader className="pb-2 pt-5 px-5 flex flex-row items-center justify-between">
        <div>
          <h2 className="text-xl font-bold flex items-center gap-2">
            Day {currentStreak || 0}
            <span className="text-xs font-normal text-muted-foreground ml-1 hidden sm:inline">Streak</span>
          </h2>
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full hover:bg-muted/40" onClick={prevMonth}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <div className="flex flex-col items-center justify-center relative w-12 h-12 group">
            <Hexagon className="h-12 w-12 text-primary/20 fill-primary/10 transition-all duration-300 group-hover:fill-primary/20" strokeWidth={1} />
            <div className="absolute inset-0 flex flex-col items-center justify-center pt-0.5">
               <span className="text-xs font-bold leading-none">{format(currentDate, "d")}</span>
               <span className="text-[9px] font-medium uppercase text-muted-foreground leading-none">{format(currentDate, "MMM")}</span>
            </div>
          </div>
          <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full hover:bg-muted/40" onClick={nextMonth}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>

      <CardContent className="px-5 pb-4 pt-2 flex-grow flex flex-col">
        <div className="grid grid-cols-7 gap-y-2 gap-x-1 text-center text-sm flex-grow items-center">
          {daysOfWeek.map((day, i) => (
            <div key={`header-${i}`} className="text-muted-foreground font-medium text-xs mb-2">
              {day}
            </div>
          ))}
          
          {days.map((day, i) => {
            const dateKey = format(day, "yyyy-MM-dd");
            const isCompleted = completedDates.has(dateKey);
            const isToday = isSameDay(day, today);
            const isCurrentMonth = isSameMonth(day, currentDate);
            const isPast = isBefore(day, startOfDay(today));
            const isMissed = !isCompleted && isPast && isCurrentMonth;
            
            return (
              <div key={dateKey} className="flex flex-col items-center justify-start h-12">
                <div 
                  className={`
                    flex items-center justify-center h-8 w-8 rounded-full text-sm font-medium transition-colors
                    ${!isCurrentMonth ? 'text-muted-foreground/30' : 'text-foreground'}
                    ${isToday ? 'bg-primary text-primary-foreground shadow-sm shadow-primary/30' : 'hover:bg-muted/30'}
                  `}
                >
                  {format(day, "d")}
                </div>
                {/* Visual indicator */}
                <div className="h-3 flex items-start justify-center mt-0.5">
                  {isCompleted && (
                    <Check className={`h-3.5 w-3.5 ${isToday ? 'text-primary-foreground' : 'text-primary'}`} strokeWidth={3} />
                  )}
                  {isMissed && (
                    <div className="h-1 w-1 rounded-full bg-destructive shadow-[0_0_4px_rgba(var(--destructive),0.6)] mt-0.5" />
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

export default StreakCalendar;
