import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { ChevronLeft, ChevronRight, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import type { Testimonial } from '@shared/schema';

export default function Testimonials() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const { data: testimonials = [], isLoading, error } = useQuery({
    queryKey: ['/api/testimonials'],
    queryFn: async () => {
      const response = await fetch('/api/testimonials?featured=true&approved=true');
      if (!response.ok) {
        throw new Error('Failed to fetch testimonials');
      }
      return response.json();
    }
  });

  const totalSlides = testimonials.length;

  // Auto-advance carousel
  useEffect(() => {
    if (!isAutoPlaying || totalSlides === 0) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % totalSlides);
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, totalSlides]);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % totalSlides);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  const TestimonialCard = ({ testimonial }: { testimonial: Testimonial }) => (
    <div className="min-w-full px-4">
      <Card className="glass-morphism border-glass-border max-w-4xl mx-auto">
        <CardContent className="p-8">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <Avatar className="w-32 h-32 border-4 border-neon-green">
              <AvatarImage 
                src={testimonial.imageUrl || `https://images.unsplash.com/photo-1494790108755-2616b86d82d4?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400`} 
                alt={testimonial.name}
              />
              <AvatarFallback className="text-2xl font-bold bg-gradient-to-r from-neon-green to-electric-blue text-white">
                {testimonial.name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            
            <div className="text-center md:text-left flex-1">
              <div className="flex justify-center md:justify-start mb-4">
                <div className="flex text-yellow-400">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star 
                      key={i}
                      className={`w-5 h-5 ${i < testimonial.rating ? 'fill-current' : ''}`}
                    />
                  ))}
                </div>
              </div>
              
              <blockquote className="text-lg text-muted-foreground mb-4 italic">
                "{testimonial.content}"
              </blockquote>
              
              <div>
                <h4 className="font-bold text-xl text-foreground">{testimonial.name}</h4>
                {testimonial.title && (
                  <p className="text-muted-foreground">{testimonial.title}</p>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const TestimonialSkeleton = () => (
    <div className="min-w-full px-4">
      <Card className="glass-morphism border-glass-border max-w-4xl mx-auto">
        <CardContent className="p-8">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <Skeleton className="w-32 h-32 rounded-full" />
            <div className="text-center md:text-left flex-1">
              <div className="flex justify-center md:justify-start mb-4">
                <div className="flex gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Skeleton key={i} className="w-5 h-5" />
                  ))}
                </div>
              </div>
              <Skeleton className="h-6 w-3/4 mb-2" />
              <Skeleton className="h-6 w-full mb-2" />
              <Skeleton className="h-6 w-2/3 mb-4" />
              <Skeleton className="h-6 w-32 mb-1" />
              <Skeleton className="h-4 w-24" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <section className="py-20 bg-gradient-to-b from-muted to-background">
      <div className="container mx-auto px-4">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="bg-gradient-to-r from-hot-pink to-neon-green bg-clip-text text-transparent">
              Success Stories
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Real transformations from real people who achieved their fitness goals with FitFusion.
          </p>
        </motion.div>

        {error && (
          <div className="glass-morphism p-8 rounded-3xl text-center max-w-2xl mx-auto">
            <p className="text-red-500 mb-4">Failed to load testimonials</p>
            <Button 
              onClick={() => window.location.reload()}
              className="neu-morphism"
            >
              Try Again
            </Button>
          </div>
        )}

        <div className="relative">
          {/* Carousel Container */}
          <div className="overflow-hidden">
            <motion.div
              className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${currentSlide * 100}%)` }}
            >
              {isLoading ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <TestimonialSkeleton key={`skeleton-${i}`} />
                ))
              ) : (
                testimonials.map((testimonial: Testimonial) => (
                  <TestimonialCard key={testimonial.id} testimonial={testimonial} />
                ))
              )}
            </motion.div>
          </div>

          {/* Navigation Controls */}
          {!isLoading && totalSlides > 1 && (
            <>
              <Button
                onClick={prevSlide}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 neu-morphism w-12 h-12 rounded-full p-0 hover:bg-muted transition-colors"
                variant="ghost"
              >
                <ChevronLeft className="w-6 h-6" />
              </Button>
              
              <Button
                onClick={nextSlide}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 neu-morphism w-12 h-12 rounded-full p-0 hover:bg-muted transition-colors"
                variant="ghost"
              >
                <ChevronRight className="w-6 h-6" />
              </Button>
            </>
          )}

          {/* Indicators */}
          {!isLoading && totalSlides > 1 && (
            <div className="flex justify-center mt-8 space-x-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`w-3 h-3 rounded-full transition-colors duration-300 ${
                    index === currentSlide ? 'bg-neon-green' : 'bg-muted'
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          )}
        </div>

        {/* Empty State */}
        {!isLoading && testimonials.length === 0 && (
          <div className="glass-morphism p-12 rounded-3xl text-center max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold mb-4">No testimonials available</h3>
            <p className="text-muted-foreground">
              Check back soon for inspiring success stories from our community.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
