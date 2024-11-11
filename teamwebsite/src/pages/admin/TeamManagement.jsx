import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Plus, X, Upload, GithubIcon, 
  LinkedinIcon, MailIcon, Edit, Trash 
} from 'lucide-react';

const TeamManagement = () => {
  const [members, setMembers] = useState([]);
  const [isAddingMember, setIsAddingMember] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    role: 'MEMBER',
    about: '',
    image: null,
    github: '',
    linkedin: '',
    email: ''
  });
  const [previewImage, setPreviewImage] = useState(null);

  useEffect(() => {
    // Fetch team members from your API
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    try {
      const response = await fetch('/api/team/');
      const data = await response.json();
      setMembers(data);
    } catch (error) {
      console.error('Error fetching members:', error);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, image: file });
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const formDataToSend = new FormData();
    Object.keys(formData).forEach(key => {
      if (formData[key] !== null) {
        formDataToSend.append(key, formData[key]);
      }
    });

    try {
      const response = await fetch('/api/team/', {
        method: 'POST',
        body: formDataToSend,
      });

      if (response.ok) {
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
        fetchMembers();
      }
    } catch (error) {
      console.error('Error adding member:', error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this member?')) {
      try {
        await fetch(`/api/team/${id}/`, {
          method: 'DELETE',
        });
        fetchMembers();
      } catch (error) {
        console.error('Error deleting member:', error);
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

              // ... (previous code remains the same until the LinkedIn input)

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
  className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
>
  Add Member
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
initial={{ opacity: 0, y: 20 }}
animate={{ opacity: 1, y: 0 }}
className="bg-white rounded-xl shadow-lg overflow-hidden"
>
<div className="p-6">
<div className="flex justify-end space-x-2 mb-4">
  <button
    onClick={() => handleDelete(member.id)}
    className="p-1 text-red-500 hover:bg-red-50 rounded"
  >
    <Trash className="w-4 h-4" />
  </button>
</div>
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
</div>
</motion.div>
))}
</div>
</div>
);
};

export default TeamManagement;