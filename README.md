# FitFusion - Modern Fitness & Wellness Platform

A production-ready fitness and health web application built with React, TypeScript, and Express.js, featuring glassmorphism design, real-time nutrition tracking, and AI-powered workout recommendations.

## 🚀 Features

### 🎨 Modern Design
- **Glassmorphism & Neumorphism** - Cutting-edge UI design with frosted glass effects
- **Responsive Design** - Mobile-first approach with tablet and desktop optimization
- **Dark/Light Theme** - Seamless theme switching with persistent preferences
- **Smooth Animations** - Framer Motion powered interactions and transitions
- **Neon Accent Colors** - Electric blue, neon green, and hot pink color scheme

### 🏋️ Fitness Features
- **AI-Powered Workouts** - Personalized workout plans that adapt to your progress
- **Exercise Database** - Comprehensive library of exercises with instructions
- **Progress Tracking** - Detailed analytics and workout history
- **BMI Calculator** - Health assessment with personalized recommendations
- **Calorie Calculator** - Daily calorie needs based on activity level

### 🍎 Nutrition Hub
- **USDA Food Database** - Real-time nutrition data from USDA FoodData Central API
- **Smart Food Search** - Intelligent search with autocomplete
- **Macro Tracking** - Protein, carbs, and fat monitoring
- **Meal Planning** - Personalized meal recommendations
- **Nutrition Tips** - Expert advice and healthy eating guidelines

### 📱 User Experience
- **Interactive Testimonials** - Success stories carousel
- **Fitness Blog** - Latest articles on health and wellness
- **Contact System** - Multi-channel communication with form validation
- **Real-time Updates** - Live data synchronization
- **Offline Support** - Progressive Web App capabilities

## 🛠 Tech Stack

### Frontend
- **React 18** - Modern React with hooks and concurrent features
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Animation library
- **Shadcn/UI** - High-quality component library
- **TanStack Query** - Server state management
- **Wouter** - Lightweight routing

### Backend
- **Express.js** - Node.js web framework
- **TypeScript** - End-to-end type safety
- **Drizzle ORM** - Type-safe database operations
- **Zod** - Schema validation
- **In-memory Storage** - Fast development and testing

### APIs & Services
- **USDA FoodData Central** - Comprehensive nutrition database
- **Exercise Database** - Workout and exercise information
- **Real-time Updates** - WebSocket support for live data

## 🚦 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn
- USDA API Key (optional, demo key included)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/fitfusion.git
   cd fitfusion
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Add your API keys to .env
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   ```
   http://localhost:5000
   ```

### Environment Variables

```env
# USDA FoodData Central API
USDA_API_KEY=your_usda_api_key_here

# Database (Optional)
DATABASE_URL=postgresql://username:password@localhost:5432/fitfusion

# Development
NODE_ENV=development
PORT=5000
