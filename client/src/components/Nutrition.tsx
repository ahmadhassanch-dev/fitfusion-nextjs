import { useState } from 'react';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { Search, Loader2, Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { searchFood } from '@/lib/nutrition-api';
import type { FoodItem } from '@/types';

export default function Nutrition() {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<FoodItem[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [loggedFoods, setLoggedFoods] = useState<FoodItem[]>([]);
  const { toast } = useToast();

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    
    setIsSearching(true);
    try {
      const response = await searchFood(searchQuery, 5);
      setSearchResults(response.foods || []);
      
      if (response.foods?.length === 0) {
        toast({
          title: "No results found",
          description: "Try searching for a different food item.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Search error:', error);
      toast({
        title: "Search failed",
        description: "Unable to search food database. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSearching(false);
    }
  };

  const addToLog = (food: FoodItem) => {
    setLoggedFoods(prev => [...prev, food]);
    toast({
      title: "Food added",
      description: `${food.description} has been added to your nutrition log.`,
    });
  };

  const removeFromLog = (index: number) => {
    setLoggedFoods(prev => prev.filter((_, i) => i !== index));
    toast({
      title: "Food removed",
      description: "Food item has been removed from your nutrition log.",
    });
  };

  const totalNutrition = loggedFoods.reduce((total, food) => ({
    calories: total.calories + (food.nutrients?.calories || 0),
    protein: total.protein + (food.nutrients?.protein || 0),
    carbs: total.carbs + (food.nutrients?.carbs || 0),
    fat: total.fat + (food.nutrients?.fat || 0),
  }), { calories: 0, protein: 0, carbs: 0, fat: 0 });

  const FoodResultCard = ({ food }: { food: FoodItem }) => (
    <motion.div
      className="neu-morphism p-4 rounded-xl hover:bg-muted transition-colors"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex justify-between items-start mb-3">
        <div>
          <h4 className="font-semibold text-sm">{food.description}</h4>
          <p className="text-xs text-muted-foreground">{food.brandOwner}</p>
        </div>
        <div className="text-right">
          <span className="text-neon-green font-bold text-lg">
            {food.nutrients?.calories || 0}
          </span>
          <span className="text-muted-foreground text-sm ml-1">cal/100g</span>
        </div>
      </div>
      
      <div className="flex gap-4 text-sm mb-3">
        <span>Protein: <span className="text-electric-blue font-medium">{food.nutrients?.protein || 0}g</span></span>
        <span>Carbs: <span className="text-hot-pink font-medium">{food.nutrients?.carbs || 0}g</span></span>
        <span>Fat: <span className="text-yellow-400 font-medium">{food.nutrients?.fat || 0}g</span></span>
      </div>
      
      <Button
        onClick={() => addToLog(food)}
        size="sm"
        className="w-full neu-morphism text-xs"
      >
        <Plus className="w-3 h-3 mr-1" />
        Add to Log
      </Button>
    </motion.div>
  );

  const LoggedFoodCard = ({ food, index }: { food: FoodItem; index: number }) => (
    <motion.div
      className="neu-morphism p-3 rounded-xl flex justify-between items-center"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div>
        <h4 className="font-medium text-sm">{food.description}</h4>
        <p className="text-xs text-muted-foreground">
          {food.nutrients?.calories || 0} cal • {food.nutrients?.protein || 0}g protein
        </p>
      </div>
      <Button
        onClick={() => removeFromLog(index)}
        size="sm"
        variant="ghost"
        className="text-red-500 hover:text-red-700"
      >
        <Trash2 className="w-4 h-4" />
      </Button>
    </motion.div>
  );

  return (
    <section id="nutrition" className="py-20 bg-gradient-to-b from-muted to-background">
      <div className="container mx-auto px-4">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="bg-gradient-to-r from-neon-green to-hot-pink bg-clip-text text-transparent">
              Nutrition Hub
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Fuel your body with science-backed nutrition guidance and meal planning powered by USDA food data.
          </p>
        </motion.div>
        
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Search and Results */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <Card className="glass-morphism border-glass-border">
              <CardHeader>
                <CardTitle className="text-2xl">Smart Nutrition Tracker</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Search Input */}
                <div className="relative">
                  <Input
                    type="text"
                    placeholder="Search for any food item..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                    className="neu-morphism-inset pr-12"
                  />
                  <Button
                    onClick={handleSearch}
                    disabled={isSearching || !searchQuery.trim()}
                    className="absolute right-2 top-2 h-8 w-8 p-0"
                    variant="ghost"
                  >
                    {isSearching ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Search className="w-4 h-4" />
                    )}
                  </Button>
                </div>
                
                {/* Search Results */}
                {searchResults.length > 0 && (
                  <div className="space-y-3">
                    <h3 className="font-semibold text-lg">Search Results</h3>
                    {searchResults.map((food, index) => (
                      <FoodResultCard key={`${food.fdcId}-${index}`} food={food} />
                    ))}
                  </div>
                )}
                
                {/* Daily Nutrition Summary */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="neu-morphism p-4 rounded-xl text-center">
                    <div className="text-2xl font-bold text-neon-green mb-1">
                      {Math.round(totalNutrition.calories)}
                    </div>
                    <div className="text-sm text-muted-foreground">Daily Calories</div>
                  </div>
                  <div className="neu-morphism p-4 rounded-xl text-center">
                    <div className="text-2xl font-bold text-electric-blue mb-1">
                      {Math.round(totalNutrition.protein)}g
                    </div>
                    <div className="text-sm text-muted-foreground">Protein</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
          
          {/* Nutrition Log and Tips */}
          <motion.div
            className="space-y-8"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            {/* Food Log */}
            <Card className="glass-morphism border-glass-border">
              <CardHeader>
                <CardTitle className="text-xl">Today's Food Log</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {loggedFoods.length > 0 ? (
                    loggedFoods.map((food, index) => (
                      <LoggedFoodCard key={index} food={food} index={index} />
                    ))
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      <p>No foods logged yet today.</p>
                      <p className="text-sm">Search and add foods to track your nutrition!</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
            
            {/* Nutrition Tips */}
            <Card className="glass-morphism border-glass-border">
              <CardHeader>
                <CardTitle className="text-xl">Pro Nutrition Tips</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-neon-green rounded-full mt-2 flex-shrink-0" />
                    <p className="text-sm text-muted-foreground">
                      Eat protein within 30 minutes post-workout for optimal muscle recovery
                    </p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-electric-blue rounded-full mt-2 flex-shrink-0" />
                    <p className="text-sm text-muted-foreground">
                      Stay hydrated with 8-10 glasses of water daily
                    </p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-hot-pink rounded-full mt-2 flex-shrink-0" />
                    <p className="text-sm text-muted-foreground">
                      Include omega-3 rich foods for heart health and inflammation reduction
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
