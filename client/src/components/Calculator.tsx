import { useState } from 'react';
import { motion } from 'framer-motion';
import { useMutation } from '@tanstack/react-query';
import { Calculator as CalculatorIcon, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import type { BMIResult, CalorieResult, BMIFormData, CalorieFormData } from '@/types';

export default function Calculator() {
  const [bmiData, setBmiData] = useState<BMIFormData>({ height: 0, weight: 0 });
  const [calorieData, setCalorieData] = useState<CalorieFormData>({
    height: 0,
    weight: 0,
    age: 0,
    gender: 'male',
    activityLevel: 'moderate'
  });
  const [bmiResult, setBmiResult] = useState<BMIResult | null>(null);
  const [calorieResult, setCalorieResult] = useState<CalorieResult | null>(null);
  const { toast } = useToast();

  const bmiMutation = useMutation({
    mutationFn: async (data: BMIFormData) => {
      const response = await apiRequest('POST', '/api/calculate/bmi', data);
      return response.json();
    },
    onSuccess: (result: BMIResult) => {
      setBmiResult(result);
      toast({
        title: "BMI Calculated",
        description: `Your BMI is ${result.bmi} (${result.category})`,
      });
    },
    onError: (error) => {
      console.error('BMI calculation error:', error);
      toast({
        title: "Calculation Failed",
        description: "Unable to calculate BMI. Please check your inputs.",
        variant: "destructive"
      });
    }
  });

  const calorieMutation = useMutation({
    mutationFn: async (data: CalorieFormData) => {
      const response = await apiRequest('POST', '/api/calculate/calories', data);
      return response.json();
    },
    onSuccess: (result: CalorieResult) => {
      setCalorieResult(result);
      toast({
        title: "Calories Calculated",
        description: `Your daily maintenance calories: ${result.maintenanceCalories}`,
      });
    },
    onError: (error) => {
      console.error('Calorie calculation error:', error);
      toast({
        title: "Calculation Failed",
        description: "Unable to calculate calories. Please check your inputs.",
        variant: "destructive"
      });
    }
  });

  const handleBmiSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (bmiData.height <= 0 || bmiData.weight <= 0) {
      toast({
        title: "Invalid Input",
        description: "Please enter valid height and weight values.",
        variant: "destructive"
      });
      return;
    }
    bmiMutation.mutate(bmiData);
  };

  const handleCalorieSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (calorieData.height <= 0 || calorieData.weight <= 0 || calorieData.age <= 0) {
      toast({
        title: "Invalid Input",
        description: "Please enter valid height, weight, and age values.",
        variant: "destructive"
      });
      return;
    }
    calorieMutation.mutate(calorieData);
  };

  const getBMIColor = (category: string) => {
    switch (category.toLowerCase()) {
      case 'underweight':
        return 'text-blue-500';
      case 'normal':
        return 'text-neon-green';
      case 'overweight':
        return 'text-yellow-500';
      case 'obese':
        return 'text-red-500';
      default:
        return 'text-muted-foreground';
    }
  };

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="bg-gradient-to-r from-electric-blue to-neon-green bg-clip-text text-transparent">
              Health Calculator
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Calculate your BMI and daily calorie needs to optimize your fitness journey.
          </p>
        </motion.div>
        
        <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {/* BMI Calculator */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <Card className="glass-morphism border-glass-border">
              <CardHeader>
                <CardTitle className="text-2xl text-center flex items-center justify-center gap-2">
                  <CalculatorIcon className="w-6 h-6" />
                  BMI Calculator
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleBmiSubmit} className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="height">Height (cm)</Label>
                      <Input
                        id="height"
                        type="number"
                        placeholder="170"
                        value={bmiData.height || ''}
                        onChange={(e) => setBmiData(prev => ({ ...prev, height: parseInt(e.target.value) || 0 }))}
                        className="neu-morphism-inset"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="weight">Weight (kg)</Label>
                      <Input
                        id="weight"
                        type="number"
                        placeholder="70"
                        value={bmiData.weight || ''}
                        onChange={(e) => setBmiData(prev => ({ ...prev, weight: parseInt(e.target.value) || 0 }))}
                        className="neu-morphism-inset"
                        required
                      />
                    </div>
                  </div>
                  
                  <Button
                    type="submit"
                    disabled={bmiMutation.isPending}
                    className="neu-morphism w-full bg-gradient-to-r from-electric-blue to-neon-green text-white font-semibold hover:shadow-lg transition-all duration-300"
                  >
                    {bmiMutation.isPending ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Calculating...
                      </>
                    ) : (
                      'Calculate BMI'
                    )}
                  </Button>
                  
                  {bmiResult && (
                    <motion.div
                      className="neu-morphism p-6 rounded-xl text-center"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5 }}
                    >
                      <div className={`text-3xl font-bold mb-2 ${getBMIColor(bmiResult.category)}`}>
                        {bmiResult.bmi}
                      </div>
                      <div className="text-lg text-foreground mb-2">{bmiResult.category}</div>
                      <div className="text-sm text-muted-foreground mb-2">{bmiResult.description}</div>
                      <div className="text-xs text-muted-foreground">
                        Healthy range: {bmiResult.healthyRange}
                      </div>
                    </motion.div>
                  )}
                </form>
              </CardContent>
            </Card>
          </motion.div>
          
          {/* Calorie Calculator */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <Card className="glass-morphism border-glass-border">
              <CardHeader>
                <CardTitle className="text-2xl text-center flex items-center justify-center gap-2">
                  <CalculatorIcon className="w-6 h-6" />
                  Calorie Calculator
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleCalorieSubmit} className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="cal-height">Height (cm)</Label>
                      <Input
                        id="cal-height"
                        type="number"
                        placeholder="170"
                        value={calorieData.height || ''}
                        onChange={(e) => setCalorieData(prev => ({ ...prev, height: parseInt(e.target.value) || 0 }))}
                        className="neu-morphism-inset"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="cal-weight">Weight (kg)</Label>
                      <Input
                        id="cal-weight"
                        type="number"
                        placeholder="70"
                        value={calorieData.weight || ''}
                        onChange={(e) => setCalorieData(prev => ({ ...prev, weight: parseInt(e.target.value) || 0 }))}
                        className="neu-morphism-inset"
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="age">Age</Label>
                      <Input
                        id="age"
                        type="number"
                        placeholder="25"
                        value={calorieData.age || ''}
                        onChange={(e) => setCalorieData(prev => ({ ...prev, age: parseInt(e.target.value) || 0 }))}
                        className="neu-morphism-inset"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="gender">Gender</Label>
                      <Select value={calorieData.gender} onValueChange={(value: 'male' | 'female') => setCalorieData(prev => ({ ...prev, gender: value }))}>
                        <SelectTrigger className="neu-morphism-inset">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="male">Male</SelectItem>
                          <SelectItem value="female">Female</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="activity">Activity Level</Label>
                    <Select value={calorieData.activityLevel} onValueChange={(value: CalorieFormData['activityLevel']) => setCalorieData(prev => ({ ...prev, activityLevel: value }))}>
                      <SelectTrigger className="neu-morphism-inset">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="sedentary">Sedentary (little/no exercise)</SelectItem>
                        <SelectItem value="light">Light activity (1-3 days/week)</SelectItem>
                        <SelectItem value="moderate">Moderate activity (3-5 days/week)</SelectItem>
                        <SelectItem value="active">Active (6-7 days/week)</SelectItem>
                        <SelectItem value="very_active">Very active (2x/day or intense exercise)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <Button
                    type="submit"
                    disabled={calorieMutation.isPending}
                    className="neu-morphism w-full bg-gradient-to-r from-hot-pink to-electric-blue text-white font-semibold hover:shadow-lg transition-all duration-300"
                  >
                    {calorieMutation.isPending ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Calculating...
                      </>
                    ) : (
                      'Calculate Calories'
                    )}
                  </Button>
                  
                  {calorieResult && (
                    <motion.div
                      className="neu-morphism p-6 rounded-xl text-center"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5 }}
                    >
                      <div className="text-3xl font-bold text-hot-pink mb-2">
                        {calorieResult.maintenanceCalories}
                      </div>
                      <div className="text-lg text-foreground mb-2">Daily Maintenance Calories</div>
                      <div className="text-sm text-muted-foreground mb-4">
                        Based on {calorieResult.activityLevel} activity level
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <div className="font-semibold text-green-500">{calorieResult.weightLoss}</div>
                          <div className="text-muted-foreground">Weight Loss</div>
                        </div>
                        <div>
                          <div className="font-semibold text-blue-500">{calorieResult.weightGain}</div>
                          <div className="text-muted-foreground">Weight Gain</div>
                        </div>
                      </div>
                      
                      <div className="mt-4 pt-4 border-t border-muted">
                        <div className="text-sm text-muted-foreground mb-2">Recommended Daily Intake:</div>
                        <div className="flex justify-between text-sm">
                          <span>Protein: <span className="font-semibold text-electric-blue">{calorieResult.recommendations.protein}g</span></span>
                          <span>Carbs: <span className="font-semibold text-hot-pink">{calorieResult.recommendations.carbs}g</span></span>
                          <span>Fat: <span className="font-semibold text-yellow-400">{calorieResult.recommendations.fat}g</span></span>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </form>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
