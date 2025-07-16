// API Response Types
export interface FoodItem {
  fdcId: number;
  description: string;
  brandOwner: string;
  ingredients: string;
  nutrients: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    fiber: number;
    sugar: number;
    sodium: number;
  };
}

export interface FoodSearchResponse {
  foods: FoodItem[];
  totalPages: number;
  currentPage: number;
  totalHits: number;
}

export interface BMIResult {
  bmi: number;
  category: string;
  description: string;
  healthyRange: string;
}

export interface CalorieResult {
  bmr: number;
  maintenanceCalories: number;
  weightLoss: number;
  weightGain: number;
  activityLevel: string;
  recommendations: {
    protein: number;
    carbs: number;
    fat: number;
  };
}

export interface ExerciseItem {
  id: string;
  name: string;
  muscle: string;
  equipment: string;
  instructions: string;
  gifUrl?: string;
}

// Form Types
export interface ContactFormData {
  firstName: string;
  lastName: string;
  email: string;
  subject: string;
  message: string;
}

export interface BMIFormData {
  height: number;
  weight: number;
}

export interface CalorieFormData {
  height: number;
  weight: number;
  age: number;
  gender: 'male' | 'female';
  activityLevel: 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active';
}

// Theme Types
export type Theme = 'light' | 'dark';

// Workout Filter Types
export type WorkoutCategory = 'all' | 'strength' | 'cardio' | 'yoga' | 'flexibility';
export type WorkoutDifficulty = 'all' | 'beginner' | 'intermediate' | 'advanced';

// Animation Types
export interface AnimationConfig {
  duration: number;
  delay?: number;
  ease?: string;
}

// Error Types
export interface ApiError {
  error: string;
  details?: string | any[];
}
