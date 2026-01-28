import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Flame, Trophy, Calendar, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useWorkouts } from '@/hooks/useWorkouts';
import { StatCard } from '@/components/StatCard';
import { CalendarView } from '@/components/CalendarView';
import { AddWorkoutSheet } from '@/components/AddWorkoutSheet';
import { WorkoutDistributionChart } from '@/components/WorkoutDistributionChart';
import { YearlyHeatmap } from '@/components/YearlyHeatmap';

const Index = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [sheetOpen, setSheetOpen] = useState(false);
  
  const {
    workouts,
    isLoaded,
    addWorkout,
    deleteWorkout,
    getWorkoutForDate,
    getStats,
    getWorkoutsForYear,
  } = useWorkouts();

  const stats = getStats();
  const existingWorkout = getWorkoutForDate(selectedDate);
  const currentYear = new Date().getFullYear();
  const yearlyWorkouts = getWorkoutsForYear(currentYear);

  const handleSelectDate = (date: Date) => {
    setSelectedDate(date);
    setSheetOpen(true);
  };

  const handleSaveWorkout = (type: Parameters<typeof addWorkout>[0], rating: number, notes?: string) => {
    addWorkout(type, rating, notes, selectedDate);
  };

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-24">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-lg border-b border-border px-4 py-4">
        <div className="max-w-lg mx-auto">
          <motion.h1 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-2xl font-bold text-gradient"
          >
            Gym Tracker
          </motion.h1>
          <p className="text-muted-foreground text-sm">Stay consistent, get stronger</p>
        </div>
      </header>

      <main className="max-w-lg mx-auto px-4 py-6 space-y-6">
        {/* Stats Grid */}
        <section className="grid grid-cols-2 gap-3">
          <StatCard
            label="Current Streak"
            value={`${stats.currentStreak} days`}
            icon={Flame}
            highlight={stats.currentStreak > 0}
            delay={0}
          />
          <StatCard
            label="Best Streak"
            value={`${stats.longestStreak} days`}
            icon={Trophy}
            delay={0.1}
          />
          <StatCard
            label="Total Workouts"
            value={stats.totalDays}
            icon={Calendar}
            delay={0.2}
          />
          <StatCard
            label="Weekly Avg"
            value={`${stats.weeklyAverage}/week`}
            icon={TrendingUp}
            delay={0.3}
          />
        </section>

        {/* Calendar */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          <CalendarView
            workouts={workouts}
            selectedDate={selectedDate}
            onSelectDate={handleSelectDate}
          />
        </motion.section>

        {/* Workout Distribution */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
        >
          <WorkoutDistributionChart typeBreakdown={stats.typeBreakdown} />
        </motion.section>

        {/* Yearly Heatmap */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.4 }}
        >
          <YearlyHeatmap workouts={yearlyWorkouts} year={currentYear} />
        </motion.section>
      </main>

      {/* Floating Action Button */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 400, damping: 20, delay: 0.5 }}
        className="fixed bottom-6 right-6"
      >
        <Button
          onClick={() => {
            setSelectedDate(new Date());
            setSheetOpen(true);
          }}
          size="lg"
          className="w-14 h-14 rounded-full bg-primary hover:bg-primary/90 shadow-lg glow-primary animate-pulse-glow"
        >
          <Plus className="w-6 h-6" />
        </Button>
      </motion.div>

      {/* Add/Edit Workout Sheet */}
      <AddWorkoutSheet
        open={sheetOpen}
        onOpenChange={setSheetOpen}
        selectedDate={selectedDate}
        existingWorkout={existingWorkout}
        onSave={handleSaveWorkout}
        onDelete={deleteWorkout}
      />
    </div>
  );
};

export default Index;
