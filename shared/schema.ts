import { pgTable, text, serial, integer, boolean, timestamp, json } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Users table
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  firstName: text("first_name"),
  lastName: text("last_name"),
  dateOfBirth: timestamp("date_of_birth"),
  height: integer("height"), // in cm
  weight: integer("weight"), // in kg
  fitnessGoal: text("fitness_goal"), // weight_loss, muscle_gain, maintenance
  activityLevel: text("activity_level"), // sedentary, light, moderate, active, very_active
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Workouts table
export const workouts = pgTable("workouts", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  category: text("category").notNull(), // strength, cardio, yoga, flexibility
  difficulty: text("difficulty").notNull(), // beginner, intermediate, advanced
  duration: integer("duration").notNull(), // in minutes
  description: text("description"),
  instructions: text("instructions"),
  equipment: text("equipment").array(),
  targetMuscles: text("target_muscles").array(),
  calories: integer("calories"), // estimated calories burned
  rating: integer("rating").default(0),
  reviews: integer("reviews").default(0),
  imageUrl: text("image_url"),
  createdAt: timestamp("created_at").defaultNow(),
});

// User workout progress
export const userWorkouts = pgTable("user_workouts", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  workoutId: integer("workout_id").references(() => workouts.id),
  completedAt: timestamp("completed_at").defaultNow(),
  duration: integer("duration"), // actual duration in minutes
  caloriesBurned: integer("calories_burned"),
  notes: text("notes"),
});

// Nutrition tracking
export const nutritionEntries = pgTable("nutrition_entries", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  foodItem: text("food_item").notNull(),
  quantity: integer("quantity").notNull(),
  unit: text("unit").notNull(), // grams, cups, pieces
  calories: integer("calories"),
  protein: integer("protein"), // in grams
  carbs: integer("carbs"), // in grams
  fat: integer("fat"), // in grams
  fiber: integer("fiber"), // in grams
  sugar: integer("sugar"), // in grams
  sodium: integer("sodium"), // in mg
  loggedAt: timestamp("logged_at").defaultNow(),
});

// Blog articles
export const articles = pgTable("articles", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  content: text("content").notNull(),
  excerpt: text("excerpt"),
  category: text("category").notNull(), // fitness, nutrition, mental-health, supplements
  author: text("author").notNull(),
  authorImage: text("author_image"),
  imageUrl: text("image_url"),
  readTime: integer("read_time"), // in minutes
  published: boolean("published").default(true),
  publishedAt: timestamp("published_at").defaultNow(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Contact form submissions
export const contactSubmissions = pgTable("contact_submissions", {
  id: serial("id").primaryKey(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  email: text("email").notNull(),
  subject: text("subject").notNull(),
  message: text("message").notNull(),
  status: text("status").default("pending"), // pending, responded, closed
  createdAt: timestamp("created_at").defaultNow(),
});

// Testimonials
export const testimonials = pgTable("testimonials", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  title: text("title"),
  content: text("content").notNull(),
  rating: integer("rating").notNull(),
  imageUrl: text("image_url"),
  featured: boolean("featured").default(false),
  approved: boolean("approved").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

// Zod schemas
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertWorkoutSchema = createInsertSchema(workouts).omit({
  id: true,
  createdAt: true,
});

export const insertUserWorkoutSchema = createInsertSchema(userWorkouts).omit({
  id: true,
  completedAt: true,
});

export const insertNutritionEntrySchema = createInsertSchema(nutritionEntries).omit({
  id: true,
  loggedAt: true,
});

export const insertArticleSchema = createInsertSchema(articles).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  publishedAt: true,
});

export const insertContactSubmissionSchema = createInsertSchema(contactSubmissions).omit({
  id: true,
  createdAt: true,
  status: true,
});

export const insertTestimonialSchema = createInsertSchema(testimonials).omit({
  id: true,
  createdAt: true,
  approved: true,
  featured: true,
});

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Workout = typeof workouts.$inferSelect;
export type InsertWorkout = z.infer<typeof insertWorkoutSchema>;

export type UserWorkout = typeof userWorkouts.$inferSelect;
export type InsertUserWorkout = z.infer<typeof insertUserWorkoutSchema>;

export type NutritionEntry = typeof nutritionEntries.$inferSelect;
export type InsertNutritionEntry = z.infer<typeof insertNutritionEntrySchema>;

export type Article = typeof articles.$inferSelect;
export type InsertArticle = z.infer<typeof insertArticleSchema>;

export type ContactSubmission = typeof contactSubmissions.$inferSelect;
export type InsertContactSubmission = z.infer<typeof insertContactSubmissionSchema>;

export type Testimonial = typeof testimonials.$inferSelect;
export type InsertTestimonial = z.infer<typeof insertTestimonialSchema>;

// Additional validation schemas
export const bmiCalculationSchema = z.object({
  height: z.number().min(50).max(300),
  weight: z.number().min(20).max(500),
});

export const calorieCalculationSchema = z.object({
  height: z.number().min(50).max(300),
  weight: z.number().min(20).max(500),
  age: z.number().min(10).max(120),
  gender: z.enum(['male', 'female']),
  activityLevel: z.enum(['sedentary', 'light', 'moderate', 'active', 'very_active']),
});

export const foodSearchSchema = z.object({
  query: z.string().min(2).max(100),
  limit: z.number().min(1).max(50).optional(),
});

export type BMICalculation = z.infer<typeof bmiCalculationSchema>;
export type CalorieCalculation = z.infer<typeof calorieCalculationSchema>;
export type FoodSearch = z.infer<typeof foodSearchSchema>;
