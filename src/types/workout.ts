export type WorkoutType = 'push' | 'pull' | 'legs' | 'rest';

export interface WorkoutEntry {
  id: string;
  date: string; // ISO date string YYYY-MM-DD
  type: WorkoutType;
  rating: number; // 1-5
  notes?: string;
}

export interface WorkoutStats {
  totalDays: number;
  currentStreak: number;
  longestStreak: number;
  weeklyAverage: number;
  typeBreakdown: Record<WorkoutType, number>;
}
