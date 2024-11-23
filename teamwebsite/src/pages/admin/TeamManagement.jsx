import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Plus, X, Upload, GithubIcon, 
  LinkedinIcon, MailIcon, Edit, Trash 
} from 'lucide-react';
import { db, storage } from '../../contexts/AuthContext';
import { 
  collection, 
  addDoc, 
  getDocs, 
  deleteDoc, 
  doc, 
  updateDoc, 
  onSnapshot, 
  query, 
  orderBy,
  writeBatch,
  getDoc 
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';


const TeamManagement = () => {
  const [members, setMembers] = useState([]);
  const [isAddingMember, setIsAddingMember] = useState(false);
  const [editingMember, setEditingMember] = useState(null);
  const [draggedItem, setDraggedItem] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    role: 'MEMBER',
    about: '',
    image: null,
    github: '',
    linkedin: '',
    email: '',
    order: 0
  });
  const [previewImage, setPreviewImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    try {
      setLoading(true);
      const q = query(collection(db, 'members'), orderBy('order', 'asc'));
      
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const membersData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          order: doc.data().order || 0
        }));
        setMembers(membersData);
        setLoading(false);
      }, (error) => {
        console.error('Error in snapshot listener:', error);
        setError('Failed to load team members');
        setLoading(false);
      });
  
      return () => unsubscribe();
    } catch (error) {
      console.error('Error setting up listener:', error);
      setError('Failed to load team members');
      setLoading(false);
    }
  }, []);

 


  const fetchMembers = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'members'));
      const membersData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        order: doc.data().order || 0
      }));
      setMembers(membersData.sort((a, b) => a.order - b.order));
    } catch (error) {
      console.error('Error fetching members:', error);
      setError('Failed to load team members');
    }
  };

  const handleDragStart = (e, member) => {
    setDraggedItem(member);
    e.currentTarget.classList.add('opacity-50');
  };

  const handleDragEnd = (e) => {
    e.currentTarget.classList.remove('opacity-50');
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = async (e, targetMember) => {
    e.preventDefault();
    
    if (!draggedItem || draggedItem.id === targetMember.id) return;

    const newMembers = [...members];
    const draggedIndex = members.findIndex(m => m.id === draggedItem.id);
    const targetIndex = members.findIndex(m => m.id === targetMember.id);

    // Swap positions
    newMembers[draggedIndex] = { ...newMembers[draggedIndex], order: targetIndex };
    newMembers[targetIndex] = { ...newMembers[targetIndex], order: draggedIndex };

    // Update state and Firestore
    setMembers(newMembers.sort((a, b) => a.order - b.order));

    try {
      await Promise.all([
        updateDoc(doc(db, 'members', draggedItem.id), { order: targetIndex }),
        updateDoc(doc(db, 'members', targetMember.id), { order: draggedIndex })
      ]);
    } catch (error) {
      console.error('Error updating order:', error);
      setError('Failed to update member order');
    }
  };

  const handleEdit = (member) => {
    setEditingMember(member.id);
    setFormData({
      name: member.name,
      role: member.role,
      about: member.about,
      image: null,
      github: member.github || '',
      linkedin: member.linkedin || '',
      email: member.email || '',
      order: member.order
    });
    setPreviewImage(member.image);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      let imageUrl = previewImage;
      
      if (formData.image) {
        const imageRef = ref(storage, `member_images/${Date.now()}_${formData.image.name}`);
        await uploadBytes(imageRef, formData.image);
        imageUrl = await getDownloadURL(imageRef);
      }

      await updateDoc(doc(db, 'members', editingMember), {
        name: formData.name,
        role: formData.role,
        about: formData.about,
        ...(imageUrl && { image: imageUrl }),
        github: formData.github,
        linkedin: formData.linkedin,
        email: formData.email
      });

      setEditingMember(null);
      fetchMembers();
    } catch (error) {
      console.error('Error updating member:', error);
      setError('Failed to update team member');
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file size (e.g., max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError('Image size must be less than 5MB');
        return;
      }
      setFormData({ ...formData, image: file });
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      let imageUrl = null;
      
      // Upload image if one is selected
      if (formData.image) {
        const imageRef = ref(storage, `member_images/${Date.now()}_${formData.image.name}`);
        await uploadBytes(imageRef, formData.image);
        imageUrl = await getDownloadURL(imageRef);
      }

      // Add member to Firestore
      await addDoc(collection(db, 'members'), {
        name: formData.name,
        role: formData.role,
        about: formData.about,
        image: imageUrl,
        github: formData.github,
        linkedin: formData.linkedin,
        email: formData.email,
        createdAt: new Date(),
        isActive: true
      });

      // Reset form
      setIsAddingMember(false);
      setFormData({
        name: '',
        role: 'MEMBER',
        about: '',
        image: null,
        github: '',
        linkedin: '',
        email: ''
      });
      setPreviewImage(null);
      
      // Refresh members list
      fetchMembers();
    } catch (error) {
      console.error('Error adding member:', error);
      setError('Failed to add team member');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
  if (window.confirm('Are you sure you want to delete this member?')) {
    try {
      setLoading(true);
      setError(null);

      console.log('Starting deletion process for ID:', id);

      // Delete directly from Firestore
      await deleteDoc(doc(db, 'members', id));
      console.log('Document deleted successfully');

    } catch (error) {
      console.error('Error deleting member:', error);
      setError(`Failed to delete team member: ${error.message}`);
      
      // Log additional error details
      console.log('Error details:', {
        code: error.code,
        message: error.message,
        fullError: error
      });
    } finally {
      setLoading(false);
    }
  }
};

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Team Management</h2>
        <button
          onClick={() => setIsAddingMember(true)}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
        >
          <Plus className="w-5 h-5" />
          <span>Add Member</span>
        </button>
      </div>

      {isAddingMember && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-6 rounded-xl shadow-lg"
        >
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Add New Member</h3>
            <button
              onClick={() => setIsAddingMember(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Role
                </label>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
                  <option value="CO_PRES">Co-President</option>
                  <option value="MEMBER">Member</option>
                  <option value="ADVISOR">Advisor</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700">
                  About
                </label>
                <textarea
                  value={formData.about}
                  onChange={(e) => setFormData({ ...formData, about: e.target.value })}
                  rows={3}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700">
                  Profile Image
                </label>
                <div className="mt-1 flex items-center space-x-4">
                  <label className="cursor-pointer bg-white px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50">
                    <Upload className="w-5 h-5 inline-block mr-2" />
                    Upload Image
                    <input
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={handleImageChange}
                    />
                  </label>
                  {previewImage && (
                    <img
                      src={previewImage}
                      alt="Preview"
                      className="h-20 w-20 object-cover rounded-lg"
                    />
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  GitHub URL
                </label>
                <input
                  type="url"
                  value={formData.github}
                  onChange={(e) => setFormData({ ...formData, github: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>

      

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  LinkedIn URL
                </label>
                <input
                  type="url"
                  value={formData.linkedin}
                  onChange={(e) => setFormData({ ...formData, linkedin: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => setIsAddingMember(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
        type="submit"
        disabled={loading}
        className={`px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 ${
          loading ? 'opacity-75 cursor-not-allowed' : ''
        }`}
      >
        {loading ? 'Adding Member...' : 'Add Member'}
      </button>
      
            </div>
          </form>
        </motion.div>
      )}

      {/* Team Members Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {members.map((member) => (
          <motion.div
            key={member.id}
            draggable
            onDragStart={(e) => handleDragStart(e, member)}
            onDragEnd={handleDragEnd}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, member)}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative bg-white rounded-xl shadow-lg overflow-hidden cursor-move"
          >
            <div className="p-6">
              <div className="flex justify-end space-x-2 mb-4">
                <button
                  onClick={() => handleEdit(member)}
                  className="p-1 text-blue-500 hover:bg-blue-50 rounded"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(member.id)}
                  className="p-1 text-red-500 hover:bg-red-50 rounded"
                >
                  <Trash className="w-4 h-4" />
                </button>
              </div>

              {editingMember === member.id ? (
                <form onSubmit={handleUpdate} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Name</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Role</label>
                    <select
                      value={formData.role}
                      onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    >
                      <option value="CO_PRES">Co-President</option>
                      <option value="MEMBER">Member</option>
                      <option value="ADVISOR">Advisor</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">About</label>
                    <textarea
                      value={formData.about}
                      onChange={(e) => setFormData({ ...formData, about: e.target.value })}
                      rows={3}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>

                  {/* Keep the rest of your form fields... */}

                  <div className="flex justify-end space-x-2">
                    <button
                      type="button"
                      onClick={() => setEditingMember(null)}
                      className="px-3 py-1 text-gray-600 hover:bg-gray-100 rounded"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={loading}
                      className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                      {loading ? 'Saving...' : 'Save'}
                    </button>
                  </div>
                </form>
              ) : (
                <div className="text-center">
                  <img
                    src={member.image || "/api/placeholder/150/150"}
                    alt={member.name}
                    className="w-32 h-32 object-cover rounded-full mx-auto mb-4"
                  />
                  <h3 className="text-lg font-semibold">{member.name}</h3>
                  <p className="text-blue-600">{member.role}</p>
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
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default TeamManagement;