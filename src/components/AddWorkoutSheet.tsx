import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { WorkoutType, WorkoutEntry } from '@/types/workout';
import { WorkoutTypeButton } from './WorkoutTypeButton';
import { StarRating } from './StarRating';
import { format } from 'date-fns';
import { Trash2 } from 'lucide-react';

interface AddWorkoutSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedDate: Date;
  existingWorkout?: WorkoutEntry;
  onSave: (type: WorkoutType, rating: number, notes?: string) => void;
  onDelete?: (id: string) => void;
}

export const AddWorkoutSheet = ({
  open,
  onOpenChange,
  selectedDate,
  existingWorkout,
  onSave,
  onDelete,
}: AddWorkoutSheetProps) => {
  const [workoutType, setWorkoutType] = useState<WorkoutType>('push');
  const [rating, setRating] = useState(3);
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (existingWorkout) {
      setWorkoutType(existingWorkout.type);
      setRating(existingWorkout.rating);
      setNotes(existingWorkout.notes || '');
    } else {
      setWorkoutType('push');
      setRating(3);
      setNotes('');
    }
  }, [existingWorkout, open]);

  const handleSave = () => {
    onSave(workoutType, rating, notes || undefined);
    onOpenChange(false);
  };

  const handleDelete = () => {
    if (existingWorkout && onDelete) {
      onDelete(existingWorkout.id);
      onOpenChange(false);
    }
  };

  const isRest = workoutType === 'rest';

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="bg-background border-t border-border rounded-t-3xl h-auto max-h-[85vh]">
        <SheetHeader className="text-left mb-6">
          <SheetTitle className="text-xl font-bold">
            {existingWorkout ? 'Edit Workout' : 'Log Workout'}
          </SheetTitle>
          <SheetDescription className="text-muted-foreground">
            {format(selectedDate, 'EEEE, MMMM d, yyyy')}
          </SheetDescription>
        </SheetHeader>

        <div className="space-y-6 pb-6">
          {/* Workout Type Selection */}
          <div>
            <label className="text-sm font-medium text-foreground mb-3 block">
              Workout Type
            </label>
            <div className="grid grid-cols-4 gap-2">
              {(['push', 'pull', 'legs', 'rest'] as WorkoutType[]).map((type) => (
                <WorkoutTypeButton
                  key={type}
                  type={type}
                  selected={workoutType === type}
                  onSelect={setWorkoutType}
                />
              ))}
            </div>
          </div>

          {/* Rating - only show for non-rest days */}
          {!isRest && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
            >
              <label className="text-sm font-medium text-foreground mb-3 block">
                How was your workout?
              </label>
              <div className="flex justify-center py-2">
                <StarRating rating={rating} onRate={setRating} size="lg" />
              </div>
            </motion.div>
          )}

          {/* Notes */}
          <div>
            <label className="text-sm font-medium text-foreground mb-3 block">
              Notes (optional)
            </label>
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="How did it go? Any PRs?"
              className="bg-secondary border-border resize-none"
              rows={3}
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            {existingWorkout && onDelete && (
              <Button
                variant="destructive"
                size="icon"
                onClick={handleDelete}
                className="shrink-0"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            )}
            <Button
              onClick={handleSave}
              className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-6"
            >
              {existingWorkout ? 'Update' : 'Save'} Workout
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};
