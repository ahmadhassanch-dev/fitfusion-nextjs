import Hero from '@/components/Hero';
import Features from '@/components/Features';
import Workouts from '@/components/Workouts';
import Nutrition from '@/components/Nutrition';
import Calculator from '@/components/Calculator';
import Testimonials from '@/components/Testimonials';
import Blog from '@/components/Blog';
import Contact from '@/components/Contact';

export default function Home() {
  return (
    <>
      <Hero />
      <Features />
      <Workouts />
      <Nutrition />
      <Calculator />
      <Testimonials />
      <Blog />
      <Contact />
    </>
  );
}
