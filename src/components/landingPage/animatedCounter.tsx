import React, {useEffect, useState} from "react";

// Animated counter component
interface AnimatedCounterProps {
  target: number;
  title: string;
  duration?: number;
}

export function AnimatedCounter ({ target, title, duration = 2 }: AnimatedCounterProps){
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
      <div className="text-3xl md:text-4xl font-bold text-green-600">{count.toLocaleString()}+</div>
      <div className="text-gray-600 mt-2">{title}</div>
    </div>
  );
};