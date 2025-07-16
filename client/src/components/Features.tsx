import { motion } from 'framer-motion';
import { Target, Activity, Users, TrendingUp, Heart, Zap } from 'lucide-react';

const features = [
  {
    icon: Target,
    title: "AI-Powered Workouts",
    description: "Personalized workout plans that adapt to your progress and goals using advanced machine learning.",
    gradient: "from-neon-green to-electric-blue"
  },
  {
    icon: Activity,
    title: "Real-Time Tracking",
    description: "Monitor your progress with detailed analytics and insights from your workout sessions.",
    gradient: "from-electric-blue to-hot-pink"
  },
  {
    icon: Users,
    title: "Community Support",
    description: "Connect with like-minded fitness enthusiasts and share your journey with our vibrant community.",
    gradient: "from-hot-pink to-neon-green"
  },
  {
    icon: TrendingUp,
    title: "Progress Analytics",
    description: "Visualize your fitness journey with detailed charts and performance metrics.",
    gradient: "from-neon-green to-hot-pink"
  },
  {
    icon: Heart,
    title: "Health Monitoring",
    description: "Track vital health metrics and receive personalized recommendations for optimal wellness.",
    gradient: "from-electric-blue to-neon-green"
  },
  {
    icon: Zap,
    title: "Quick Workouts",
    description: "Efficient workout routines designed to maximize results in minimal time.",
    gradient: "from-hot-pink to-electric-blue"
  }
];

export default function Features() {
  return (
    <section className="py-20 bg-gradient-to-b from-background to-muted">
      <div className="container mx-auto px-4">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Why Choose{' '}
            <span className="bg-gradient-to-r from-neon-green to-electric-blue bg-clip-text text-transparent">
              FitFusion?
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Experience the future of fitness with our cutting-edge features designed to accelerate your transformation.
          </p>
        </motion.div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              className="glass-morphism p-8 rounded-3xl hover:scale-105 transition-transform duration-300 group"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <div className={`w-16 h-16 bg-gradient-to-r ${feature.gradient} rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                <feature.icon className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-4">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
