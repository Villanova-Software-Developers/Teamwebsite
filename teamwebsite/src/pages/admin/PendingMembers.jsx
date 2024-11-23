import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  GithubIcon, LinkedinIcon, MailIcon, 
  Check, X, Edit 
} from 'lucide-react';
import { db } from '../../contexts/AuthContext';
import { 
  collection, query, getDocs, doc, 
  deleteDoc, addDoc, updateDoc 
} from 'firebase/firestore';

const PendingMembers = () => {
  const [pendingMembers, setPendingMembers] = useState([]);
  const [editingMember, setEditingMember] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    role: 'MEMBER',
  });

  useEffect(() => {
    fetchPendingMembers();
  }, []);

  const fetchPendingMembers = async () => {
    try {
      const q = query(collection(db, 'pendingMembers'));
      const querySnapshot = await getDocs(q);
      const members = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setPendingMembers(members);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching pending members:', err);
      setError('Failed to fetch pending members');
      setLoading(false);
    }
  };

  const handleApprove = async (member) => {
    try {
      // Get current count of members for ordering
      const membersSnapshot = await getDocs(collection(db, 'members'));
      const currentOrder = membersSnapshot.size;

      // Add to members collection with role and order
      await addDoc(collection(db, 'members'), {
        ...member,
        role: formData.role || 'MEMBER',
        order: currentOrder,
        approvedAt: new Date(),
        status: 'APPROVED'
      });

      // Delete from pending
      await deleteDoc(doc(db, 'pendingMembers', member.id));
      
      // Refresh list
      fetchPendingMembers();
    } catch (err) {
      console.error('Error approving member:', err);
      setError('Failed to approve member');
    }
  };

  const handleReject = async (memberId) => {
    if (window.confirm('Are you sure you want to reject this application?')) {
      try {
        await deleteDoc(doc(db, 'pendingMembers', memberId));
        fetchPendingMembers();
      } catch (err) {
        console.error('Error rejecting member:', err);
        setError('Failed to reject member');
      }
    }
  };

  const handleEdit = (member) => {
    setEditingMember(member.id);
    setFormData({
      role: member.role || 'MEMBER',
    });
  };

  const handleUpdate = async (member) => {
    try {
      await updateDoc(doc(db, 'pendingMembers', member.id), {
        role: formData.role
      });
      setEditingMember(null);
      fetchPendingMembers();
    } catch (err) {
      console.error('Error updating member:', err);
      setError('Failed to update member');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <div className="text-lg">Loading pending members...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Pending Member Applications</h2>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-lg">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {pendingMembers.map((member) => (
          <motion.div
            key={member.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-lg overflow-hidden"
          >
            <div className="p-6">
              <div className="text-center">
                <img
                  src={member.image || "/api/placeholder/150/150"}
                  alt={member.name}
                  className="w-32 h-32 object-cover rounded-full mx-auto mb-4"
                />
                <h3 className="text-lg font-semibold">{member.name}</h3>
                {editingMember === member.id ? (
                  <div className="mt-2 mb-4">
                    <select
                      value={formData.role}
                      onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                      className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    >
                      <option value="CO_PRES">Co-President</option>
                      <option value="MEMBER">Member</option>
                      <option value="ADVISOR">Advisor</option>
                    </select>
                    <div className="flex justify-center space-x-2 mt-2">
                      <button
                        onClick={() => handleUpdate(member)}
                        className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setEditingMember(null)}
                        className="px-3 py-1 text-gray-600 hover:bg-gray-100 rounded"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <p className="text-blue-600 mb-4">{member.role || 'Member'}</p>
                )}
                <p className="text-gray-600 mt-2">{member.about}</p>
                <div className="flex justify-center space-x-3 mt-4">
                  {member.github && (
                    <a href={member.github} target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-blue-600">
                      <GithubIcon className="w-5 h-5" />
                    </a>
                  )}
                  {member.linkedin && (
                    <a href={member.linkedin} target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-blue-600">
                      <LinkedinIcon className="w-5 h-5" />
                    </a>
                  )}
                  {member.email && (
                    <a href={`mailto:${member.email}`} className="text-gray-600 hover:text-blue-600">
                      <MailIcon className="w-5 h-5" />
                    </a>
                  )}
                </div>
                <div className="flex justify-center space-x-3 mt-6">
                  <button
                    onClick={() => handleEdit(member)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-full"
                  >
                    <Edit className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handleApprove(member)}
                    className="p-2 text-green-600 hover:bg-green-50 rounded-full"
                  >
                    <Check className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handleReject(member.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-full"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        ))}

        {pendingMembers.length === 0 && (
          <div className="col-span-3 text-center py-12 text-gray-500">
            No pending member applications
          </div>
        )}
      </div>
    </div>
  );
};

export default PendingMembers;