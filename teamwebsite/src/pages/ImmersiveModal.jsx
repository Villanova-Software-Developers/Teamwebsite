import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AnimatedText = ({ children, delay, index }) => {
  // Determine direction based on index
  const isEven = index % 2 === 0;
  
  return (
    <motion.div
      initial={{ 
        opacity: 0, 
        x: isEven ? -100 : 100,
        y: 20 
      }}
      animate={{ 
        opacity: 1, 
        x: 0,
        y: 0 
      }}
      transition={{ 
        duration: 0.8,
        delay,
        type: "spring",
        stiffness: 100,
        damping: 12,
        ease: [0.22, 1, 0.36, 1]
      }}
      className="font-tech"
    >
      {children}
    </motion.div>
  );
};

const ImmersiveModal = ({ isOpen, onClose, content }) => {
  const navigate = useNavigate();
  
  const handleNavigateAndClose = () => {
    onClose();
    setTimeout(() => {
      navigate('/join-us');
    }, 300);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50"
      >
        {/* Video Background with Wave Effect */}
        <div className="absolute inset-0 overflow-hidden">
          <video
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover"
          >
            <source src="code3.mp4" type="video/mp4" />
          </video>
          
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-purple-900/90 via-purple-900/80 to-blue-900/90" />
        </div>

        {/* Content Container */}
        <div className="relative h-full flex items-center justify-center px-4">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="w-full max-w-4xl"
          >
            {/* Close Button */}
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              onClick={onClose}
              className="absolute top-4 right-4 text-white/80 hover:text-white transition-colors"
            >
              <X className="w-8 h-8" />
            </motion.button>

            {/* Content */}
            <div className="space-y-8">
              <motion.h2
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.1 }}
                className="text-4xl font-bold text-white mb-4"
              >
                {content.title}
              </motion.h2>

              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-lg text-white/90 space-y-4"
              >
                {content.description}
              </motion.div>

              {/* Features Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                {content.features?.map((feature, index) => (
                  <AnimatedText key={index} delay={0.4 + index * 0.15} index={index}>
                    <motion.div
                      whileHover={{ 
                        scale: 1.02,
                        boxShadow: "0 0 20px rgba(59, 130, 246, 0.3)"
                      }}
                      className="bg-white/10 backdrop-blur-lg p-6 rounded-xl border border-white/10 transition-all"
                    >
                      <h3 className="text-2xl font-bold text-white mb-2">{feature.title}</h3>
                      <p className="text-lg text-white/80">{feature.description}</p>
                    </motion.div>
                  </AnimatedText>
                ))}
              </div>

              {/* Call to Action */}
              <AnimatedText delay={1.2} index={-1}>
                <motion.div className="flex justify-center mt-12">
                  <motion.button
                    onClick={handleNavigateAndClose}
                    whileHover={{ 
                      scale: 1.05,
                      boxShadow: "0 0 30px rgba(34, 211, 238, 0.5)"
                    }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-cyan-400 hover:bg-cyan-500 text-white px-10 py-4 rounded-lg text-xl font-bold tracking-wider transition-all shadow-lg"
                  >
                    GET STARTED →
                  </motion.button>
                </motion.div>
              </AnimatedText>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ImmersiveModal;