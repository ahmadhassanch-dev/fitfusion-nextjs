import type { FoodSearchResponse, FoodItem } from '@/types';

const API_BASE = '/api/nutrition';

export async function searchFood(query: string, limit: number = 10): Promise<FoodSearchResponse> {
  const response = await fetch(`${API_BASE}/search?query=${encodeURIComponent(query)}&limit=${limit}`);
  
  if (!response.ok) {
    throw new Error(`Failed to search food: ${response.statusText}`);
  }
  
  return response.json();
}

export async function getFoodDetails(fdcId: number): Promise<FoodItem> {
  const response = await fetch(`${API_BASE}/food/${fdcId}`);
  
  if (!response.ok) {
    throw new Error(`Failed to get food details: ${response.statusText}`);
  }
  
  return response.json();
}

export function calculateNutritionPer100g(food: FoodItem, servingSize: number): FoodItem['nutrients'] {
  const factor = 100 / servingSize;
  
  return {
    calories: Math.round(food.nutrients.calories * factor),
    protein: Math.round(food.nutrients.protein * factor * 10) / 10,
    carbs: Math.round(food.nutrients.carbs * factor * 10) / 10,
    fat: Math.round(food.nutrients.fat * factor * 10) / 10,
    fiber: Math.round(food.nutrients.fiber * factor * 10) / 10,
    sugar: Math.round(food.nutrients.sugar * factor * 10) / 10,
    sodium: Math.round(food.nutrients.sodium * factor),
  };
}
