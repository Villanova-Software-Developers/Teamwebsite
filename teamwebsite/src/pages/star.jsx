import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, ArrowRight, Beaker, Lock, MessageSquare, User } from 'lucide-react';

// Hero Section Component
const Hero = () => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="relative h-screen flex items-center justify-center bg-gradient-to-r from-blue-50 to-indigo-50"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.h1 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="text-5xl md:text-6xl font-bold text-gray-900 mb-6"
        >
          Transform Your Hair Journey
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="text-xl text-gray-600 mb-8"
        >
          Data-driven solutions for personalized hair loss treatment
        </motion.p>
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="flex justify-center gap-4"
        >
          <button className="bg-indigo-600 text-white px-8 py-3 rounded-lg hover:bg-indigo-700 transition-colors">
            Get Started
          </button>
          <button className="border border-gray-300 px-8 py-3 rounded-lg hover:bg-gray-50 transition-colors">
            Learn More
          </button>
        </motion.div>
      </div>
    </motion.div>
  );
};

// Features Section
const Feature = ({ icon: Icon, title, description }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="p-6 bg-white rounded-xl shadow-sm"
    >
      <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
        <Icon className="w-6 h-6 text-indigo-600" />
      </div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </motion.div>
  );
};

// How It Works Section
const HowItWorks = () => {
  const steps = [
    { number: 1, title: "Complete Assessment", description: "Take our comprehensive hair health quiz" },
    { number: 2, title: "Lab Testing", description: "Get your baseline metrics through clinical testing" },
    { number: 3, title: "Personalized Plan", description: "Receive your custom treatment protocol" },
    { number: 4, title: "Track Progress", description: "Monitor your results with follow-up testing" },
  ];

  return (
    <div className="py-20 bg-gray-50">
      <div className="max-w-6xl mx-auto px-4">
        <motion.h2 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-4xl font-bold text-center mb-16"
        >
          How It Works
        </motion.h2>
        <div className="grid md:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2 }}
              className="text-center"
            >
              <div className="w-12 h-12 bg-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-bold">{step.number}</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
              <p className="text-gray-600">{step.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Auth Modal
const AuthModal = ({ isOpen, onClose, mode = 'login' }) => {
  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white rounded-lg p-8 max-w-md w-full mx-4"
      >
        <h2 className="text-2xl font-bold mb-6">
          {mode === 'login' ? 'Welcome Back' : 'Create Account'}
        </h2>
        <form className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              placeholder="Enter your email"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              type="password"
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              placeholder="Enter your password"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700 transition-colors"
          >
            {mode === 'login' ? 'Sign In' : 'Create Account'}
          </button>
        </form>
      </motion.div>
    </motion.div>
  );
};

// Main App Component
const Star = () => {
  const [showAuth, setShowAuth] = useState(false);

  return (
    <div className="min-h-screen bg-white">
      <nav className="fixed w-full bg-white/80 backdrop-blur-sm z-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <span className="text-2xl font-bold text-indigo-600">WisePath</span>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <a href="#" className="text-gray-600 hover:text-gray-900">How it Works</a>
              <a href="#" className="text-gray-600 hover:text-gray-900">Results</a>
              <a href="#" className="text-gray-600 hover:text-gray-900">Science</a>
              <button 
                onClick={() => setShowAuth(true)}
                className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
              >
                Get Started
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main>
        <Hero />
        
        <div className="py-20">
          <div className="max-w-6xl mx-auto px-4 grid md:grid-cols-3 gap-8">
            <Feature 
              icon={Beaker}
              title="Data-Driven Treatment"
              description="Clinical lab testing to guide your personalized treatment plan"
            />
            <Feature 
              icon={MessageSquare}
              title="Expert Support"
              description="Direct access to healthcare providers and ongoing guidance"
            />
            <Feature 
              icon={Lock}
              title="HIPAA Compliant"
              description="Your privacy and security are our top priority"
            />
          </div>
        </div>

        <HowItWorks />

        <AuthModal isOpen={showAuth} onClose={() => setShowAuth(false)} />
      </main>

      <footer className="bg-gray-50 py-12">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <p className="text-gray-600">© 2025 WisePath Health LLC. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Star;