import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { ArrowRight, Clock, Star } from 'lucide-react';

const Projects = () => {
  const [activeTab, setActiveTab] = useState('current');
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const projects = {
    current: [
      {
        title: 'Project Alpha',
        description: 'An innovative solution for modern problems',
        status: 'In Progress',
        completion: 75,
      },
      {
        title: 'Project Beta',
        description: 'Revolutionizing the way we think',
        status: 'Planning',
        completion: 25,
      },
    ],
    past: [
      {
        title: 'Project Legacy',
        description: 'Award-winning innovation',
        status: 'Completed',
        completion: 100,
      },
      {
        title: 'Project Phoenix',
        description: 'Breakthrough in technology',
        status: 'Completed',
        completion: 100,
      },
    ],
  };

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
                key={project.title}
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: index * 0.2 }}
                className="bg-white rounded-xl shadow-lg overflow-hidden"
              >
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-bold text-gray-900">
                      {project.title}
                    </h3>
                    <span
                      className={`px-3 py-1 rounded-full text-sm ${
                        project.status === 'Completed'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-blue-100 text-blue-800'
                      }`}
                    >
                      {project.status}
                    </span>
                  </div>
                  <p className="text-gray-600 mb-4">{project.description}</p>
                  
                  {/* Progress Bar */}
                  <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${project.completion}%` }}
                      transition={{ duration: 1, delay: index * 0.2 }}
                      className="bg-blue-500 h-2 rounded-full"
                    />
                  </div>

                  <motion.button
                    whileHover={{ x: 5 }}
                    className="flex items-center text-blue-500 hover:text-blue-600"
                  >
                    Learn More <ArrowRight className="ml-2 w-4 h-4" />
                  </motion.button>
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