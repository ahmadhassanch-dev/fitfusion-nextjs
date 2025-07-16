import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { Star, Clock, Target } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import type { Workout } from '@shared/schema';

const categoryColors = {
  strength: 'bg-neon-green text-dark-bg',
  cardio: 'bg-electric-blue text-white',
  yoga: 'bg-hot-pink text-white',
  flexibility: 'bg-gradient-to-r from-neon-green to-electric-blue text-white'
};

const filterButtons = [
  { key: 'all', label: 'All' },
  { key: 'strength', label: 'Strength' },
  { key: 'cardio', label: 'Cardio' },
  { key: 'yoga', label: 'Yoga' },
  { key: 'flexibility', label: 'Flexibility' }
];

export default function Workouts() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [filteredWorkouts, setFilteredWorkouts] = useState<Workout[]>([]);

  const { data: workouts = [], isLoading, error } = useQuery({
    queryKey: ['/api/workouts'],
    queryFn: async () => {
      const response = await fetch('/api/workouts');
      if (!response.ok) {
        throw new Error('Failed to fetch workouts');
      }
      return response.json();
    }
  });

  useEffect(() => {
    if (selectedCategory === 'all') {
      setFilteredWorkouts(workouts);
    } else {
      setFilteredWorkouts(workouts.filter((workout: Workout) => workout.category === selectedCategory));
    }
  }, [workouts, selectedCategory]);

  const WorkoutCard = ({ workout }: { workout: Workout }) => (
    <motion.div
      className="glass-morphism rounded-3xl overflow-hidden hover:scale-105 transition-transform duration-300 group"
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
    >
      <div className="relative overflow-hidden">
        <img
          src={workout.imageUrl || `https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400`}
          alt={workout.name}
          className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
      </div>
      
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <Badge className={`${categoryColors[workout.category as keyof typeof categoryColors]} font-semibold`}>
            {workout.category.toUpperCase()}
          </Badge>
          <div className="flex items-center text-muted-foreground">
            <Clock className="w-4 h-4 mr-1" />
            <span className="text-sm">{workout.duration} min</span>
          </div>
        </div>
        
        <h3 className="text-xl font-bold mb-2">{workout.name}</h3>
        <p className="text-muted-foreground mb-4 line-clamp-2">{workout.description}</p>
        
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <Star className="w-4 h-4 text-yellow-400 mr-1 fill-current" />
            <span className="text-sm text-muted-foreground">
              {workout.rating} ({workout.reviews?.toLocaleString()})
            </span>
          </div>
          <div className="flex items-center text-muted-foreground">
            <Target className="w-4 h-4 mr-1" />
            <span className="text-sm">{workout.calories} cal</span>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-2 mb-4">
          {workout.targetMuscles?.slice(0, 3).map((muscle) => (
            <Badge key={muscle} variant="secondary" className="text-xs">
              {muscle}
            </Badge>
          ))}
          {workout.targetMuscles && workout.targetMuscles.length > 3 && (
            <Badge variant="secondary" className="text-xs">
              +{workout.targetMuscles.length - 3} more
            </Badge>
          )}
        </div>
        
        <Button className="neu-morphism w-full hover:bg-muted transition-colors">
          Start Workout
        </Button>
      </div>
    </motion.div>
  );

  const WorkoutSkeleton = () => (
    <div className="glass-morphism rounded-3xl overflow-hidden">
      <Skeleton className="w-full h-48" />
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <Skeleton className="h-6 w-20" />
          <Skeleton className="h-4 w-16" />
        </div>
        <Skeleton className="h-6 w-3/4 mb-2" />
        <Skeleton className="h-4 w-full mb-4" />
        <div className="flex items-center justify-between mb-4">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-16" />
        </div>
        <div className="flex gap-2 mb-4">
          <Skeleton className="h-6 w-16" />
          <Skeleton className="h-6 w-16" />
          <Skeleton className="h-6 w-16" />
        </div>
        <Skeleton className="h-10 w-full" />
      </div>
    </div>
  );

  return (
    <section id="workouts" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="bg-gradient-to-r from-electric-blue to-hot-pink bg-clip-text text-transparent">
              Workout Plans
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Choose from our expertly crafted workout programs designed for every fitness level and goal.
          </p>
        </motion.div>
        
        {/* Filter Buttons */}
        <motion.div
          className="flex justify-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
        >
          <div className="glass-morphism p-2 rounded-full">
            {filterButtons.map((button) => (
              <Button
                key={button.key}
                onClick={() => setSelectedCategory(button.key)}
                className={`px-6 py-2 rounded-full mr-2 transition-all duration-300 ${
                  selectedCategory === button.key
                    ? 'neu-morphism bg-neon-green text-dark-bg font-semibold'
                    : 'hover:bg-muted'
                }`}
                variant={selectedCategory === button.key ? 'default' : 'ghost'}
              >
                {button.label}
              </Button>
            ))}
          </div>
        </motion.div>
        
        {/* Error State */}
        {error && (
          <div className="glass-morphism p-8 rounded-3xl text-center">
            <p className="text-red-500 mb-4">Failed to load workouts</p>
            <Button 
              onClick={() => window.location.reload()}
              className="neu-morphism"
            >
              Try Again
            </Button>
          </div>
        )}
        
        {/* Workouts Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <AnimatePresence mode="wait">
            {isLoading ? (
              // Loading skeletons
              Array.from({ length: 6 }).map((_, index) => (
                <WorkoutSkeleton key={`skeleton-${index}`} />
              ))
            ) : (
              // Workout cards
              filteredWorkouts.map((workout) => (
                <WorkoutCard key={workout.id} workout={workout} />
              ))
            )}
          </AnimatePresence>
        </div>
        
        {/* Empty State */}
        {!isLoading && filteredWorkouts.length === 0 && (
          <motion.div
            className="glass-morphism p-12 rounded-3xl text-center"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h3 className="text-2xl font-bold mb-4">No workouts found</h3>
            <p className="text-muted-foreground mb-6">
              Try selecting a different category or check back later for new workouts.
            </p>
            <Button
              onClick={() => setSelectedCategory('all')}
              className="neu-morphism"
            >
              View All Workouts
            </Button>
          </motion.div>
        )}
      </div>
    </section>
  );
}
