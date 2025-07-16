import type { ExerciseItem } from '@/types';

const API_BASE = '/api/exercises';

export async function searchExercises(
  muscle?: string,
  equipment?: string,
  limit: number = 10
): Promise<ExerciseItem[]> {
  const params = new URLSearchParams();
  
  if (muscle) params.append('muscle', muscle);
  if (equipment) params.append('equipment', equipment);
  params.append('limit', limit.toString());
  
  const response = await fetch(`${API_BASE}/search?${params}`);
  
  if (!response.ok) {
    throw new Error(`Failed to search exercises: ${response.statusText}`);
  }
  
  const data = await response.json();
  return data.exercises || [];
}

export async function getExerciseById(id: string): Promise<ExerciseItem> {
  const response = await fetch(`${API_BASE}/${id}`);
  
  if (!response.ok) {
    throw new Error(`Failed to get exercise: ${response.statusText}`);
  }
  
  return response.json();
}

export function getExercisesByMuscleGroup(muscle: string): Promise<ExerciseItem[]> {
  return searchExercises(muscle);
}

export function getExercisesByEquipment(equipment: string): Promise<ExerciseItem[]> {
  return searchExercises(undefined, equipment);
}
