# FitFusion - Modern Fitness & Wellness Platform

## Overview

FitFusion is a production-ready fitness and health web application built with modern web technologies. The application features a glassmorphism design with neon accent colors, AI-powered workout recommendations, real-time nutrition tracking via USDA API, and comprehensive fitness tools including BMI and calorie calculators.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **React 18** with TypeScript for type-safe component development
- **Single Page Application (SPA)** using Wouter for lightweight routing
- **Component-based architecture** with shared UI components from Shadcn/UI
- **State management** using TanStack Query for server state and React hooks for local state
- **Styling** with Tailwind CSS using a custom fitness theme with neon colors
- **Animations** powered by Framer Motion for smooth transitions and interactions

### Backend Architecture
- **Express.js** server with TypeScript for API endpoints
- **RESTful API design** with structured route handlers
- **In-memory storage** with interface abstraction for future database integration
- **Middleware** for request logging, JSON parsing, and error handling
- **Type-safe validation** using Zod schemas for request/response validation

### Database Strategy
- **Current**: In-memory storage implementation (`MemStorage` class)
- **Future**: PostgreSQL with Drizzle ORM (configuration already in place)
- **Schema-first approach** with shared types between frontend and backend
- **Migration support** configured via Drizzle Kit

## Key Components

### Core Features
1. **Workout Management**
   - Exercise database with categories (strength, cardio, yoga, flexibility)
   - Workout progress tracking and history
   - Difficulty levels and duration tracking

2. **Nutrition Tracking**
   - USDA FoodData Central API integration
   - Real-time food search and nutrition data
   - Macro tracking (protein, carbs, fat, calories)

3. **Health Calculators**
   - BMI calculator with health recommendations
   - Calorie calculator based on activity level
   - Personalized fitness goal setting

4. **Content Management**
   - Fitness blog with categorized articles
   - User testimonials with approval system
   - Contact form with status tracking

### UI Components
- **Glassmorphism design** with frosted glass effects
- **Responsive layout** with mobile-first approach
- **Dark/light theme** support with persistent preferences
- **Interactive elements** including carousels, modals, and form components

## Data Flow

### Client-Server Communication
1. **API Requests** use fetch with credential inclusion
2. **Query management** via TanStack Query with caching and background updates
3. **Form handling** with validation and error states
4. **Real-time updates** for nutrition data and workout progress

### State Management
- **Server state** managed by TanStack Query
- **UI state** handled by React hooks (useState, useEffect)
- **Theme state** persisted in localStorage
- **Form state** with validation and error handling

## External Dependencies

### API Integrations
- **USDA FoodData Central API** for nutrition data
- **Exercise API** (planned) for workout database expansion

### Key Libraries
- **Frontend**: React, TypeScript, Tailwind CSS, Framer Motion, Wouter
- **Backend**: Express.js, Drizzle ORM, Zod validation
- **UI Components**: Radix UI primitives via Shadcn/UI
- **Database**: Neon PostgreSQL (configured, not yet implemented)

## Deployment Strategy

### Development
- **Vite** for fast development builds and hot module replacement
- **TypeScript** compilation with strict mode enabled
- **Development server** with middleware integration

### Production
- **Build process** using Vite for frontend and esbuild for backend
- **Static assets** served from Express server
- **Environment variables** for database connections and API keys
- **Deployment ready** for platforms like Vercel, Netlify, or traditional hosting

### Database Deployment
- **PostgreSQL** database configured for production
- **Connection pooling** via Neon serverless
- **Migration system** ready for schema deployment
- **Environment-based configuration** for different deployment stages

The application follows modern web development practices with a focus on performance, user experience, and maintainability. The modular architecture allows for easy extension and scaling as the platform grows.