import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const CustomCursor = ({ allWordsTyped }) => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [hoveredWord, setHoveredWord] = useState(null);
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);

  const videoSources = {
    Villanova: '/Code(2).mp4',
    Software: '/Code(1).mp4',
    Engineers: '/Code.mp4'
  };

  useEffect(() => {
    const updateMousePosition = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    const updateCursorStyle = (e) => {
      const titleElement = e.target.closest('[data-word]');
      if (titleElement) {
        setHoveredWord(titleElement.dataset.word);
      } else {
        setHoveredWord(null);
      }
    };

    window.addEventListener('mousemove', updateMousePosition);
    document.addEventListener('mousemove', updateCursorStyle);
    document.addEventListener('mouseout', updateCursorStyle);

    return () => {
      window.removeEventListener('mousemove', updateMousePosition);
      document.removeEventListener('mousemove', updateCursorStyle);
      document.removeEventListener('mouseout', updateCursorStyle);
    };
  }, []);

  const handleVideoLoad = () => {
    setIsVideoLoaded(true);
  };

  return (
    <AnimatePresence>
      {hoveredWord && allWordsTyped && (
        <div
          className="fixed pointer-events-none z-0"
          style={{
            left: `${mousePosition.x - 160}px`,
            top: `${mousePosition.y - 160}px`,
          }}
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            transition={{
              type: "spring",
              mass: 0.3,
              stiffness: 100,
              damping: 10
            }}
          >
            <div className="relative w-80 h-80">
              <div 
                className="absolute inset-0 rounded-full overflow-hidden"
               
              >
                <video
                  key={hoveredWord}
                  autoPlay
                  muted
                  loop
                  playsInline
                  onLoadedData={handleVideoLoad}
                  className={`w-full h-full object-cover scale-[1] ${isVideoLoaded ? 'opacity-100' : 'opacity-0'}`}
                >
                  <source src={videoSources[hoveredWord]} type="video/mp4" />
                </video>
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-white/20 mix-blend-overlay" />
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default CustomCursor;