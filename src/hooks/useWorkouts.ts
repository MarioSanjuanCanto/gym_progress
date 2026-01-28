import { useState, useEffect, useCallback } from 'react';
import { WorkoutEntry, WorkoutStats, WorkoutType } from '@/types/workout';
import { persistentGetItem, persistentSetItem } from '@/lib/persistentStorage';

const STORAGE_KEY = 'gym-tracker-workouts';

const generateId = () => Math.random().toString(36).substring(2, 9);

const getDateString = (date: Date = new Date()): string => {
  return date.toISOString().split('T')[0];
};

const getDaysDifference = (date1: string, date2: string): number => {
  const d1 = new Date(date1);
  const d2 = new Date(date2);
  const diffTime = Math.abs(d2.getTime() - d1.getTime());
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

export const useWorkouts = () => {
  const [workouts, setWorkouts] = useState<WorkoutEntry[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from persistent storage on mount (web + iOS/Android)
  useEffect(() => {
    let cancelled = false;

    (async () => {
      const stored = await persistentGetItem(STORAGE_KEY);
      if (!cancelled && stored) {
        try {
          setWorkouts(JSON.parse(stored));
        } catch (e) {
          console.error('Failed to parse workouts from storage', e);
        }
      }
      if (!cancelled) setIsLoaded(true);
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  // Save to persistent storage whenever workouts change (web + iOS/Android)
  useEffect(() => {
    if (isLoaded) {
      void persistentSetItem(STORAGE_KEY, JSON.stringify(workouts));
    }
  }, [workouts, isLoaded]);

  const addWorkout = useCallback((type: WorkoutType, rating: number, notes?: string, date?: Date) => {
    const dateStr = getDateString(date);

    // Check if workout already exists for this date
    const existingIndex = workouts.findIndex(w => w.date === dateStr);

    if (existingIndex >= 0) {
      // Update existing workout
      setWorkouts(prev => {
        const updated = [...prev];
        updated[existingIndex] = {
          ...updated[existingIndex],
          type,
          rating,
          notes,
        };
        return updated;
      });
    } else {
      // Add new workout
      const newWorkout: WorkoutEntry = {
        id: generateId(),
        date: dateStr,
        type,
        rating,
        notes,
      };
      setWorkouts(prev => [...prev, newWorkout].sort((a, b) => b.date.localeCompare(a.date)));
    }
  }, [workouts]);

  const deleteWorkout = useCallback((id: string) => {
    setWorkouts(prev => prev.filter(w => w.id !== id));
  }, []);

  const getWorkoutForDate = useCallback((date: Date): WorkoutEntry | undefined => {
    const dateStr = getDateString(date);
    return workouts.find(w => w.date === dateStr);
  }, [workouts]);

  const getStats = useCallback((): WorkoutStats => {
    const now = new Date();
    const sortedWorkouts = [...workouts]
      .filter(w => w.type !== 'rest')
      .sort((a, b) => b.date.localeCompare(a.date));

    // Calculate current streak
    let currentStreak = 0;
    let checkDate = new Date();

    for (let i = 0; i < 365; i++) {
      const dateStr = getDateString(checkDate);
      const hasWorkout = sortedWorkouts.some(w => w.date === dateStr);

      if (hasWorkout) {
        currentStreak++;
      } else if (i > 0) {
        break;
      }

      checkDate.setDate(checkDate.getDate() - 1);
    }

    // Calculate longest streak
    let longestStreak = 0;
    let tempStreak = 0;
    let prevDate: string | null = null;

    sortedWorkouts.forEach(w => {
      if (!prevDate || getDaysDifference(prevDate, w.date) === 1) {
        tempStreak++;
      } else {
        tempStreak = 1;
      }
      longestStreak = Math.max(longestStreak, tempStreak);
      prevDate = w.date;
    });

    // Calculate weekly average (last 4 weeks)
    const fourWeeksAgo = new Date();
    fourWeeksAgo.setDate(fourWeeksAgo.getDate() - 28);
    const recentWorkouts = sortedWorkouts.filter(w => new Date(w.date) >= fourWeeksAgo);
    const weeklyAverage = recentWorkouts.length / 4;

    // Type breakdown
    const typeBreakdown: Record<WorkoutType, number> = {
      push: 0,
      pull: 0,
      legs: 0,
      rest: 0,
    };

    workouts.forEach(w => {
      typeBreakdown[w.type]++;
    });

    return {
      totalDays: sortedWorkouts.length,
      currentStreak,
      longestStreak,
      weeklyAverage: Math.round(weeklyAverage * 10) / 10,
      typeBreakdown,
    };
  }, [workouts]);

  const getWorkoutsForMonth = useCallback((year: number, month: number): WorkoutEntry[] => {
    return workouts.filter(w => {
      const date = new Date(w.date);
      return date.getFullYear() === year && date.getMonth() === month;
    });
  }, [workouts]);

  const getWorkoutsForYear = useCallback((year: number): WorkoutEntry[] => {
    return workouts.filter(w => {
      const date = new Date(w.date);
      return date.getFullYear() === year;
    });
  }, [workouts]);

  return {
    workouts,
    isLoaded,
    addWorkout,
    deleteWorkout,
    getWorkoutForDate,
    getStats,
    getWorkoutsForMonth,
    getWorkoutsForYear,
  };
};
