// landing-page.tsx
import React, { useState, useEffect, useRef } from 'react';
import {AnalyticsSection } from '@/components/landingPage/analyticsSection';
import TestimonialSection from '../components/landingPage/TestimonialSlider';
import { HeroSection } from '@/components/landingPage/heroSection';
import {ImageCarousel} from '@/components/landingPage/imageCarousel';
import { FeatureCard } from '@/components/landingPage/featureCard';
import { AnimatedCounter } from '../components/landingPage/animatedCounter';
import { motion, AnimatePresence } from 'framer-motion';
import { Footer } from '@/components/landingPage/footer';

// Main Landing Page Component
const LandingPage = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const heroSectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsScrolled(!entry.isIntersecting);
      },
      { threshold: 0.1 }
    );

    if (heroSectionRef.current) {
      observer.observe(heroSectionRef.current);
    }

    return () => {
      if (heroSectionRef.current) {
        observer.unobserve(heroSectionRef.current);
      }
    };
  }, []);

  return (
    <div className="bg-gray-50">
      {/* Navigation Bar */}
      {/* Updated Navigation Bar */}
      <header className={`fixed w-full top-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-white shadow-sm' 
          : 'bg-transparent shadow-none'
      } py-4 px-4 md:px-6`}>
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div className="flex items-center">
            <h1 className={`text-2xl font-bold ${
              isScrolled ? 'text-blue-700' : 'text-white'
            }`}>ShopSage</h1>
          </div>
          <nav>
            <button 
              onClick={() => window.location.href = "/auth"}
              className={`px-4 py-2 rounded-lg transition-colors ${
                isScrolled 
                  ? 'bg-blue-600 text-white hover:bg-blue-700'
                  : 'bg-white/20 text-white hover:bg-white/30'
              }`}
            >
              Login
            </button>
          </nav>
        </div>
      </header>

      {/* HeroSection with spacing for fixed nav */}
      <div ref={heroSectionRef}> {/* Add padding for fixed header */}
        <HeroSection />
      </div>
      
      {/* Mobile Carousel (only visible on small screens) */}
      <div className="py-6 bg-blue-50 px-4">
        <div className="max-w-6xl mx-auto">
          <ImageCarousel />
        </div>
      </div>

<AnalyticsSection/>

      {/* Feature section */}
      <section className="py-16 md:py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div 
            className="text-center mb-12 md:mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-2xl md:text-4xl font-bold mb-4">ShopSage Features</h2>
            <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
              Everything you need to manage your business efficiently in one place
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-8">
            <FeatureCard 
              icon="💼"
              title="Sales Management"
              description="Track sales, create invoices, and monitor performance in real-time."
            />
            <FeatureCard 
              icon="📊"
              title="Inventory Control"
              description="Keep track of stock levels and get automatic reorder notifications."
            />
            <FeatureCard 
              icon="🔍"
              title="Business Analytics"
              description="Gain insights with comprehensive reporting and data visualization."
            />
            <FeatureCard 
              icon="🏪"
              title="POS System"
              description="Streamline checkout processes with our intuitive point-of-sale system."
            />
            <FeatureCard 
              icon="👥"
              title="Customer Management"
              description="Build relationships with customer profiles and purchase history."
            />
            <FeatureCard 
              icon="🔔"
              title="Smart Notifications"
              description="Get alerted about important events and never miss a business opportunity."
            />
          </div>
        </div>
      </section>

      {/* Testimonals */}
      <section className="py-12 md:py-12">
      <TestimonialSection/>
      </section>

      {/* Stats section with animated counters */}
      <section className="py-16 md:py-20 px-4 bg-blue-50">
        <div className="max-w-6xl mx-auto">
          <motion.div 
            className="text-center mb-12 md:mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-2xl md:text-4xl font-bold mb-4">ShopSage by the Numbers</h2>
            <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
              Join thousands of satisfied customers who have transformed their business
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
            <AnimatedCounter target={50} title="Customers" />
            <AnimatedCounter target={1} title="Countries" />
            <AnimatedCounter target={1000} title="Transactions Processed" />
            <AnimatedCounter target={99.9} title="Uptime Percentage" />
          </div>
        </div>
      </section>

      {/* Interactive CTA section */}
      <section className="py-16 md:py-20 bg-gradient-to-r from-blue-600 to-indigo-800 px-4">
        <div className="max-w-4xl mx-auto text-center text-white">
          <motion.h2 
            className="text-2xl md:text-4xl font-bold mb-4 md:mb-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            Ready to Transform Your Business with ShopSage?
          </motion.h2>
          
          <motion.p 
            className="text-lg md:text-xl mb-8 md:mb-10 text-blue-100"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            viewport={{ once: true }}
          >
            Get started today and see the difference our platform can make
          </motion.p>
          
          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            viewport={{ once: true }}
          >
            <motion.button 
              className="bg-white text-blue-700 py-3 px-8 rounded-full text-lg font-bold shadow"
              whileHover={{ scale: 1.05, backgroundColor: "#f0f9ff", color: "#1e40af" }}
              whileTap={{ scale: 0.95 }}
              onClick={() => window.location.href = "/auth"}
            >
              Start Free Trial
            </motion.button>
            
            <motion.button 
              className="bg-transparent border-2 border-white text-white py-3 px-8 rounded-full text-lg font-bold"
              whileHover={{ scale: 1.05, backgroundColor: "rgba(255,255,255,0.1)" }}
              whileTap={{ scale: 0.95 }}
              onClick={() => window.location.href = "/auth"}
            >
              Schedule Demo
            </motion.button>
          </motion.div>
        </div>
      </section>

      <Footer/>
    </div>
  );
};

export default LandingPage;