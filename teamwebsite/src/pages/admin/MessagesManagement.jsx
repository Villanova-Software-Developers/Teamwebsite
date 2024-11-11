import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Mail, Search, Check, MessageCircle } from 'lucide-react';
import { db } from '../../contexts/AuthContext';
import { collection, query, orderBy, onSnapshot, updateDoc, doc } from 'firebase/firestore';

const MessagesManagement = () => {
  const [messages, setMessages] = useState([]);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, 'messages'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const messagesData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate().toLocaleString() || 'N/A'
      }));
      setMessages(messagesData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const markAsRead = async (messageId) => {
    try {
      const messageRef = doc(db, 'messages', messageId);
      await updateDoc(messageRef, {
        status: 'READ'
      });
    } catch (error) {
      console.error('Error updating message status:', error);
    }
  };

  const filteredMessages = messages.filter(message =>
    message.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    message.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    message.message.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Messages</h2>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search messages..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 border rounded-lg w-64"
          />
        </div>
      </div>

      {loading ? (
        <div className="text-center py-8">Loading messages...</div>
      ) : (
        <div className="grid gap-4">
          {filteredMessages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`bg-white rounded-xl shadow-lg overflow-hidden ${
                message.status === 'UNREAD' ? 'border-l-4 border-blue-500' : ''
              }`}
            >
              <div className="p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-semibold">{message.name}</h3>
                    <p className="text-gray-600">{message.email}</p>
                    <p className="text-gray-500 text-sm mt-1">
                      Sent: {message.createdAt}
                    </p>
                    <p className="mt-4 text-gray-700">{message.message}</p>
                  </div>
                  <div className="flex space-x-2">
                    {message.status === 'UNREAD' && (
                      <button
                        onClick={() => markAsRead(message.id)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                        title="Mark as Read"
                      >
                        <Check className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}

          {filteredMessages.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No messages found
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default MessagesManagement;