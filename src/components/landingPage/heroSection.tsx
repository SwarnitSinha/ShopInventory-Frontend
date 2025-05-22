import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';


// Component for the hero section with animated text
export function HeroSection () {
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
<div className="relative h-screen bg-gradient-to-r from-green-800 to-teal-800 overflow-hidden"> {/* Forest Green + Deep Teal */}
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
          className="text-xl md:text-2xl font-medium mb-6 text-center text-green-200"
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
              className="text-xl md:text-3xl font-medium text-center text-green-100"
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
            className="bg-white text-green-800 font-bold py-3 px-8 rounded-full text-lg shadow-lg hover:shadow-xl"
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