import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';


// Image carousel component
export function ImageCarousel(){
  const [current, setCurrent] = useState(0);
  
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
    <div className="relative w-full overflow-hidden">
      <div className="relative h-64 sm:h-80 md:h-96 lg:h-[500px] w-full">
        <AnimatePresence custom={current} mode="popLayout">
          <motion.div
            key={current}
            custom={current}
            className="absolute inset-0 w-full"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'tween', ease: 'easeInOut', duration: 0.7 }}
          >
            <img 
              src={images[current].url} 
              alt={images[current].alt}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black bg-opacity-40 flex items-end justify-center p-4 md:p-8">
              <div className="text-white text-center max-w-4xl mx-auto">
                <h3 className="text-2xl md:text-4xl font-bold mb-4">
                  {images[current].caption}
                </h3>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      <button 
        onClick={prev}
        className="absolute left-2 md:left-8 top-1/2 -translate-y-1/2 bg-white bg-opacity-30 hover:bg-opacity-50 rounded-full p-2 md:p-3 text-white z-10"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6 md:w-8 md:h-8">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      
      <button 
        onClick={next}
        className="absolute right-2 md:right-8 top-1/2 -translate-y-1/2 bg-white bg-opacity-30 hover:bg-opacity-50 rounded-full p-2 md:p-3 text-white z-10"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6 md:w-8 md:h-8">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>

      <div className="absolute bottom-4 md:bottom-8 left-1/2 -translate-x-1/2 flex space-x-3 z-10">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrent(index)}
            className={`w-3 h-3 md:w-4 md:h-4 rounded-full transition-all duration-300 ${current === index ? 'bg-white w-6 md:w-8' : 'bg-white bg-opacity-50'}`}
          />
        ))}
      </div>
    </div>
  );
};