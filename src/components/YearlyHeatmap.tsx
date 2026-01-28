import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { WorkoutEntry, WorkoutType } from '@/types/workout';
import { cn } from '@/lib/utils';

interface YearlyHeatmapProps {
  workouts: WorkoutEntry[];
  year: number;
}

const workoutColors: Record<WorkoutType, string> = {
  push: 'bg-push',
  pull: 'bg-pull',
  legs: 'bg-legs',
  rest: 'bg-rest',
};

export const YearlyHeatmap = ({ workouts, year }: YearlyHeatmapProps) => {
  const weeks = useMemo(() => {
    const result: (WorkoutEntry | null)[][] = [];
    const startDate = new Date(year, 0, 1);
    const endDate = new Date(year, 11, 31);
    
    // Adjust start to first Sunday
    const firstSunday = new Date(startDate);
    firstSunday.setDate(startDate.getDate() - startDate.getDay());
    
    let currentDate = new Date(firstSunday);
    let currentWeek: (WorkoutEntry | null)[] = [];
    
    while (currentDate <= endDate || currentWeek.length > 0) {
      if (currentWeek.length === 7) {
        result.push(currentWeek);
        currentWeek = [];
      }
      
      if (currentDate > endDate) {
        break;
      }
      
      const dateStr = currentDate.toISOString().split('T')[0];
      const workout = workouts.find(w => w.date === dateStr);
      
      // Only add if it's within the current year
      if (currentDate.getFullYear() === year) {
        currentWeek.push(workout || null);
      } else {
        currentWeek.push(null);
      }
      
      currentDate.setDate(currentDate.getDate() + 1);
    }
    
    if (currentWeek.length > 0) {
      while (currentWeek.length < 7) {
        currentWeek.push(null);
      }
      result.push(currentWeek);
    }
    
    return result;
  }, [workouts, year]);

  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  return (
    <div className="card-gradient rounded-2xl p-6 border border-border overflow-x-auto">
      <h3 className="font-bold text-lg mb-4">{year} Overview</h3>
      
      <div className="min-w-[700px]">
        {/* Month labels */}
        <div className="flex mb-2 pl-6">
          {months.map((month, i) => (
            <div key={month} className="flex-1 text-xs text-muted-foreground">
              {month}
            </div>
          ))}
        </div>

        {/* Heatmap grid */}
        <div className="flex gap-1">
          {/* Day labels */}
          <div className="flex flex-col gap-1 text-xs text-muted-foreground pr-2">
            <span className="h-3"></span>
            <span className="h-3">M</span>
            <span className="h-3"></span>
            <span className="h-3">W</span>
            <span className="h-3"></span>
            <span className="h-3">F</span>
            <span className="h-3"></span>
          </div>
          
          {/* Weeks */}
          <div className="flex gap-1 flex-1">
            {weeks.map((week, weekIndex) => (
              <div key={weekIndex} className="flex flex-col gap-1">
                {week.map((day, dayIndex) => (
                  <motion.div
                    key={`${weekIndex}-${dayIndex}`}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ 
                      duration: 0.2, 
                      delay: (weekIndex * 7 + dayIndex) * 0.001 
                    }}
                    className={cn(
                      'w-3 h-3 rounded-sm',
                      day 
                        ? workoutColors[day.type]
                        : 'bg-secondary/30'
                    )}
                    title={day ? `${day.date}: ${day.type}` : undefined}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
