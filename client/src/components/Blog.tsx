import { useState } from 'react';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { Calendar, Clock, User, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import type { Article } from '@shared/schema';

const categoryColors = {
  fitness: 'bg-neon-green text-dark-bg',
  nutrition: 'bg-electric-blue text-white',
  'mental-health': 'bg-hot-pink text-white',
  supplements: 'bg-gradient-to-r from-neon-green to-electric-blue text-white'
};

const filterButtons = [
  { key: 'all', label: 'All' },
  { key: 'fitness', label: 'Fitness' },
  { key: 'nutrition', label: 'Nutrition' },
  { key: 'mental-health', label: 'Mental Health' },
  { key: 'supplements', label: 'Supplements' }
];

export default function Blog() {
  const [selectedCategory, setSelectedCategory] = useState('all');

  const { data: articles = [], isLoading, error } = useQuery({
    queryKey: ['/api/articles', selectedCategory],
    queryFn: async () => {
      const params = new URLSearchParams({
        published: 'true',
        limit: '6'
      });
      
      if (selectedCategory !== 'all') {
        params.append('category', selectedCategory);
      }
      
      const response = await fetch(`/api/articles?${params}`);
      if (!response.ok) {
        throw new Error('Failed to fetch articles');
      }
      return response.json();
    }
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const ArticleCard = ({ article }: { article: Article }) => (
    <motion.article
      className="glass-morphism rounded-3xl overflow-hidden hover:scale-105 transition-transform duration-300 group"
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
    >
      <div className="relative overflow-hidden">
        <img
          src={article.imageUrl || `https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400`}
          alt={article.title}
          className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
      </div>
      
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <Badge className={`${categoryColors[article.category as keyof typeof categoryColors]} font-semibold`}>
            {article.category.replace('-', ' ').toUpperCase()}
          </Badge>
          <div className="flex items-center text-muted-foreground text-sm">
            <Calendar className="w-4 h-4 mr-1" />
            {formatDate(article.publishedAt!)}
          </div>
        </div>
        
        <h3 className="text-xl font-bold mb-3 line-clamp-2 group-hover:text-neon-green transition-colors">
          {article.title}
        </h3>
        
        <p className="text-muted-foreground mb-4 line-clamp-3">
          {article.excerpt}
        </p>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Avatar className="w-8 h-8">
              <AvatarImage src={article.authorImage} alt={article.author} />
              <AvatarFallback className="text-xs bg-gradient-to-r from-neon-green to-electric-blue text-white">
                {article.author.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-medium">{article.author}</p>
            </div>
          </div>
          
          <div className="flex items-center text-muted-foreground text-sm">
            <Clock className="w-4 h-4 mr-1" />
            {article.readTime} min read
          </div>
        </div>
        
        <Button 
          className="w-full mt-4 group/btn neu-morphism hover:bg-muted transition-colors"
          variant="ghost"
        >
          Read More
          <ArrowRight className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />
        </Button>
      </CardContent>
    </motion.article>
  );

  const ArticleSkeleton = () => (
    <div className="glass-morphism rounded-3xl overflow-hidden">
      <Skeleton className="w-full h-48" />
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <Skeleton className="h-6 w-20" />
          <Skeleton className="h-4 w-24" />
        </div>
        <Skeleton className="h-6 w-full mb-2" />
        <Skeleton className="h-6 w-3/4 mb-4" />
        <Skeleton className="h-4 w-full mb-2" />
        <Skeleton className="h-4 w-full mb-2" />
        <Skeleton className="h-4 w-2/3 mb-4" />
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <Skeleton className="w-8 h-8 rounded-full" />
            <Skeleton className="h-4 w-20" />
          </div>
          <Skeleton className="h-4 w-16" />
        </div>
        <Skeleton className="h-10 w-full" />
      </div>
    </div>
  );

  return (
    <section id="blog" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="bg-gradient-to-r from-neon-green to-electric-blue bg-clip-text text-transparent">
              Fitness Blog
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Stay updated with the latest fitness trends, nutrition tips, and wellness advice from our expert team.
          </p>
        </motion.div>

        {/* Filter Buttons */}
        <motion.div
          className="flex flex-wrap justify-center gap-2 mb-12"
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
                className={`px-4 py-2 rounded-full mr-2 mb-2 transition-all duration-300 ${
                  selectedCategory === button.key
                    ? 'neu-morphism bg-neon-green text-dark-bg font-semibold'
                    : 'hover:bg-muted'
                }`}
                variant={selectedCategory === button.key ? 'default' : 'ghost'}
                size="sm"
              >
                {button.label}
              </Button>
            ))}
          </div>
        </motion.div>

        {/* Error State */}
        {error && (
          <div className="glass-morphism p-8 rounded-3xl text-center max-w-2xl mx-auto">
            <p className="text-red-500 mb-4">Failed to load articles</p>
            <Button 
              onClick={() => window.location.reload()}
              className="neu-morphism"
            >
              Try Again
            </Button>
          </div>
        )}

        {/* Articles Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {isLoading ? (
            Array.from({ length: 6 }).map((_, index) => (
              <ArticleSkeleton key={`skeleton-${index}`} />
            ))
          ) : (
            articles.map((article: Article) => (
              <ArticleCard key={article.id} article={article} />
            ))
          )}
        </div>

        {/* Empty State */}
        {!isLoading && articles.length === 0 && (
          <motion.div
            className="glass-morphism p-12 rounded-3xl text-center max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h3 className="text-2xl font-bold mb-4">No articles found</h3>
            <p className="text-muted-foreground mb-6">
              {selectedCategory === 'all' 
                ? "Check back soon for new articles from our fitness experts."
                : `No articles found in the ${selectedCategory.replace('-', ' ')} category. Try selecting a different category.`
              }
            </p>
            <Button
              onClick={() => setSelectedCategory('all')}
              className="neu-morphism"
            >
              View All Articles
            </Button>
          </motion.div>
        )}

        {/* Call to Action */}
        {!isLoading && articles.length > 0 && (
          <motion.div
            className="text-center mt-12"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <Button className="neu-morphism bg-gradient-to-r from-neon-green to-electric-blue text-dark-bg font-semibold hover:shadow-lg transition-all duration-300">
              View All Articles
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </motion.div>
        )}
      </div>
    </section>
  );
}
