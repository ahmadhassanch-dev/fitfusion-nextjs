import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  insertContactSubmissionSchema, 
  bmiCalculationSchema, 
  calorieCalculationSchema,
  foodSearchSchema,
  type BMICalculation,
  type CalorieCalculation,
  type FoodSearch
} from "@shared/schema";
import { ZodError } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Health check
  app.get("/api/health", (_req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  // Workouts API
  app.get("/api/workouts", async (req, res) => {
    try {
      const { category, difficulty, limit } = req.query;
      const workouts = await storage.getWorkouts(
        category as string,
        difficulty as string,
        limit ? parseInt(limit as string) : undefined
      );
      res.json(workouts);
    } catch (error) {
      res.status(500).json({ 
        error: "Failed to fetch workouts",
        details: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  app.get("/api/workouts/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const workout = await storage.getWorkout(id);
      
      if (!workout) {
        return res.status(404).json({ error: "Workout not found" });
      }
      
      res.json(workout);
    } catch (error) {
      res.status(500).json({ 
        error: "Failed to fetch workout",
        details: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  // Articles API
  app.get("/api/articles", async (req, res) => {
    try {
      const { category, published, limit } = req.query;
      const articles = await storage.getArticles(
        category as string,
        published === "true",
        limit ? parseInt(limit as string) : undefined
      );
      res.json(articles);
    } catch (error) {
      res.status(500).json({ 
        error: "Failed to fetch articles",
        details: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  app.get("/api/articles/:slug", async (req, res) => {
    try {
      const article = await storage.getArticleBySlug(req.params.slug);
      
      if (!article) {
        return res.status(404).json({ error: "Article not found" });
      }
      
      res.json(article);
    } catch (error) {
      res.status(500).json({ 
        error: "Failed to fetch article",
        details: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  // Testimonials API
  app.get("/api/testimonials", async (req, res) => {
    try {
      const { featured, approved } = req.query;
      const testimonials = await storage.getTestimonials(
        featured === "true",
        approved !== "false" // Default to approved testimonials
      );
      res.json(testimonials);
    } catch (error) {
      res.status(500).json({ 
        error: "Failed to fetch testimonials",
        details: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  // Contact form submission
  app.post("/api/contact", async (req, res) => {
    try {
      const validatedData = insertContactSubmissionSchema.parse(req.body);
      const submission = await storage.createContactSubmission(validatedData);
      res.status(201).json({ 
        message: "Contact form submitted successfully",
        id: submission.id
      });
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({ 
          error: "Validation failed",
          details: error.errors
        });
      }
      res.status(500).json({ 
        error: "Failed to submit contact form",
        details: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  // BMI Calculator
  app.post("/api/calculate/bmi", async (req, res) => {
    try {
      const { height, weight }: BMICalculation = bmiCalculationSchema.parse(req.body);
      
      const bmi = weight / ((height / 100) ** 2);
      
      let category: string;
      let description: string;
      
      if (bmi < 18.5) {
        category = "Underweight";
        description = "Consider gaining weight through proper nutrition and strength training";
      } else if (bmi < 25) {
        category = "Normal";
        description = "You're in a healthy weight range - maintain your current lifestyle";
      } else if (bmi < 30) {
        category = "Overweight";
        description = "Consider losing weight through balanced diet and regular exercise";
      } else {
        category = "Obese";
        description = "Consult a healthcare professional for personalized weight management guidance";
      }
      
      res.json({
        bmi: parseFloat(bmi.toFixed(1)),
        category,
        description,
        healthyRange: "18.5 - 24.9"
      });
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({ 
          error: "Invalid input data",
          details: error.errors
        });
      }
      res.status(500).json({ 
        error: "Failed to calculate BMI",
        details: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  // Calorie Calculator
  app.post("/api/calculate/calories", async (req, res) => {
    try {
      const { height, weight, age, gender, activityLevel }: CalorieCalculation = 
        calorieCalculationSchema.parse(req.body);
      
      // Calculate BMR using Harris-Benedict equation
      let bmr: number;
      if (gender === "male") {
        bmr = 88.362 + (13.397 * weight) + (4.799 * height) - (5.677 * age);
      } else {
        bmr = 447.593 + (9.247 * weight) + (3.098 * height) - (4.330 * age);
      }
      
      // Activity multipliers
      const activityMultipliers = {
        sedentary: 1.2,
        light: 1.375,
        moderate: 1.55,
        active: 1.725,
        very_active: 1.9
      };
      
      const maintenanceCalories = Math.round(bmr * activityMultipliers[activityLevel]);
      
      res.json({
        bmr: Math.round(bmr),
        maintenanceCalories,
        weightLoss: Math.round(maintenanceCalories - 500),
        weightGain: Math.round(maintenanceCalories + 500),
        activityLevel: activityLevel.replace('_', ' '),
        recommendations: {
          protein: Math.round(weight * 2.2), // 2.2g per kg
          carbs: Math.round(maintenanceCalories * 0.45 / 4), // 45% of calories
          fat: Math.round(maintenanceCalories * 0.3 / 9) // 30% of calories
        }
      });
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({ 
          error: "Invalid input data",
          details: error.errors
        });
      }
      res.status(500).json({ 
        error: "Failed to calculate calories",
        details: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  // Food search (USDA API proxy)
  app.get("/api/nutrition/search", async (req, res) => {
    try {
      const { query, limit = 10 }: FoodSearch = foodSearchSchema.parse({
        query: req.query.query,
        limit: req.query.limit ? parseInt(req.query.limit as string) : 10
      });
      
      const API_KEY = process.env.USDA_API_KEY || process.env.VITE_USDA_API_KEY || "DEMO_KEY";
      const apiUrl = `https://api.nal.usda.gov/fdc/v1/foods/search?api_key=${API_KEY}&query=${encodeURIComponent(query)}&pageSize=${limit}`;
      
      const response = await fetch(apiUrl);
      
      if (!response.ok) {
        throw new Error(`USDA API error: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      
      // Transform the data to a more manageable format
      const foods = data.foods?.map((food: any) => ({
        fdcId: food.fdcId,
        description: food.description,
        brandOwner: food.brandOwner || "Generic",
        ingredients: food.ingredients || "",
        nutrients: food.foodNutrients?.reduce((acc: any, nutrient: any) => {
          const name = nutrient.nutrientName?.toLowerCase();
          if (name?.includes("energy") || name?.includes("calorie")) {
            acc.calories = nutrient.value || 0;
          } else if (name?.includes("protein")) {
            acc.protein = nutrient.value || 0;
          } else if (name?.includes("carbohydrate")) {
            acc.carbs = nutrient.value || 0;
          } else if (name?.includes("total lipid") || name?.includes("fat")) {
            acc.fat = nutrient.value || 0;
          } else if (name?.includes("fiber")) {
            acc.fiber = nutrient.value || 0;
          } else if (name?.includes("sugars")) {
            acc.sugar = nutrient.value || 0;
          } else if (name?.includes("sodium")) {
            acc.sodium = nutrient.value || 0;
          }
          return acc;
        }, { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0, sugar: 0, sodium: 0 })
      })) || [];
      
      res.json({
        foods,
        totalPages: data.totalPages || 1,
        currentPage: data.currentPage || 1,
        totalHits: data.totalHits || 0
      });
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({ 
          error: "Invalid search parameters",
          details: error.errors
        });
      }
      res.status(500).json({ 
        error: "Failed to search food database",
        details: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  // Exercise search (Exercise DB API proxy)
  app.get("/api/exercises/search", async (req, res) => {
    try {
      const { muscle, equipment, limit = 10 } = req.query;
      
      // Note: This would integrate with a real exercise API
      // For now, return structured response format
      res.json({
        exercises: [],
        message: "Exercise API integration pending - requires API key setup"
      });
    } catch (error) {
      res.status(500).json({ 
        error: "Failed to search exercises",
        details: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
