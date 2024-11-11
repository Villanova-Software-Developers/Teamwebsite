import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Search, Filter, FileText, 
  ExternalLink, Download, Check, 
  X, AlertCircle 
} from 'lucide-react';

const StatusBadge = ({ status }) => {
  const getStatusColor = () => {
    switch (status) {
      case 'NEW':
        return 'bg-blue-100 text-blue-800';
      case 'REVIEWING':
        return 'bg-yellow-100 text-yellow-800';
      case 'ACCEPTED':
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

const ProjectManagement = () => {
  const [projects, setProjects] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedProject, setSelectedProject] = useState(null);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const response = await fetch('/api/projects/');
      const data = await response.json();
      setProjects(data);
    } catch (error) {
      console.error('Error fetching projects:', error);
    }
  };

  const handleStatusChange = async (projectId, newStatus) => {
    try {
      const response = await fetch(`/api/projects/${projectId}/`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus })
      });

      if (response.ok) {
        fetchProjects();
      }
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const filteredProjects = projects.filter(project => {
    const matchesSearch = 
      project.project_title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || project.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search projects..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 border rounded-lg w-full md:w-64"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2 border rounded-lg"
        >
          <option value="all">All Status</option>
          <option value="NEW">New</option>
          <option value="REVIEWING">Reviewing</option>
          <option value="ACCEPTED">Accepted</option>
          <option value="REJECTED">Rejected</option>
        </select>
      </div>

      <div className="grid gap-6">
        {filteredProjects.map((project) => (
          <motion.div
            key={project.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-lg overflow-hidden"
          >
            <div className="p-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
                <div>
                  <div className="flex items-center space-x-3">
                    <h3 className="text-lg font-semibold">{project.project_title}</h3>
                    <StatusBadge status={project.status} />
                  </div>
                  <p className="text-gray-600 mt-1">By {project.name}</p>
                  <p className="text-gray-500 text-sm mt-1">{project.email}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setSelectedProject(project)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                  >
                    <FileText className="w-5 h-5" />
                  </button>
                  {project.document && (
                    <a
                      href={project.document}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                    >
                      <Download className="w-5 h-5" />
                    </a>
                  )}
                  <button
                    onClick={() => handleStatusChange(project.id, 'REVIEWING')}
                    className="p-2 text-yellow-600 hover:bg-yellow-50 rounded-lg"
                  >
                    <AlertCircle className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handleStatusChange(project.id, 'ACCEPTED')}
                    className="p-2 text-green-600 hover:bg-green-50 rounded-lg"
                  >
                    <Check className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handleStatusChange(project.id, 'REJECTED')}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Project Details Modal */}
      {selectedProject && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl shadow-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-semibold">{selectedProject.project_title}</h3>
                  <p className="text-gray-600">Submitted by {selectedProject.name}</p>
                </div>
                <button
                  onClick={() => setSelectedProject(null)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-700">Description</h4>
                  <p className="mt-1 text-gray-600">{selectedProject.description}</p>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-gray-700">Contact Information</h4>
                  <p className="mt-1 text-gray-600">{selectedProject.email}</p>
                </div>

                {selectedProject.document && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-700">Attached Document</h4>
                    <a
                      href={selectedProject.document}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-1 inline-flex items-center text-blue-600 hover:text-blue-700"
                    >
                      <Download className="w-4 h-4 mr-1" />
                      Download Document
                    </a>
                  </div>
                )}

                <div>
                  <h4 className="text-sm font-medium text-gray-700">Status</h4>
                  <div className="mt-2">
                    <StatusBadge status={selectedProject.status} />
                  </div>
                </div>
              </div>

              <div className="mt-6 flex justify-end space-x-3">
                <button
                  onClick={() => setSelectedProject(null)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    handleStatusChange(selectedProject.id, 'ACCEPTED');
                    setSelectedProject(null);
                  }}
                  className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                >
                  Accept Project
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default ProjectManagement;