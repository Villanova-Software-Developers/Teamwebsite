import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import CustomCursor from './CustomCursor';

const TypeWriter = ({ text, onComplete }) => {
  const [displayText, setDisplayText] = useState('');
  const indexRef = useRef(0);
  const interval = useRef(null);
  
  React.useEffect(() => {
    if (indexRef.current >= text.length) return;
    
    interval.current = setInterval(() => {
      if (indexRef.current < text.length) {
        setDisplayText(prev => text.slice(0, indexRef.current + 1));
        indexRef.current += 1;
      } else {
        clearInterval(interval.current);
        onComplete?.();
      }
    }, 100);

    return () => {
      if (interval.current) clearInterval(interval.current);
    };
  }, [text, onComplete]);

  return (
    <span className="inline-block text-outline w-full">
      {displayText}
      {indexRef.current < text.length && (
        <motion.span
          animate={{ opacity: [1, 0] }}
          transition={{ duration: 0.5, repeat: Infinity }}
          className="inline-block"
        >
          |
        </motion.span>
      )}
    </span>
  );
};

const WordContainer = ({ children, word }) => (
  <motion.div
    data-word={word}
    className="relative text-6xl md:text-8xl font-bold whitespace-nowrap"
    whileHover={{ scale: 1.05 }}
  >
    {children}
  </motion.div>
);

const AnimatedTitle = () => {
  const [activeWordIndex, setActiveWordIndex] = useState(0);
  const [words] = useState(['Villanova', 'Software', 'Engineers']);
  const [completedWords, setCompletedWords] = useState(new Set());
  const [allWordsTyped, setAllWordsTyped] = useState(false);
  const isTypingRef = useRef(false);

  const handleWordComplete = () => {
    if (isTypingRef.current) return;
    isTypingRef.current = true;

    setCompletedWords(prev => new Set([...prev, activeWordIndex]));
    
    if (activeWordIndex < words.length - 1) {
      setTimeout(() => {
        setActiveWordIndex(prev => prev + 1);
        isTypingRef.current = false;
      }, 500);
    } else {
      setAllWordsTyped(true);
    }
  };

  return (
    <div className="relative">
      <CustomCursor allWordsTyped={allWordsTyped} />
      <div className="animated-title-container relative z-10">
        <div className="flex flex-col gap-6">
          <div className="flex gap-8 items-center h-24">
            <WordContainer word="Villanova">
              {activeWordIndex === 0 ? (
                <TypeWriter text={words[0]} onComplete={handleWordComplete} />
              ) : (
                <span className="text-outline">
                  {completedWords.has(0) ? words[0] : ''}
                </span>
              )}
            </WordContainer>

            <WordContainer word="Software">
              {activeWordIndex === 1 ? (
                <TypeWriter text={words[1]} onComplete={handleWordComplete} />
              ) : (
                <span className="text-outline">
                  {completedWords.has(1) ? words[1] : ''}
                </span>
              )}
            </WordContainer>
          </div>
          
          <div className="h-24 flex items-center">
            <WordContainer word="Engineers">
              {activeWordIndex === 2 ? (
                <TypeWriter text={words[2]} onComplete={handleWordComplete} />
              ) : (
                <span className="text-outline">
                  {completedWords.has(2) ? words[2] : ''}
                </span>
              )}
            </WordContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnimatedTitle;