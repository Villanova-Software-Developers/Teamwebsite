import React, { useState } from 'react';
import GameifiedLesson from '../../components/gamified/GameifiedLesson';
import { motion } from 'framer-motion';
import { Trophy, Star, ArrowLeft, TrendingUp, DollarSign, Building, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const InvestmentBankingGame = () => {
  const navigate = useNavigate();
  const [currentLesson, setCurrentLesson] = useState(0);
  const [completedLessons, setCompletedLessons] = useState([]);
  const [totalXP, setTotalXP] = useState(0);
  const [totalCoins, setTotalCoins] = useState(0);

  // Investment Banking Lesson Data
  const investmentBankingLessons = [
    {
      id: 1,
      title: "What is Investment Banking?",
      description: "Learn the fundamentals of investment banking and its role in the financial world",
      character: "/img2.jpg",
      slides: [
        {
          type: "Introduction",
          question: "What is the primary role of investment banks?",
          characterHint: "Think about how big companies get money for growth! 🏦💡",
          context: "Investment banks are financial institutions that help companies and governments raise capital and provide various financial services.",
          answers: [
            "Accepting deposits from regular customers like a traditional bank",
            "Helping companies raise money through stock and bond offerings",
            "Providing personal loans to individuals",
            "Managing retirement accounts for employees"
          ],
          correctAnswer: 1,
          explanation: "Investment banks primarily help companies raise capital by underwriting and selling securities like stocks and bonds. They're different from commercial banks that take deposits!",
          difficulty: 1
        },
        {
          type: "Core Services",
          question: "Which service is NOT typically provided by investment banks?",
          characterHint: "Investment banks work with big corporations, not everyday banking! 🏢",
          answers: [
            "Mergers and acquisitions advisory",
            "Initial Public Offerings (IPOs)",
            "Checking and savings accounts for individuals",
            "Corporate restructuring advice"
          ],
          correctAnswer: 2,
          explanation: "Investment banks don't provide traditional banking services like checking accounts. They focus on complex financial transactions for corporations and institutions!",
          difficulty: 2
        },
        {
          type: "IPO Process",
          question: "What does IPO stand for and what does it mean?",
          characterHint: "When a private company wants to sell shares to the public for the first time! 📈",
          context: "An IPO is a major milestone for companies, transforming them from private to publicly traded entities.",
          answers: [
            "Initial Public Offering - when a company sells stocks to the public for the first time",
            "Internal Profit Organization - a company's internal financial structure",
            "International Purchase Order - buying goods from other countries",
            "Investment Portfolio Option - a type of investment strategy"
          ],
          correctAnswer: 0,
          explanation: "IPO stands for Initial Public Offering! It's when a private company sells shares to the public for the first time, often with help from investment banks. This is how companies like Facebook and Google went public!",
          difficulty: 2
        },
        {
          type: "M&A Basics",
          question: "In investment banking, what does M&A stand for?",
          characterHint: "When companies join together or one buys another! 🤝",
          answers: [
            "Money and Assets",
            "Markets and Analysis",
            "Mergers and Acquisitions",
            "Management and Administration"
          ],
          correctAnswer: 2,
          explanation: "M&A stands for Mergers and Acquisitions! This is when companies combine (merger) or one company buys another (acquisition). Investment banks help facilitate these complex deals!",
          difficulty: 1
        },
        {
          type: "Revenue Sources",
          question: "How do investment banks primarily make money?",
          characterHint: "They charge fees for their expert advice and services! 💰",
          answers: [
            "Interest on loans like traditional banks",
            "Fees from advisory services and underwriting",
            "Rent from office buildings",
            "Selling insurance products"
          ],
          correctAnswer: 1,
          explanation: "Investment banks make money through fees! They charge companies for services like helping with IPOs, providing M&A advice, and underwriting securities. No deposits or loans involved!",
          difficulty: 2
        }
      ]
    },
    {
      id: 2,
      title: "Investment Banking Divisions",
      description: "Explore the different divisions and career paths within investment banks",
      character: "/img3.jpg",
      slides: [
        {
          type: "Front Office",
          question: "Which division of an investment bank directly works with clients and generates revenue?",
          characterHint: "Think about the people who meet with clients and make deals happen! 💼",
          context: "Investment banks are typically divided into Front Office, Middle Office, and Back Office divisions.",
          answers: [
            "Back Office - Operations and settlements",
            "Middle Office - Risk management and compliance", 
            "Front Office - Sales, trading, and advisory",
            "Human Resources - Recruiting and training"
          ],
          correctAnswer: 2,
          explanation: "The Front Office includes Investment Banking Division (IBD), Sales & Trading, and Research. These are the revenue-generating divisions that work directly with clients!",
          difficulty: 2
        },
        {
          type: "IBD Role",
          question: "What is the main focus of the Investment Banking Division (IBD)?",
          characterHint: "They help companies with big financial decisions and transactions! 🎯",
          answers: [
            "Day trading stocks for quick profits",
            "Providing advisory services for M&A, IPOs, and capital raising",
            "Managing the bank's own investments",
            "Processing daily transactions and settlements"
          ],
          correctAnswer: 1,
          explanation: "IBD focuses on advisory services! They help companies with major transactions like mergers, acquisitions, going public (IPOs), and raising capital through debt or equity.",
          difficulty: 2
        },
        {
          type: "Sales & Trading",
          question: "What does the Sales & Trading division do?",
          characterHint: "They help clients buy and sell securities in the financial markets! 📊",
          answers: [
            "Audit company financial statements",
            "Buy and sell securities for clients and the bank",
            "Manage employee retirement plans",
            "Design marketing campaigns for bank services"
          ],
          correctAnswer: 1,
          explanation: "Sales & Trading facilitates buying and selling of securities! Salespeople work with institutional clients, while traders execute trades and manage market risk.",
          difficulty: 2
        },
        {
          type: "Career Paths",
          question: "What is typically the entry-level position for someone starting in Investment Banking?",
          characterHint: "Everyone starts somewhere! It's the first step on the ladder! 🪜",
          answers: [
            "Managing Director",
            "Vice President", 
            "Analyst",
            "Senior Associate"
          ],
          correctAnswer: 2,
          explanation: "Analyst is the entry-level position! The typical hierarchy is: Analyst → Associate → Vice President → Director → Managing Director. Fresh graduates usually start as Analysts!",
          difficulty: 1
        },
        {
          type: "Skills Required",
          question: "Which skill is most crucial for success in investment banking?",
          characterHint: "You need to understand numbers and financial statements really well! 🧮",
          answers: [
            "Creative writing and storytelling",
            "Financial modeling and analytical thinking",
            "Social media marketing",
            "Computer programming"
          ],
          correctAnswer: 1,
          explanation: "Financial modeling and analytical skills are essential! Investment bankers need to analyze companies, build complex financial models, and provide data-driven recommendations to clients.",
          difficulty: 2
        }
      ]
    },
    {
      id: 3,
      title: "Financial Markets & Valuation",
      description: "Learn how investment banks value companies and understand market dynamics",
      character: "/img4.jpg",
      slides: [
        {
          type: "Valuation Methods",
          question: "Which is a common method investment banks use to value companies?",
          characterHint: "Think about comparing similar companies or looking at cash flows! 💰",
          context: "Valuation is crucial when advising on M&A deals, IPOs, or any major financial transaction.",
          answers: [
            "Comparable Company Analysis (Trading Comps)",
            "Counting the number of employees",
            "Measuring office space square footage",
            "Looking at social media followers"
          ],
          correctAnswer: 0,
          explanation: "Comparable Company Analysis is a key valuation method! Investment bankers compare similar public companies' trading multiples to value their client's company. It's like comparing house prices in a neighborhood!",
          difficulty: 2
        },
        {
          type: "DCF Model",
          question: "What does DCF stand for in valuation?",
          characterHint: "It's about predicting future cash flows and bringing them to today's value! 🔮",
          answers: [
            "Direct Cash Flow",
            "Discounted Cash Flow", 
            "Dynamic Capital Framework",
            "Debt Coverage Factor"
          ],
          correctAnswer: 1,
          explanation: "DCF stands for Discounted Cash Flow! It values a company based on its projected future cash flows, discounted back to present value. It's like asking 'What is future money worth today?'",
          difficulty: 3
        },
        {
          type: "Market Capitalization",
          question: "How do you calculate a company's market capitalization?",
          characterHint: "Multiply the stock price by the total number of shares! 📈",
          answers: [
            "Revenue minus expenses",
            "Stock price × Number of outstanding shares",
            "Total assets minus total debt",
            "Annual profit divided by 12 months"
          ],
          correctAnswer: 1,
          explanation: "Market cap = Stock price × Outstanding shares! If a company has 1 million shares at $50 each, the market cap is $50 million. This represents the total value investors place on the company!",
          difficulty: 2
        },
        {
          type: "P/E Ratio",
          question: "What does the P/E ratio help investors understand about a stock?",
          characterHint: "It shows how much investors are willing to pay for each dollar of earnings! 💭",
          context: "P/E ratio is one of the most commonly used valuation metrics in finance.",
          answers: [
            "How much profit the company makes per employee",
            "How expensive the stock is relative to its earnings",
            "How much debt the company has",
            "How fast the company is growing"
          ],
          correctAnswer: 1,
          explanation: "P/E (Price-to-Earnings) ratio shows how much investors pay for each dollar of earnings! A high P/E might mean investors expect high growth, while a low P/E could indicate undervaluation or slow growth.",
          difficulty: 2
        },
        {
          type: "Bull vs Bear",
          question: "What does a 'bull market' represent?",
          characterHint: "Think about a bull charging forward and upward! 🐂",
          answers: [
            "A market where prices are falling and pessimism dominates",
            "A market where prices are rising and optimism prevails",
            "A market that only trades agricultural commodities",
            "A market that operates only during daytime hours"
          ],
          correctAnswer: 1,
          explanation: "A bull market represents rising prices and investor optimism! The term comes from how a bull attacks by thrusting upward with its horns. The opposite is a bear market (prices falling, like a bear swiping downward)!",
          difficulty: 1
        }
      ]
    }
  ];

  const handleLessonComplete = (lessonResults) => {
    setTotalXP(prev => prev + lessonResults.xp);
    setTotalCoins(prev => prev + lessonResults.coins);
    setCompletedLessons(prev => [...prev, currentLesson]);
    
    // Move to next lesson or show completion
    if (currentLesson < investmentBankingLessons.length - 1) {
      setCurrentLesson(prev => prev + 1);
    } else {
      // All lessons completed!
      showModuleCompletion();
    }
  };

  const showModuleCompletion = () => {
    // You could navigate to a completion page or show a modal
    alert(`🎉 Congratulations! You've completed Investment Banking Basics!\n\nTotal XP: ${totalXP}\nTotal Coins: ${totalCoins}`);
  };

  if (currentLesson < investmentBankingLessons.length) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
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
                  <Building className="text-blue-600 mr-3" size={28} />
                  <div>
                    <h1 className="text-xl font-bold text-gray-800">Investment Banking Mastery</h1>
                    <p className="text-sm text-gray-600">Learn the fundamentals of investment banking</p>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{totalXP}</div>
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
                  Lesson {currentLesson + 1} of {investmentBankingLessons.length}: {investmentBankingLessons[currentLesson].title}
                </span>
                <span className="text-sm text-gray-500">
                  {Math.round(((currentLesson + 1) / investmentBankingLessons.length) * 100)}% Complete
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <motion.div
                  className="h-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${((currentLesson + 1) / investmentBankingLessons.length) * 100}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Lesson Content */}
        <GameifiedLesson
          lessonData={investmentBankingLessons[currentLesson]}
          onLessonComplete={handleLessonComplete}
          characterImage={investmentBankingLessons[currentLesson].character}
          theme="investment"
        />
      </div>
    );
  }

  // Module Completion Screen
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
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
          🏆
        </motion.div>
        
        <h1 className="text-4xl font-bold text-gray-800 mb-4">
          Investment Banking Mastery Complete!
        </h1>
        
        <p className="text-xl text-gray-600 mb-8">
          Congratulations! You've mastered the fundamentals of investment banking.
        </p>

        <div className="grid grid-cols-3 gap-6 mb-8">
          <div className="bg-blue-50 rounded-xl p-4">
            <Star className="text-blue-500 mx-auto mb-2" size={32} />
            <div className="text-2xl font-bold text-blue-600">{totalXP}</div>
            <div className="text-sm text-blue-700">XP Earned</div>
          </div>
          <div className="bg-yellow-50 rounded-xl p-4">
            <DollarSign className="text-yellow-500 mx-auto mb-2" size={32} />
            <div className="text-2xl font-bold text-yellow-600">{totalCoins}</div>
            <div className="text-sm text-yellow-700">Coins Earned</div>
          </div>
          <div className="bg-green-50 rounded-xl p-4">
            <Trophy className="text-green-500 mx-auto mb-2" size={32} />
            <div className="text-2xl font-bold text-green-600">{investmentBankingLessons.length}</div>
            <div className="text-sm text-green-700">Lessons Completed</div>
          </div>
        </div>

        <div className="space-y-4">
          <button
            onClick={() => navigate('/finlit')}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold py-4 px-8 rounded-xl hover:shadow-lg transition-all duration-300"
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

export default InvestmentBankingGame;