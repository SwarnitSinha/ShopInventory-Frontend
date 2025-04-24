import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaStar } from 'react-icons/fa';

const testimonials = [
  {
    name: "Emily Johnson",
    role: "CEO",
    image: "https://i.pravatar.cc/100?img=1",
    message: "The user interface of ShopSage is so intuitive, I was able to start using it without any guidance.",
    rating: 5,
  },
  {
    name: "Ethan Miller",
    role: "Product Designer",
    image: "https://i.pravatar.cc/100?img=2",
    message: "I used to dread doing my inventory, but ShopSage made it simple and stress-free.",
    rating: 5,
  },
  {
    name: "Aarav Patel",
    role: "Retail Owner",
    image: "https://i.pravatar.cc/100?img=3",
    message: "Running my store is smoother now. Highly recommended!",
    rating: 4,
  },
  {
    name: "Pooja Mehra",
    role: "Store Manager",
    image: "https://i.pravatar.cc/100?img=4",
    message: "It’s a complete solution for small businesses. Love it!",
    rating: 5,
  }
];

export default function TestimonialSection() {
  const [index, setIndex] = useState(0);

  const next = () => {
    setIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prev = () => {
    setIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const visibleTestimonials = [
    testimonials[index],
    testimonials[(index + 1) % testimonials.length],
  ];

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 md:px-8 flex flex-col md:flex-row items-center gap-10">
        {/* Left Info Panel */}
        <div className="md:w-1/3 text-left">
          <p className="text-sm text-gray-500 mb-1">Testimonial</p>
          <h2 className="text-3xl font-bold mb-4">
            23k+ Customers <br /> gave their <span className="text-purple-600">Feedback</span>
          </h2>
          <div className="flex gap-2 mt-4">
            <button
              onClick={prev}
              className="w-10 h-10 bg-gray-100 hover:bg-purple-100 rounded-full flex items-center justify-center text-lg text-gray-600"
            >
              ←
            </button>
            <button
              onClick={next}
              className="w-10 h-10 bg-purple-600 hover:bg-purple-700 text-white rounded-full flex items-center justify-center text-lg"
            >
              →
            </button>
          </div>
        </div>

        {/* Right Testimonial Cards */}
        <div className="md:w-2/3 flex gap-6 overflow-hidden">
          {visibleTestimonials.map((t, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0.5, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className={`flex-1 bg-white border ${
                i === 1 ? "border-purple-500 shadow-xl" : "border-gray-200"
              } rounded-xl p-6 transition-all`}
            >
              <div className="flex items-center gap-4 mb-4">
                <img
                  src={t.image}
                  alt={t.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <h4 className="font-semibold">{t.name}</h4>
                  <p className="text-gray-500 text-sm">{t.role}</p>
                </div>
              </div>
              <div className="flex gap-1 text-yellow-400 mb-3">
                {Array.from({ length: t.rating }).map((_, i) => (
                  <FaStar key={i} />
                ))}
              </div>
              <p className="text-gray-600 text-sm leading-relaxed">"{t.message}"</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
