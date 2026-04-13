import React, { useState } from 'react';
import GameifiedLesson from '../../components/gamified/GameifiedLesson';
import { motion } from 'framer-motion';
import { Trophy, Star, ArrowLeft, TrendingUp, CreditCard, Shield, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const CreditScoreGame = () => {
  const navigate = useNavigate();
  const [currentLesson, setCurrentLesson] = useState(0);
  const [completedLessons, setCompletedLessons] = useState([]);
  const [totalXP, setTotalXP] = useState(0);
  const [totalCoins, setTotalCoins] = useState(0);

  // Credit Score Lesson Data
  const creditScoreLessons = [
    {
      id: 1,
      title: "What is a Credit Score?",
      description: "Learn the fundamentals of credit scores and why they matter for your financial future",
      character: "/img3.jpg",
      slides: [
        {
          type: "Introduction",
          question: "What is a credit score?",
          characterHint: "Think of it as your financial report card! 📊✨",
          context: "Credit scores are used by lenders to determine how likely you are to repay borrowed money.",
          answers: [
            "A number that represents your investment portfolio value",
            "A three-digit number that reflects your creditworthiness",
            "Your annual income divided by your age",
            "The amount of money you have in your savings account"
          ],
          correctAnswer: 1,
          explanation: "A credit score is a three-digit number (typically 300-850) that represents how likely you are to repay borrowed money. It's like a financial report card that lenders use to decide whether to approve you for loans, credit cards, or mortgages!",
          difficulty: 1
        },
        {
          type: "Score Ranges",
          question: "Which credit score range is generally considered 'excellent'?",
          characterHint: "The higher the better! Excellent scores open doors to the best deals! 🌟",
          answers: [
            "300-579 (Poor)",
            "580-669 (Fair)",
            "670-739 (Good)",
            "740-850 (Excellent)"
          ],
          correctAnswer: 3,
          explanation: "A credit score of 740-850 is considered excellent! This range typically qualifies you for the best interest rates and loan terms. The higher your score, the more money you can save on interest!",
          difficulty: 2
        },
        {
          type: "Credit Bureaus",
          question: "How many major credit bureaus are there in the United States?",
          characterHint: "Remember the 'Big Three' - they each keep track of your credit history! 🏛️",
          context: "Credit bureaus collect and maintain credit information about consumers.",
          answers: [
            "One",
            "Two", 
            "Three",
            "Five"
          ],
          correctAnswer: 2,
          explanation: "There are three major credit bureaus in the US: Experian, Equifax, and TransUnion. Each one tracks your credit history independently, so your scores might vary slightly between them!",
          difficulty: 2
        },
        {
          type: "Why It Matters",
          question: "Which of the following is NOT typically affected by your credit score?",
          characterHint: "Credit scores affect many financial decisions, but not everything! 🤔",
          answers: [
            "Interest rates on loans and credit cards",
            "Approval for rental apartments",
            "Your ability to get a job (in some industries)",
            "The weather forecast for your city"
          ],
          correctAnswer: 3,
          explanation: "Credit scores don't affect the weather! 😄 But they do impact loan interest rates, rental applications, some job opportunities, insurance premiums, and even cell phone plans. A good credit score can save you thousands of dollars!",
          difficulty: 1
        },
        {
          type: "Building Credit",
          question: "What's the best way to start building credit if you have no credit history?",
          characterHint: "You need to start somewhere! Look for options designed for beginners! 💳",
          answers: [
            "Apply for multiple credit cards at once",
            "Take out a large personal loan",
            "Get a secured credit card or become an authorized user",
            "Avoid all credit products until you're 30"
          ],
          correctAnswer: 2,
          explanation: "A secured credit card (where you put down a deposit) or becoming an authorized user on someone else's account are great ways to start building credit. Start small and build responsibly!",
          difficulty: 2
        }
      ]
    },
    {
      id: 2,
      title: "Credit Score Factors",
      description: "Discover what factors influence your credit score and their relative importance",
      character: "/img4.jpg",
      slides: [
        {
          type: "Payment History",
          question: "Which factor has the BIGGEST impact on your credit score?",
          characterHint: "The most important thing is paying your bills on time, every time! ⏰💰",
          context: "Credit scores are calculated using five main factors, each with different weights.",
          answers: [
            "Length of credit history (15%)",
            "Payment history (35%)",
            "Credit utilization (30%)",
            "Types of credit used (10%)"
          ],
          correctAnswer: 1,
          explanation: "Payment history accounts for 35% of your credit score - making it the most important factor! Even one late payment can hurt your score, so always pay at least the minimum amount by the due date!",
          difficulty: 2
        },
        {
          type: "Credit Utilization",
          question: "What is the ideal credit utilization ratio?",
          characterHint: "Keep your balances low compared to your credit limits! Less is more! 📉",
          context: "Credit utilization is the percentage of available credit you're using.",
          answers: [
            "90-100% (maxing out your cards)",
            "50-60% (using about half)",
            "30% or lower (keeping balances low)",
            "It doesn't matter as long as you pay the minimum"
          ],
          correctAnswer: 2,
          explanation: "Keep your credit utilization below 30%, but ideally under 10%! If you have a $1,000 credit limit, try to keep your balance under $300. Low utilization shows you manage credit responsibly!",
          difficulty: 2
        },
        {
          type: "Length of History",
          question: "How does the length of your credit history affect your score?",
          characterHint: "Like fine wine, credit gets better with age! The longer the better! 🍷⏳",
          answers: [
            "It doesn't affect your score at all",
            "Only the newest accounts matter",
            "Longer credit history generally helps your score",
            "You should close old accounts to improve your score"
          ],
          correctAnswer: 2,
          explanation: "Longer credit history is generally better! It accounts for 15% of your score. Keep old accounts open (especially your first credit card) to maintain a longer average account age!",
          difficulty: 2
        },
        {
          type: "Credit Mix",
          question: "Which scenario shows the best 'credit mix'?",
          characterHint: "Having different types of credit shows you can manage various financial responsibilities! 🎭",
          answers: [
            "Only having multiple credit cards",
            "Having a mix of credit cards, a car loan, and a mortgage",
            "Only having student loans",
            "Having no credit accounts at all"
          ],
          correctAnswer: 1,
          explanation: "A diverse credit mix (credit cards, installment loans like car or mortgage) shows you can handle different types of credit. This accounts for 10% of your score, but don't take on debt just for the mix!",
          difficulty: 3
        },
        {
          type: "New Credit",
          question: "What happens when you apply for too many new credit accounts quickly?",
          characterHint: "Too many applications in a short time can make you look desperate for credit! 🚨",
          context: "New credit inquiries can temporarily lower your credit score.",
          answers: [
            "Your score will improve because you have more available credit",
            "Multiple hard inquiries can lower your score temporarily",
            "Nothing happens to your score",
            "Your score immediately increases by 50 points"
          ],
          correctAnswer: 1,
          explanation: "Multiple hard inquiries in a short period can lower your score temporarily and make you look risky to lenders. Space out credit applications and only apply when you really need new credit!",
          difficulty: 2
        }
      ]
    },
    {
      id: 3,
      title: "Improving Your Credit Score",
      description: "Learn practical strategies to boost your credit score and maintain good credit health",
      character: "/img5.jpg",
      slides: [
        {
          type: "Quick Wins",
          question: "Which action can improve your credit score the fastest?",
          characterHint: "Sometimes the biggest impact comes from fixing errors or paying down balances! ⚡",
          context: "Some credit improvement strategies work faster than others.",
          answers: [
            "Opening 5 new credit cards",
            "Paying down credit card balances to lower utilization",
            "Closing your oldest credit account",
            "Applying for a large personal loan"
          ],
          correctAnswer: 1,
          explanation: "Paying down balances to reduce credit utilization can improve your score within 1-2 billing cycles! This is often the fastest way to see improvement, especially if your utilization is currently high.",
          difficulty: 2
        },
        {
          type: "Dispute Errors",
          question: "What should you do if you find an error on your credit report?",
          characterHint: "Don't let errors drag down your score! You have the right to fix them! ✏️",
          answers: [
            "Ignore it - errors will fix themselves eventually",
            "Dispute the error with the credit bureau in writing",
            "Pay the incorrect debt to make it go away",
            "Close all your credit accounts and start over"
          ],
          correctAnswer: 1,
          explanation: "Always dispute errors in writing with the credit bureau! They have 30 days to investigate. Common errors include wrong payment history, accounts that aren't yours, or incorrect balances. It's free to dispute!",
          difficulty: 2
        },
        {
          type: "Payment Strategies",
          question: "What's the best payment strategy for credit cards?",
          characterHint: "Pay in full if you can, but at least pay on time! Timing matters too! 📅",
          answers: [
            "Only pay the minimum amount due each month",
            "Pay the full balance before the due date",
            "Skip payments during months when you're tight on money",
            "Pay randomly whenever you remember"
          ],
          correctAnswer: 1,
          explanation: "Pay your full balance before the due date to avoid interest charges and maintain excellent payment history! If you can't pay in full, always pay at least the minimum on time. Consider paying before the statement closes to lower reported utilization!",
          difficulty: 1
        },
        {
          type: "Credit Monitoring",
          question: "How often should you check your credit score and report?",
          characterHint: "Stay vigilant! Regular monitoring helps catch problems early! 👀",
          context: "Credit monitoring helps you stay aware of changes and potential fraud.",
          answers: [
            "Never - it will hurt your score to check",
            "Once every 10 years",
            "At least once a year, but monthly monitoring is better",
            "Only when applying for a loan"
          ],
          correctAnswer: 2,
          explanation: "Check your credit report at least annually (free at annualcreditreport.com) and monitor your score monthly if possible! Checking your own credit is a 'soft inquiry' that won't hurt your score. Stay vigilant for identity theft!",
          difficulty: 2
        },
        {
          type: "Advanced Strategies",
          question: "Which advanced strategy can help improve your credit utilization ratio?",
          characterHint: "Think about ways to make your balances look smaller compared to your limits! 🎯",
          answers: [
            "Request credit limit increases on existing cards",
            "Use cash for all purchases",
            "Pay your credit card bill multiple times per month",
            "All of the above"
          ],
          correctAnswer: 3,
          explanation: "All of these strategies help! Credit limit increases lower your utilization ratio. Using cash reduces balances. Paying multiple times per month keeps balances low when statements close. Smart credit management is about strategy!",
          difficulty: 3
        }
      ]
    },
    {
      id: 4,
      title: "Credit Myths & Mistakes",
      description: "Debunk common credit myths and learn to avoid costly credit mistakes",
      character: "/av.jpg",
      slides: [
        {
          type: "Common Myths",
          question: "Which statement about credit scores is a MYTH?",
          characterHint: "Don't believe everything you hear! Let's separate fact from fiction! 🕵️",
          context: "There are many misconceptions about how credit scores work.",
          answers: [
            "Checking your own credit score hurts your score",
            "Payment history is the most important factor",
            "Credit utilization should be kept low",
            "Length of credit history matters"
          ],
          correctAnswer: 0,
          explanation: "MYTH! Checking your own credit score is a 'soft inquiry' that doesn't hurt your score at all! You can check as often as you want. Only 'hard inquiries' from lenders when you apply for credit can temporarily lower your score.",
          difficulty: 2
        },
        {
          type: "Closing Accounts",
          question: "What usually happens when you close a credit card account?",
          characterHint: "Closing accounts can backfire! Think about how it affects your available credit! ⚠️",
          answers: [
            "Your credit score automatically improves",
            "Your credit utilization ratio may increase, potentially lowering your score",
            "Nothing happens to your credit score",
            "Your credit history is erased"
          ],
          correctAnswer: 1,
          explanation: "Closing accounts can hurt your score! It reduces your total available credit, which can increase your utilization ratio. Keep old accounts open, especially your first credit card, unless there's an annual fee you can't justify.",
          difficulty: 3
        },
        {
          type: "Credit Repair Scams",
          question: "Which is a red flag for a credit repair scam?",
          characterHint: "If it sounds too good to be true, it probably is! Watch out for false promises! 🚩",
          answers: [
            "They guarantee to remove all negative items from your credit report",
            "They ask for payment upfront before doing any work",
            "They tell you not to contact credit bureaus directly",
            "All of the above"
          ],
          correctAnswer: 3,
          explanation: "All of these are red flags! Legitimate negative information can't be removed, you can dispute errors yourself for free, and reputable companies don't require full payment upfront. Be wary of 'credit repair' companies making impossible promises!",
          difficulty: 2
        },
        {
          type: "Student Loans",
          question: "How do student loans typically affect your credit score?",
          characterHint: "Student loans are installment loans that can help build credit if managed well! 🎓",
          context: "Student loans are often people's first experience with credit.",
          answers: [
            "Student loans don't appear on credit reports",
            "They can help build positive credit history if payments are made on time",
            "They automatically hurt your credit score",
            "Only private student loans affect credit scores"
          ],
          correctAnswer: 1,
          explanation: "Student loans can help build credit if you make payments on time! They add to your credit mix and payment history. Both federal and private student loans appear on credit reports. Just don't miss payments!",
          difficulty: 2
        },
        {
          type: "Marriage & Credit",
          question: "What happens to credit scores when you get married?",
          characterHint: "Marriage doesn't merge credit scores, but it can affect future applications! 👰🤵",
          answers: [
            "Your credit scores automatically merge into one joint score",
            "Your scores remain separate, but joint applications consider both scores",
            "The person with the lower score adopts the higher score",
            "You must close all individual accounts and start over"
          ],
          correctAnswer: 1,
          explanation: "Credit scores don't merge when you marry! Each person keeps their individual credit report and score. However, when applying for joint accounts or loans, both scores may be considered. Choose who applies based on who has the better credit!",
          difficulty: 2
        }
      ]
    }
  ];

  const handleLessonComplete = (lessonResults) => {
    setTotalXP(prev => prev + lessonResults.xp);
    setTotalCoins(prev => prev + lessonResults.coins);
    setCompletedLessons(prev => [...prev, currentLesson]);
    
    if (currentLesson < creditScoreLessons.length - 1) {
      setCurrentLesson(prev => prev + 1);
    } else {
      showModuleCompletion();
    }
  };

  const showModuleCompletion = () => {
    alert(`🎉 Congratulations! You've mastered Credit Score Fundamentals!\n\nTotal XP: ${totalXP}\nTotal Coins: ${totalCoins}`);
  };

  if (currentLesson < creditScoreLessons.length) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50">
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
                  <CreditCard className="text-purple-600 mr-3" size={28} />
                  <div>
                    <h1 className="text-xl font-bold text-gray-800">Credit Score Mastery</h1>
                    <p className="text-sm text-gray-600">Master your credit and unlock financial opportunities</p>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">{totalXP}</div>
                  <div className="text-xs text-gray-500">Total XP</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-yellow-600">{totalCoins}</div>
                  <div className="text-xs text-gray-500">Coins</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{completedLessons.length}</div>
                  <div className="text-xs text-gray-500">Lessons</div>
                </div>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mt-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-600">
                  Lesson {currentLesson + 1} of {creditScoreLessons.length}: {creditScoreLessons[currentLesson].title}
                </span>
                <span className="text-sm text-gray-500">
                  {Math.round(((currentLesson + 1) / creditScoreLessons.length) * 100)}% Complete
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <motion.div
                  className="h-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${((currentLesson + 1) / creditScoreLessons.length) * 100}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Lesson Content */}
        <GameifiedLesson
          lessonData={creditScoreLessons[currentLesson]}
          onLessonComplete={handleLessonComplete}
          characterImage={creditScoreLessons[currentLesson].character}
          theme="credit"
        />
      </div>
    );
  }

  // Module Completion Screen
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50 flex items-center justify-center p-4">
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
          💳
        </motion.div>
        
        <h1 className="text-4xl font-bold text-gray-800 mb-4">
          Credit Score Mastery Complete!
        </h1>
        
        <p className="text-xl text-gray-600 mb-8">
          Amazing work! You now understand how to build and maintain excellent credit.
        </p>

        <div className="grid grid-cols-3 gap-6 mb-8">
          <div className="bg-purple-50 rounded-xl p-4">
            <Star className="text-purple-500 mx-auto mb-2" size={32} />
            <div className="text-2xl font-bold text-purple-600">{totalXP}</div>
            <div className="text-sm text-purple-700">XP Earned</div>
          </div>
          <div className="bg-yellow-50 rounded-xl p-4">
            <Shield className="text-yellow-500 mx-auto mb-2" size={32} />
            <div className="text-2xl font-bold text-yellow-600">{totalCoins}</div>
            <div className="text-sm text-yellow-700">Coins Earned</div>
          </div>
          <div className="bg-green-50 rounded-xl p-4">
            <Trophy className="text-green-500 mx-auto mb-2" size={32} />
            <div className="text-2xl font-bold text-green-600">{creditScoreLessons.length}</div>
            <div className="text-sm text-green-700">Lessons Completed</div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-xl p-6 mb-8">
          <h3 className="text-lg font-bold text-purple-800 mb-4">🎉 You've Unlocked:</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="flex items-center text-purple-700">
              <TrendingUp size={16} className="mr-2" />
              Credit Score Improvement Strategies
            </div>
            <div className="flex items-center text-purple-700">
              <AlertCircle size={16} className="mr-2" />
              Myth-Busting Knowledge
            </div>
            <div className="flex items-center text-purple-700">
              <Shield size={16} className="mr-2" />
              Fraud Protection Skills
            </div>
            <div className="flex items-center text-purple-700">
              <CreditCard size={16} className="mr-2" />
              Smart Credit Management
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <button
            onClick={() => navigate('/finlit')}
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold py-4 px-8 rounded-xl hover:shadow-lg transition-all duration-300"
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

export default CreditScoreGame;