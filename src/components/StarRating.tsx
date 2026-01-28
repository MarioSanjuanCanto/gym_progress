import { motion } from 'framer-motion';
import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StarRatingProps {
  rating: number;
  onRate: (rating: number) => void;
  size?: 'sm' | 'md' | 'lg';
  readonly?: boolean;
}

const sizes = {
  sm: 'w-4 h-4',
  md: 'w-6 h-6',
  lg: 'w-8 h-8',
};

export const StarRating = ({ rating, onRate, size = 'md', readonly = false }: StarRatingProps) => {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <motion.button
          key={star}
          whileHover={readonly ? {} : { scale: 1.2 }}
          whileTap={readonly ? {} : { scale: 0.9 }}
          onClick={() => !readonly && onRate(star)}
          disabled={readonly}
          className={cn(
            'transition-colors duration-150',
            readonly ? 'cursor-default' : 'cursor-pointer'
          )}
        >
          <Star
            className={cn(
              sizes[size],
              star <= rating 
                ? 'fill-primary text-primary' 
                : 'fill-none text-muted-foreground/40'
            )}
          />
        </motion.button>
      ))}
    </div>
  );
};
