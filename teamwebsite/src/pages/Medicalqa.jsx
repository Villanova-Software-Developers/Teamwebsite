import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { 
  Send, Settings, Loader, Brain, MessageCircle, 
  ChevronDown, Plus, Trash2,Link
} from 'lucide-react';
import { 
  collection, addDoc, query, orderBy, 
  onSnapshot, serverTimestamp, updateDoc, 
  doc, deleteDoc, getDocs,  where} from 'firebase/firestore';
import { db } from '../contexts/AuthContext';
import { useAuth } from '../contexts/AuthContext';


 function MedicalQA() {
    const [apiBaseUrl, setApiBaseUrl] = useState('https://148f-153-104-35-220.ngrok-free.app');
    const [showApiInput, setShowApiInput] = useState(false);
        const [messages, setMessages] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
const [isEditingTitle, setIsEditingTitle] = useState(false);
const [editingTitle, setEditingTitle] = useState('');



const MODELS = [
    { 
      id: 'base', 
      name: 'Base T5', 
      endpoint: '/api/base/generate', 
      color: 'from-blue-500 to-blue-700',
      lightColor: 'bg-blue-50',
      accentColor: 'text-blue-700' 
    },
    { 
      id: 'finetuned', 
      name: 'Finetuned T5', 
      endpoint: '/api/finetuned/generate', 
      color: 'from-violet-500 to-purple-700',
      lightColor: 'bg-purple-50',
      accentColor: 'text-purple-700'
    },
    { 
      id: 'qlora-base', 
      name: 'Base QLora', 
      endpoint: '/api/qlora/base/generate', 
      color: 'from-emerald-500 to-green-700',
      lightColor: 'bg-emerald-50',
      accentColor: 'text-emerald-700'
    },
    { 
      id: 'qlora-finetuned', 
      name: 'Finetuned QLora', 
      endpoint: '/api/qlora/finetuned/generate', 
      color: 'from-rose-500 to-pink-700',
      lightColor: 'bg-rose-50',
      accentColor: 'text-rose-700'
    }
  ];
  const [conversations, setConversations] = useState([]);
  const [showSidebar, setShowSidebar] = useState(true);



  const [activeConversation, setActiveConversation] = useState(null);
  const [question, setQuestion] = useState('');
  const [selectedModel, setSelectedModel] = useState(MODELS[0]);
  const [isLoading, setIsLoading] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showModelDropdown, setShowModelDropdown] = useState(false);

  const [settings, setSettings] = useState({
    maxLength: 256,
    temperature: 0.7,
    topP: 0.9,
    repetitionPenalty: 1.2
  });
  const updateChatTitle = async (conversationId, newTitle) => {
    try {
      await updateDoc(doc(db, 'conversations', conversationId), {
        title: newTitle,
        lastUpdated: serverTimestamp()
      });
      setIsEditingTitle(false);
    } catch (error) {
      console.error('Error updating chat title:', error);
    }
  };
  const filteredConversations = conversations.filter(conv => 
    (conv.title || 'New Chat').toLowerCase().includes(searchQuery.toLowerCase())
  );
  

  

  const createNewConversation = async () => {
    try {
      const conversationRef = await addDoc(collection(db, 'conversations'), {
        type: 'chat',
        title: 'New Chat',
        model: selectedModel.id,
        createdAt: serverTimestamp(),
        lastUpdated: serverTimestamp()
      });
  
      console.log('Created new conversation:', conversationRef.id);
      setActiveConversation(conversationRef.id);
      
      // Clear existing messages when starting new conversation
      setMessages([]);
      
      return conversationRef.id;
    } catch (error) {
      console.error('Error creating conversation:', error);
      return null;
    }
  };
  
  
  const handleSubmit = async () => {
    // More detailed validation
    if (!question.trim()) {
      console.log('Empty question, skipping submission');
      return;
    }
    
    if (isLoading) {
      console.log('Already loading, skipping submission');
      return;
    }
    
    if (!activeConversation) {
      console.log('No active conversation, creating new one');
      const newConvId = await createNewConversation();
      if (!newConvId) {
        console.error('Failed to create new conversation');
        return;
      }
      setActiveConversation(newConvId);
    }
    
    setIsLoading(true);
    
    try {
      // Create user message with retry
      let userMessageRef;
      for (let i = 0; i < 3; i++) {
        try {
          userMessageRef = await addDoc(collection(db, 'messages'), {
            content: question,
            role: 'user',
            conversationId: activeConversation,
            createdAt: serverTimestamp(),
            type: 'chat'
          });
          break;
        } catch (err) {
          if (i === 2) throw new Error('Failed to create user message after 3 attempts');
          await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1s between retries
        }
      }
  
      // Update conversation timestamp
      await updateDoc(doc(db, 'conversations', activeConversation), {
        lastUpdated: serverTimestamp()
      });
  
      // Validate API URL
      if (!apiBaseUrl?.trim()) {
        throw new Error('API Base URL is not configured');
      }
  
      // Prepare conversation history with validatio
      const conversationHistory = messages
        .filter(msg => msg.role && msg.content) // Only include valid messages
        .map(msg => ({
          role: msg.role,
          content: msg.content
        }));
  
      // Make API call with timeout
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 30000); // 30s timeout
  
      const response = await fetch(`${apiBaseUrl}${selectedModel.endpoint}`, {

        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          question: question,
          settings: settings,
          model: selectedModel.id,
          conversation_history: conversationHistory
        }),
        signal: controller.signal
      });
  
      clearTimeout(timeout);
  
      if (!response.ok) {
        throw new Error(`API responded with status: ${response.status}`);
      }
  
      const data = await response.json();
  
      // Create AI message with retry
      for (let i = 0; i < 3; i++) {
        try {
          await addDoc(collection(db, 'messages'), {
            content: data.answer,
            role: 'assistant',
            conversationId: activeConversation,
            metadata: data,
            createdAt: serverTimestamp(),
            type: 'chat'
          });
          break;
        } catch (err) {
          if (i === 2) throw new Error('Failed to create AI message after 3 attempts');
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      }
  
      setQuestion('');
      
    } catch (error) {
      console.error('Error in handleSubmit:', error);
      // Add user-facing error handling
      alert(`Failed to send message: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    const q = query(
      collection(db, 'conversations'),
      orderBy('lastUpdated', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const newConversations = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setConversations(newConversations);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!activeConversation) return;
  
    console.log('Setting up messages listener for conversation:', activeConversation);
  
    const q = query(
      collection(db, 'messages'),
      where('conversationId', '==', activeConversation),
      orderBy('createdAt', 'asc')
    );
  
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const newMessages = [];
      snapshot.forEach((doc) => {
        newMessages.push({
          id: doc.id,
          ...doc.data()
        });
      });
      
      console.log('Received messages:', newMessages);
      setMessages(newMessages);
    }, (error) => {
      console.error('Error in messages listener:', error);
    });
  
    return () => unsubscribe();
  }, [activeConversation]);
    // Add this function to handle conversation deletion
    const deleteConversation = async (conversationId) => {
        try {
          // Delete all messages in the conversation
          const messagesQuery = query(
            collection(db, 'messages'),
            where('conversationId', '==', conversationId)
          );
          const messagesDocs = await getDocs(messagesQuery);
          messagesDocs.forEach(async (doc) => {
            await deleteDoc(doc.ref);
          });
    
          // Delete the conversation document
          await deleteDoc(doc(db, 'conversations', conversationId));
    
          // If the deleted conversation was active, clear it
          if (conversationId === activeConversation) {
            setActiveConversation(null);
            setMessages([]);
          }
        } catch (error) {
          console.error('Error deleting conversation:', error);
        }
      };
    
  
  // Clean up old conversations periodically
  useEffect(() => {
    const cleanup = async () => {
      const thirtyMinutesAgo = new Date(Date.now() - 30 * 60 * 1000);
      const q = query(
        collection(db, 'messages'),
        orderBy('lastUpdated')
      );
      
      const snapshot = await getDocs(q);
      snapshot.docs.forEach(async (doc) => {
        const data = doc.data();
        if (data.lastUpdated && data.lastUpdated.toDate() < thirtyMinutesAgo) {
          await deleteDoc(doc.ref);
        }
      });
    };

    const interval = setInterval(cleanup, 5 * 60 * 1000); // Run every 5 minutes
    return () => clearInterval(interval);
  }, []);
  
    return (
            <div className="h-screen flex flex-col">
              {/* Top Navigation */}
              <div className="bg-white border-b border-gray-200 px-4 py-2 flex justify-between items-center">
                <div className="flex items-center gap-4">
                  {/* Toggle Sidebar Button */}
                  <button
                    onClick={() => setShowSidebar(!showSidebar)}
                    className="p-2 hover:bg-gray-100 rounded-lg"
                  >
                    <MessageCircle className="w-5 h-5" />
                  </button>
                  
                  {/* Model Selector */}
                  <div className="relative">
                    <motion.button
                      onClick={() => setShowModelDropdown(!showModelDropdown)}
                      className={`px-3 py-1.5 rounded-lg flex items-center gap-2 bg-gradient-to-r ${selectedModel.color} text-white text-sm`}
                    >
                      <Brain className="w-4 h-4" />
                      <span>{selectedModel.name}</span>
                      <ChevronDown className={`w-3 h-3 transition-transform ${showModelDropdown ? 'rotate-180' : ''}`} />
                    </motion.button>
          
                    <AnimatePresence>
                      {showModelDropdown && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="absolute z-10 mt-2 w-full bg-white rounded-lg shadow-lg border border-gray-200"
                        >
                          {MODELS.map(model => (
                            <button
                              key={model.id}
                              onClick={() => {
                                setSelectedModel(model);
                                setShowModelDropdown(false);
                              }}
                              className={`w-full p-2 flex items-center gap-2 text-gray-700 hover:bg-gray-50 text-sm
                                ${model.id === selectedModel.id ? 'bg-gray-50' : ''}`}
                            >
                              <Brain className="w-4 h-4" />
                              <span>{model.name}</span>
                            </button>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
                <AnimatePresence>
  {showApiInput && (
    <motion.div
      initial={{ height: 0 }}
      animate={{ height: 'auto' }}
      exit={{ height: 0 }}
      className="border-b border-gray-200 bg-white p-3"
    >
      <div className="flex gap-2 max-w-2xl mx-auto">
        <input
          type="text"
          value={apiBaseUrl}
          onChange={(e) => setApiBaseUrl(e.target.value)}
          placeholder="Enter API Base URL..."
          className="flex-1 px-3 py-2 rounded-lg bg-gray-50 border border-gray-200 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>
    </motion.div>
  )}
</AnimatePresence>
<button
  onClick={() => setShowApiInput(!showApiInput)}
  className="p-2 rounded-lg hover:bg-gray-100"
>
  <Link className="w-5 h-5" />
</button>
          
                {/* Settings Button */}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowSettings(!showSettings)}
                  className="p-2 rounded-lg hover:bg-gray-100"
                >
                  <Settings className="w-5 h-5" />
                </motion.button>
              </div>
          
              {/* Main Content Area */}
              <div className="flex flex-1 overflow-hidden">
                {/* Sidebar */}
                <div className={`${showSidebar ? 'w-64' : 'w-0'} bg-white border-r border-gray-200 flex flex-col transition-all duration-300 ease-in-out overflow-hidden`}>
                  {showSidebar && (
                    <>
                      <div className="p-2">
                        <button
                          onClick={() => {
                            setActiveConversation(null);
                            setMessages([]);
                          }}
                          className="w-full px-3 py-1.5 bg-blue-600 text-white rounded-lg flex items-center justify-center gap-2 hover:bg-blue-700 transition-all duration-200 text-sm"
                        >
                          <Plus className="w-4 h-4" />
                          New Chat
                        </button>
                      </div>
          
                      <div className="flex-1 overflow-y-auto p-2 space-y-1">
                      {conversations.map((conv) => (
  <div
    key={conv.id}
    className={`group rounded-lg transition-all duration-200 ${
      activeConversation === conv.id
        ? 'bg-blue-50 text-blue-700'
        : 'hover:bg-gray-50'
    }`}
  >
    <div
      onClick={() => setActiveConversation(conv.id)}
      className="w-full p-2 flex items-center justify-between text-sm"
    >
      <div className="flex items-center gap-2 truncate flex-1">
        <MessageCircle className="w-4 h-4" />
        {isEditingTitle && activeConversation === conv.id ? (
          <input
            type="text"
            value={editingTitle}
            onChange={(e) => setEditingTitle(e.target.value)}
            onBlur={() => {
              updateChatTitle(conv.id, editingTitle);
              setIsEditingTitle(false);
            }}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                updateChatTitle(conv.id, editingTitle);
                setIsEditingTitle(false);
              }
            }}
            className="flex-1 bg-transparent border-none focus:ring-0 p-0 text-sm"
            autoFocus
          />
        ) : (
          <span 
            className="truncate cursor-pointer"
            onDoubleClick={() => {
              setEditingTitle(conv.title || 'New Chat');
              setIsEditingTitle(true);
            }}
          >
            {conv.title || 'New Chat'}
          </span>
        )}
      </div>
      
      <button
        onClick={(e) => {
          e.stopPropagation();
          deleteConversation(conv.id);
        }}
        className="opacity-0 group-hover:opacity-100 hover:text-red-500 transition-opacity duration-200"
      >
        <Trash2 className="w-3 h-3" />
      </button>
    </div>
  </div>
))}
                      </div>
                    </>
                  )}
                </div>
          
                {/* Chat Area */}
                <div className="flex-1 flex flex-col overflow-hidden bg-gray-50">
                  {activeConversation ? (
                    <>
                      {/* Settings Panel */}
                      <AnimatePresence>
                        {showSettings && (
                          <motion.div
                            initial={{ height: 0 }}
                            animate={{ height: 'auto' }}
                            exit={{ height: 0 }}
                            className="border-b border-gray-200 overflow-hidden bg-gray-50"
                          >
                            <div className="p-3 grid grid-cols-2 gap-3">
                              {Object.entries(settings).map(([key, value]) => (
                                <div key={key} className="space-y-1">
                                  <label className="flex justify-between text-xs font-medium text-gray-600">
                                    <span>{key.charAt(0).toUpperCase() + key.slice(1)}</span>
                                    <span className="text-gray-500">{value}</span>
                                  </label>
                                  <input
                                    type="range"
                                    min={key === 'maxLength' ? 100 : 0}
                                    max={key === 'maxLength' ? 512 : key === 'repetitionPenalty' ? 2 : 1}
                                    step={key === 'maxLength' ? 1 : 0.1}
                                    value={value}
                                    onChange={(e) => setSettings({...settings, [key]: parseFloat(e.target.value)})}
                                    className="w-full accent-blue-600"
                                  />
                                </div>
                              ))}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
          
                      {/* Messages */}
                      <div className="flex-1 overflow-y-auto p-4 space-y-4">
                        <AnimatePresence>
                          {messages.map((message) => (
                            <motion.div
                              key={message.id}
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -10 }}
                              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                            >
                              <div className={`max-w-2xl rounded-lg p-3 shadow-sm ${
                                message.role === 'user' 
                                  ? `${selectedModel.lightColor} ${selectedModel.accentColor}`
                                  : 'bg-white text-gray-700'
                              }`}>
                                <p className="text-sm">{message.content}</p>
                                {message.metadata && (
                                  <div className="mt-2 flex flex-wrap gap-1">
                                    <span className="px-2 py-0.5 bg-gray-100 rounded-full text-xs text-gray-600">
                                      {message.metadata.question_type}
                                    </span>
                                    {message.metadata.medical_context?.map((term, i) => (
                                      <span key={i} className="px-2 py-0.5 bg-gray-100 rounded-full text-xs text-gray-600">
                                        {term}
                                      </span>
                                    ))}
                                  </div>
                                )}
                              </div>
                            </motion.div>
                          ))}
                        </AnimatePresence>
                      </div>
          
                      {/* Input Area */}
                      <div className="border-t border-gray-200 p-3 bg-white">
                        <div className="flex gap-2 max-w-4xl mx-auto">
                          <input
                            type="text"
                            value={question}
                            onChange={(e) => setQuestion(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
                            placeholder="Ask your medical question..."
                            className="flex-1 px-3 py-2 rounded-lg bg-gray-50 border border-gray-200 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                          <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={handleSubmit}
                            disabled={isLoading}
                            className={`px-4 py-2 rounded-lg text-white flex items-center gap-2 text-sm
                              bg-gradient-to-r ${selectedModel.color} hover:opacity-90 disabled:opacity-50`}
                          >
                            {isLoading ? <Loader className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                          </motion.button>
                        </div>
                      </div>
                    </>
                  ) : (
                    // Welcome Screen
                    <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-6 max-w-2xl"
                      >
                        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-1 rounded-full inline-block">
                          <div className="bg-white p-3 rounded-full">
                            <MessageCircle className="w-10 h-10 text-blue-600" />
                          </div>
                        </div>
                        
                        <h2 className="text-2xl font-bold text-gray-800">
                          Medical AI Assistant
                        </h2>
                        
                        <p className="text-gray-600 text-base leading-relaxed">
                          Start a new conversation with our advanced medical AI models. 
                          Choose from multiple models for different perspectives on your medical questions.
                        </p>
                        
                        <div className="grid grid-cols-2 gap-3 max-w-xl mx-auto">
                          {MODELS.map((model) => (
                            <motion.button
                              key={model.id}
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                              onClick={() => {
                                setSelectedModel(model);
                                createNewConversation();
                              }}
                              className={`p-3 rounded-xl bg-gradient-to-r ${model.color} 
                                hover:opacity-90 text-white text-left space-y-1 shadow-sm hover:shadow transition-shadow duration-200`}
                            >
                              <div className="flex items-center gap-2">
                                <Brain className="w-5 h-5" />
                                <span className="font-medium text-sm">{model.name}</span>
                              </div>
                              <p className="text-xs text-white/90">
                                {model.description || 'Start a conversation with this model'}
                              </p>
                            </motion.button>
                          ))}
                        </div>
                        
                        <div className="pt-6 space-y-3">
                          <p className="text-gray-600 text-sm">
                            Example questions to get started:
                          </p>
                          <div className="flex flex-wrap gap-2 justify-center">
                            {[
                              "What are the early symptoms of diabetes?",
                              "How is high blood pressure treated?",
                              "What causes seasonal allergies?",
                              "Explain the different types of arthritis"
                            ].map((example, index) => (
                              <motion.button
                                key={index}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => {
                                  setQuestion(example);
                                  createNewConversation();
                                }}
                                className="px-3 py-1.5 rounded-lg bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 text-sm shadow-sm hover:shadow transition-shadow duration-200"
                              >
                                {example}
                              </motion.button>
                            ))}
                          </div>
                        </div>
                      </motion.div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
    }
    
    export default MedicalQA;
