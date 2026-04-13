import React, { useState } from 'react';
import GameifiedLesson from '../../components/gamified/GameifiedLesson';
import { motion } from 'framer-motion';
import { Trophy, Star, ArrowLeft, Shield, Umbrella, PiggyBank, AlertTriangle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const EmergencyFundGame = () => {
  const navigate = useNavigate();
  const [currentLesson, setCurrentLesson] = useState(0);
  const [completedLessons, setCompletedLessons] = useState([]);
  const [totalXP, setTotalXP] = useState(0);
  const [totalCoins, setTotalCoins] = useState(0);

  // Emergency Fund Lesson Data
  const emergencyFundLessons = [
    {
      id: 1,
      title: "Emergency Fund Basics",
      description: "Learn why emergency funds are crucial for financial security and peace of mind",
      character: "/img2.jpg",
      slides: [
        {
          type: "Introduction",
          question: "What is an emergency fund?",
          characterHint: "Think of it as your financial safety net for when life throws you curveballs! ⚾🛡️",
          context: "Emergency funds provide financial security during unexpected life events.",
          answers: [
            "Money saved for vacation trips and fun activities",
            "A separate savings account for unexpected expenses and emergencies",
            "Investment money in the stock market",
            "Money borrowed from friends and family"
          ],
          correctAnswer: 1,
          explanation: "An emergency fund is money set aside specifically for unexpected expenses like job loss, medical bills, car repairs, or home maintenance. It's your financial safety net that prevents you from going into debt when life happens!",
          difficulty: 1
        },
        {
          type: "Purpose",
          question: "Which situation would be appropriate to use your emergency fund?",
          characterHint: "Real emergencies are unexpected and necessary, not wants or planned expenses! 🚨",
          answers: [
            "Your car breaks down and needs a $800 repair",
            "A new gaming console goes on sale",
            "You want to take a spontaneous vacation",
            "Your friend is selling their bike at a good price"
          ],
          correctAnswer: 0,
          explanation: "A car repair is a perfect example of an emergency fund use! It's unexpected, necessary, and would disrupt your budget. Emergency funds are for needs, not wants or planned purchases.",
          difficulty: 2
        },
        {
          type: "Why Important",
          question: "What's the main benefit of having an emergency fund?",
          characterHint: "It's about avoiding debt and having peace of mind! Sleep better at night! 😴✨",
          context: "Emergency funds provide both financial and psychological benefits.",
          answers: [
            "To get higher interest rates than checking accounts",
            "To avoid going into debt when unexpected expenses arise",
            "To impress friends with how much money you have saved",
            "To have spending money for impulse purchases"
          ],
          correctAnswer: 1,
          explanation: "The main benefit is avoiding debt! Without an emergency fund, unexpected expenses often go on credit cards or require loans, creating expensive debt. An emergency fund keeps you financially stable and stress-free!",
          difficulty: 1
        },
        {
          type: "Common Emergencies",
          question: "Which of these is the most expensive emergency Americans typically face?",
          characterHint: "Healthcare costs can be shocking without insurance coverage! 🏥💰",
          answers: [
            "Car repairs ($500-2,000)",
            "Home maintenance ($200-1,500)",
            "Medical emergencies ($1,000-50,000+)",
            "Pet emergencies ($300-5,000)"
          ],
          correctAnswer: 2,
          explanation: "Medical emergencies can be the most expensive! Even with insurance, deductibles, co-pays, and uncovered treatments can cost thousands. This is why having 3-6 months of expenses saved is so important!",
          difficulty: 2
        },
        {
          type: "Getting Started",
          question: "If you're just starting to build an emergency fund, what should be your first goal?",
          characterHint: "Start small and build momentum! Every journey begins with a single step! 👣",
          answers: [
            "Save $10,000 immediately",
            "Save $1,000 as a starter emergency fund",
            "Save 6 months of expenses right away",
            "Don't start until you can save the full amount"
          ],
          correctAnswer: 1,
          explanation: "Start with $1,000! This covers most small emergencies and builds the savings habit. Once you have $1,000, work toward 3-6 months of expenses. Starting small makes the goal achievable and builds momentum!",
          difficulty: 1
        }
      ]
    },
    {
      id: 2,
      title: "How Much to Save",
      description: "Learn how to calculate the right emergency fund size for your personal situation",
      character: "/img3.jpg",
      slides: [
        {
          type: "General Rule",
          question: "What's the general recommendation for emergency fund size?",
          characterHint: "Think about how long you could survive without income! Most experts agree on a range! 📅💰",
          context: "Emergency fund size depends on your personal circumstances and risk tolerance.",
          answers: [
            "1-2 weeks of expenses",
            "1-2 months of expenses",
            "3-6 months of expenses",
            "12 months of expenses"
          ],
          correctAnswer: 2,
          explanation: "Most financial experts recommend 3-6 months of living expenses! This covers most emergency situations like job loss or major health issues. The exact amount depends on your job security, family situation, and comfort level.",
          difficulty: 1
        },
        {
          type: "Personal Factors",
          question: "Who should lean toward having 6+ months of expenses saved?",
          characterHint: "Some people face more uncertainty in their income or have higher responsibilities! 🎯",
          answers: [
            "Single people with stable government jobs",
            "Freelancers, contractors, or people with variable income",
            "Students living with parents",
            "People with no debt and high savings rates"
          ],
          correctAnswer: 1,
          explanation: "People with variable or uncertain income should save more! Freelancers, contractors, commission-based workers, and small business owners face more income volatility and should aim for 6-12 months of expenses.",
          difficulty: 2
        },
        {
          type: "Calculating Expenses",
          question: "When calculating emergency fund needs, which expenses should you include?",
          characterHint: "Focus on what you absolutely need to survive, not your fun money! 🏠🍽️",
          context: "Your emergency fund should cover essential living expenses, not discretionary spending.",
          answers: [
            "Only rent and food",
            "Essential expenses: housing, utilities, food, transportation, minimum debt payments",
            "All current expenses including entertainment and dining out",
            "Just housing costs since other expenses can be eliminated"
          ],
          correctAnswer: 1,
          explanation: "Include all essential expenses you can't eliminate: housing, utilities, food, transportation, insurance, minimum debt payments, and basic healthcare. Skip discretionary spending like entertainment - you can cut those in an emergency!",
          difficulty: 2
        },
        {
          type: "Monthly Calculation",
          question: "If your essential monthly expenses are $3,000, how much should your emergency fund be?",
          characterHint: "Multiply by the number of months you want to cover! Simple math! 🧮",
          answers: [
            "$3,000 (1 month)",
            "$6,000 (2 months)",
            "$9,000-18,000 (3-6 months)",
            "$36,000 (12 months)"
          ],
          correctAnswer: 2,
          explanation: "For $3,000 in monthly expenses, aim for $9,000-18,000! This gives you 3-6 months of coverage. Start with 3 months ($9,000) and work up to 6 months ($18,000) based on your situation.",
          difficulty: 1
        },
        {
          type: "Adjusting Over Time",
          question: "When should you update your emergency fund target amount?",
          characterHint: "Life changes, and so should your emergency fund! Stay current! 🔄",
          answers: [
            "Never - set it once and forget it",
            "Only when you change jobs",
            "When major life changes occur (marriage, kids, new home, etc.)",
            "Every 10 years whether you need to or not"
          ],
          correctAnswer: 2,
          explanation: "Update your emergency fund when life changes! New job, marriage, kids, buying a home, or changes in expenses all affect how much you need. Review annually and adjust as needed to stay protected!",
          difficulty: 2
        }
      ]
    },
    {
      id: 3,
      title: "Building Your Emergency Fund",
      description: "Discover practical strategies to build your emergency fund faster and more efficiently",
      character: "/img4.jpg",
      slides: [
        {
          type: "Getting Started",
          question: "What's the best first step to start building an emergency fund?",
          characterHint: "Make it automatic so you don't have to think about it! Set it and forget it! 🤖💰",
          context: "Automation makes saving easier and more consistent.",
          answers: [
            "Wait until you have extra money left over each month",
            "Set up automatic transfers to a separate savings account",
            "Keep emergency money in your checking account",
            "Only save money during months when you get bonuses"
          ],
          correctAnswer: 1,
          explanation: "Automate it! Set up automatic transfers to a separate savings account right after payday. Even $25-50 per paycheck adds up quickly. Automation makes saving effortless and ensures it happens consistently!",
          difficulty: 1
        },
        {
          type: "Finding Money",
          question: "Which strategy can help you find money to fund your emergency savings?",
          characterHint: "Look for money you're already spending that you might not need! 🔍💡",
          answers: [
            "Cancel or reduce subscription services you rarely use",
            "Cook at home more often instead of eating out",
            "Use windfalls like tax refunds or bonuses",
            "All of the above"
          ],
          correctAnswer: 3,
          explanation: "All of these strategies work! Small changes like canceling unused subscriptions, cooking more meals at home, and directing windfalls to savings can significantly accelerate your emergency fund building!",
          difficulty: 2
        },
        {
          type: "Where to Keep It",
          question: "Where should you keep your emergency fund?",
          characterHint: "You need easy access but also want it to earn something! Think liquid and safe! 💧🏦",
          context: "Emergency funds need to be accessible but separate from daily spending money.",
          answers: [
            "Invested in risky stocks for higher returns",
            "In a high-yield savings account or money market account",
            "Hidden as cash under your mattress",
            "In a retirement account where you can't touch it"
          ],
          correctAnswer: 1,
          explanation: "Keep it in a high-yield savings account or money market account! You want it to be easily accessible, FDIC insured, and earning some interest. Avoid investments (too risky) or cash at home (no growth, security risk).",
          difficulty: 2
        },
        {
          type: "Building Speed",
          question: "What can help you build your emergency fund faster?",
          characterHint: "Think about increasing income or decreasing expenses temporarily! Sprint to the finish! 🏃‍♀️💨",
          answers: [
            "Taking on a temporary side hustle or freelance work",
            "Having a garage sale or selling items you don't need",
            "Using the snowball method: save aggressively for a short period",
            "All of the above"
          ],
          correctAnswer: 3,
          explanation: "All of these accelerate your savings! Side hustles boost income, selling unused items provides immediate cash, and intense saving periods can build momentum. The faster you build it, the sooner you have peace of mind!",
          difficulty: 2
        },
        {
          type: "Staying Motivated",
          question: "How can you stay motivated while building your emergency fund?",
          characterHint: "Track your progress and celebrate milestones! Make it a game! 🎮🏆",
          answers: [
            "Track your progress and celebrate milestones",
            "Visualize how the fund will protect you from stress",
            "Start with small, achievable goals",
            "All of the above"
          ],
          correctAnswer: 3,
          explanation: "All of these help maintain motivation! Track progress visually, celebrate reaching $500, $1,000, etc. Imagine the peace of mind you'll have. Start small to build confidence. Saving is easier when you can see the progress!",
          difficulty: 1
        }
      ]
    },
    {
      id: 4,
      title: "Using and Managing Your Emergency Fund",
      description: "Learn when and how to use your emergency fund, and how to replenish it afterward",
      character: "/img5.jpg",
      slides: [
        {
          type: "When to Use",
          question: "Which situation is NOT appropriate for using your emergency fund?",
          characterHint: "Emergency funds are for true emergencies, not opportunities or wants! 🚨❌",
          context: "It's important to distinguish between true emergencies and other expenses.",
          answers: [
            "Your employer announces layoffs and you lose your job",
            "Your refrigerator breaks and all your food is spoiling",
            "Your dream vacation destination has a limited-time 50% off deal",
            "You need emergency dental work after an accident"
          ],
          correctAnswer: 2,
          explanation: "A vacation deal is NOT an emergency! Even at 50% off, it's a want, not a need. True emergencies are unexpected, necessary, and can't be delayed. Save vacation money separately from your emergency fund!",
          difficulty: 2
        },
        {
          type: "Decision Framework",
          question: "Before using your emergency fund, what question should you ask yourself?",
          characterHint: "Think about whether this expense is truly unexpected and unavoidable! 🤔",
          answers: [
            "Will this purchase make me happy?",
            "Is this an unexpected, necessary expense that I can't cover with my regular budget?",
            "Can I get a good deal on this purchase?",
            "Do I have enough money in my emergency fund to afford this?"
          ],
          correctAnswer: 1,
          explanation: "Ask: 'Is this unexpected, necessary, and can't be covered by my regular budget?' If yes to all three, it's likely a true emergency. If you can wait, plan for it, or it's a want rather than a need, find another way to pay!",
          difficulty: 2
        },
        {
          type: "Replenishing",
          question: "What should you do immediately after using your emergency fund?",
          characterHint: "Don't leave yourself unprotected! Get back to full protection ASAP! 🔄🛡️",
          answers: [
            "Nothing - you can deal with it later",
            "Start replenishing it immediately with your next paycheck",
            "Wait until you feel like saving again",
            "Use it for other expenses since it's already depleted"
          ],
          correctAnswer: 1,
          explanation: "Start replenishing immediately! You're vulnerable without a full emergency fund. Make rebuilding it your top financial priority until it's back to your target amount. Don't let yourself stay unprotected!",
          difficulty: 1
        },
        {
          type: "Avoiding Temptation",
          question: "How can you avoid the temptation to use your emergency fund for non-emergencies?",
          characterHint: "Make it a little harder to access and remember why you're saving! 🔐💭",
          answers: [
            "Keep it at a different bank from your checking account",
            "Don't link it to your debit card or online banking",
            "Remember your 'why' - the peace of mind it provides",
            "All of the above"
          ],
          correctAnswer: 3,
          explanation: "All of these strategies help! Keep it at a different bank, don't make it too easy to access, and regularly remind yourself why you're saving. A little friction prevents impulse decisions you'll regret later!",
          difficulty: 2
        },
        {
          type: "Growing Over Time",
          question: "As your income increases, what should you do with your emergency fund?",
          characterHint: "Your expenses probably increased too, so your safety net should grow accordingly! 📈",
          answers: [
            "Keep the same dollar amount forever",
            "Invest it all in the stock market for higher returns",
            "Increase it to maintain 3-6 months of your new expense level",
            "Spend it since you're earning more money now"
          ],
          correctAnswer: 2,
          explanation: "Update it to match your new lifestyle! If you earn more, you probably spend more too. Recalculate your monthly essential expenses and adjust your emergency fund target accordingly. Stay protected at your new income level!",
          difficulty: 2
        }
      ]
    }
  ];

  const handleLessonComplete = (lessonResults) => {
    setTotalXP(prev => prev + lessonResults.xp);
    setTotalCoins(prev => prev + lessonResults.coins);
    setCompletedLessons(prev => [...prev, currentLesson]);
    
    if (currentLesson < emergencyFundLessons.length - 1) {
      setCurrentLesson(prev => prev + 1);
    } else {
      showModuleCompletion();
    }
  };

  const showModuleCompletion = () => {
    alert(`🎉 Congratulations! You've mastered Emergency Fund Planning!\n\nTotal XP: ${totalXP}\nTotal Coins: ${totalCoins}`);
  };

  if (currentLesson < emergencyFundLessons.length) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-teal-50">
        {/* Header */}
        <div className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <button
                  onClick={() => navigate('/finlit')}
                  className="flex items-center text-gray-600 hover:text-gray-800 transition-colors mr-4"
                >
                  <ArrowLeft size={20} className="mr-2" />
                  Back to Modules
                </button>
                <div className="flex items-center">
                  <Shield className="text-green-600 mr-3" size={28} />
                  <div>
                    <h1 className="text-xl font-bold text-gray-800">Emergency Fund Mastery</h1>
                    <p className="text-sm text-gray-600">Build your financial safety net and peace of mind</p>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{totalXP}</div>
                  <div className="text-xs text-gray-500">Total XP</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-yellow-600">{totalCoins}</div>
                  <div className="text-xs text-gray-500">Coins</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{completedLessons.length}</div>
                  <div className="text-xs text-gray-500">Lessons</div>
                </div>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mt-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-600">
                  Lesson {currentLesson + 1} of {emergencyFundLessons.length}: {emergencyFundLessons[currentLesson].title}
                </span>
                <span className="text-sm text-gray-500">
                  {Math.round(((currentLesson + 1) / emergencyFundLessons.length) * 100)}% Complete
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <motion.div
                  className="h-2 bg-gradient-to-r from-green-500 to-blue-500 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${((currentLesson + 1) / emergencyFundLessons.length) * 100}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Lesson Content */}
        <GameifiedLesson
          lessonData={emergencyFundLessons[currentLesson]}
          onLessonComplete={handleLessonComplete}
          characterImage={emergencyFundLessons[currentLesson].character}
          theme="emergency"
        />
      </div>
    );
  }

  // Module Completion Screen
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-teal-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-2xl mx-auto bg-white rounded-3xl shadow-2xl p-12 text-center"
      >
        <motion.div
          animate={{ rotate: [0, 5, -5, 0] }}
          transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
          className="text-8xl mb-6"
        >
          🛡️
        </motion.div>
        
        <h1 className="text-4xl font-bold text-gray-800 mb-4">
          Emergency Fund Mastery Complete!
        </h1>
        
        <p className="text-xl text-gray-600 mb-8">
          Outstanding! You now know how to build and manage a rock-solid emergency fund.
        </p>

        <div className="grid grid-cols-3 gap-6 mb-8">
          <div className="bg-green-50 rounded-xl p-4">
            <Star className="text-green-500 mx-auto mb-2" size={32} />
            <div className="text-2xl font-bold text-green-600">{totalXP}</div>
            <div className="text-sm text-green-700">XP Earned</div>
          </div>
          <div className="bg-yellow-50 rounded-xl p-4">
            <PiggyBank className="text-yellow-500 mx-auto mb-2" size={32} />
            <div className="text-2xl font-bold text-yellow-600">{totalCoins}</div>
            <div className="text-sm text-yellow-700">Coins Earned</div>
          </div>
          <div className="bg-blue-50 rounded-xl p-4">
            <Trophy className="text-blue-500 mx-auto mb-2" size={32} />
            <div className="text-2xl font-bold text-blue-600">{emergencyFundLessons.length}</div>
            <div className="text-sm text-blue-700">Lessons Completed</div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-green-100 to-blue-100 rounded-xl p-6 mb-8">
          <h3 className="text-lg font-bold text-green-800 mb-4">🎉 Your Financial Safety Net Skills:</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="flex items-center text-green-700">
              <Shield size={16} className="mr-2" />
              Emergency Fund Fundamentals
            </div>
            <div className="flex items-center text-green-700">
              <PiggyBank size={16} className="mr-2" />
              Smart Saving Strategies
            </div>
            <div className="flex items-center text-green-700">
              <Umbrella size={16} className="mr-2" />
              Protection Planning
            </div>
            <div className="flex items-center text-green-700">
              <AlertTriangle size={16} className="mr-2" />
              Emergency Decision Making
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <button
            onClick={() => navigate('/finlit')}
            className="w-full bg-gradient-to-r from-green-600 to-blue-600 text-white font-bold py-4 px-8 rounded-xl hover:shadow-lg transition-all duration-300"
          >
            Continue to Next Module
          </button>
          <button
            onClick={() => window.location.reload()}
            className="w-full border-2 border-gray-300 text-gray-700 font-semibold py-3 px-8 rounded-xl hover:border-gray-400 transition-colors"
          >
            Review Lessons
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default EmergencyFundGame;