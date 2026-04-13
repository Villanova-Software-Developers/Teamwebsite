import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Trophy, Star, Heart, Flame, Zap, Award, Gift, 
  CheckCircle, XCircle, ArrowRight, Volume2, Play,
  Lightbulb, Target, BookOpen, Coffee, Clock, 
  Users, MessageCircle, ThumbsUp, Sparkles
} from 'lucide-react';

const GameifiedLesson = ({ 
  lessonData, 
  onLessonComplete, 
  characterImage = "/img2.jpg",
  theme = "investment" 
}) => {
  // Game State
  const [currentSlide, setCurrentSlide] = useState(0);
  const [hearts, setHearts] = useState(5);
  const [streak, setStreak] = useState(0);
  const [xp, setXP] = useState(0);
  const [stars, setStars] = useState(0);
  const [coins, setCoins] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isCorrect, setIsCorrect] = useState(null);
  const [showCelebration, setShowCelebration] = useState(false);
  const [showEncouragement, setShowEncouragement] = useState(false);
  const [completedSlides, setCompletedSlides] = useState([]);
  const [powerUps, setPowerUps] = useState({
    skipQuestion: 2,
    freezeTime: 1,
    doubleXP: 1
  });
  
  // Audio refs for sound effects
  const correctSoundRef = useRef(null);
  const wrongSoundRef = useRef(null);
  const coinSoundRef = useRef(null);
  const celebrationSoundRef = useRef(null);

  // Character personalities and reactions
  const characterReactions = {
    correct: [
      "Excellent work! You're really getting the hang of this! 🎉",
      "Fantastic! Your understanding is growing stronger! ⭐",
      "Brilliant! You nailed that one perfectly! 💫",
      "Outstanding! Keep up this amazing progress! 🚀",
      "Wonderful! You're becoming a real expert! 👏"
    ],
    wrong: [
      "Don't worry, everyone learns at their own pace! Let's try again! 💪",
      "That's okay! Making mistakes is how we learn best! 🌱",
      "No problem! Let me explain this concept differently! 💡",
      "Keep going! You're closer to understanding than you think! ✨",
      "Every expert was once a beginner! You've got this! 🎯"
    ],
    encouragement: [
      "You're doing amazing! Keep up the great work! 🌟",
      "I believe in you! You can master this! 💪",
      "Your progress is impressive! Stay focused! 🎯",
      "Great job staying committed to learning! 📚",
      "You're building valuable skills! Keep going! 🚀"
    ]
  };

  // Theme colors
  const themeColors = {
    investment: {
      primary: "from-blue-600 to-purple-600",
      secondary: "from-green-500 to-teal-500",
      accent: "bg-blue-500",
      light: "bg-blue-50"
    },
    credit: {
      primary: "from-purple-600 to-pink-600",
      secondary: "from-orange-500 to-red-500",
      accent: "bg-purple-500",
      light: "bg-purple-50"
    },
    emergency: {
      primary: "from-green-600 to-blue-600",
      secondary: "from-yellow-500 to-orange-500",
      accent: "bg-green-500",
      light: "bg-green-50"
    }
  };

  const currentTheme = themeColors[theme] || themeColors.investment;

  // Handle answer selection
  const handleAnswerSelect = (answerIndex) => {
    if (showAnswer) return;
    
    setSelectedAnswer(answerIndex);
    const currentQuestion = lessonData.slides[currentSlide];
    const correct = answerIndex === currentQuestion.correctAnswer;
    
    setIsCorrect(correct);
    setShowAnswer(true);

    if (correct) {
      // Correct answer rewards
      setXP(prev => prev + 10);
      setCoins(prev => prev + 5);
      setStreak(prev => prev + 1);
      setStars(prev => prev + 1);
      setShowCelebration(true);
      
      if (correctSoundRef.current) {
        correctSoundRef.current.play();
      }
      
      // Bonus rewards for streaks
      if ((streak + 1) % 3 === 0) {
        setCoins(prev => prev + 10);
        setXP(prev => prev + 20);
      }
      
      setTimeout(() => setShowCelebration(false), 2000);
    } else {
      // Wrong answer
      setHearts(prev => Math.max(0, prev - 1));
      setStreak(0);
      setShowEncouragement(true);
      
      if (wrongSoundRef.current) {
        wrongSoundRef.current.play();
      }
      
      setTimeout(() => setShowEncouragement(false), 3000);
    }
  };

  // Navigate to next slide
  const handleNext = () => {
    if (currentSlide < lessonData.slides.length - 1) {
      setCompletedSlides(prev => [...prev, currentSlide]);
      setCurrentSlide(prev => prev + 1);
      setShowAnswer(false);
      setSelectedAnswer(null);
      setIsCorrect(null);
    } else {
      // Lesson complete
      if (onLessonComplete) {
        onLessonComplete({
          xp,
          coins,
          stars,
          hearts: hearts,
          streak,
          completedSlides: completedSlides.length + 1
        });
      }
    }
  };

  // Use power-up
  const usePowerUp = (powerUpType) => {
    if (powerUps[powerUpType] <= 0) return;
    
    setPowerUps(prev => ({
      ...prev,
      [powerUpType]: prev[powerUpType] - 1
    }));

    switch (powerUpType) {
      case 'skipQuestion':
        handleNext();
        break;
      case 'freezeTime':
        // Implementation for time-based questions
        break;
      case 'doubleXP':
        setXP(prev => prev + (isCorrect ? 10 : 0));
        break;
    }
  };

  // Get random character reaction
  const getCharacterReaction = (type) => {
    const reactions = characterReactions[type];
    return reactions[Math.floor(Math.random() * reactions.length)];
  };

  // Progress calculation
  const progress = ((currentSlide + 1) / lessonData.slides.length) * 100;
  const currentQuestion = lessonData.slides[currentSlide];

  // Confetti effect component
  const ConfettiEffect = () => (
    <div className="fixed inset-0 pointer-events-none z-50">
      {Array.from({ length: 50 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-3 h-3"
          style={{
            backgroundColor: ['#FFD700', '#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A'][i % 5],
            left: `${Math.random() * 100}%`,
            borderRadius: Math.random() > 0.5 ? '50%' : '0%'
          }}
          initial={{ y: -20, opacity: 0, rotate: 0 }}
          animate={{ 
            y: window.innerHeight + 20, 
            opacity: [0, 1, 1, 0], 
            rotate: 360 * (Math.random() > 0.5 ? 1 : -1)
          }}
          transition={{ 
            duration: 3 + Math.random() * 2, 
            ease: "easeOut",
            delay: Math.random() * 0.5 
          }}
        />
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50 p-4 font-sans">
      {/* Audio elements */}
      <audio ref={correctSoundRef} src="https://assets.mixkit.co/active_storage/sfx/2018/2018-preview.mp3" preload="auto" />
      <audio ref={wrongSoundRef} src="https://assets.mixkit.co/active_storage/sfx/2003/2003-preview.mp3" preload="auto" />
      <audio ref={coinSoundRef} src="https://assets.mixkit.co/active_storage/sfx/1993/1993-preview.mp3" preload="auto" />
      <audio ref={celebrationSoundRef} src="https://assets.mixkit.co/active_storage/sfx/1993/1993-preview.mp3" preload="auto" />

      {/* Celebration Effects */}
      <AnimatePresence>
        {showCelebration && <ConfettiEffect />}
      </AnimatePresence>

      {/* Top Game UI */}
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6 bg-white rounded-2xl p-4 shadow-lg border-2 border-gray-100">
          {/* Progress Bar */}
          <div className="flex-1 mr-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-600">
                Lesson Progress
              </span>
              <span className="text-sm font-bold text-gray-800">
                {currentSlide + 1}/{lessonData.slides.length}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <motion.div 
                className={`h-3 rounded-full bg-gradient-to-r ${currentTheme.primary}`}
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
          </div>

          {/* Game Stats */}
          <div className="flex items-center space-x-6">
            {/* Hearts */}
            <div className="flex items-center">
              <Heart className="text-red-500 mr-1" size={20} />
              <span className="font-bold text-gray-800">{hearts}</span>
            </div>

            {/* Streak */}
            <div className="flex items-center">
              <Flame className="text-orange-500 mr-1" size={20} />
              <span className="font-bold text-gray-800">{streak}</span>
            </div>

            {/* XP */}
            <div className="flex items-center">
              <Star className="text-yellow-500 mr-1" size={20} />
              <span className="font-bold text-gray-800">{xp}</span>
            </div>

            {/* Coins */}
            <div className="flex items-center">
              <div className="w-5 h-5 bg-yellow-400 rounded-full mr-1 flex items-center justify-center">
                <div className="w-2 h-2 bg-yellow-600 rounded-full"></div>
              </div>
              <span className="font-bold text-gray-800">{coins}</span>
            </div>
          </div>
        </div>

        {/* Main Lesson Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Character Section */}
          <div className="lg:col-span-1">
            <motion.div 
              className="bg-white rounded-2xl p-6 shadow-lg border-2 border-gray-100 sticky top-4"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              {/* Character Image */}
              <div className="relative">
                <motion.img 
                  src={characterImage} 
                  alt="Learning Assistant" 
                  className="w-32 h-32 rounded-full mx-auto object-cover border-4 border-gradient-to-r from-blue-400 to-purple-400 shadow-lg"
                  animate={{ 
                    scale: showCelebration ? [1, 1.1, 1] : 1,
                    rotate: showCelebration ? [0, 5, -5, 0] : 0
                  }}
                  transition={{ duration: 0.5 }}
                />
                
                {/* Character Expression */}
                <motion.div 
                  className="absolute -top-2 -right-2 text-2xl"
                  animate={{ 
                    scale: isCorrect === true ? [1, 1.5, 1] : isCorrect === false ? [1, 0.8, 1] : 1
                  }}
                >
                  {isCorrect === true ? '😊' : isCorrect === false ? '😅' : '🤔'}
                </motion.div>
              </div>

              {/* Character Speech Bubble */}
              <motion.div 
                className="mt-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-4 relative"
                key={currentSlide}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="absolute -top-2 left-8 w-4 h-4 bg-blue-50 transform rotate-45 border-l border-t border-gray-200"></div>
                <p className="text-gray-700 text-sm leading-relaxed">
                  {showAnswer ? (
                    isCorrect ? getCharacterReaction('correct') : getCharacterReaction('wrong')
                  ) : (
                    currentQuestion.characterHint || "Let's learn something new together! Take your time to think about this question. 🤔"
                  )}
                </p>
              </motion.div>

              {/* Power-ups */}
              <div className="mt-6">
                <h4 className="text-sm font-semibold text-gray-600 mb-3">Power-ups</h4>
                <div className="space-y-2">
                  {Object.entries(powerUps).map(([key, count]) => (
                    <button
                      key={key}
                      onClick={() => usePowerUp(key)}
                      disabled={count === 0 || showAnswer}
                      className={`w-full flex items-center justify-between p-3 rounded-lg border-2 transition-all ${
                        count > 0 ? 'bg-white border-blue-200 hover:border-blue-400 hover:shadow-md' : 'bg-gray-100 border-gray-200 opacity-50'
                      }`}
                    >
                      <div className="flex items-center">
                        {key === 'skipQuestion' && <ArrowRight size={16} className="mr-2 text-blue-500" />}
                        {key === 'freezeTime' && <Clock size={16} className="mr-2 text-green-500" />}
                        {key === 'doubleXP' && <Zap size={16} className="mr-2 text-yellow-500" />}
                        <span className="text-sm font-medium">
                          {key === 'skipQuestion' && 'Skip Question'}
                          {key === 'freezeTime' && 'Freeze Time'}
                          {key === 'doubleXP' && 'Double XP'}
                        </span>
                      </div>
                      <span className="text-sm font-bold text-gray-600">{count}</span>
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>

          {/* Question Section */}
          <div className="lg:col-span-2">
            <motion.div 
              className="bg-white rounded-2xl p-8 shadow-lg border-2 border-gray-100 min-h-96"
              key={currentSlide}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              {/* Question Type Badge */}
              <div className="flex items-center justify-between mb-6">
                <div className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium text-white bg-gradient-to-r ${currentTheme.primary}`}>
                  <BookOpen size={16} className="mr-2" />
                  {currentQuestion.type || 'Multiple Choice'}
                </div>
                
                {currentQuestion.difficulty && (
                  <div className="flex items-center">
                    {Array.from({ length: 3 }).map((_, i) => (
                      <Star 
                        key={i} 
                        size={16} 
                        className={`${i < currentQuestion.difficulty ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
                      />
                    ))}
                  </div>
                )}
              </div>

              {/* Question Content */}
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-4 leading-relaxed">
                  {currentQuestion.question}
                </h2>
                
                {currentQuestion.context && (
                  <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-6">
                    <p className="text-blue-800 text-sm">
                      <Lightbulb size={16} className="inline mr-2" />
                      {currentQuestion.context}
                    </p>
                  </div>
                )}

                {currentQuestion.image && (
                  <div className="mb-6">
                    <img 
                      src={currentQuestion.image} 
                      alt="Question visual" 
                      className="w-full max-w-md mx-auto rounded-lg shadow-md"
                    />
                  </div>
                )}
              </div>

              {/* Answer Options */}
              <div className="space-y-4 mb-8">
                {currentQuestion.answers.map((answer, index) => (
                  <motion.button
                    key={index}
                    onClick={() => handleAnswerSelect(index)}
                    disabled={showAnswer}
                    className={`w-full p-4 rounded-xl border-2 text-left transition-all duration-300 ${
                      selectedAnswer === index
                        ? isCorrect === true
                          ? 'border-green-400 bg-green-50 text-green-800'
                          : isCorrect === false
                          ? 'border-red-400 bg-red-50 text-red-800'
                          : 'border-blue-400 bg-blue-50'
                        : showAnswer && index === currentQuestion.correctAnswer
                        ? 'border-green-400 bg-green-50 text-green-800'
                        : 'border-gray-200 bg-gray-50 hover:border-blue-300 hover:bg-blue-50'
                    }`}
                    whileHover={{ scale: showAnswer ? 1 : 1.02 }}
                    whileTap={{ scale: showAnswer ? 1 : 0.98 }}
                  >
                    <div className="flex items-center">
                      <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center mr-4 font-bold ${
                        selectedAnswer === index
                          ? isCorrect === true
                            ? 'border-green-400 bg-green-400 text-white'
                            : isCorrect === false
                            ? 'border-red-400 bg-red-400 text-white'
                            : 'border-blue-400 bg-blue-400 text-white'
                          : showAnswer && index === currentQuestion.correctAnswer
                          ? 'border-green-400 bg-green-400 text-white'
                          : 'border-gray-300'
                      }`}>
                        {String.fromCharCode(65 + index)}
                      </div>
                      <span className="flex-1 font-medium">{answer}</span>
                      {showAnswer && index === currentQuestion.correctAnswer && (
                        <CheckCircle className="text-green-500" size={24} />
                      )}
                      {showAnswer && selectedAnswer === index && isCorrect === false && (
                        <XCircle className="text-red-500" size={24} />
                      )}
                    </div>
                  </motion.button>
                ))}
              </div>

              {/* Explanation */}
              <AnimatePresence>
                {showAnswer && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className={`p-6 rounded-xl border-2 mb-6 ${
                      isCorrect ? 'border-green-300 bg-green-50' : 'border-blue-300 bg-blue-50'
                    }`}
                  >
                    <div className="flex items-start">
                      <div className={`p-2 rounded-full mr-4 ${
                        isCorrect ? 'bg-green-200' : 'bg-blue-200'
                      }`}>
                        {isCorrect ? <CheckCircle className="text-green-600" size={20} /> : <Lightbulb className="text-blue-600" size={20} />}
                      </div>
                      <div>
                        <h4 className={`font-bold mb-2 ${
                          isCorrect ? 'text-green-800' : 'text-blue-800'
                        }`}>
                          {isCorrect ? 'Excellent! Here\'s why:' : 'Let me explain:'}
                        </h4>
                        <p className={`text-sm leading-relaxed ${
                          isCorrect ? 'text-green-700' : 'text-blue-700'
                        }`}>
                          {currentQuestion.explanation}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Next Button */}
              <div className="flex justify-end">
                <AnimatePresence>
                  {showAnswer && (
                    <motion.button
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      onClick={handleNext}
                      className={`flex items-center px-8 py-4 rounded-xl font-bold text-white bg-gradient-to-r ${currentTheme.primary} hover:shadow-lg transition-all duration-300`}
                    >
                      {currentSlide < lessonData.slides.length - 1 ? (
                        <>
                          Next Question
                          <ArrowRight className="ml-2" size={20} />
                        </>
                      ) : (
                        <>
                          Complete Lesson
                          <Trophy className="ml-2" size={20} />
                        </>
                      )}
                    </motion.button>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Floating Rewards Animation */}
      <AnimatePresence>
        {showCelebration && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50"
          >
            <div className="bg-white rounded-2xl p-8 shadow-2xl border-4 border-yellow-400">
              <div className="text-center">
                <div className="text-6xl mb-4">🎉</div>
                <h3 className="text-2xl font-bold text-gray-800 mb-2">Amazing!</h3>
                <div className="flex items-center justify-center space-x-4 text-sm">
                  <div className="flex items-center">
                    <Star className="text-yellow-500 mr-1" size={16} />
                    <span>+10 XP</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-4 h-4 bg-yellow-400 rounded-full mr-1"></div>
                    <span>+5 coins</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Encouragement Modal */}
      <AnimatePresence>
        {showEncouragement && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="bg-white rounded-2xl p-8 max-w-md w-full text-center"
            >
              <div className="text-4xl mb-4">💪</div>
              <h3 className="text-xl font-bold text-gray-800 mb-4">Keep Going!</h3>
              <p className="text-gray-600 mb-6">{getCharacterReaction('encouragement')}</p>
              <button
                onClick={() => setShowEncouragement(false)}
                className={`px-6 py-3 rounded-xl font-bold text-white bg-gradient-to-r ${currentTheme.primary}`}
              >
                Continue Learning
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default GameifiedLesson;