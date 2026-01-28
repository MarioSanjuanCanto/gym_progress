import { motion } from 'framer-motion';
import { WorkoutType } from '@/types/workout';
import { cn } from '@/lib/utils';

interface WorkoutDistributionChartProps {
  typeBreakdown: Record<WorkoutType, number>;
}

const typeConfig: Record<WorkoutType, { label: string; className: string }> = {
  push: { label: 'Push', className: 'workout-push' },
  pull: { label: 'Pull', className: 'workout-pull' },
  legs: { label: 'Legs', className: 'workout-legs' },
  rest: { label: 'Rest', className: 'workout-rest' },
};

export const WorkoutDistributionChart = ({ typeBreakdown }: WorkoutDistributionChartProps) => {
  const total = Object.values(typeBreakdown).reduce((a, b) => a + b, 0);
  const workoutTotal = total - typeBreakdown.rest; // Exclude rest for percentage

  if (total === 0) {
    return (
      <div className="card-gradient rounded-2xl p-6 border border-border">
        <h3 className="font-bold text-lg mb-4">Workout Distribution</h3>
        <p className="text-muted-foreground text-center py-8">
          No workouts logged yet. Start tracking!
        </p>
      </div>
    );
  }

  return (
    <div className="card-gradient rounded-2xl p-6 border border-border">
      <h3 className="font-bold text-lg mb-6">Workout Distribution</h3>
      
      <div className="space-y-4">
        {(['push', 'pull', 'legs'] as WorkoutType[]).map((type, index) => {
          const count = typeBreakdown[type];
          const percentage = workoutTotal > 0 ? (count / workoutTotal) * 100 : 0;
          const config = typeConfig[type];

          return (
            <div key={type}>
              <div className="flex justify-between items-center mb-2">
                <span className="font-medium text-sm">{config.label}</span>
                <span className="text-muted-foreground text-sm">
                  {count} days ({Math.round(percentage)}%)
                </span>
              </div>
              <div className="h-3 bg-secondary rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${percentage}%` }}
                  transition={{ duration: 0.8, delay: index * 0.1, ease: 'easeOut' }}
                  className={cn('h-full rounded-full', config.className)}
                />
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-6 pt-4 border-t border-border">
        <div className="flex justify-between items-center text-sm">
          <span className="text-muted-foreground">Rest days</span>
          <span className="font-medium">{typeBreakdown.rest}</span>
        </div>
      </div>
    </div>
  );
};
