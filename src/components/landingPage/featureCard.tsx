import { motion } from 'framer-motion';

// Feature card with hover animation
interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

export function FeatureCard ({ icon, title, description }: FeatureCardProps) {
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