import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { ArrowRight } from 'lucide-react';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../contexts/AuthContext';

const Projects = () => {
  const [activeTab, setActiveTab] = useState('current');
  const [projects, setProjects] = useState({ current: [], past: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'projects'));
      const projectsData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      // Separate projects into current and past
      const categorizedProjects = {
        current: projectsData.filter(project => project.status === 'current'),
        past: projectsData.filter(project => project.status === 'past')
      };

      setProjects(categorizedProjects);
    } catch (error) {
      console.error('Error fetching projects:', error);
      setError('Failed to load projects');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center text-gray-600">Loading projects...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center text-red-600">{error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Our Projects</h1>
          <p className="text-gray-600">Discover our innovative work and achievements</p>
        </motion.div>

        {/* Tab Navigation */}
        <div className="flex justify-center space-x-4 mb-12">
          {['current', 'past'].map((tab) => (
            <motion.button
              key={tab}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-2 rounded-full ${
                activeTab === tab
                  ? 'bg-blue-500 text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-100'
              } transition-colors duration-200`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)} Projects
            </motion.button>
          ))}
        </div>

        {/* Projects Grid */}
        <div ref={ref} className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <AnimatePresence mode="wait">
            {projects[activeTab].map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: index * 0.2 }}
                className="bg-white rounded-xl shadow-lg overflow-hidden"
              >
                {project.image && (
                  <div className="w-full h-48">
                    <img
                      src={project.image}
                      alt={project.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-bold text-gray-900">
                      {project.title}
                    </h3>
                    <span
                      className={`px-3 py-1 rounded-full text-sm ${
                        project.status === 'past'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-blue-100 text-blue-800'
                      }`}
                    >
                      {project.status === 'current' ? 'In Progress' : 'Completed'}
                    </span>
                  </div>
                  <p className="text-gray-600 mb-4">{project.about}</p>
                  
                  {/* Progress Bar */}
                  <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${project.completion}%` }}
                      transition={{ duration: 1, delay: index * 0.2 }}
                      className="bg-blue-500 h-2 rounded-full"
                    />
                  </div>

                  {project.learnMoreLink && (
                    <motion.a
                      href={project.learnMoreLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      whileHover={{ x: 5 }}
                      className="flex items-center text-blue-500 hover:text-blue-600"
                    >
                      Learn More <ArrowRight className="ml-2 w-4 h-4" />
                    </motion.a>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default Projects;