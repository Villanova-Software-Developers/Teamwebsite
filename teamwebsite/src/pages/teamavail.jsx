import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, CheckCircle, Clock } from 'lucide-react';
import { db } from '../contexts/AuthContext';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

const TimeAvailability = () => {
  const [formState, setFormState] = useState({
    name: '',
    timePreferences: [], // Changed to array for multiple selection
    customTime: '',
    weeklyHours: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      await addDoc(collection(db, 'timeAvailability'), {
        name: formState.name,
        timePreferences: formState.timePreferences,
        customTime: formState.customTime,
        weeklyHours: formState.weeklyHours,
        semester: 'Spring 2025',
        createdAt: serverTimestamp(),
      });

      setIsSubmitting(false);
      setIsSubmitted(true);
      
      setTimeout(() => {
        setIsSubmitted(false);
        setFormState({
          name: '',
          timePreferences: [],
          customTime: '',
          weeklyHours: '',
        });
      }, 3000);
    } catch (error) {
      setError('Error submitting form. Please try again.');
      setIsSubmitting(false);
      console.error('Submission error:', error);
    }
  };

  const handleTimePreferenceChange = (value) => {
    setFormState((prev) => {
      const timePreferences = prev.timePreferences.includes(value)
        ? prev.timePreferences.filter(time => time !== value)
        : [...prev.timePreferences, value];
      return { ...prev, timePreferences };
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="min-h-screen bg-gray-50 py-16">
      <div className="max-w-4xl mx-auto px-6 sm:px-8 lg:px-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-xl p-10"
        >
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-6 font-sans">Spring 2025 Availability</h1>
            <div className="mt-6 text-black-600 space-y-4 max-w-3xl mx-auto">
              <p className="text-lg font-sans leading-relaxed">
              We are excited to announce our collaboration with VCG Group on the Optima application project. 
                This is a great opportunity to work on a real-world project and gain valuable experience. 
                We also have couple of projects from two other non profits and people can choose which they want to work on.
              </p>
              <p className="text-lg">
              Please indicate your availability for our weekly team meetings and your planned contribution hours. 
                We'll use this information to schedule our Spring 2025 sessions and organize project workload.
              </p>
              <p className="text-lg font-medium mt-4">
                Please select all time slots when you're available for team meetings. Multiple selections help us find 
                the best time that works for everyone.
              </p>
            </div>
          </div>

          {error && (
            <div className="mb-8 p-4 bg-red-50 border border-red-200 text-red-600 rounded-lg text-center">
              {error}
            </div>
          )}

          {isSubmitted ? (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="text-center py-16"
            >
              <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-6" />
              <h2 className="text-3xl font-semibold text-black-900 mb-4 font-serif tracking-tight">
                Thank You for Submitting Your Availability!
              </h2>
              <p className="mt-4 text-lg text-gray-600">
                We'll coordinate the meeting time based on everyone's preferences.
              </p>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="bg-gray-50 p-6 rounded-xl">
                <label
                  htmlFor="name"
                  className="block text-lg font-medium text-gray-700 mb-3 font-sans tracking-wide"
                >
                  Full Name
                </label>
                <motion.input
                  whileFocus={{ scale: 1.01 }}
                  type="text"
                  id="name"
                  name="name"
                  value={formState.name}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 text-lg py-3"
                />
              </div>

              <div className="bg-gray-50 p-6 rounded-xl">
                <label className="block text-lg font-medium text-gray-700 mb-4">
                  Meeting Time Preferences (Select all that work for you)
                </label>
                <div className="space-y-4">
                  {[
                    { value: 'tuesday', label: 'Tuesday 7:00 PM - 9:00 PM' },
                    { value: 'wednesday', label: 'Wednesday 7:00 PM - 9:00 PM' },
                    { value: 'thursday', label: 'Thursday 7:00 PM - 9:00 PM' }
                  ].map((option) => (
                    <div key={option.value} className="flex items-center bg-white p-4 rounded-lg border border-gray-200">
                      <input
                        type="checkbox"
                        id={option.value}
                        checked={formState.timePreferences.includes(option.value)}
                        onChange={() => handleTimePreferenceChange(option.value)}
                        className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <label
                        htmlFor={option.value}
                        className="ml-4 block text-base text-gray-700 font-sans tracking-wide"
                      >
                        {option.label}
                      </label>
                    </div>
                  ))}
                  <div className="flex items-center bg-white p-4 rounded-lg border border-gray-200">
                    <input
                      type="checkbox"
                      id="other"
                      checked={formState.timePreferences.includes('other')}
                      onChange={() => handleTimePreferenceChange('other')}
                      className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label
                      htmlFor="other"
                      className="ml-4 block text-base text-gray-700"
                    >
                      Other
                    </label>
                  </div>
                </div>
              </div>

              {formState.timePreferences.includes('other') && (
                <div className="bg-gray-50 p-6 rounded-xl">
                  <label
                    htmlFor="customTime"
                    className="block text-lg font-medium text-gray-700 mb-3"
                  >
                    Specify Additional Availability
                  </label>
                  <motion.textarea
                    whileFocus={{ scale: 1.01 }}
                    id="customTime"
                    name="customTime"
                    rows={4}
                    value={formState.customTime}
                    onChange={handleChange}
                    required
                    placeholder="Please specify any other days and times that work for you..."
                    className="mt-1 block w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 text-base"
                  />
                </div>
              )}

              <div className="bg-gray-50 p-6 rounded-xl">
                <label
                  htmlFor="weeklyHours"
                  className="block text-lg font-medium text-gray-700 mb-3"
                >
                  Planned Weekly Contribution Hours
                </label>
                <div className="flex items-center">
                  <Clock className="w-6 h-6 text-gray-400 mr-3" />
                  <motion.input
                    whileFocus={{ scale: 1.01 }}
                    type="number"
                    id="weeklyHours"
                    name="weeklyHours"
                    min="1"
                    max="40"
                    value={formState.weeklyHours}
                    onChange={handleChange}
                    required
                    placeholder="Enter hours per week"
                    className="block w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 text-lg py-3"
                  />
                </div>
                <p className="mt-2 text-sm text-gray-500 font-sans italic">
                  Please indicate how many hours per week you plan to contribute to the project
                </p>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={isSubmitting}
                className={`w-full flex justify-center items-center py-4 px-6 border border-transparent rounded-xl shadow-sm text-lg font-medium text-white 
                  ${isSubmitting ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'}
                  focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
              >
                {isSubmitting ? (
                  <>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                      className="mr-3"
                    >
                      <Send className="w-5 h-5" />
                    </motion.div>
                    Submitting...
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5 mr-3" />
                    Submit Availability
                  </>
                )}
              </motion.button>
            </form>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default TimeAvailability;