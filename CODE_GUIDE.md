# FitFusion - Complete Code Guide

## Project Overview
FitFusion is a modern fitness and health web application built with React and Express.js, featuring glassmorphism design and comprehensive fitness tools.

## Project Structure

```
FitFusion/
├── client/                    # Frontend React application
│   ├── src/
│   │   ├── components/        # React components
│   │   │   ├── ui/           # Shadcn/ui components
│   │   │   ├── Hero.tsx      # Landing page hero section
│   │   │   ├── Features.tsx  # Features showcase
│   │   │   ├── Workouts.tsx  # Workout management
│   │   │   ├── Nutrition.tsx # Nutrition tracking
│   │   │   ├── Calculator.tsx # BMI/Calorie calculators
│   │   │   ├── Blog.tsx      # Fitness blog
│   │   │   ├── Testimonials.tsx # User testimonials
│   │   │   ├── Contact.tsx   # Contact form
│   │   │   └── Layout.tsx    # Main layout wrapper
│   │   ├── hooks/            # Custom React hooks
│   │   ├── lib/              # Utility functions and API clients
│   │   ├── pages/            # Page components
│   │   ├── types/            # TypeScript type definitions
│   │   ├── App.tsx           # Main app component
│   │   ├── main.tsx          # App entry point
│   │   └── index.css         # Global styles
│   └── index.html            # HTML template
├── server/                   # Backend Express application
│   ├── index.ts             # Server entry point
│   ├── routes.ts            # API route handlers
│   ├── storage.ts           # In-memory data storage
│   └── vite.ts              # Vite integration
├── shared/                  # Shared code between client/server
│   └── schema.ts            # Database schema and types
├── package.json             # Dependencies and scripts
├── tailwind.config.ts       # Tailwind CSS configuration
├── vite.config.ts           # Vite build configuration
└── replit.md                # Project documentation
```

## Key Features

### 1. **Glassmorphism Design**
- Modern frosted glass UI effects
- Neon accent colors (cyan/blue theme)
- Dark theme by default with light theme toggle
- Smooth animations with Framer Motion

### 2. **Workout Management**
- Exercise database with categories
- Workout progress tracking
- Filter by category and difficulty
- Animated workout cards

### 3. **Nutrition Tracking**
- Real-time USDA Food Database integration
- Macro tracking (protein, carbs, fat, calories)
- Food search with nutrition details
- Daily nutrition logging

### 4. **Health Calculators**
- BMI calculator with health recommendations
- Calorie calculator based on activity level
- Personalized fitness goal setting

### 5. **Content Features**
- Fitness blog with categorized articles
- User testimonials carousel
- Contact form with validation
- Responsive design

## Getting Started

### Prerequisites
- Node.js 20+
- npm or yarn

### Installation
```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

### Environment Variables
Create a `.env` file for API keys:
```
VITE_USDA_API_KEY=your_usda_api_key_here
```

## Technology Stack

### Frontend
- **React 18** with TypeScript
- **Wouter** for routing
- **TanStack Query** for state management
- **Tailwind CSS** for styling
- **Framer Motion** for animations
- **Shadcn/UI** for components

### Backend
- **Express.js** with TypeScript
- **Zod** for validation
- **Drizzle ORM** (configured for PostgreSQL)
- **In-memory storage** (current implementation)

### Development Tools
- **Vite** for fast development
- **ESBuild** for backend compilation
- **TypeScript** for type safety

## API Endpoints

### Workouts
- `GET /api/workouts` - Get all workouts
- `GET /api/workouts/:id` - Get workout by ID
- `POST /api/workouts` - Create new workout

### Nutrition
- `GET /api/nutrition/search` - Search food database
- `POST /api/nutrition/log` - Log nutrition entry

### Calculators
- `POST /api/calculate/bmi` - Calculate BMI
- `POST /api/calculate/calories` - Calculate calories

### Content
- `GET /api/articles` - Get blog articles
- `GET /api/testimonials` - Get testimonials
- `POST /api/contact` - Submit contact form

## Design System

### Colors
- Primary: Cyan/Blue neon colors
- Background: Dark with glassmorphism effects
- Accent: Bright cyan (#00d4ff)
- Text: White/light gray

### Components
- Glassmorphism cards with backdrop blur
- Neon button effects
- Animated transitions
- Responsive grid layouts

## Deployment

The application is ready for deployment on:
- Vercel
- Netlify
- Traditional hosting with Node.js support

### Build Commands
```bash
# Build for production
npm run build

# Start production server
npm start
```

## Future Enhancements

- PostgreSQL database integration
- User authentication system
- Social features and community
- Mobile app development
- AI-powered workout recommendations
- Wearable device integration

## Contributing

The codebase follows modern React patterns with:
- Functional components with hooks
- TypeScript for type safety
- Clean component architecture
- Responsive design principles
- Accessibility best practices

---

*Built with modern web technologies for optimal performance and user experience.*