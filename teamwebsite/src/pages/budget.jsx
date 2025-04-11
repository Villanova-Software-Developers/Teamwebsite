import React, { useState, useEffect, useRef } from 'react';
import { Trash2, DollarSign, ShoppingCart, Home, Coffee, Gift, Car, Film, Wifi, BookOpen, Award, Music, Star, Heart, Sparkles } from 'lucide-react';

const BudgetGame = () => {
  // Game states
  const [gameState, setGameState] = useState('intro'); // intro, playing, completed
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(180); // 3 minutes in seconds
  const [draggedItem, setDraggedItem] = useState(null);
  const [foundWords, setFoundWords] = useState([]);
  const [puzzleCompleted, setPuzzleCompleted] = useState(false);
  const [wordSearchCompleted, setWordSearchCompleted] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [selectedGame, setSelectedGame] = useState('drag-drop');
  const [searchTerm, setSearchTerm] = useState('');
  const [showWordDefinition, setShowWordDefinition] = useState(null);
  const [coins, setCoins] = useState(0);
  const [showReward, setShowReward] = useState(false);
  const [showComboPower, setShowComboPower] = useState(false);
  const [comboMultiplier, setComboMultiplier] = useState(1);
  const [showTips, setShowTips] = useState(false);
  const [activePowerUp, setActivePowerUp] = useState(null);
  
  // Audio refs
  const successSoundRef = useRef(null);
  const coinSoundRef = useRef(null);
  const completeSoundRef = useRef(null);
  
  // Budget items for drag and drop
  const [incomeItems, setIncomeItems] = useState([
    { id: 'income1', type: 'income', name: 'Salary', amount: 3000, placed: false, icon: 'DollarSign' },
    { id: 'income2', type: 'income', name: 'Freelance', amount: 500, placed: false, icon: 'Wifi' },
    { id: 'income3', type: 'income', name: 'Side Gig', amount: 350, placed: false, icon: 'Music' },
  ]);
  
  const [expenseItems, setExpenseItems] = useState([
    { id: 'expense1', type: 'expense', name: 'Rent', amount: 1200, placed: false, category: 'housing', icon: 'Home' },
    { id: 'expense2', type: 'expense', name: 'Groceries', amount: 400, placed: false, category: 'food', icon: 'ShoppingCart' },
    { id: 'expense3', type: 'expense', name: 'Utilities', amount: 150, placed: false, category: 'housing', icon: 'Wifi' },
    { id: 'expense4', type: 'expense', name: 'Transportation', amount: 200, placed: false, category: 'transport', icon: 'Car' },
    { id: 'expense5', type: 'expense', name: 'Entertainment', amount: 100, placed: false, category: 'leisure', icon: 'Film' },
    { id: 'expense6', type: 'expense', name: 'Dining Out', amount: 200, placed: false, category: 'food', icon: 'Coffee' },
  ]);
  
  // Jigsaw puzzle pieces
  const [puzzlePieces, setPuzzlePieces] = useState([
    { id: 'piece1', placed: false, position: { x: Math.random() * 300, y: Math.random() * 200 }, rotation: Math.random() * 30 - 15 },
    { id: 'piece2', placed: false, position: { x: Math.random() * 300, y: Math.random() * 200 }, rotation: Math.random() * 30 - 15 },
    { id: 'piece3', placed: false, position: { x: Math.random() * 300, y: Math.random() * 200 }, rotation: Math.random() * 30 - 15 },
    { id: 'piece4', placed: false, position: { x: Math.random() * 300, y: Math.random() * 200 }, rotation: Math.random() * 30 - 15 },
    { id: 'piece5', placed: false, position: { x: Math.random() * 300, y: Math.random() * 200 }, rotation: Math.random() * 30 - 15 },
    { id: 'piece6', placed: false, position: { x: Math.random() * 300, y: Math.random() * 200 }, rotation: Math.random() * 30 - 15 },
    { id: 'piece7', placed: false, position: { x: Math.random() * 300, y: Math.random() * 200 }, rotation: Math.random() * 30 - 15 },
    { id: 'piece8', placed: false, position: { x: Math.random() * 300, y: Math.random() * 200 }, rotation: Math.random() * 30 - 15 },
    { id: 'piece9', placed: false, position: { x: Math.random() * 300, y: Math.random() * 200 }, rotation: Math.random() * 30 - 15 },
  ]);
  
  // Word search grid
  const wordSearchGrid = [
    ['B', 'U', 'D', 'G', 'E', 'T', 'I', 'N', 'G', 'X'],
    ['A', 'L', 'L', 'O', 'C', 'A', 'T', 'I', 'O', 'N'],
    ['L', 'P', 'E', 'Y', 'E', 'K', 'S', 'A', 'V', 'E'],
    ['A', 'E', 'X', 'P', 'E', 'N', 'S', 'E', 'S', 'X'],
    ['N', 'E', 'M', 'E', 'R', 'G', 'E', 'N', 'C', 'Y'],
    ['C', 'I', 'N', 'C', 'O', 'M', 'E', 'S', 'L', 'Z'],
    ['E', 'T', 'S', 'A', 'V', 'I', 'N', 'G', 'S', 'F'],
    ['D', 'R', 'E', 'C', 'E', 'I', 'P', 'T', 'E', 'I'],
    ['E', 'A', 'F', 'I', 'N', 'A', 'N', 'C', 'E', 'X'],
    ['B', 'C', 'K', 'T', 'R', 'A', 'C', 'K', 'I', 'N'],
  ];
  
  const wordsToFind = [
    'BUDGET', 
    'INCOME', 
    'EXPENSES', 
    'SAVING',
    'BALANCE', 
    'ALLOCATION', 
    'EMERGENCY', 
    'FINANCE', 
    'RECEIPT', 
    'TRACK'
  ];
  
  const wordDefinitions = {
    'BUDGET': 'A plan for your income and expenses. It helps you manage your money and reach financial goals.',
    'INCOME': 'Money you receive, such as from jobs, investments, or gifts.',
    'EXPENSES': 'Money you spend on needs and wants.',
    'SAVING': 'Money you set aside for future use instead of spending now.',
    'BALANCE': 'The difference between your income and expenses.',
    'ALLOCATION': 'How you divide your money among different categories and needs.',
    'EMERGENCY': 'Funds set aside for unexpected events like medical bills or car repairs.',
    'FINANCE': 'The management of money, including saving, investing, and spending.',
    'RECEIPT': 'A record of purchase that helps with expense tracking and returns.',
    'TRACK': 'Recording and monitoring your spending to stay within your budget.'
  };
  
  // Power-ups
  const [powerUps, setPowerUps] = useState([
    { id: 'time-freeze', name: 'Time Freeze', icon: 'Sparkles', description: 'Pause the timer for 30 seconds', available: true },
    { id: 'double-points', name: 'Double Points', icon: 'Star', description: 'Double all points for 30 seconds', available: false },
    { id: 'hint', name: 'Hint Coin', icon: 'Heart', description: 'Get a hint for the current challenge', available: false },
  ]);
  
  // Timer effect
  useEffect(() => {
    let timer;
    if (gameState === 'playing' && timeLeft > 0 && !activePowerUp?.id === 'time-freeze') {
      timer = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      // Time's up logic
      setGameState('completed');
    }
    
    return () => clearTimeout(timer);
  }, [timeLeft, gameState, activePowerUp]);
  
  // Power-up effect
  useEffect(() => {
    if (activePowerUp) {
      const timer = setTimeout(() => {
        setActivePowerUp(null);
        
        // Reset combo multiplier if it was a double points power-up
        if (activePowerUp.id === 'double-points') {
          setComboMultiplier(1);
        }
      }, 30000); // 30 seconds
      
      return () => clearTimeout(timer);
    }
  }, [activePowerUp]);
  
  // Calculate total for income and expenses
  const totalIncome = incomeItems.reduce((sum, item) => item.placed ? sum + item.amount : sum, 0);
  const totalExpenses = expenseItems.reduce((sum, item) => item.placed ? sum + item.amount : sum, 0);
  const balance = totalIncome - totalExpenses;
  
  // Handle drag start
  const handleDragStart = (e, item) => {
    setDraggedItem(item);
  };
  
  // Handle drop in income section
  const handleDropIncome = () => {
    if (draggedItem && draggedItem.type === 'income' && !draggedItem.placed) {
      // Update the item's placed status
      if (draggedItem.type === 'income') {
        setIncomeItems(incomeItems.map(item => 
          item.id === draggedItem.id ? { ...item, placed: true } : item
        ));
      }
      
      // Calculate points with combo multiplier
      const pointsToAdd = 10 * comboMultiplier;
      setScore(score + pointsToAdd);
      
      // Show floating score
      showFloatingScore(pointsToAdd);
      
      // Play sound
      if (successSoundRef.current) {
        successSoundRef.current.play();
      }
      
      // Show confetti
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 2000);
      
      // Add coins
      addCoins(1);
      
      // Increase combo if all items placed correctly
      if (incomeItems.filter(item => !item.placed).length === 1) {
        triggerCombo();
      }
      
      setDraggedItem(null);
    }
  };
  
  // Handle drop in expense section
  const handleDropExpense = () => {
    if (draggedItem && draggedItem.type === 'expense' && !draggedItem.placed) {
      // Update the item's placed status
      setExpenseItems(expenseItems.map(item => 
        item.id === draggedItem.id ? { ...item, placed: true } : item
      ));
      
      // Calculate points with combo multiplier
      const pointsToAdd = 10 * comboMultiplier;
      setScore(score + pointsToAdd);
      
      // Show floating score
      showFloatingScore(pointsToAdd);
      
      // Play sound
      if (successSoundRef.current) {
        successSoundRef.current.play();
      }
      
      // Show confetti
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 2000);
      
      // Add coins
      addCoins(1);
      
      // Increase combo if all items placed correctly
      if (expenseItems.filter(item => !item.placed).length === 1) {
        triggerCombo();
      }
      
      setDraggedItem(null);
    }
  };
  
  // Handle dropping on wrong area or cancelling drag
  const handleDragEnd = () => {
    setDraggedItem(null);
  };
  
  // Format time display
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };
  
  // Start the game
  const startGame = () => {
    setGameState('playing');
    
    // Unlock first power-up
    setPowerUps(powerUps.map(power => 
      power.id === 'hint' ? { ...power, available: true } : power
    ));
  };
  
  // Complete current game part
  const completeCurrentGame = () => {
    if (selectedGame === 'drag-drop') {
      setSelectedGame('jigsaw');
      addCoins(5);
      
      // Play sound
      if (completeSoundRef.current) {
        completeSoundRef.current.play();
      }
      
      // Unlock power-up
      setPowerUps(powerUps.map(power => 
        power.id === 'time-freeze' ? { ...power, available: true } : power
      ));
    } else if (selectedGame === 'jigsaw') {
      setPuzzleCompleted(true);
      setSelectedGame('word-search');
      addCoins(5);
      
      // Play sound
      if (completeSoundRef.current) {
        completeSoundRef.current.play();
      }
      
      // Unlock power-up
      setPowerUps(powerUps.map(power => 
        power.id === 'double-points' ? { ...power, available: true } : power
      ));
    } else if (selectedGame === 'word-search') {
      setWordSearchCompleted(true);
      setGameState('completed');
      addCoins(10);
      
      // Play sound
      if (completeSoundRef.current) {
        completeSoundRef.current.play();
      }
    }
  };
  
  // Handle word search
  const handleWordSearch = () => {
    const term = searchTerm.toUpperCase().trim();
    
    if (wordsToFind.includes(term) && !foundWords.includes(term)) {
      // Found a valid word!
      setFoundWords([...foundWords, term]);
      
      // Calculate points with combo multiplier
      const pointsToAdd = 15 * comboMultiplier;
      setScore(score + pointsToAdd);
      
      // Show floating score
      showFloatingScore(pointsToAdd);
      
      // Play sound
      if (successSoundRef.current) {
        successSoundRef.current.play();
      }
      
      // Show definition
      setShowWordDefinition(term);
      
      // Add coins
      addCoins(2);
      
      // Show confetti
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 2000);
      
      // Reset search term
      setSearchTerm('');
      
      // Check if all words are found
      if (foundWords.length === wordsToFind.length - 1) {
        triggerCombo();
        setTimeout(() => {
          setWordSearchCompleted(true);
        }, 2000);
      }
    }
  };
  
  // Simulated jigsaw piece placement
  const placePuzzlePiece = (pieceId) => {
    // Update puzzle piece state
    setPuzzlePieces(puzzlePieces.map(piece => 
      piece.id === pieceId ? { ...piece, placed: true } : piece
    ));
    
    // Calculate points with combo multiplier
    const pointsToAdd = 10 * comboMultiplier;
    setScore(score + pointsToAdd);
    
    // Show floating score
    showFloatingScore(pointsToAdd);
    
    // Play sound
    if (successSoundRef.current) {
      successSoundRef.current.play();
    }
    
    // Add coins
    addCoins(1);
    
    // Check if puzzle is complete
    const updatedPieces = puzzlePieces.map(piece => 
      piece.id === pieceId ? { ...piece, placed: true } : piece
    );
    
    if (updatedPieces.every(piece => piece.placed)) {
      setPuzzleCompleted(true);
      triggerCombo();
    }
  };
  
  // Add coins with animation
  const addCoins = (amount) => {
    setCoins(coins + amount);
    setShowReward(true);
    
    // Play coin sound
    if (coinSoundRef.current) {
      coinSoundRef.current.play();
    }
    
    setTimeout(() => {
      setShowReward(false);
    }, 2000);
  };
  
  // Trigger combo multiplier
  const triggerCombo = () => {
    setComboMultiplier(2);
    setShowComboPower(true);
    
    setTimeout(() => {
      setShowComboPower(false);
    }, 3000);
    
    // Double points power-up
    setActivePowerUp({
      id: 'double-points',
      name: 'Double Points',
      icon: 'Star'
    });
  };
  
  // Show floating score animation
  const showFloatingScore = (points) => {
    // This would be implemented with a more complex animation system
    // For simplicity, we're using the confetti effect instead
  };
  
  // Use a power-up
  const activatePowerUp = (powerUpId) => {
    const powerUp = powerUps.find(p => p.id === powerUpId);
    
    if (powerUp && powerUp.available) {
      // Mark as used
      setPowerUps(powerUps.map(p => 
        p.id === powerUpId ? { ...p, available: false } : p
      ));
      
      // Apply power-up effect
      if (powerUpId === 'time-freeze') {
        setActivePowerUp({
          id: 'time-freeze',
          name: 'Time Freeze',
          icon: 'Sparkles'
        });
      } else if (powerUpId === 'double-points') {
        setComboMultiplier(2);
        setActivePowerUp({
          id: 'double-points',
          name: 'Double Points',
          icon: 'Star'
        });
      } else if (powerUpId === 'hint') {
        // Give appropriate hint based on current game
        if (selectedGame === 'drag-drop') {
          setShowTips(true);
          setTimeout(() => setShowTips(false), 5000);
        } else if (selectedGame === 'jigsaw') {
          // Auto-place one piece
          const unplacedPieces = puzzlePieces.filter(p => !p.placed);
          if (unplacedPieces.length > 0) {
            placePuzzlePiece(unplacedPieces[0].id);
          }
        } else if (selectedGame === 'word-search') {
          // Highlight a word
          const unfoundWords = wordsToFind.filter(w => !foundWords.includes(w));
          if (unfoundWords.length > 0) {
            setSearchTerm(unfoundWords[0].toLowerCase());
          }
        }
      }
    }
  };
  
  // Reset items to draggable area
  const resetItems = () => {
    setIncomeItems(incomeItems.map(item => ({ ...item, placed: false })));
    setExpenseItems(expenseItems.map(item => ({ ...item, placed: false })));
  };
  
  // Restart the game
  const restartGame = () => {
    setGameState('intro');
    setScore(0);
    setTimeLeft(180);
    setDraggedItem(null);
    setFoundWords([]);
    setPuzzleCompleted(false);
    setWordSearchCompleted(false);
    setSelectedGame('drag-drop');
    setComboMultiplier(1);
    setCoins(0);
    resetItems();
    setPuzzlePieces(puzzlePieces.map(piece => ({ 
      ...piece, 
      placed: false,
      position: { x: Math.random() * 300, y: Math.random() * 200 },
      rotation: Math.random() * 30 - 15
    })));
  };

  // Icon mapping helper
  const getIcon = (iconName, size = 20) => {
    switch (iconName) {
      case 'DollarSign': return <DollarSign size={size} />;
      case 'ShoppingCart': return <ShoppingCart size={size} />;
      case 'Home': return <Home size={size} />;
      case 'Coffee': return <Coffee size={size} />;
      case 'Car': return <Car size={size} />;
      case 'Film': return <Film size={size} />;
      case 'Wifi': return <Wifi size={size} />;
      case 'Music': return <Music size={size} />;
      case 'Star': return <Star size={size} />;
      case 'Heart': return <Heart size={size} />;
      case 'Sparkles': return <Sparkles size={size} />;
      default: return <DollarSign size={size} />;
    }
  };

  // Confetti component
  const Confetti = () => {
    return (
      <div className="absolute inset-0 pointer-events-none z-50">
        {Array.from({ length: 100 }).map((_, i) => {
          const size = Math.random() * 12 + 5;
          const left = Math.random() * 100;
          const animDuration = Math.random() * 3 + 2;
          const delay = Math.random() * 0.5;
          
          return (
            <div 
              key={i}
              className="absolute top-0 animate-fall"
              style={{
                left: `${left}%`,
                width: size,
                height: size,
                backgroundColor: `hsl(${Math.random() * 360}, 100%, 50%)`,
                borderRadius: Math.random() > 0.5 ? '50%' : '0%',
                animation: `fall ${animDuration}s ease-in ${delay}s`,
                transform: `rotate(${Math.random() * 360}deg)`,
              }}
            />
          );
        })}
      </div>
    );
  };

  return (
    <div className="relative w-full h-full min-h-screen bg-gradient-to-br from-indigo-700 via-purple-600 to-pink-500 p-4 overflow-hidden">
      {/* Hidden audio elements */}
      <audio ref={successSoundRef} src="https://assets.mixkit.co/active_storage/sfx/2046/2046-preview.mp3
" preload="auto" />
      <audio ref={coinSoundRef} src="https://assets.mixkit.co/active_storage/sfx/270/270-preview.mp3" preload="auto" />
      <audio ref={completeSoundRef} src="https://assets.mixkit.co/active_storage/sfx/1950/1950-preview.mp3" preload="auto" />
      
      {/* Background effects */}
      <div className="absolute inset-0 z-0">
        {/* Animated bubbles */}
        {Array.from({ length: 20 }).map((_, i) => (
          <div 
            key={i}
            className="absolute rounded-full opacity-20 animate-float"
            style={{
              width: `${Math.random() * 100 + 50}px`,
              height: `${Math.random() * 100 + 50}px`,
              background: `rgba(255, 255, 255, 0.1)`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDuration: `${Math.random() * 10 + 10}s`,
              animationDelay: `${Math.random() * 5}s`
            }}
          />
        ))}
      </div>
      
      {showConfetti && <Confetti />}
      
      {/* Floating rewards */}
      {showReward && (
        <div className="fixed top-1/4 left-1/2 transform -translate-x-1/2 text-yellow-300 text-3xl font-bold animate-float-up z-50 flex items-center">
          <div className="mr-2 text-4xl">+{comboMultiplier > 1 ? comboMultiplier : ''}</div>
          <DollarSign size={24} className="text-yellow-300" />
        </div>
      )}
      
      {/* Combo power-up animation */}
      {showComboPower && (
        <div className="fixed inset-0 flex items-center justify-center pointer-events-none z-50">
          <div className="bg-yellow-500 bg-opacity-30 text-white text-4xl font-bold p-6 rounded-2xl animate-pulse-grow">
            2X COMBO!
          </div>
        </div>
      )}
      
      {/* Active power-up indicator */}
      {activePowerUp && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-yellow-400 text-yellow-900 px-4 py-2 rounded-full shadow-lg z-50 animate-pulse flex items-center">
          {getIcon(activePowerUp.icon)}
          <span className="ml-2 font-bold">{activePowerUp.name} Active!</span>
        </div>
      )}
      
      {/* Game header */}
      <div className="flex justify-between items-center mb-8 relative z-10">
        <div className="text-3xl font-bold text-white drop-shadow-lg flex items-center">
          <div className="w-12 h-12 bg-yellow-400 rounded-full flex items-center justify-center mr-3 transform -rotate-12 shadow-lg">
            <DollarSign size={28} className="text-yellow-800" />
          </div>
          Level 1: Budget Basics
        </div>
        <div className="flex gap-4">
          <div className="bg-white bg-opacity-20 backdrop-blur-md p-3 rounded-lg shadow-lg border border-white border-opacity-30">
            <span className="font-semibold text-white">Score:</span> 
            <span className="text-yellow-300 font-bold text-xl ml-2">{score}</span>
          </div>
          <div className="bg-white bg-opacity-20 backdrop-blur-md p-3 rounded-lg shadow-lg border border-white border-opacity-30">
            <span className="font-semibold text-white">Time:</span> 
            <span className={`font-bold text-xl ml-2 ${timeLeft < 30 ? 'text-red-300' : 'text-green-300'}`}>
              {formatTime(timeLeft)}
            </span>
          </div>
          <div className="bg-white bg-opacity-20 backdrop-blur-md p-3 rounded-lg shadow-lg border border-white border-opacity-30 flex items-center">
            <DollarSign size={16} className="text-yellow-300 mr-1" /> 
            <span className="text-yellow-300 font-bold text-xl">{coins}</span>
          </div>
        </div>
      </div>
      
      {/* Game content based on state */}
      {gameState === 'intro' && (
        <div className="bg-white bg-opacity-10 backdrop-blur-lg rounded-xl shadow-lg p-8 max-w-2xl mx-auto text-center relative z-10 border border-white border-opacity-20 animate-fade-bounce">
          <h1 className="text-4xl font-bold text-white mb-4 text-shadow">Welcome to Budget Basics!</h1>
          <div className="mb-6">
            <div className="w-24 h-24 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center mx-auto shadow-lg animate-pulse-slow">
              <DollarSign size={64} className="text-white" />
            </div>
          </div>
          <p className="text-xl mb-8 text-white text-opacity-90">
            Master budgeting through three exciting challenges!
            <br />Complete them all to unlock special rewards.
          </p>
          <button 
            onClick={startGame}
            className="bg-gradient-to-r from-green-400 to-blue-500 hover:from-green-500 hover:to-blue-600 text-white font-bold py-4 px-10 rounded-full shadow-xl transform transition hover:scale-105 focus:outline-none focus:ring-4 focus:ring-blue-300 focus:ring-opacity-50 text-xl"
          >
            START YOUR JOURNEY!
          </button>
          
          <div className="mt-12 grid grid-cols-3 gap-4">
            <div className="bg-white bg-opacity-20 p-4 rounded-lg shadow">
              <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-2">
                <DollarSign size={24} className="text-white" />
              </div>
              <div className="text-white font-semibold">Budget Builder</div>
            </div>
            <div className="bg-white bg-opacity-20 p-4 rounded-lg shadow">
              <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-2">
                <BookOpen size={24} className="text-white" />
              </div>
              <div className="text-white font-semibold">Budget Puzzle</div>
            </div>
            <div className="bg-white bg-opacity-20 p-4 rounded-lg shadow">
              <div className="w-12 h-12 bg-pink-500 rounded-full flex items-center justify-center mx-auto mb-2">
                <Wifi size={24} className="text-white" />
              </div>
              <div className="text-white font-semibold">Word Search</div>
            </div>
          </div>
        </div>
      )}
      
      {gameState === 'playing' && (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 relative z-10">
          {/* Power-ups sidebar */}
          <div className="bg-white bg-opacity-10 backdrop-blur-md rounded-xl shadow-lg p-6 border border-white border-opacity-20 flex flex-col">
            <h2 className="text-xl font-bold text-white mb-4 drop-shadow-lg">Power-Ups</h2>
            <div className="space-y-3 mb-auto">
              {powerUps.map(power => (
                <button 
                  key={power.id}
                  onClick={() => activatePowerUp(power.id)}
                  disabled={!power.available}
                  className={`w-full p-3 rounded-lg flex items-center transition duration-300 ${power.available ? 'bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 cursor-pointer' : 'bg-gray-700 bg-opacity-50 cursor-not-allowed opacity-50'}`}
                >
                  <div className="rounded-full p-3 mr-3 bg-white bg-opacity-20">
                    {getIcon(power.icon)}
                  </div>
                  <div className="text-left">
                    <div className="font-semibold text-white">{power.name}</div>
                    <div className="text-sm text-white text-opacity-80">{power.description}</div>
                  </div>
                </button>
              ))}
            </div>
            
            <div className="mt-6 pt-6 border-t border-white border-opacity-20">
              <div className="text-sm text-white mb-2">Game Progress</div>
              <div className="w-full bg-white bg-opacity-20 rounded-full h-4">
                <div 
                  className="bg-gradient-to-r from-green-400 to-blue-500 h-4 rounded-full transition-all duration-500 ease-out"
                  style={{ 
                    width: `${(() => {
                      if (wordSearchCompleted) return '100%';
                      if (puzzleCompleted) return '66%';
                      if (incomeItems.every(item => item.placed) && expenseItems.every(item => item.placed)) return '33%';
                      return '0%';
                    })()}` 
                  }}
                ></div>
              </div>
            </div>
            
            {/* Game selection tabs */}
            <div className="mt-6 pt-6 border-t border-white border-opacity-20">
              <h3 className="text-white font-semibold mb-3">Challenges</h3>
              <div className="space-y-3">
                <button 
                  onClick={() => setSelectedGame('drag-drop')}
                  className={`w-full p-3 rounded-lg flex items-center transition-all duration-300 ${selectedGame === 'drag-drop' ? 'bg-gradient-to-r from-blue-600 to-blue-400 scale-105 shadow-xl' : 'bg-white bg-opacity-20 hover:bg-opacity-30'}`}
                >
                  <div className="rounded-full p-2 mr-3 bg-white bg-opacity-20">
                    <DollarSign size={20} className="text-white" />
                  </div>
                  <div className="text-left">
                    <div className="font-semibold text-white">Budget Builder</div>
                    <div className="text-xs text-white text-opacity-80">Drag & Drop</div>
                  </div>
                </button>
                
                <button 
                  onClick={() => setSelectedGame('jigsaw')}
                  className={`w-full p-3 rounded-lg flex items-center transition-all duration-300 ${selectedGame === 'jigsaw' ? 'bg-gradient-to-r from-purple-600 to-purple-400 scale-105 shadow-xl' : 'bg-white bg-opacity-20 hover:bg-opacity-30'}`}
                  disabled={!incomeItems.every(item => item.placed) || !expenseItems.every(item => item.placed)}
                >
                  <div className="rounded-full p-2 mr-3 bg-white bg-opacity-20">
                    <BookOpen size={20} className="text-white" />
                  </div>
                  <div className="text-left">
                    <div className="font-semibold text-white">Budget Puzzle</div>
                    <div className="text-xs text-white text-opacity-80">{!incomeItems.every(item => item.placed) || !expenseItems.every(item => item.placed) ? 'Locked' : 'Unlocked!'}</div>
                  </div>
                </button>
                
                <button 
                  onClick={() => setSelectedGame('word-search')}
                  className={`w-full p-3 rounded-lg flex items-center transition-all duration-300 ${selectedGame === 'word-search' ? 'bg-gradient-to-r from-pink-600 to-pink-400 scale-105 shadow-xl' : 'bg-white bg-opacity-20 hover:bg-opacity-30'}`}
                  disabled={!puzzleCompleted}
                >
                  <div className="rounded-full p-2 mr-3 bg-white bg-opacity-20">
                    <Wifi size={20} className="text-white" />
                  </div>
                  <div className="text-left">
                    <div className="font-semibold text-white">Budget Terms</div>
                    <div className="text-xs text-white text-opacity-80">{!puzzleCompleted ? 'Locked' : 'Unlocked!'}</div>
                  </div>
                </button>
              </div>
            </div>
          </div>
          
          {/* Main game area */}
          <div className="lg:col-span-3 relative">
            {/* Drag and Drop Budget Builder */}
            {selectedGame === 'drag-drop' && (
              <div className="bg-white bg-opacity-10 backdrop-blur-md rounded-xl shadow-lg p-6 border border-white border-opacity-20 animate-fade-in">
                <div className="absolute top-0 right-0 m-4">
                  <div className="text-xs inline-block py-1 px-2 bg-purple-500 bg-opacity-80 rounded-full text-white animate-pulse">
                    DRAG & DROP GAME
                  </div>
                </div>
                
                <h2 className="text-2xl font-bold text-white mb-4 drop-shadow-lg flex items-center">
                  <DollarSign className="mr-2 text-green-300" />
                  Budget Builder Challenge
                </h2>
                <p className="mb-6 text-white">Drag income and expense items to their correct sections and balance your budget!</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  {/* Income section */}
                  <div 
                    className="border-2 border-dashed border-green-300 bg-gradient-to-br from-green-500 to-blue-500 bg-opacity-30 p-6 rounded-lg min-h-64 shadow-inner transition-all duration-300 hover:shadow-lg"
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={handleDropIncome}
                  >
                    <div className="flex items-center mb-4">
                      <div className="w-10 h-10 rounded-full bg-green-400 flex items-center justify-center mr-3 shadow-lg">
                        <DollarSign className="text-green-900" size={20} />
                      </div>
                      <h3 className="font-bold text-xl text-white drop-shadow-md">Income</h3>
                    </div>
                    
                    <div className="space-y-3">
                      {incomeItems.filter(item => item.placed).map(item => (
                        <div key={item.id} className="bg-white bg-opacity-20 backdrop-blur-sm p-4 rounded-lg shadow-lg flex justify-between items-center animate-slide-in border-l-4 border-green-400">
                          <div className="flex items-center">
                            <div className="w-8 h-8 rounded-full bg-green-400 flex items-center justify-center mr-3">
                              {getIcon(item.icon, 16)}
                            </div>
                            <span className="font-semibold text-white">{item.name}</span>
                          </div>
                          <span className="font-bold text-green-300">${item.amount}</span>
                        </div>
                      ))}
                    </div>
                    
                    <div className="mt-6 pt-6 border-t border-white border-opacity-20 flex justify-between">
                      <span className="font-semibold text-white">Total Income:</span>
                      <span className="font-bold text-xl text-green-300">${totalIncome}</span>
                    </div>
                  </div>
                  
                  {/* Expenses section */}
                  <div 
                    className="border-2 border-dashed border-red-300 bg-gradient-to-br from-red-500 to-pink-500 bg-opacity-30 p-6 rounded-lg min-h-64 shadow-inner transition-all duration-300 hover:shadow-lg"
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={handleDropExpense}
                  >
                    <div className="flex items-center mb-4">
                      <div className="w-10 h-10 rounded-full bg-red-400 flex items-center justify-center mr-3 shadow-lg">
                        <ShoppingCart className="text-red-900" size={20} />
                      </div>
                      <h3 className="font-bold text-xl text-white drop-shadow-md">Expenses</h3>
                    </div>
                    
                    <div className="space-y-3">
                      {expenseItems.filter(item => item.placed).map(item => (
                        <div key={item.id} className="bg-white bg-opacity-20 backdrop-blur-sm p-4 rounded-lg shadow-lg flex justify-between items-center animate-slide-in border-l-4 border-red-400">
                          <div className="flex items-center">
                            <div className="w-8 h-8 rounded-full bg-red-400 flex items-center justify-center mr-3">
                              {getIcon(item.icon, 16)}
                            </div>
                            <span className="font-semibold text-white">{item.name}</span>
                          </div>
                          <span className="font-bold text-red-300">${item.amount}</span>
                        </div>
                      ))}
                    </div>
                    
                    <div className="mt-6 pt-6 border-t border-white border-opacity-20 flex justify-between">
                      <span className="font-semibold text-white">Total Expenses:</span>
                      <span className="font-bold text-xl text-red-300">${totalExpenses}</span>
                    </div>
                  </div>
                </div>
                
                {/* Balance calculation */}
                <div className={`p-6 rounded-lg mb-6 shadow-lg ${balance >= 0 ? 'bg-gradient-to-r from-green-500 to-blue-500' : 'bg-gradient-to-r from-red-500 to-pink-500'} transform transition-all duration-300 hover:scale-102 hover:shadow-xl`}>
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-white text-lg">Balance (Income - Expenses):</span>
                    <span className={`font-bold text-2xl text-white`}>
                      ${balance}
                    </span>
                  </div>
                </div>
                
                {/* Items to drag */}
                <div className="bg-white bg-opacity-10 backdrop-blur-sm p-6 rounded-lg shadow-lg border border-white border-opacity-20">
                  <h3 className="font-semibold text-white mb-4 text-lg">Drag these items to build your budget:</h3>
                  <div className="flex flex-wrap gap-3">
                    {incomeItems.filter(item => !item.placed).map(item => (
                      <div 
                        key={item.id}
                        className="bg-gradient-to-r from-green-400 to-blue-500 text-white p-4 rounded-lg shadow-lg cursor-move flex items-center transform transition-all duration-300 hover:scale-105 hover:shadow-xl border border-white border-opacity-20 animate-bounce-in"
                        draggable
                        onDragStart={(e) => handleDragStart(e, item)}
                        onDragEnd={handleDragEnd}
                      >
                        <div className="w-8 h-8 rounded-full bg-white bg-opacity-20 flex items-center justify-center mr-3">
                          {getIcon(item.icon, 16)}
                        </div>
                        <div>
                          <div className="font-semibold">{item.name}</div>
                          <div className="text-sm text-green-200">${item.amount}</div>
                        </div>
                      </div>
                    ))}
                    
                    {expenseItems.filter(item => !item.placed).map(item => (
                      <div 
                        key={item.id}
                        className="bg-gradient-to-r from-red-400 to-pink-500 text-white p-4 rounded-lg shadow-lg cursor-move flex items-center transform transition-all duration-300 hover:scale-105 hover:shadow-xl border border-white border-opacity-20 animate-bounce-in"
                        draggable
                        onDragStart={(e) => handleDragStart(e, item)}
                        onDragEnd={handleDragEnd}
                      >
                        <div className="w-8 h-8 rounded-full bg-white bg-opacity-20 flex items-center justify-center mr-3">
                          {getIcon(item.icon, 16)}
                        </div>
                        <div>
                          <div className="font-semibold">{item.name}</div>
                          <div className="text-sm text-red-200">${item.amount}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Tips bubble */}
                {showTips && (
                  <div className="fixed bottom-10 right-10 bg-yellow-400 text-yellow-900 p-4 rounded-lg max-w-xs shadow-lg animate-bounce-in z-50">
                    <h4 className="font-bold mb-2">PRO TIP!</h4>
                    <p>Drag income items (green) to the Income section and expense items (red) to the Expenses section.</p>
                    <button onClick={() => setShowTips(false)} className="absolute top-2 right-2 text-yellow-700 hover:text-yellow-900">×</button>
                  </div>
                )}
                    {/* Check if all items are placed */}
    {incomeItems.every(item => item.placed) && expenseItems.every(item => item.placed) && (
      <div className="mt-8 text-center">
        <div className="inline-block animate-pulse-grow">
          <button
            onClick={completeCurrentGame}
            className="bg-gradient-to-r from-green-400 to-blue-500 hover:from-green-500 hover:to-blue-600 text-white font-bold py-4 px-8 rounded-full shadow-xl transform transition hover:scale-105 text-xl border-2 border-white border-opacity-30"
          >
            AMAZING! UNLOCK PUZZLE CHALLENGE
          </button>
        </div>
      </div>
    )}
  </div>
)}
  {/* Jigsaw Puzzle */}
  {selectedGame === 'jigsaw' && (
              <div className="animate-fadeIn">
                <h2 className="text-xl font-bold text-blue-800 mb-4">Budget Puzzle</h2>
                <p className="mb-6">Complete the puzzle to visualize your budget!</p>
                
                <div className="grid grid-cols-3 gap-2 mb-8 bg-blue-50 p-4 rounded-lg">
                  {/* Puzzle grid */}
                  {puzzlePieces.map((piece, index) => (
                    <div 
                      key={piece.id}
                      className={`aspect-square border-2 ${piece.placed ? 'border-green-500 bg-green-100' : 'border-gray-300 bg-white'} rounded-lg flex items-center justify-center cursor-pointer transition hover:border-blue-400`}
                      onClick={() => placePuzzlePiece(piece.id)}
                    >
                      {piece.placed ? (
                        <div className="text-2xl font-bold text-green-600">✓</div>
                      ) : (
                        <div className="text-lg font-semibold text-gray-700">Piece {index + 1}</div>
                      )}
                    </div>
                  ))}
                </div>
                
                {puzzlePieces.every(piece => piece.placed) && (
                  <div className="bg-green-100 p-4 rounded-lg mb-6 animate-fadeIn">
                    <h3 className="font-semibold text-green-800 mb-2">Puzzle Completed!</h3>
                    <div className="bg-white p-4 rounded-lg">
                      <div className="text-center mb-4">
                        <span className="text-xl font-bold">Your Budget Visualization</span>
                      </div>
                      <div className="h-48 bg-blue-50 rounded-lg p-4 flex items-center justify-center">
                        {/* Simplified visualization */}
                        <div className="w-full max-w-md">
                          <div className="mb-2 text-sm font-semibold text-gray-600">Income vs Expenses</div>
                          <div className="flex h-8 w-full rounded-full overflow-hidden">
                            <div 
                              className="bg-green-500 flex items-center justify-center text-xs text-white"
                              style={{ width: `${(totalIncome / (totalIncome + totalExpenses)) * 100}%` }}
                            >
                              Income
                            </div>
                            <div 
                              className="bg-red-500 flex items-center justify-center text-xs text-white"
                              style={{ width: `${(totalExpenses / (totalIncome + totalExpenses)) * 100}%` }}
                            >
                              Expenses
                            </div>
                          </div>
                          <div className="mt-6">
                            <div className="mb-2 text-sm font-semibold text-gray-600">Expense Breakdown</div>
                            <div className="grid grid-cols-3 gap-2">
                              <div className="bg-blue-100 p-2 rounded text-center text-xs">
                                <Home size={16} className="mx-auto mb-1" />
                                Housing
                              </div>
                              <div className="bg-yellow-100 p-2 rounded text-center text-xs">
                                <Coffee size={16} className="mx-auto mb-1" />
                                Food
                              </div>
                              <div className="bg-purple-100 p-2 rounded text-center text-xs">
                                <Film size={16} className="mx-auto mb-1" />
                                Leisure
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="mt-6 text-center">
                      <button
                        onClick={completeCurrentGame}
                        className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-6 rounded-full shadow animate-pulse"
                      >
                        Excellent! Move to Word Search
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

          </div>
        </div>
      )}
      
            {/* Word Search */}
{selectedGame === 'word-search' && (
  <div className="bg-white bg-opacity-10 backdrop-blur-md rounded-xl shadow-lg p-6 border border-white border-opacity-20 animate-fade-in">
    <div className="absolute top-0 right-0 m-4">
      <div className="text-xs inline-block py-1 px-2 bg-pink-500 bg-opacity-80 rounded-full text-white animate-pulse">
        WORD SEARCH GAME
      </div>
    </div>
    
    <h2 className="text-2xl font-bold text-white mb-4 drop-shadow-lg flex items-center">
      <Wifi className="mr-2 text-pink-300" />
      Budget Vocabulary Challenge
    </h2>
    <p className="mb-6 text-white">Search for budget terms to learn their definitions!</p>
    
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        {/* Word search grid */}
        <div className="grid grid-cols-10 gap-2 mb-6 bg-gradient-to-br from-pink-500 to-purple-500 p-6 rounded-xl shadow-lg">
          {wordSearchGrid.flat().map((letter, index) => (
            <div 
              key={index}
              className="w-8 h-8 bg-white bg-opacity-20 backdrop-blur-sm border border-white border-opacity-20 rounded-lg flex items-center justify-center font-bold text-white hover:bg-white hover:bg-opacity-30 transition-colors cursor-pointer transform hover:scale-110 hover:shadow-lg transition-all duration-200"
              onClick={() => {
                // For demo purposes - would need real word search logic in a production game
                setSearchTerm(searchTerm + letter.toLowerCase());
              }}
            >
              {letter}
            </div>
          ))}
        </div>
        
        {/* Search input */}
        <div className="bg-white bg-opacity-20 backdrop-blur-md p-4 rounded-lg shadow-lg mb-6">
          <div className="flex items-center">
            <input 
              type="text" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Type or click letters above..."
              className="w-full bg-white bg-opacity-20 border border-white border-opacity-20 rounded-lg p-3 text-white placeholder-white placeholder-opacity-60 focus:outline-none focus:ring-2 focus:ring-pink-500"
            />
            <button 
              onClick={handleWordSearch}
              className="ml-2 bg-gradient-to-r from-pink-400 to-purple-500 hover:from-pink-500 hover:to-purple-600 text-white py-3 px-6 rounded-lg shadow-lg transform transition hover:scale-105"
            >
              Search
            </button>
          </div>
        </div>
        
        {/* Word definition popup */}
        {showWordDefinition && (
          <div className="bg-gradient-to-r from-yellow-400 to-orange-500 p-4 rounded-lg shadow-xl animate-bounce-in mb-6">
            <h3 className="font-bold text-yellow-900 text-lg mb-2">{showWordDefinition}</h3>
            <p className="text-yellow-900">{wordDefinitions[showWordDefinition]}</p>
            <div className="mt-3 flex justify-end">
              <button 
                onClick={() => setShowWordDefinition(null)}
                className="bg-yellow-900 text-yellow-100 px-3 py-1 rounded-md text-sm"
              >
                Got it!
              </button>
            </div>
          </div>
        )}
      </div>
      
      <div>
        <div className="bg-white bg-opacity-20 backdrop-blur-md p-6 rounded-lg shadow-lg mb-6">
          <h3 className="font-bold text-white mb-4 text-lg">Words to Find:</h3>
          <div className="grid grid-cols-2 gap-3">
            {wordsToFind.map((word) => (
              <div 
                key={word}
                className={`p-3 rounded-lg transition-all duration-300 ${foundWords.includes(word) 
                  ? 'bg-gradient-to-r from-green-400 to-green-500 shadow-lg scale-105 border border-white border-opacity-30' 
                  : 'bg-white bg-opacity-20'}`}
              >
                {foundWords.includes(word) ? (
                  <div className="flex items-center">
                    <div className="w-6 h-6 rounded-full bg-white text-green-500 flex items-center justify-center mr-2">✓</div>
                    <span className="font-semibold text-white">{word}</span>
                  </div>
                ) : (
                  <div className="flex items-center">
                    <div className="w-6 h-6 rounded-full bg-white bg-opacity-20 flex items-center justify-center mr-2">?</div>
                    <span className="text-white opacity-80">{word}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
        
        <div className="bg-white bg-opacity-20 backdrop-blur-md p-6 rounded-lg shadow-lg">
          <div className="flex items-center mb-3">
            <div className="w-8 h-8 rounded-full bg-pink-500 flex items-center justify-center mr-3">
              <Award size={16} className="text-white" />
            </div>
            <h3 className="font-bold text-white">Progress</h3>
          </div>
          
          <div className="mb-4">
            <div className="font-semibold text-white mb-2">Found: {foundWords.length}/{wordsToFind.length}</div>
            <div className="w-full bg-white bg-opacity-20 rounded-full h-3">
              <div 
                className="bg-gradient-to-r from-pink-400 to-purple-500 h-3 rounded-full transition-all duration-500"
                style={{ width: `${(foundWords.length / wordsToFind.length) * 100}%` }}
              ></div>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-2 mb-3">
            {Array.from({ length: foundWords.length }).map((_, i) => (
              <div key={i} className="w-6 h-6 bg-yellow-400 rounded-full animate-pulse-slow flex items-center justify-center">
                <DollarSign size={12} className="text-yellow-900" />
              </div>
            ))}
          </div>
          
          <div className="text-white text-sm">
            Find more words to earn coins and unlock rewards!
          </div>
        </div>
        
        {foundWords.length === wordsToFind.length && (
          <div className="mt-6 bg-gradient-to-r from-green-400 to-blue-500 p-6 rounded-lg animate-fadeIn">
            <h3 className="text-white font-bold text-xl mb-2">All words found!</h3>
            <p className="text-white mb-4">You've unlocked a special budget template and earned 10 hint coins for future challenges!</p>
            <button
              onClick={completeCurrentGame}
              className="w-full bg-white text-blue-600 font-bold py-3 px-6 rounded-full shadow-xl transform transition hover:scale-105 text-lg"
            >
              Complete Level 1
            </button>
          </div>
        )}
      </div>
    </div>
  </div>
)}
      {gameState === 'completed' && (
        <div className="relative z-10">
          <div className="absolute inset-0 z-0">
            {/* Background celebratory effects */}
            {Array.from({ length: 20 }).map((_, i) => (
              <div 
                key={i}
                className="absolute rounded-full animate-float"
                style={{
                  width: `${Math.random() * 100 + 50}px`,
                  height: `${Math.random() * 100 + 50}px`,
                  background: `radial-gradient(circle, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0) 70%)`,
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animationDuration: `${Math.random() * 10 + 10}s`,
                  animationDelay: `${Math.random() * 5}s`
                }}
              />
            ))}
          </div>
        
          <div className="bg-white bg-opacity-10 backdrop-blur-md rounded-xl shadow-lg p-8 max-w-4xl mx-auto text-center border border-white border-opacity-20 animate-fade-bounce">
            <div className="mb-8">
              <div className="w-32 h-32 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center mx-auto shadow-xl transform rotate-12 animate-pulse-slow">
                <Award size={64} className="text-white" />
              </div>
            </div>
            <h1 className="text-4xl font-bold text-white mb-4 drop-shadow-lg">Level 1 Completed!</h1>
            <p className="text-xl mb-8 text-white">
              Congratulations! You've mastered the basics of budgeting.
            </p>
            
            <div className="bg-white bg-opacity-10 backdrop-blur-sm p-8 rounded-xl mb-8 shadow-lg border border-white border-opacity-20">
              <h2 className="font-bold text-2xl mb-6 text-white">Level 1 Achievements</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-6 rounded-xl shadow-lg transform hover:scale-105 transition-all duration-300 border border-white border-opacity-20">
                  <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <DollarSign size={32} className="text-white" />
                  </div>
                  <div className="text-white font-bold text-lg mb-2">Budget Builder</div>
                  <div className="text-blue-100">Created a balanced budget by allocating income and expenses properly</div>
                </div>
                <div className="bg-gradient-to-br from-purple-500 to-purple-600 p-6 rounded-xl shadow-lg transform hover:scale-105 transition-all duration-300 border border-white border-opacity-20">
                  <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <BookOpen size={32} className="text-white" />
                  </div>
                  <div className="text-white font-bold text-lg mb-2">Puzzle Master</div>
                  <div className="text-purple-100">Visualized budget components and analyzed expense categories</div>
                </div>
                <div className="bg-gradient-to-br from-pink-500 to-pink-600 p-6 rounded-xl shadow-lg transform hover:scale-105 transition-all duration-300 border border-white border-opacity-20">
                  <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Wifi size={32} className="text-white" />
                  </div>
                  <div className="text-white font-bold text-lg mb-2">Word Finder</div>
                  <div className="text-pink-100">Learned 10 key budget terms and their financial definitions</div>
                </div>
              </div>
            </div>
            
            <div className="bg-white bg-opacity-10 backdrop-blur-sm p-8 rounded-xl mb-8 shadow-lg border border-white border-opacity-20">
              <h2 className="font-bold text-2xl mb-6 text-white">Rewards Unlocked</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gradient-to-br from-yellow-400 to-orange-500 p-6 rounded-xl shadow-lg border border-white border-opacity-20 transform hover:scale-105 transition-all duration-300">
                  <div className="flex items-center">
                    <div className="rounded-full bg-white bg-opacity-20 p-4 mr-4">
                      <Gift size={32} className="text-white" />
                    </div>
                    <div className="text-left">
                      <div className="font-bold text-xl text-white">Budget Template</div>
                      <div className="text-yellow-100 mt-1">Customizable spreadsheet for personal use</div>
                      <button className="mt-3 bg-white text-orange-500 px-4 py-2 rounded-lg font-semibold text-sm shadow-md hover:bg-opacity-90 transition">Download</button>
                    </div>
                  </div>
                </div>
                <div className="bg-gradient-to-br from-indigo-400 to-purple-500 p-6 rounded-xl shadow-lg border border-white border-opacity-20 transform hover:scale-105 transition-all duration-300">
                  <div className="flex items-center">
                    <div className="rounded-full bg-white bg-opacity-20 p-4 mr-4">
                      <Heart size={32} className="text-white" />
                    </div>
                    <div className="text-left">
                      <div className="font-bold text-xl text-white">20 Hint Coins</div>
                      <div className="text-indigo-100 mt-1">Use in future challenges for help</div>
                      <div className="mt-3 flex">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <div key={i} className="w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center mr-1 animate-pulse-slow shadow-md">
                            <DollarSign size={16} className="text-yellow-900" />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-10 flex justify-center space-x-6">
              <button 
                onClick={restartGame}
                className="bg-white bg-opacity-20 hover:bg-opacity-30 text-white font-bold py-4 px-8 rounded-xl shadow-lg transform transition hover:scale-105 border border-white border-opacity-20 backdrop-blur-sm"
              >
                Play Again
              </button>
              <button 
                className="bg-gradient-to-r from-green-400 to-blue-500 hover:from-green-500 hover:to-blue-600 text-white font-bold py-4 px-10 rounded-xl shadow-xl transform transition hover:scale-105 border-2 border-white border-opacity-30"
              >
                Continue to Level 2: Needs vs Wants
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Custom styles for animations */}
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes slideIn {
          from { transform: translateX(-20px); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        
        @keyframes bounceIn {
          0% { transform: scale(0.8); opacity: 0; }
          50% { transform: scale(1.05); }
          70% { transform: scale(0.95); }
          100% { transform: scale(1); opacity: 1; }
        }
        
        @keyframes pulse {
          0% { transform: scale(1); }
          50% { transform: scale(1.1); }
          100% { transform: scale(1); }
        }
        
        @keyframes pulseGrow {
          0% { transform: scale(1); opacity: 0.9; }
          50% { transform: scale(1.2); opacity: 1; }
          100% { transform: scale(1); opacity: 0.9; }
        }
        
        @keyframes float {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
          100% { transform: translateY(0px); }
        }
        
        @keyframes floatUp {
          0% { transform: translateY(0) translateX(-50%); opacity: 1; }
          100% { transform: translateY(-100px) translateX(-50%); opacity: 0; }
        }
        
        @keyframes fall {
          0% { transform: translateY(-10vh) rotate(0deg); }
          100% { transform: translateY(100vh) rotate(360deg); }
        }
        
        @keyframes fadeBounce {
          0% { transform: scale(0.9); opacity: 0; }
          50% { transform: scale(1.02); }
          100% { transform: scale(1); opacity: 1; }
        }
        
        @keyframes growWidth {
          0% { width: 0%; }
          100% { width: 100%; }
        }
        
        .animate-fade-in {
          animation: fadeIn 0.5s ease-out;
        }
        
        .animate-fade-in-up {
          animation: fadeInUp 0.6s ease-out;
        }
        
        .animate-slide-in {
          animation: slideIn 0.4s ease-out;
        }
        
        .animate-bounce-in {
          animation: bounceIn 0.5s ease-out;
        }
        
        .animate-pulse-slow {
          animation: pulse 3s infinite ease-in-out;
        }
        
        .animate-pulse-grow {
          animation: pulseGrow 2s infinite ease-in-out;
        }
        
        .animate-float {
          animation: float 6s infinite ease-in-out;
        }
        
        .animate-float-up {
          animation: floatUp 2s forwards ease-out;
        }
        
        .animate-fall {
          animation: fall 3s linear;
        }
        
        .animate-fade-bounce {
          animation: fadeBounce 0.8s ease-out;
        }
        
        .animate-grow-width {
          animation: growWidth 1.5s ease-out;
        }
        
        .scale-102 {
          transform: scale(1.02);
        }
        
        .text-shadow {
          text-shadow: 0 2px 4px rgba(0,0,0,0.2);
        }
      `}</style>
    </div>
  );
};

export default BudgetGame;    
