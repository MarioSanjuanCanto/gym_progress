import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  highlight?: boolean;
  delay?: number;
}

export const StatCard = ({ label, value, icon: Icon, highlight = false, delay = 0 }: StatCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      className={cn(
        'card-gradient rounded-xl p-4 border border-border',
        highlight && 'ring-1 ring-primary/30 glow-primary'
      )}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-muted-foreground text-xs uppercase tracking-wider mb-1">{label}</p>
          <p className={cn(
            'font-bold text-2xl',
            highlight ? 'text-gradient' : 'text-foreground'
          )}>
            {value}
          </p>
        </div>
        <div className={cn(
          'p-2 rounded-lg',
          highlight ? 'bg-primary/20' : 'bg-secondary'
        )}>
          <Icon className={cn(
            'w-5 h-5',
            highlight ? 'text-primary' : 'text-muted-foreground'
          )} />
        </div>
      </div>
    </motion.div>
  );
};
