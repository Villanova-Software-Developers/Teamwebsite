import { motion } from 'framer-motion';
import { useState } from 'react';
import { Send, Settings, Loader } from 'lucide-react';

const MedicalQA = () => {
  const [question, setQuestion] = useState('');
  const [response, setResponse] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [settings, setSettings] = useState({
    maxLength: 256,
    temperature: 0.7,
    topP: 0.9,
    repetitionPenalty: 1.2
  });

  const handleSubmit = async () => {
    if (!question.trim()) return;
    setIsLoading(true);
    try {
      const response = await fetch('http://104.154.103.87:8000/api/generate', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({question, settings})
      });
      const data = await response.json();
      setResponse(data);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };
  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 }
  };

  return (
    <motion.div 
      initial="initial"
      animate="animate"
      className="max-w-4xl mx-auto p-6 space-y-6"
    >
      <motion.div 
        variants={fadeIn}
        className="bg-white rounded-lg shadow-lg overflow-hidden"
      >
        <div className="p-6 bg-gradient-to-r from-blue-600 to-blue-800">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-white">Medical Assistant</h2>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowSettings(!showSettings)}
              className="p-2 rounded-full bg-white/20 hover:bg-white/30"
            >
              <Settings className="w-5 h-5 text-white" />
            </motion.button>
          </div>
        </div>

        <div className="p-6">
          <motion.div 
            initial={false}
            animate={{ height: showSettings ? 'auto' : 0 }}
            className="overflow-hidden"
          >
            <div className="grid grid-cols-2 gap-4 mb-4">
              {Object.entries(settings).map(([key, value]) => (
                <div key={key}>
                  <label className="block text-sm font-medium text-gray-700">
                    {key.charAt(0).toUpperCase() + key.slice(1)}
                  </label>
                  <input
                    type="range"
                    min={key === 'maxLength' ? 100 : 0}
                    max={key === 'maxLength' ? 512 : key === 'repetitionPenalty' ? 2 : 1}
                    step={key === 'maxLength' ? 1 : 0.1}
                    value={value}
                    onChange={(e) => setSettings({...settings, [key]: parseFloat(e.target.value)})}
                    className="w-full"
                  />
                  <span className="text-sm text-gray-500">{value}</span>
                </div>
              ))}
            </div>
          </motion.div>

          <div className="mt-4 flex gap-2">
            <input
              type="text"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
              placeholder="Ask your medical question..."
              className="flex-1 p-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleSubmit}
              disabled={isLoading}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
            >
              {isLoading ? <Loader className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
            </motion.button>
          </div>
        </div>
      </motion.div>

      {response && (
        <motion.div
          variants={fadeIn}
          className="bg-white rounded-lg shadow-lg p-6 space-y-4"
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="prose max-w-none"
          >
            <h3 className="text-lg font-semibold text-gray-900">Response</h3>
            <p className="text-gray-700">{response.answer}</p>
            
            <div className="mt-4 flex flex-wrap gap-4 text-sm">
              <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full">
                Type: {response.question_type}
              </span>
              {response.medical_context?.length > 0 && (
                <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full">
                  Context: {response.medical_context.join(', ')}
                </span>
              )}
            </div>
            
            <p className="mt-4 text-sm text-gray-500 italic">
              {response.disclaimer}
            </p>
          </motion.div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default MedicalQA;