import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { 
  Mail, Search, Check, MessageCircle, 
  Download, Archive, Trash2, Calendar,
  ChevronLeft, ChevronRight, Filter
} from 'lucide-react';
import { db } from '../../contexts/AuthContext';
import { 
  collection, query, orderBy, onSnapshot, 
  updateDoc, doc, deleteDoc, where, 
  startAfter, limit, getDocs, Timestamp 
} from 'firebase/firestore';
import { addDoc } from 'firebase/firestore';

// Add this function inside your component
const addAuditLog = async (action, details) => {
  try {
    await addDoc(collection(db, 'audit_logs'), {
      action,
      details,
      timestamp: new Date(),
      userId: 'ADMIN', // Replace with actual admin ID
      ip: window.sessionStorage.getItem('userIP') || 'unknown'
    });
  } catch (error) {
    console.error('Error adding audit log:', error);
  }
};
const MESSAGES_PER_PAGE = 10;

const MessagesManagement = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMessages, setSelectedMessages] = useState(new Set());
  const [lastVisible, setLastVisible] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const [dateFilter, setDateFilter] = useState({
    startDate: null,
    endDate: null
  });
  const [statusFilter, setStatusFilter] = useState('ALL');

  // Fetch messages with pagination and filters
  const fetchMessages = useCallback(async (isNewQuery = false) => {
    try {
      setLoading(true);
      let messagesQuery = query(
        collection(db, 'messages'),
        orderBy('createdAt', 'desc'),
        limit(MESSAGES_PER_PAGE)
      );

      // Apply filters
      if (dateFilter.startDate) {
        messagesQuery = query(
          messagesQuery,
          where('createdAt', '>=', Timestamp.fromDate(dateFilter.startDate))
        );
      }
      if (dateFilter.endDate) {
        messagesQuery = query(
          messagesQuery,
          where('createdAt', '<=', Timestamp.fromDate(dateFilter.endDate))
        );
      }
      if (statusFilter !== 'ALL') {
        messagesQuery = query(
          messagesQuery,
          where('status', '==', statusFilter)
        );
      }

      if (!isNewQuery && lastVisible) {
        messagesQuery = query(
          messagesQuery,
          startAfter(lastVisible)
        );
      }

      const snapshot = await getDocs(messagesQuery);
      
      // Update lastVisible for pagination
      setLastVisible(snapshot.docs[snapshot.docs.length - 1]);
      setHasMore(snapshot.docs.length === MESSAGES_PER_PAGE);

      const messagesData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate().toLocaleString() || 'N/A'
      }));

      if (isNewQuery) {
        setMessages(messagesData);
      } else {
        setMessages(prev => [...prev, ...messagesData]);
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
      setError('Failed to load messages. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [lastVisible, dateFilter, statusFilter]);

  useEffect(() => {
    const q = query(collection(db, 'messages'), orderBy('createdAt', 'desc'));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      console.log("Messages snapshot:", snapshot.size); // Debug log
      const messagesData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate?.().toLocaleString() || 'N/A'
      }));
      setMessages(messagesData);
      setLoading(false);
    }, (error) => {
      console.error('Error fetching messages:', error);
      setLoading(false);
    });
  
    return () => unsubscribe();
  }, []);
  // Message actions with audit logging
  const handleMessageAction = async (messageId, action, batch = false) => {
    try {
      const messageRef = doc(db, 'messages', messageId);
      const timestamp = new Date();
      
      switch (action) {
        case 'READ':
          await updateDoc(messageRef, {
            status: 'READ',
            updatedAt: timestamp,
            updatedBy: 'ADMIN' // Replace with actual admin ID
          });
          break;

        case 'ARCHIVE':
          await updateDoc(messageRef, {
            status: 'ARCHIVED',
            archivedAt: timestamp,
            archivedBy: 'ADMIN' // Replace with actual admin ID
          });
          break;

        case 'DELETE':
          // Create audit log before deletion
          await addAuditLog('message_deletion', {
            messageId,
            deletedAt: timestamp,
            deletedBy: 'ADMIN' // Replace with actual admin ID
          });
          await deleteDoc(messageRef);
          break;

        default:
          break;
      }

      if (!batch) {
        // Refresh messages if not batch operation
        fetchMessages(true);
      }
    } catch (error) {
      console.error(`Error performing message action ${action}:`, error);
      setError(`Failed to ${action.toLowerCase()} message. Please try again.`);
    }
  };

  // Batch operations
  const handleBatchOperation = async (action) => {
    try {
      setLoading(true);
      const promises = Array.from(selectedMessages).map(messageId => 
        handleMessageAction(messageId, action, true)
      );
      await Promise.all(promises);
      setSelectedMessages(new Set());
      fetchMessages(true);
    } catch (error) {
      console.error('Error in batch operation:', error);
      setError('Failed to process batch operation. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Export messages
  const exportMessages = async () => {
    try {
      const exportData = messages.map(message => ({
        name: message.name,
        email: message.email,
        message: message.message,
        status: message.status,
        createdAt: message.createdAt
      }));

      const csvContent = "data:text/csv;charset=utf-8," + 
        encodeURIComponent(convertToCSV(exportData));
      
      const link = document.createElement('a');
      link.setAttribute('href', csvContent);
      link.setAttribute('download', `messages_export_${new Date().toISOString()}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Error exporting messages:', error);
      setError('Failed to export messages. Please try again.');
    }
  };

  // Filter and search functionality
  const filteredMessages = messages.filter(message =>
    message.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    message.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    message.message.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header and Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <h2 className="text-2xl font-bold">Messages</h2>
        <div className="flex items-center gap-4">
          {/* Search */}
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

          {/* Date Filter */}
          <div className="flex items-center gap-2">
            <input
              type="date"
              value={dateFilter.startDate?.toISOString().split('T')[0] || ''}
              onChange={(e) => setDateFilter(prev => ({
                ...prev,
                startDate: e.target.value ? new Date(e.target.value) : null
              }))}
              className="border rounded-lg px-3 py-2"
            />
            <span>to</span>
            <input
              type="date"
              value={dateFilter.endDate?.toISOString().split('T')[0] || ''}
              onChange={(e) => setDateFilter(prev => ({
                ...prev,
                endDate: e.target.value ? new Date(e.target.value) : null
              }))}
              className="border rounded-lg px-3 py-2"
            />
          </div>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border rounded-lg px-3 py-2"
          >
            <option value="ALL">All Status</option>
            <option value="UNREAD">Unread</option>
            <option value="READ">Read</option>
            <option value="ARCHIVED">Archived</option>
          </select>
        </div>
      </div>

      {/* Batch Actions */}
      {selectedMessages.size > 0 && (
        <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
          <span className="text-sm text-gray-600">
            {selectedMessages.size} messages selected
          </span>
          <button
            onClick={() => handleBatchOperation('READ')}
            className="px-3 py-1 text-sm text-blue-600 hover:bg-blue-50 rounded-md"
          >
            Mark as Read
          </button>
          <button
            onClick={() => handleBatchOperation('ARCHIVE')}
            className="px-3 py-1 text-sm text-yellow-600 hover:bg-yellow-50 rounded-md"
          >
            Archive
          </button>
          <button
            onClick={() => handleBatchOperation('DELETE')}
            className="px-3 py-1 text-sm text-red-600 hover:bg-red-50 rounded-md"
          >
            Delete
          </button>
        </div>
      )}

      {/* Messages List */}
      {loading ? (
        <div className="text-center py-8">Loading messages...</div>
      ) : error ? (
        <div className="text-center py-8 text-red-600">{error}</div>
      ) : (
        <div className="grid gap-4">
          {filteredMessages.map((message) => (
            <MessageCard
              key={message.id}
              message={message}
              selected={selectedMessages.has(message.id)}
              onSelect={() => {
                const newSelected = new Set(selectedMessages);
                if (newSelected.has(message.id)) {
                  newSelected.delete(message.id);
                } else {
                  newSelected.add(message.id);
                }
                setSelectedMessages(newSelected);
              }}
              onAction={handleMessageAction}
            />
          ))}

          {filteredMessages.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No messages found
            </div>
          )}
        </div>
      )}

      {/* Pagination */}
      <div className="flex justify-between items-center mt-4">
        <button
          onClick={() => {
            if (page > 1) {
              setPage(prev => prev - 1);
              fetchMessages(true);
            }
          }}
          disabled={page === 1}
          className="px-4 py-2 bg-white border rounded-md disabled:opacity-50"
        >
          Previous
        </button>
        <span>Page {page}</span>
        <button
          onClick={() => {
            if (hasMore) {
              setPage(prev => prev + 1);
              fetchMessages();
            }
          }}
          disabled={!hasMore}
          className="px-4 py-2 bg-white border rounded-md disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
};

// Message Card Component
const MessageCard = ({ message, selected, onSelect, onAction }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className={`bg-white rounded-xl shadow-lg overflow-hidden ${
      message.status === 'UNREAD' ? 'border-l-4 border-blue-500' : ''
    }`}
  >
    <div className="p-6">
      <div className="flex justify-between items-start">
        <div className="flex items-center gap-4">
          <input
            type="checkbox"
            checked={selected}
            onChange={() => onSelect(message.id)}
            className="h-4 w-4 text-blue-600 rounded"
          />
          <div>
            <h3 className="text-lg font-semibold">{message.name}</h3>
            <p className="text-gray-600">{message.email}</p>
            <p className="text-gray-500 text-sm mt-1">
              Sent: {message.createdAt}
            </p>
            <p className="mt-4 text-gray-700">{message.message}</p>
          </div>
        </div>
        <div className="flex space-x-2">
          {message.status === 'UNREAD' && (
            <button
              onClick={() => onAction(message.id, 'READ')}
              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
              title="Mark as Read"
            >
              <Check className="w-5 h-5" />
            </button>
          )}
          <button
            onClick={() => onAction(message.id, 'ARCHIVE')}
            className="p-2 text-yellow-600 hover:bg-yellow-50 rounded-lg"
            title="Archive"
          >
            <Archive className="w-5 h-5" />
          </button>
          <button
            onClick={() => onAction(message.id, 'DELETE')}
            className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
            title="Delete"
          >
            <Trash2 className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  </motion.div>
);

// Helper function to convert data to CSV
const convertToCSV = (data) => {
  const headers = Object.keys(data[0]);
  const rows = data.map(obj => headers.map(header => obj[header]));
  return [headers.join(','), ...rows.map(row => row.join(','))].join('\n');
};

export default MessagesManagement;