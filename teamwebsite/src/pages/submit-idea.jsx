import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, Upload, CheckCircle, X } from 'lucide-react';
import { storage, db } from '../contexts/AuthContext';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

const SubmitIdea = () => {
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    projectTitle: '',
    description: '',
    file: null,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      let fileUrl = null;
      if (formState.file) {
        const fileRef = ref(storage, `project_docs/${Date.now()}_${formState.file.name}`);
        await uploadBytes(fileRef, formState.file);
        fileUrl = await getDownloadURL(fileRef);
      }

      await addDoc(collection(db, 'projectIdeas'), {
        name: formState.name,
        email: formState.email,
        projectTitle: formState.projectTitle,
        description: formState.description,
        documentUrl: fileUrl,
        status: 'NEW',
        createdAt: serverTimestamp(),
      });

      setIsSubmitting(false);
      setIsSubmitted(true);
      
      setTimeout(() => {
        setIsSubmitted(false);
        setFormState({
          name: '',
          email: '',
          projectTitle: '',
          description: '',
          file: null,
        });
      }, 3000);
    } catch (error) {
      setError('Error submitting form. Please try again.');
      setIsSubmitting(false);
      console.error('Submission error:', error);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && (file.type === 'application/pdf' || file.type === 'application/msword' || file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document')) {
      if (file.size <= 10 * 1024 * 1024) { // 10MB in bytes
        setFormState((prev) => ({ ...prev, file }));
        setError('');
      } else {
        setError('File size must be less than 10MB');
        e.target.value = '';
      }
    } else {
      setError('Please upload a PDF or DOC file');
      e.target.value = '';
    }
  };

  const handleRemoveFile = () => {
    setFormState((prev) => ({ ...prev, file: null }));
    setError('');
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
  };

  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + ' B';
    else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
    else return (bytes / 1048576).toFixed(1) + ' MB';
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-lg p-8"
        >
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Submit Your Idea</h1>
            <p className="mt-2 text-gray-600">
              Share your innovative project ideas with us
            </p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-md">
              {error}
            </div>
          )}

          {isSubmitted ? (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="text-center py-12"
            >
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <h2 className="text-2xl font-semibold text-gray-900">
                Thank You for Your Submission!
              </h2>
              <p className="mt-2 text-gray-600">
                We'll review your idea and get back to you soon.
              </p>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700"
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
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700"
                >
                  Email Address
                </label>
                <motion.input
                  whileFocus={{ scale: 1.01 }}
                  type="email"
                  id="email"
                  name="email"
                  value={formState.email}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label
                  htmlFor="projectTitle"
                  className="block text-sm font-medium text-gray-700"
                >
                  Project Title
                </label>
                <motion.input
                  whileFocus={{ scale: 1.01 }}
                  type="text"
                  id="projectTitle"
                  name="projectTitle"
                  value={formState.projectTitle}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label
                  htmlFor="description"
                  className="block text-sm font-medium text-gray-700"
                >
                  Project Description
                </label>
                <motion.textarea
                  whileFocus={{ scale: 1.01 }}
                  id="description"
                  name="description"
                  rows={4}
                  value={formState.description}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Project One-pager
                </label>
                {formState.file ? (
                  <div className="mt-1 p-4 border border-gray-300 rounded-md">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Upload className="h-5 w-5 text-gray-400" />
                        <div>
                          <p className="text-sm font-medium text-gray-700">{formState.file.name}</p>
                          <p className="text-xs text-gray-500">{formatFileSize(formState.file.size)}</p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={handleRemoveFile}
                        className="text-gray-400 hover:text-gray-500"
                      >
                        <X className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                ) : (
                  <motion.div
                    whileHover={{ scale: 1.01 }}
                    className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md"
                  >
                    <div className="space-y-1 text-center">
                      <Upload className="mx-auto h-12 w-12 text-gray-400" />
                      <div className="flex text-sm text-gray-600">
                        <label
                          htmlFor="file-upload"
                          className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none"
                        >
                          <span>Upload a file</span>
                          <input
                            id="file-upload"
                            name="file-upload"
                            type="file"
                            className="sr-only"
                            onChange={handleFileChange}
                            accept=".pdf,.doc,.docx"
                          />
                        </label>
                        <p className="pl-1">or drag and drop</p>
                      </div>
                      <p className="text-xs text-gray-500">
                        PDF, DOC up to 10MB
                      </p>
                    </div>
                  </motion.div>
                )}
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={isSubmitting}
                className={`w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white 
                  ${isSubmitting ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'}
                  focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
              >
                {isSubmitting ? (
                  <>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                      className="mr-2"
                    >
                      <Send className="w-4 h-4" />
                    </motion.div>
                    Submitting...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-2" />
                    Submit Idea
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

export default SubmitIdea;