import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Search, Download, Check, 
  X, FileText,
  Trash2 // Added Trash2 icon for delete
} from 'lucide-react';
import { db } from '../../contexts/AuthContext';
import { 
  collection, 
   
  updateDoc, 
  doc, 
  onSnapshot, 
  query, 
  orderBy,
  deleteDoc // Added deleteDoc
} from 'firebase/firestore';

const StatusBadge = ({ status }) => {
  const getStatusColor = () => {
    switch (status) {
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800';
      case 'APPROVED':
        return 'bg-green-100 text-green-800';
      case 'REJECTED':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor()}`}>
      {status}
    </span>
  );
};

const JoinRequestsManagement = () => {
  const [requests, setRequests] = useState([]);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [requestToDelete, setRequestToDelete] = useState(null);

  useEffect(() => {
    const q = query(collection(db, 'joinRequests'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const requestsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate().toLocaleString() || 'N/A'
      }));
      setRequests(requestsData);
      setLoading(false);
    }, (error) => {
      console.error('Error fetching requests:', error);
      setError('Failed to load join requests');
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleStatusChange = async (requestId, newStatus) => {
    try {
      const requestRef = doc(db, 'joinRequests', requestId);
      await updateDoc(requestRef, {
        status: newStatus,
        updatedAt: new Date()
      });
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  // Add delete handler
  const handleDelete = async (requestId) => {
    try {
      const requestRef = doc(db, 'joinRequests', requestId);
      await deleteDoc(requestRef);
      setShowDeleteConfirm(false);
      setRequestToDelete(null);
    } catch (error) {
      console.error('Error deleting request:', error);
    }
  };

  const filteredRequests = requests.filter(request => 
    request.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    request.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <div className="text-center py-8">Loading requests...</div>;
  }

  if (error) {
    return <div className="text-center py-8 text-red-600">{error}</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Join Requests</h2>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search requests..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 border rounded-lg w-64"
          />
        </div>
      </div>

      <div className="grid gap-6">
        {filteredRequests.map((request) => (
          <motion.div
            key={request.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-lg overflow-hidden"
          >
            <div className="p-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
                <div>
                  <div className="flex items-center space-x-3">
                    <h3 className="text-lg font-semibold">{request.name}</h3>
                    <StatusBadge status={request.status || 'PENDING'} />
                  </div>
                  <p className="text-gray-600 mt-1">{request.email}</p>
                  <p className="text-gray-500 text-sm mt-1">Submitted: {request.createdAt}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setSelectedRequest(request)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                    title="View Details"
                  >
                    <FileText className="w-5 h-5" />
                  </button>
                  {request.resumeUrl && (
                    <a
                      href={request.resumeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                      title="Download Resume"
                    >
                      <Download className="w-5 h-5" />
                    </a>
                  )}
                  <button
                    onClick={() => handleStatusChange(request.id, 'APPROVED')}
                    className="p-2 text-green-600 hover:bg-green-50 rounded-lg"
                    title="Approve Request"
                  >
                    <Check className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handleStatusChange(request.id, 'REJECTED')}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                    title="Reject Request"
                  >
                    <X className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => {
                      setRequestToDelete(request);
                      setShowDeleteConfirm(true);
                    }}
                    className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg"
                    title="Delete Request"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Request Details Modal */}
      {selectedRequest && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl shadow-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-semibold">{selectedRequest.name}</h3>
                  <p className="text-gray-600">{selectedRequest.email}</p>
                </div>
                <button
                  onClick={() => setSelectedRequest(null)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-700">Why they want to join</h4>
                  <p className="mt-1 text-gray-600 whitespace-pre-wrap">{selectedRequest.reason}</p>
                </div>

                {selectedRequest.resumeUrl && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-700">Resume</h4>
                    <a
                      href={selectedRequest.resumeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-1 inline-flex items-center text-blue-600 hover:text-blue-700"
                    >
                      <Download className="w-4 h-4 mr-1" />
                      Download Resume
                    </a>
                  </div>
                )}

                <div>
                  <h4 className="text-sm font-medium text-gray-700">Application Date</h4>
                  <p className="mt-1 text-gray-600">{selectedRequest.createdAt}</p>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-gray-700">Status</h4>
                  <div className="mt-2">
                    <StatusBadge status={selectedRequest.status || 'PENDING'} />
                  </div>
                </div>
              </div>

              <div className="mt-6 flex justify-end space-x-3">
                <button
                  onClick={() => setSelectedRequest(null)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    handleStatusChange(selectedRequest.id, 'APPROVED');
                    setSelectedRequest(null);
                  }}
                  className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                >
                  Approve Application
                </button>
                <button
                  onClick={() => {
                    handleStatusChange(selectedRequest.id, 'REJECTED');
                    setSelectedRequest(null);
                  }}
                  className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                >
                  Reject Application
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl shadow-lg p-6 max-w-md w-full"
          >
            <h3 className="text-xl font-semibold mb-4">Confirm Delete</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete the join request from {requestToDelete.name}? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => {
                  setShowDeleteConfirm(false);
                  setRequestToDelete(null);
                }}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(requestToDelete.id)}
                className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {filteredRequests.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No join requests found
        </div>
      )}
    </div>
  );
};

export default JoinRequestsManagement;