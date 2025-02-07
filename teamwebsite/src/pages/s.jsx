import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MessageSquare, 
  Clock, 
  User, 
  Bot, 
  Filter,
  Bell,
  Calendar,
  CheckCircle2,
  XCircle,
  AlertCircle
} from 'lucide-react';
const ActivityLog = () => {
  const [activities] = useState([
    {
      id: 1,
      type: 'lab_test',
      status: 'completed',
      message: 'Blood Test Results Received',
      timestamp: '2 hours ago',
      priority: 'high'
    },
    {
      id: 2,
      type: 'consultation',
      status: 'scheduled',
      message: 'Follow-up Consultation Scheduled',
      timestamp: '1 day ago',
      priority: 'medium'
    },
    {
      id: 3,
      type: 'treatment',
      status: 'in_progress',
      message: 'Treatment Plan Updated',
      timestamp: '2 days ago',
      priority: 'low'
    }
  ]);

  const getStatusIcon = (status) => {
    switch(status) {
      case 'completed':
        return <CheckCircle2 className="text-green-500" />;
      case 'scheduled':
        return <Calendar className="text-blue-500" />;
      case 'in_progress':
        return <AlertCircle className="text-yellow-500" />;
      default:
        return <AlertCircle className="text-gray-500" />;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">Activity Log</h2>
        <button className="flex items-center gap-2 text-gray-600 hover:text-gray-900">
          <Filter className="w-4 h-4" />
          Filter
        </button>
      </div>
      <div className="space-y-4">
        {activities.map((activity, index) => (
          <motion.div
            key={activity.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg"
          >
            <div className="w-8 h-8">
              {getStatusIcon(activity.status)}
            </div>
            <div className="flex-1">
              <div className="flex justify-between items-start">
                <h3 className="font-medium">{activity.message}</h3>
                <span className="text-sm text-gray-500">{activity.timestamp}</span>
              </div>
              <p className="text-sm text-gray-600 mt-1">
                Status: <span className="capitalize">{activity.status.replace('_', ' ')}</span>
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

const ChatInterface = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'ai',
      content: 'Hello! Im your AI health assistant. How can I help you today?',
      timestamp: new Date().toISOString()
    }
  ]);
  const [newMessage, setNewMessage] = useState('');

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const userMessage = {
      id: messages.length + 1,
      sender: 'user',
      content: newMessage,
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMessage]);
    setNewMessage('');

    // Simulate AI response
    setTimeout(() => {
      const aiResponse = {
        id: messages.length + 2,
        sender: 'ai',
        content: 'I understand your concern. Based on your recent test results, I can provide some insights about your treatment progress...',
        timestamp: new Date().toISOString()
      };
      setMessages(prev => [...prev, aiResponse]);
    }, 1000);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm h-[600px] flex flex-col">
      <div className="p-4 border-b">
        <h2 className="text-xl font-semibold">AI Health Assistant</h2>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <AnimatePresence>
          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[70%] p-3 rounded-lg ${
                  message.sender === 'user'
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-100 text-gray-900'
                }`}
              >
                <p>{message.content}</p>
                <span className="text-xs opacity-70 mt-1 block">
                  {new Date(message.timestamp).toLocaleTimeString()}
                </span>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <form onSubmit={handleSendMessage} className="p-4 border-t">
        <div className="flex gap-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <button
            type="submit"
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Send
          </button>
        </div>
      </form>
    </div>
  );
};

const ActivityAndChatPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid md:grid-cols-2 gap-8"
        >
          <div className="space-y-8">
            <ActivityLog />
          </div>
          <div>
            <ChatInterface />
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ActivityAndChatPage;