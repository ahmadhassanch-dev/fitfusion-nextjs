import { useState, useEffect } from 'react';
import { Link, useLocation } from 'wouter';
import { motion } from 'framer-motion';
import { Menu, X, Sun, Moon, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTheme } from './ThemeProvider';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const [location] = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { href: '/', label: 'Home' },
    { href: '#workouts', label: 'Workouts' },
    { href: '#nutrition', label: 'Nutrition' },
    { href: '#blog', label: 'Blog' },
    { href: '#contact', label: 'Contact' },
  ];

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId.replace('#', ''));
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Navigation */}
      <motion.nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled ? 'glass-morphism backdrop-blur-md' : 'glass-morphism'
        }`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link href="/">
              <div className="flex items-center space-x-2 cursor-pointer">
                <div className="w-10 h-10 bg-gradient-to-r from-neon-green to-electric-blue rounded-full flex items-center justify-center">
                  <Zap className="w-6 h-6 text-white" />
                </div>
                <span className="text-2xl font-bold bg-gradient-to-r from-neon-green to-electric-blue bg-clip-text text-transparent">
                  FitFusion
                </span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              {navItems.map((item) => (
                <button
                  key={item.href}
                  onClick={() => item.href.startsWith('#') ? scrollToSection(item.href) : null}
                  className={`transition-colors duration-300 hover:text-neon-green ${
                    item.href === '/' && location === '/' ? 'text-neon-green' : ''
                  }`}
                >
                  {item.href.startsWith('#') ? (
                    <span>{item.label}</span>
                  ) : (
                    <Link href={item.href}>{item.label}</Link>
                  )}
                </button>
              ))}
            </div>

            {/* Controls */}
            <div className="flex items-center space-x-4">
              {/* Theme Toggle */}
              <button
                onClick={toggleTheme}
                className="neu-morphism p-2 rounded-full hover:bg-gray-800 dark:hover:bg-gray-700 transition-colors"
              >
                {theme === 'dark' ? (
                  <Sun className="w-5 h-5" />
                ) : (
                  <Moon className="w-5 h-5" />
                )}
              </button>

              {/* CTA Button */}
              <Button className="hidden md:block neu-morphism bg-gradient-to-r from-neon-green to-electric-blue text-dark-bg font-semibold hover:shadow-lg transition-all duration-300">
                Get Started
              </Button>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="md:hidden neu-morphism p-2 rounded-full"
              >
                {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <motion.div
              className="md:hidden mt-4 glass-morphism rounded-3xl p-6"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex flex-col space-y-4">
                {navItems.map((item) => (
                  <button
                    key={item.href}
                    onClick={() => item.href.startsWith('#') ? scrollToSection(item.href) : setIsMenuOpen(false)}
                    className="text-left transition-colors duration-300 hover:text-neon-green"
                  >
                    {item.href.startsWith('#') ? (
                      <span>{item.label}</span>
                    ) : (
                      <Link href={item.href}>{item.label}</Link>
                    )}
                  </button>
                ))}
                <Button className="neu-morphism bg-gradient-to-r from-neon-green to-electric-blue text-dark-bg font-semibold">
                  Get Started
                </Button>
              </div>
            </motion.div>
          )}
        </div>
      </motion.nav>

      {/* Main Content */}
      <main className="pt-20">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-background dark:bg-dark-bg border-t border-gray-800 dark:border-gray-700 py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-6">
                <div className="w-10 h-10 bg-gradient-to-r from-neon-green to-electric-blue rounded-full flex items-center justify-center">
                  <Zap className="w-6 h-6 text-white" />
                </div>
                <span className="text-2xl font-bold bg-gradient-to-r from-neon-green to-electric-blue bg-clip-text text-transparent">
                  FitFusion
                </span>
              </div>
              <p className="text-muted-foreground mb-6">
                Transform your fitness journey with AI-powered workouts and personalized nutrition guidance.
              </p>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li><button onClick={() => scrollToSection('home')} className="text-muted-foreground hover:text-neon-green transition-colors">Home</button></li>
                <li><button onClick={() => scrollToSection('workouts')} className="text-muted-foreground hover:text-neon-green transition-colors">Workouts</button></li>
                <li><button onClick={() => scrollToSection('nutrition')} className="text-muted-foreground hover:text-neon-green transition-colors">Nutrition</button></li>
                <li><button onClick={() => scrollToSection('blog')} className="text-muted-foreground hover:text-neon-green transition-colors">Blog</button></li>
                <li><button onClick={() => scrollToSection('contact')} className="text-muted-foreground hover:text-neon-green transition-colors">Contact</button></li>
              </ul>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-4">Programs</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-muted-foreground hover:text-electric-blue transition-colors">Strength Training</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-electric-blue transition-colors">Cardio Workouts</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-electric-blue transition-colors">Yoga & Mindfulness</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-electric-blue transition-colors">Nutrition Plans</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-electric-blue transition-colors">Personal Training</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-4">Support</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-muted-foreground hover:text-hot-pink transition-colors">Help Center</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-hot-pink transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-hot-pink transition-colors">Terms of Service</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-hot-pink transition-colors">FAQ</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-hot-pink transition-colors">Community</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 dark:border-gray-700 mt-8 pt-8 text-center">
            <p className="text-muted-foreground">© 2024 FitFusion. All rights reserved. Built with React and Express.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
