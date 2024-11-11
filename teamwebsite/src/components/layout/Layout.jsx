import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { NavLink, Outlet } from 'react-router-dom';
import { Menu, X } from 'lucide-react';


const Layout = () => {
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { path: '/', label: 'Home' },
    { path: '/projects', label: 'Projects' },
    { path: '/members', label: 'Members' },
    { path: '/submit-idea', label: 'Submit an Idea' },
    { path: '/join-us', label: 'Join Us' },  // Added this line
    { path: '/faq', label: 'FAQ & Contact' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="fixed w-full bg-white/80 backdrop-blur-md shadow-sm z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="text-xl font-bold text-gray-800"
              >
                Villanova Software Engineers
              </motion.div>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              {navItems.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) =>
                    `${
                      isActive
                        ? 'text-blue-600 font-medium'
                        : 'text-gray-600 hover:text-blue-500'
                    } transition-colors duration-200`
                  }
                >
                  <motion.div
                    whileHover={{ y: -2 }}
                    className="font-medium"
                  >
                    {item.label}
                  </motion.div>
                </NavLink>
              ))}
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden flex items-center">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="text-gray-600 hover:text-gray-900 p-2"
              >
                {isOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        <motion.div
          initial={false}
          animate={isOpen ? { height: 'auto' } : { height: 0 }}
          className="md:hidden overflow-hidden bg-white"
        >
          <div className="px-4 pt-2 pb-3 space-y-1">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => setIsOpen(false)}
                className={({ isActive }) =>
                  `${
                    isActive
                      ? 'bg-blue-50 text-blue-600'
                      : 'text-gray-600 hover:bg-gray-50'
                  } block px-3 py-2 rounded-md text-base font-medium`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </div>
        </motion.div>
      </nav>

      <main className="pt-16">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;