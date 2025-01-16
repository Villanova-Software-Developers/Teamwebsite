import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Search, 
  Clock, 
  Calendar,
  Users,
  BarChart2,
  X,
  Trash2
} from 'lucide-react';
import { db } from '../../contexts/AuthContext';
import { 
  collection, 
  query, 
  orderBy,
  onSnapshot,
  deleteDoc,
  doc 
} from 'firebase/firestore';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';

const TimeAvailabilityAdmin = () => {
  const [submissions, setSubmissions] = useState([]);
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [submissionToDelete, setSubmissionToDelete] = useState(null);

  useEffect(() => {
    const q = query(collection(db, 'timeAvailability'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const submissionsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate().toLocaleString() || 'N/A'
      }));
      setSubmissions(submissionsData);
      setLoading(false);
    }, (error) => {
      console.error('Error fetching submissions:', error);
      setError('Failed to load time availability submissions');
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleDelete = async (submissionId) => {
    try {
      await deleteDoc(doc(db, 'timeAvailability', submissionId));
      setShowDeleteConfirm(false);
      setSubmissionToDelete(null);
    } catch (error) {
      console.error('Error deleting submission:', error);
    }
  };

  // Calculate statistics
  const calculateStats = () => {
    const totalSubmissions = submissions.length;
    
    // Count all time preferences (now handling arrays)
    const timePreferences = submissions.reduce((acc, sub) => {
      if (Array.isArray(sub.timePreferences)) {
        sub.timePreferences.forEach(pref => {
          acc[pref] = (acc[pref] || 0) + 1;
        });
      }
      return acc;
    }, {});

    const avgWeeklyHours = submissions.reduce((acc, sub) => 
      acc + (parseInt(sub.weeklyHours) || 0), 0) / totalSubmissions || 0;

    // Find most popular time slot
    const mostPopularTime = Object.entries(timePreferences)
      .sort(([,a], [,b]) => b - a)[0]?.[0] || 'None';

    return {
      totalSubmissions,
      timePreferences,
      avgWeeklyHours: avgWeeklyHours.toFixed(1),
      mostPopularTime
    };
  };

  const stats = calculateStats();

  // Prepare chart data
  const timePreferenceChartData = Object.entries(stats.timePreferences)
    .map(([time, count]) => ({
      name: time === 'tuesday' ? 'Tuesday' : 
            time === 'wednesday' ? 'Wednesday' :
            time === 'thursday' ? 'Thursday' : 'Other',
      value: count
    }));

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  const filteredSubmissions = submissions.filter(submission => 
    submission.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatTimePreferences = (preferences) => {
    if (!Array.isArray(preferences)) return 'None specified';
    
    return preferences.map(pref => {
      switch(pref) {
        case 'tuesday': return 'Tuesday 7-9 PM';
        case 'wednesday': return 'Wednesday 7-9 PM';
        case 'thursday': return 'Thursday 7-9 PM';
        case 'other': return 'Other';
        default: return pref;
      }
    }).join(', ');
  };

  if (loading) {
    return <div className="text-center py-8">Loading submissions...</div>;
  }

  if (error) {
    return <div className="text-center py-8 text-red-600">{error}</div>;
  }

  return (
    <div className="space-y-8">
      {/* Header and Search */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Time Availability Management</h2>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search by name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 border rounded-lg w-64"
          />
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-lg p-6"
        >
          <div className="flex items-center">
            <Users className="w-8 h-8 text-blue-500" />
            <div className="ml-4">
              <p className="text-sm text-gray-600">Total Submissions</p>
              <p className="text-2xl font-bold">{stats.totalSubmissions}</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-lg p-6"
        >
          <div className="flex items-center">
            <Clock className="w-8 h-8 text-green-500" />
            <div className="ml-4">
              <p className="text-sm text-gray-600">Average Weekly Hours</p>
              <p className="text-2xl font-bold">{stats.avgWeeklyHours}</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-lg p-6"
        >
          <div className="flex items-center">
            <Calendar className="w-8 h-8 text-purple-500" />
            <div className="ml-4">
              <p className="text-sm text-gray-600">Most Popular Time</p>
              <p className="text-2xl font-bold capitalize">
                {stats.mostPopularTime === 'tuesday' ? 'Tuesday' :
                 stats.mostPopularTime === 'wednesday' ? 'Wednesday' :
                 stats.mostPopularTime === 'thursday' ? 'Thursday' :
                 stats.mostPopularTime}
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-lg p-6"
        >
          <h3 className="text-lg font-semibold mb-4">Time Slot Popularity</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={timePreferenceChartData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label
                >
                  {timePreferenceChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-lg p-6"
        >
          <h3 className="text-lg font-semibold mb-4">Weekly Hours Distribution</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={submissions.map(s => ({
                  name: s.name,
                  hours: parseInt(s.weeklyHours) || 0
                }))}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="hours" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

      {/* Submissions List */}
      <div className="grid gap-6">
        {filteredSubmissions.map((submission) => (
          <motion.div
            key={submission.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-lg overflow-hidden"
          >
            <div className="p-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
                <div>
                  <h3 className="text-lg font-semibold">{submission.name}</h3>
                  <p className="text-gray-600 mt-1">
                    Available Times: {formatTimePreferences(submission.timePreferences)}
                  </p>
                  <p className="text-gray-600">Weekly Hours: {submission.weeklyHours}</p>
                  <p className="text-gray-500 text-sm mt-1">Submitted: {submission.createdAt}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setSelectedSubmission(submission)}
                    className="px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                  >
                    View Details
                  </button>
                  <button
                    onClick={() => {
                      setSubmissionToDelete(submission);
                      setShowDeleteConfirm(true);
                    }}
                    className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg"
                    title="Delete Submission"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Submission Details Modal */}
      {selectedSubmission && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl shadow-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-semibold">{selectedSubmission.name}</h3>
                </div>
                <button
                  onClick={() => setSelectedSubmission(null)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-700">Available Time Slots</h4>
                  <p className="mt-1 text-gray-600">{formatTimePreferences(selectedSubmission.timePreferences)}</p>
                </div>

                {selectedSubmission.customTime && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-700">Additional Time Details</h4>
                    <p className="mt-1 text-gray-600">{selectedSubmission.customTime}</p>
                  </div>
                )}

                <div>
                  <h4 className="text-sm font-medium text-gray-700">Weekly Hours Commitment</h4>
                  <p className="mt-1 text-gray-600">{selectedSubmission.weeklyHours} hours</p>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-gray-700">Submission Date</h4>
                  <p className="mt-1 text-gray-600">{selectedSubmission.createdAt}</p>
                </div>
              </div>

              <div className="mt-6 flex justify-end space-x-3">
                <button
                  onClick={() => setSelectedSubmission(null)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Close
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
            className="bg-white rounded-xl shadow-lg p-6 max-w-md w-full">
            <h3 className="text-xl font-semibold mb-4">Confirm Delete</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete the availability submission from {submissionToDelete.name}? 
              This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => {
                  setShowDeleteConfirm(false);
                  setSubmissionToDelete(null);
                }}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(submissionToDelete.id)}
                className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {filteredSubmissions.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No availability submissions found
        </div>
      )}
    </div>
  );
};

export default TimeAvailabilityAdmin;