import { 
  users, workouts, userWorkouts, nutritionEntries, articles, 
  contactSubmissions, testimonials,
  type User, type InsertUser, type Workout, type InsertWorkout,
  type UserWorkout, type InsertUserWorkout, type NutritionEntry, type InsertNutritionEntry,
  type Article, type InsertArticle, type ContactSubmission, type InsertContactSubmission,
  type Testimonial, type InsertTestimonial
} from "@shared/schema";

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, user: Partial<InsertUser>): Promise<User | undefined>;

  // Workout operations
  getWorkouts(category?: string, difficulty?: string, limit?: number): Promise<Workout[]>;
  getWorkout(id: number): Promise<Workout | undefined>;
  createWorkout(workout: InsertWorkout): Promise<Workout>;
  updateWorkout(id: number, workout: Partial<InsertWorkout>): Promise<Workout | undefined>;

  // User workout progress
  getUserWorkouts(userId: number, limit?: number): Promise<UserWorkout[]>;
  logUserWorkout(userWorkout: InsertUserWorkout): Promise<UserWorkout>;

  // Nutrition tracking
  getUserNutritionEntries(userId: number, date?: Date): Promise<NutritionEntry[]>;
  createNutritionEntry(entry: InsertNutritionEntry): Promise<NutritionEntry>;
  deleteNutritionEntry(id: number, userId: number): Promise<boolean>;

  // Articles
  getArticles(category?: string, published?: boolean, limit?: number): Promise<Article[]>;
  getArticle(id: number): Promise<Article | undefined>;
  getArticleBySlug(slug: string): Promise<Article | undefined>;
  createArticle(article: InsertArticle): Promise<Article>;
  updateArticle(id: number, article: Partial<InsertArticle>): Promise<Article | undefined>;

  // Contact submissions
  createContactSubmission(submission: InsertContactSubmission): Promise<ContactSubmission>;
  getContactSubmissions(status?: string): Promise<ContactSubmission[]>;

  // Testimonials
  getTestimonials(featured?: boolean, approved?: boolean): Promise<Testimonial[]>;
  createTestimonial(testimonial: InsertTestimonial): Promise<Testimonial>;
  updateTestimonial(id: number, testimonial: Partial<InsertTestimonial>): Promise<Testimonial | undefined>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User> = new Map();
  private workouts: Map<number, Workout> = new Map();
  private userWorkouts: Map<number, UserWorkout> = new Map();
  private nutritionEntries: Map<number, NutritionEntry> = new Map();
  private articles: Map<number, Article> = new Map();
  private contactSubmissions: Map<number, ContactSubmission> = new Map();
  private testimonials: Map<number, Testimonial> = new Map();

  private currentUserId = 1;
  private currentWorkoutId = 1;
  private currentUserWorkoutId = 1;
  private currentNutritionId = 1;
  private currentArticleId = 1;
  private currentContactId = 1;
  private currentTestimonialId = 1;

  constructor() {
    this.initializeData();
  }

  private initializeData() {
    // Initialize with sample workouts
    const sampleWorkouts: Workout[] = [
      {
        id: this.currentWorkoutId++,
        name: "Muscle Building Pro",
        category: "strength",
        difficulty: "advanced",
        duration: 45,
        description: "Advanced strength training program for maximum muscle growth and power development.",
        instructions: "Follow the exercise sequence with proper form. Rest 2-3 minutes between sets.",
        equipment: ["barbells", "dumbbells", "bench", "squat rack"],
        targetMuscles: ["chest", "back", "shoulders", "arms", "legs"],
        calories: 350,
        rating: 5,
        reviews: 2300,
        imageUrl: "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400",
        createdAt: new Date(),
      },
      {
        id: this.currentWorkoutId++,
        name: "HIIT Cardio Blast",
        category: "cardio",
        difficulty: "intermediate",
        duration: 30,
        description: "High-intensity interval training to torch calories and improve cardiovascular health.",
        instructions: "Alternate between high-intensity bursts and recovery periods. Stay hydrated.",
        equipment: ["none"],
        targetMuscles: ["full body"],
        calories: 450,
        rating: 5,
        reviews: 1800,
        imageUrl: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400",
        createdAt: new Date(),
      },
      {
        id: this.currentWorkoutId++,
        name: "Mindful Flow",
        category: "yoga",
        difficulty: "beginner",
        duration: 60,
        description: "Relaxing yoga sequences to improve flexibility, balance, and mental clarity.",
        instructions: "Focus on breathing and maintain poses comfortably. Listen to your body.",
        equipment: ["yoga mat", "blocks", "strap"],
        targetMuscles: ["core", "back", "legs", "arms"],
        calories: 200,
        rating: 5,
        reviews: 1200,
        imageUrl: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400",
        createdAt: new Date(),
      },
    ];

    sampleWorkouts.forEach(workout => {
      this.workouts.set(workout.id, workout);
    });

    // Initialize with sample articles
    const sampleArticles: Article[] = [
      {
        id: this.currentArticleId++,
        title: "10 Essential Exercises for Building Muscle",
        slug: "10-essential-exercises-building-muscle",
        content: "Discover the fundamental movements that will transform your physique and boost your strength gains. These exercises target multiple muscle groups and provide the foundation for any effective strength training program.",
        excerpt: "Discover the fundamental movements that will transform your physique and boost your strength gains.",
        category: "fitness",
        author: "Dr. Alex Turner",
        authorImage: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400",
        imageUrl: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400",
        readTime: 5,
        published: true,
        publishedAt: new Date('2024-12-15'),
        createdAt: new Date('2024-12-15'),
        updatedAt: new Date('2024-12-15'),
      },
      {
        id: this.currentArticleId++,
        title: "The Complete Guide to Meal Prep",
        slug: "complete-guide-meal-prep",
        content: "Learn how to prepare nutritious meals in advance to stay consistent with your fitness goals. Meal prep is one of the most effective strategies for maintaining a healthy diet.",
        excerpt: "Learn how to prepare nutritious meals in advance to stay consistent with your fitness goals.",
        category: "nutrition",
        author: "Sarah Martinez",
        authorImage: "https://images.unsplash.com/photo-1494790108755-2616b86d82d4?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400",
        imageUrl: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400",
        readTime: 8,
        published: true,
        publishedAt: new Date('2024-12-12'),
        createdAt: new Date('2024-12-12'),
        updatedAt: new Date('2024-12-12'),
      },
      {
        id: this.currentArticleId++,
        title: "Mental Health Benefits of Regular Exercise",
        slug: "mental-health-benefits-exercise",
        content: "Explore how physical activity can improve your mental well-being and overall quality of life. Exercise is not just about physical fitness - it's a powerful tool for mental health.",
        excerpt: "Explore how physical activity can improve your mental well-being and overall quality of life.",
        category: "mental-health",
        author: "Dr. Lisa Chen",
        authorImage: "https://images.unsplash.com/photo-1582750433449-648ed127bb54?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400",
        imageUrl: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400",
        readTime: 6,
        published: true,
        publishedAt: new Date('2024-12-10'),
        createdAt: new Date('2024-12-10'),
        updatedAt: new Date('2024-12-10'),
      },
    ];

    sampleArticles.forEach(article => {
      this.articles.set(article.id, article);
    });

    // Initialize with sample testimonials
    const sampleTestimonials: Testimonial[] = [
      {
        id: this.currentTestimonialId++,
        name: "Sarah Johnson",
        title: "Marketing Manager",
        content: "FitFusion completely transformed my approach to fitness. The AI-powered workouts adapted perfectly to my schedule and goals. I've lost 30 pounds and gained so much strength!",
        rating: 5,
        imageUrl: "https://images.unsplash.com/photo-1494790108755-2616b86d82d4?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400",
        featured: true,
        approved: true,
        createdAt: new Date(),
      },
      {
        id: this.currentTestimonialId++,
        name: "Mike Chen",
        title: "Software Engineer",
        content: "The nutrition tracking with real USDA data helped me understand exactly what I was eating. Combined with the workout plans, I've achieved my dream physique!",
        rating: 5,
        imageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400",
        featured: true,
        approved: true,
        createdAt: new Date(),
      },
      {
        id: this.currentTestimonialId++,
        name: "Emma Rodriguez",
        title: "Teacher & Mother",
        content: "As a busy mom, I needed workouts that fit my schedule. FitFusion's flexible programs and supportive community kept me motivated throughout my transformation.",
        rating: 5,
        imageUrl: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400",
        featured: true,
        approved: true,
        createdAt: new Date(),
      },
    ];

    sampleTestimonials.forEach(testimonial => {
      this.testimonials.set(testimonial.id, testimonial);
    });
  }

  // User operations
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.email === email);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.username === username);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const user: User = {
      ...insertUser,
      id: this.currentUserId++,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.users.set(user.id, user);
    return user;
  }

  async updateUser(id: number, updates: Partial<InsertUser>): Promise<User | undefined> {
    const user = this.users.get(id);
    if (!user) return undefined;

    const updatedUser: User = {
      ...user,
      ...updates,
      updatedAt: new Date(),
    };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  // Workout operations
  async getWorkouts(category?: string, difficulty?: string, limit?: number): Promise<Workout[]> {
    let workouts = Array.from(this.workouts.values());

    if (category) {
      workouts = workouts.filter(w => w.category === category);
    }

    if (difficulty) {
      workouts = workouts.filter(w => w.difficulty === difficulty);
    }

    if (limit) {
      workouts = workouts.slice(0, limit);
    }

    return workouts.sort((a, b) => b.rating - a.rating);
  }

  async getWorkout(id: number): Promise<Workout | undefined> {
    return this.workouts.get(id);
  }

  async createWorkout(insertWorkout: InsertWorkout): Promise<Workout> {
    const workout: Workout = {
      ...insertWorkout,
      id: this.currentWorkoutId++,
      createdAt: new Date(),
    };
    this.workouts.set(workout.id, workout);
    return workout;
  }

  async updateWorkout(id: number, updates: Partial<InsertWorkout>): Promise<Workout | undefined> {
    const workout = this.workouts.get(id);
    if (!workout) return undefined;

    const updatedWorkout: Workout = {
      ...workout,
      ...updates,
    };
    this.workouts.set(id, updatedWorkout);
    return updatedWorkout;
  }

  // User workout progress
  async getUserWorkouts(userId: number, limit?: number): Promise<UserWorkout[]> {
    let userWorkouts = Array.from(this.userWorkouts.values())
      .filter(uw => uw.userId === userId);

    if (limit) {
      userWorkouts = userWorkouts.slice(0, limit);
    }

    return userWorkouts.sort((a, b) => new Date(b.completedAt!).getTime() - new Date(a.completedAt!).getTime());
  }

  async logUserWorkout(insertUserWorkout: InsertUserWorkout): Promise<UserWorkout> {
    const userWorkout: UserWorkout = {
      ...insertUserWorkout,
      id: this.currentUserWorkoutId++,
      completedAt: new Date(),
    };
    this.userWorkouts.set(userWorkout.id, userWorkout);
    return userWorkout;
  }

  // Nutrition tracking
  async getUserNutritionEntries(userId: number, date?: Date): Promise<NutritionEntry[]> {
    let entries = Array.from(this.nutritionEntries.values())
      .filter(ne => ne.userId === userId);

    if (date) {
      const targetDate = new Date(date);
      entries = entries.filter(ne => {
        const entryDate = new Date(ne.loggedAt!);
        return entryDate.toDateString() === targetDate.toDateString();
      });
    }

    return entries.sort((a, b) => new Date(b.loggedAt!).getTime() - new Date(a.loggedAt!).getTime());
  }

  async createNutritionEntry(insertEntry: InsertNutritionEntry): Promise<NutritionEntry> {
    const entry: NutritionEntry = {
      ...insertEntry,
      id: this.currentNutritionId++,
      loggedAt: new Date(),
    };
    this.nutritionEntries.set(entry.id, entry);
    return entry;
  }

  async deleteNutritionEntry(id: number, userId: number): Promise<boolean> {
    const entry = this.nutritionEntries.get(id);
    if (!entry || entry.userId !== userId) return false;

    this.nutritionEntries.delete(id);
    return true;
  }

  // Articles
  async getArticles(category?: string, published?: boolean, limit?: number): Promise<Article[]> {
    let articles = Array.from(this.articles.values());

    if (category) {
      articles = articles.filter(a => a.category === category);
    }

    if (published !== undefined) {
      articles = articles.filter(a => a.published === published);
    }

    if (limit) {
      articles = articles.slice(0, limit);
    }

    return articles.sort((a, b) => new Date(b.publishedAt!).getTime() - new Date(a.publishedAt!).getTime());
  }

  async getArticle(id: number): Promise<Article | undefined> {
    return this.articles.get(id);
  }

  async getArticleBySlug(slug: string): Promise<Article | undefined> {
    return Array.from(this.articles.values()).find(a => a.slug === slug);
  }

  async createArticle(insertArticle: InsertArticle): Promise<Article> {
    const article: Article = {
      ...insertArticle,
      id: this.currentArticleId++,
      publishedAt: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.articles.set(article.id, article);
    return article;
  }

  async updateArticle(id: number, updates: Partial<InsertArticle>): Promise<Article | undefined> {
    const article = this.articles.get(id);
    if (!article) return undefined;

    const updatedArticle: Article = {
      ...article,
      ...updates,
      updatedAt: new Date(),
    };
    this.articles.set(id, updatedArticle);
    return updatedArticle;
  }

  // Contact submissions
  async createContactSubmission(insertSubmission: InsertContactSubmission): Promise<ContactSubmission> {
    const submission: ContactSubmission = {
      ...insertSubmission,
      id: this.currentContactId++,
      status: "pending",
      createdAt: new Date(),
    };
    this.contactSubmissions.set(submission.id, submission);
    return submission;
  }

  async getContactSubmissions(status?: string): Promise<ContactSubmission[]> {
    let submissions = Array.from(this.contactSubmissions.values());

    if (status) {
      submissions = submissions.filter(s => s.status === status);
    }

    return submissions.sort((a, b) => new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime());
  }

  // Testimonials
  async getTestimonials(featured?: boolean, approved?: boolean): Promise<Testimonial[]> {
    let testimonials = Array.from(this.testimonials.values());

    if (featured !== undefined) {
      testimonials = testimonials.filter(t => t.featured === featured);
    }

    if (approved !== undefined) {
      testimonials = testimonials.filter(t => t.approved === approved);
    }

    return testimonials.sort((a, b) => new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime());
  }

  async createTestimonial(insertTestimonial: InsertTestimonial): Promise<Testimonial> {
    const testimonial: Testimonial = {
      ...insertTestimonial,
      id: this.currentTestimonialId++,
      featured: false,
      approved: false,
      createdAt: new Date(),
    };
    this.testimonials.set(testimonial.id, testimonial);
    return testimonial;
  }

  async updateTestimonial(id: number, updates: Partial<InsertTestimonial>): Promise<Testimonial | undefined> {
    const testimonial = this.testimonials.get(id);
    if (!testimonial) return undefined;

    const updatedTestimonial: Testimonial = {
      ...testimonial,
      ...updates,
    };
    this.testimonials.set(id, updatedTestimonial);
    return updatedTestimonial;
  }
}

export const storage = new MemStorage();
