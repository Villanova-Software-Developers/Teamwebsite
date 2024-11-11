import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, FileText, TrendingUp, 
  BarChart2, Calendar, ChevronRight 
} from 'lucide-react';
import { 
  LineChart, Line, XAxis, YAxis, 
  CartesianGrid, Tooltip, ResponsiveContainer 
} from 'recharts';
import TeamManagement from './TeamManagement';
import ProjectManagement from './ProjectManagement';

const StatCard = ({ title, value, icon: Icon, trend }) => (
  <motion.div
    whileHover={{ scale: 1.02 }}
    className="bg-white p-6 rounded-xl shadow-lg"
  >
    <div className="flex justify-between items-start">
      <div>
        <p className="text-gray-500 text-sm">{title}</p>
        <h3 className="text-2xl font-bold mt-2">{value}</h3>
        {trend && (
          <p className={`text-sm mt-2 ${trend >= 0 ? 'text-green-500' : 'text-red-500'}`}>
            {trend >= 0 ? '+' : ''}{trend}% from last month
          </p>
        )}
      </div>
      <div className="p-3 bg-blue-50 rounded-lg">
        <Icon className="w-6 h-6 text-blue-500" />
      </div>
    </div>
  </motion.div>
);

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [analyticsData, setAnalyticsData] = useState({
    projectSubmissions: [],
    joinRequests: [],
    trafficData: []
  });

  useEffect(() => {
    // Fetch analytics data from your backend
    // This is mock data for demonstration
    const mockData = {
      projectSubmissions: [
        { date: '2024-01', count: 15 },
        { date: '2024-02', count: 20 },
        { date: '2024-03', count: 25 },
      ],
      joinRequests: [
        { date: '2024-01', count: 30 },
        { date: '2024-02', count: 35 },
        { date: '2024-03', count: 45 },
      ],
      trafficData: [
        { date: '2024-01', visitors: 1200 },
        { date: '2024-02', visitors: 1400 },
        { date: '2024-03', visitors: 1800 },
      ]
    };
    setAnalyticsData(mockData);
  }, []);

  const stats = [
    {
      title: 'Total Project Submissions',
      value: '60',
      icon: FileText,
      trend: 12.5
    },
    {
      title: 'Join Requests',
      value: '110',
      icon: Users,
      trend: 8.2
    },
    {
      title: 'Monthly Traffic',
      value: '1.8K',
      icon: TrendingUp,
      trend: 15.3
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Navigation Tabs */}
        <div className="flex space-x-4 mb-8">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`px-4 py-2 rounded-lg ${
              activeTab === 'dashboard' 
                ? 'bg-blue-500 text-white' 
                : 'bg-white text-gray-600'
            }`}
          >
            Dashboard
          </button>
          <button
            onClick={() => setActiveTab('team')}
            className={`px-4 py-2 rounded-lg ${
              activeTab === 'team' 
                ? 'bg-blue-500 text-white' 
                : 'bg-white text-gray-600'
            }`}
          >
            Team Management
          </button>
          <button
            onClick={() => setActiveTab('projects')}
            className={`px-4 py-2 rounded-lg ${
              activeTab === 'projects' 
                ? 'bg-blue-500 text-white' 
                : 'bg-white text-gray-600'
            }`}
          >
            Project Ideas
          </button>
        </div>

        {activeTab === 'dashboard' && (
          <div className="space-y-8">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {stats.map((stat, index) => (
                <StatCard key={index} {...stat} />
              ))}
            </div>

            {/* Traffic Analytics */}
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <h2 className="text-lg font-semibold mb-4">Traffic Analytics</h2>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={analyticsData.trafficData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Line 
                      type="monotone" 
                      dataKey="visitors" 
                      stroke="#3B82F6" 
                      strokeWidth={2} 
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Submission Analytics */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-xl shadow-lg">
                <h2 className="text-lg font-semibold mb-4">Project Submissions</h2>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={analyticsData.projectSubmissions}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Line 
                        type="monotone" 
                        dataKey="count" 
                        stroke="#10B981" 
                        strokeWidth={2} 
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-lg">
                <h2 className="text-lg font-semibold mb-4">Join Requests</h2>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={analyticsData.joinRequests}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Line 
                        type="monotone" 
                        dataKey="count" 
                        stroke="#6366F1" 
                        strokeWidth={2} 
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'team' && <TeamManagement />}
        {activeTab === 'projects' && <ProjectManagement />}
      </div>
    </div>
  );
};

export default AdminDashboard;