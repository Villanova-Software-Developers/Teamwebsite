import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const FloatingElement = ({ delay = 0, children, x, y }) => (
  <motion.div
    initial={{ opacity: 0, x, y: y - 20 }}
    animate={{ opacity: 1, x, y }}
    exit={{ opacity: 0, y: y + 20 }}
    transition={{
      delay,
      duration: 0.5,
      y: {
        duration: 2,
        repeat: Infinity,
        repeatType: "reverse",
        ease: "easeInOut"
      }
    }}
    className="absolute"
  >
    {children}
  </motion.div>
);

const AnimatedTitle = () => {
  const [isHovered, setIsHovered] = useState(false);

  const floatingElements = [
    {
      component: (
        <div className="bg-yellow-400 w-24 h-32 rounded-lg shadow-lg flex flex-col items-center justify-center p-4">
          <div className="text-xs text-white font-semibold">Monthly</div>
          <div className="text-sm text-white font-bold mt-1">Projects</div>
          <div className="text-lg text-white font-bold mt-2">12+</div>
        </div>
      ),
      x: -100,
      y: -50,
      delay: 0
    },
    {
      component: (
        <div className="w-16 h-16 rounded-full bg-blue-600 shadow-lg flex items-center justify-center">
          <span className="text-white text-2xl">{"</>"}</span>
        </div>
      ),
      x: 80,
      y: 20,
      delay: 0.2
    },
    {
      component: (
        <div className="bg-white w-20 h-20 rounded-lg shadow-lg flex items-center justify-center">
          <svg className="w-12 h-12 text-blue-600" viewBox="0 0 24 24">
            <path fill="currentColor" d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path>
          </svg>
        </div>
      ),
      x: -60,
      y: 40,
      delay: 0.4
    }
  ];

  return (
    <div className="relative">
      <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6 leading-tight flex flex-wrap items-center">
        Villanova{' '}
        <span
          className="relative inline-block mx-2"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <span className="relative z-10">Software</span>
          <AnimatePresence>
            {isHovered && (
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                {floatingElements.map((element, index) => (
                  <FloatingElement
                    key={index}
                    delay={element.delay}
                    x={element.x}
                    y={element.y}
                  >
                    {element.component}
                  </FloatingElement>
                ))}
              </div>
            )}
          </AnimatePresence>
        </span>{' '}
        Engineers
      </h1>
    </div>
  );
};

export default AnimatedTitle;