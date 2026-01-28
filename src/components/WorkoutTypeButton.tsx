import { motion } from 'framer-motion';
import { WorkoutType } from '@/types/workout';
import { cn } from '@/lib/utils';
import { Dumbbell, ArrowDown, Footprints, Moon } from 'lucide-react';

interface WorkoutTypeButtonProps {
  type: WorkoutType;
  selected: boolean;
  onSelect: (type: WorkoutType) => void;
}

const typeConfig: Record<WorkoutType, { 
  label: string; 
  icon: React.ElementType; 
  className: string;
  description: string;
}> = {
  push: { 
    label: 'Push', 
    icon: Dumbbell, 
    className: 'workout-push',
    description: 'Chest, Shoulders, Triceps'
  },
  pull: { 
    label: 'Pull', 
    icon: ArrowDown, 
    className: 'workout-pull',
    description: 'Back, Biceps, Rear Delts'
  },
  legs: { 
    label: 'Legs', 
    icon: Footprints, 
    className: 'workout-legs',
    description: 'Quads, Hamstrings, Glutes'
  },
  rest: { 
    label: 'Rest', 
    icon: Moon, 
    className: 'workout-rest',
    description: 'Recovery Day'
  },
};

export const WorkoutTypeButton = ({ type, selected, onSelect }: WorkoutTypeButtonProps) => {
  const config = typeConfig[type];
  const Icon = config.icon;

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => onSelect(type)}
      className={cn(
        'relative flex flex-col items-center justify-center gap-2 p-4 rounded-xl transition-all duration-200',
        'border-2',
        selected 
          ? `${config.className} border-transparent text-white shadow-lg` 
          : 'bg-secondary border-border text-muted-foreground hover:border-primary/50'
      )}
    >
      <Icon className="w-6 h-6" />
      <span className="font-semibold text-sm">{config.label}</span>
      {selected && (
        <motion.div
          layoutId="selected-workout"
          className="absolute inset-0 rounded-xl ring-2 ring-white/30"
          initial={false}
          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        />
      )}
    </motion.button>
  );
};
