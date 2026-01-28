import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { WorkoutEntry, WorkoutType } from '@/types/workout';
import { cn } from '@/lib/utils';

interface CalendarViewProps {
  workouts: WorkoutEntry[];
  onSelectDate: (date: Date) => void;
  selectedDate: Date;
}

const DAYS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const workoutColors: Record<WorkoutType, string> = {
  push: 'bg-push',
  pull: 'bg-pull',
  legs: 'bg-legs',
  rest: 'bg-rest',
};

export const CalendarView = ({ workouts, onSelectDate, selectedDate }: CalendarViewProps) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const calendarDays = useMemo(() => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startingDay = firstDay.getDay();
    const totalDays = lastDay.getDate();

    const days: (Date | null)[] = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDay; i++) {
      days.push(null);
    }
    
    // Add all days of the month
    for (let i = 1; i <= totalDays; i++) {
      days.push(new Date(year, month, i));
    }
    
    return days;
  }, [currentMonth]);

  const getWorkoutForDate = (date: Date): WorkoutEntry | undefined => {
    const dateStr = date.toISOString().split('T')[0];
    return workouts.find(w => w.date === dateStr);
  };

  const isToday = (date: Date): boolean => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const isSelected = (date: Date): boolean => {
    return date.toDateString() === selectedDate.toDateString();
  };

  const goToPrevMonth = () => {
    setCurrentMonth(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  };

  const goToNextMonth = () => {
    setCurrentMonth(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  };

  return (
    <div className="card-gradient rounded-2xl p-4 border border-border">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={goToPrevMonth}
          className="p-2 rounded-lg bg-secondary text-foreground hover:bg-secondary/80"
        >
          <ChevronLeft className="w-5 h-5" />
        </motion.button>
        
        <AnimatePresence mode="wait">
          <motion.h3
            key={`${currentMonth.getFullYear()}-${currentMonth.getMonth()}`}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="font-bold text-lg"
          >
            {MONTHS[currentMonth.getMonth()]} {currentMonth.getFullYear()}
          </motion.h3>
        </AnimatePresence>
        
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={goToNextMonth}
          className="p-2 rounded-lg bg-secondary text-foreground hover:bg-secondary/80"
        >
          <ChevronRight className="w-5 h-5" />
        </motion.button>
      </div>

      {/* Day headers */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {DAYS.map((day, i) => (
          <div key={i} className="text-center text-xs text-muted-foreground font-medium py-2">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-1">
        {calendarDays.map((date, i) => {
          if (!date) {
            return <div key={`empty-${i}`} className="aspect-square" />;
          }

          const workout = getWorkoutForDate(date);
          const today = isToday(date);
          const selected = isSelected(date);

          return (
            <motion.button
              key={date.toISOString()}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onSelectDate(date)}
              className={cn(
                'aspect-square rounded-lg flex flex-col items-center justify-center relative',
                'transition-all duration-150',
                selected && 'ring-2 ring-primary',
                today && !selected && 'ring-1 ring-muted-foreground/30',
                workout ? workoutColors[workout.type] : 'bg-secondary/50 hover:bg-secondary'
              )}
            >
              <span className={cn(
                'text-sm font-medium',
                workout ? 'text-white' : 'text-foreground'
              )}>
                {date.getDate()}
              </span>
              {workout && workout.type !== 'rest' && (
                <div className="flex gap-0.5 mt-0.5">
                  {Array.from({ length: workout.rating }).map((_, i) => (
                    <div key={i} className="w-1 h-1 rounded-full bg-white/70" />
                  ))}
                </div>
              )}
            </motion.button>
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex flex-wrap items-center justify-center gap-4 mt-4 pt-4 border-t border-border">
        {(['push', 'pull', 'legs', 'rest'] as WorkoutType[]).map((type) => (
          <div key={type} className="flex items-center gap-2">
            <div className={cn('w-3 h-3 rounded', workoutColors[type])} />
            <span className="text-xs text-muted-foreground capitalize">{type}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
