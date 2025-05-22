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
    boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.15)",
    border: "2px solid #9CAF88" // Sage Green border on hover
  }}
>
  <div className="text-green-800 mb-4 text-4xl md:text-5xl">{icon}</div> {/* Forest Green icon */}
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </motion.div>
  );
};