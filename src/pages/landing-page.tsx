// landing-page.tsx
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Component for the hero section with animated text
const HeroSection = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const heroTexts = [
    "Transform Your Business",
    "Streamline Operations",
    "Boost Your Sales",
    "Manage Inventory Effortlessly"
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % heroTexts.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleGetStarted = () => {
    window.location.href = "/auth";
  };

  return (
    <div className="relative min-h-[70vh] md:h-screen bg-gradient-to-r from-blue-600 to-indigo-800 overflow-hidden">
      {/* Animated background circles */}
      <div className="absolute inset-0 overflow-hidden">
        {Array.from({ length: 20 }).map((_, index) => (
          <motion.div
            key={index}
            className="absolute rounded-full bg-white opacity-10"
            initial={{
              x: Math.random() * window.innerWidth,
              y: Math.random() * window.innerHeight,
              scale: Math.random() * 0.5 + 0.5,
            }}
            animate={{
              x: Math.random() * window.innerWidth,
              y: Math.random() * window.innerHeight,
              transition: {
                duration: Math.random() * 50 + 30,
                repeat: Infinity,
                repeatType: "reverse",
              },
            }}
            style={{
              width: `${Math.random() * 200 + 50}px`,
              height: `${Math.random() * 200 + 50}px`,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 flex flex-col items-center justify-center h-full text-white px-4 py-16 md:py-0">
        <motion.h1 
          className="text-4xl md:text-6xl font-bold mb-2 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          ShopSage
        </motion.h1>
        
        <motion.h2
          className="text-xl md:text-2xl font-medium mb-6 text-center text-blue-200"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          Smart Business Management Solution
        </motion.h2>

        <div className="h-16 md:h-20 overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.h3
              key={currentIndex}
              className="text-xl md:text-3xl font-medium text-center text-blue-100"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
            >
              {heroTexts[currentIndex]}
            </motion.h3>
          </AnimatePresence>
        </div>

        <motion.div 
          className="mt-8 md:mt-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 1 }}
        >
          <motion.button 
            className="bg-white text-blue-800 font-bold py-3 px-8 rounded-full text-lg shadow-lg hover:shadow-xl"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleGetStarted}
          >
            Get Started
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
};

// Image carousel component
const ImageCarousel = () => {
  const [current, setCurrent] = useState(0);
  
  // Unsplash images (business/technology themed)
  const images = [
    {
      url: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d",
      alt: "Modern office workspace",
      caption: "Modern and efficient workspace solutions"
    },
    {
      url: "https://images.unsplash.com/photo-1551288049-bebda4e38f71",
      alt: "Team collaboration",
      caption: "Empower your team with the right tools"
    },
    {
      url: "https://images.unsplash.com/photo-1460925895917-afdab827c52f",
      alt: "Business analytics",
      caption: "Data-driven business decisions"
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % images.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [images.length]);

  const next = () => setCurrent((prev) => (prev + 1) % images.length);
  const prev = () => setCurrent((prev) => (prev - 1 + images.length) % images.length);

  return (
    <div className="relative max-w-6xl mx-auto overflow-hidden rounded-xl shadow-xl">
      <div className="relative h-64 sm:h-80 md:h-96 lg:h-[500px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={current}
            className="absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <img 
              src={images[current].url} 
              alt={images[current].alt}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black bg-opacity-40 flex items-end justify-center p-4 md:p-8">
              <div className="text-white text-center">
                <h3 className="text-xl md:text-2xl font-bold mb-2">
                  {images[current].caption}
                </h3>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      <button 
        onClick={prev}
        className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 bg-white bg-opacity-30 hover:bg-opacity-50 rounded-full p-1 md:p-2 text-white"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-5 h-5 md:w-6 md:h-6">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      
      <button 
        onClick={next}
        className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 bg-white bg-opacity-30 hover:bg-opacity-50 rounded-full p-1 md:p-2 text-white"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-5 h-5 md:w-6 md:h-6">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>

      <div className="absolute bottom-2 md:bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrent(index)}
            className={`w-2 h-2 md:w-3 md:h-3 rounded-full ${current === index ? 'bg-white' : 'bg-white bg-opacity-50'}`}
          />
        ))}
      </div>
    </div>
  );
};

// Feature card with hover animation
interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const FeatureCard = ({ icon, title, description }: FeatureCardProps) => {
  return (
    <motion.div 
      className="bg-white rounded-xl shadow-lg p-6 flex flex-col items-center text-center"
      whileHover={{ 
        y: -10,
        boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)"
      }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      <div className="text-blue-600 mb-4 text-4xl md:text-5xl">{icon}</div>
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </motion.div>
  );
};

// Animated counter component
interface AnimatedCounterProps {
  target: number;
  title: string;
  duration?: number;
}

const AnimatedCounter = ({ target, title, duration = 2 }: AnimatedCounterProps) => {
  const [count, setCount] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const counterRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.1 }
    );

    if (counterRef.current) {
      observer.observe(counterRef.current);
    }

    return () => {
      if (counterRef.current) {
        observer.unobserve(counterRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (!isVisible) return;

    let start = 0;
    const increment = target / (duration * 60);
    const timer = setInterval(() => {
      start += increment;
      setCount(Math.floor(start));
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      }
    }, 1000 / 60);

    return () => clearInterval(timer);
  }, [isVisible, target, duration]);

  return (
    <div ref={counterRef} className="text-center">
      <div className="text-3xl md:text-4xl font-bold text-blue-600">{count.toLocaleString()}+</div>
      <div className="text-gray-600 mt-2">{title}</div>
    </div>
  );
};

// Main Landing Page Component
const LandingPage = () => {
  return (
    <div className="bg-gray-50">
      {/* Navigation Bar */}
      <header className="bg-white shadow-sm py-4 px-4 md:px-6">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div className="flex items-center">
            <h1 className="text-2xl font-bold text-blue-700">ShopSage</h1>
          </div>
          <nav>
            <button 
              onClick={() => window.location.href = "/auth"}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Login
            </button>
          </nav>
        </div>
      </header>

      {/* Top Carousel (desktop only) */}
      <div className="hidden md:block py-6 bg-blue-50 px-4">
        <div className="max-w-6xl mx-auto">
          <ImageCarousel />
        </div>
      </div>

      <HeroSection />
      
      {/* Mobile Carousel (only visible on small screens) */}
      <div className="md:hidden py-6 bg-blue-50 px-4">
        <div className="max-w-6xl mx-auto">
          <ImageCarousel />
        </div>
      </div>

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
            <AnimatedCounter target={5000} title="Customers" />
            <AnimatedCounter target={120} title="Countries" />
            <AnimatedCounter target={10000000} title="Transactions Processed" />
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

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-10 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-6 md:mb-0">
              <h3 className="text-2xl font-bold">ShopSage</h3>
              <p className="text-gray-400 mt-2">Smart Business Management Solution</p>
            </div>
          
            <div className="flex flex-col md:flex-row gap-6 md:gap-12">
              <div>
                <h4 className="font-bold mb-2 text-center md:text-left">Product</h4>
                <ul className="space-y-1 text-gray-400 text-center md:text-left">
                  <li>Features</li>
                  <li>Pricing</li>
                  <li>Support</li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-bold mb-2 text-center md:text-left">Company</h4>
                <ul className="space-y-1 text-gray-400 text-center md:text-left">
                  <li>About Us</li>
                  <li>Contact</li>
                  <li>Blog</li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-bold mb-2 text-center md:text-left">Legal</h4>
                <ul className="space-y-1 text-gray-400 text-center md:text-left">
                  <li>Privacy</li>
                  <li>Terms</li>
                  <li>Security</li>
                </ul>
              </div>
            </div>
          </div>
          
          <div className="mt-8 pt-6 border-t border-gray-800 text-center">
            <p className="text-gray-500">© 2025 ShopSage. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;