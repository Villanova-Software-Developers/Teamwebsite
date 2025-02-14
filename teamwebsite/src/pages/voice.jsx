import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, AlertCircle } from 'lucide-react';

const VoiceAssistant = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [response, setResponse] = useState('');
  const [error, setError] = useState('');
  const [status, setStatus] = useState('idle');
  
  const recognitionRef = useRef(null);
  const transcriptPartsRef = useRef([]);

  const OPENAI_API_KEY = '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';
  const API_URL = 'https://api.openai.com/v1/chat/completions';

  useEffect(() => {
    initializeSpeechRecognition();
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  const initializeSpeechRecognition = () => {
    if (!('webkitSpeechRecognition' in window)) {
      setError('Speech recognition is not supported in this browser. Please use Chrome, Edge, or Safari.');
      return;
    }

    try {
      const SpeechRecognition = window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true; // Set to true for continuous recording
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onstart = () => {
        console.log('Recording started');
        setError('');
        // Reset transcript parts when starting new recording
        transcriptPartsRef.current = [];
      };

      recognitionRef.current.onend = () => {
        console.log('Recording ended');
        if (isRecording) {
          try {
            recognitionRef.current.start();
          } catch (error) {
            console.error('Error restarting recognition:', error);
          }
        }
      };

      recognitionRef.current.onresult = (event) => {
        let interimTranscript = '';
        
        // Process all results, including interim ones
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          
          if (event.results[i].isFinal) {
            // Add final results to our transcript parts array
            transcriptPartsRef.current.push(transcript.trim());
          } else {
            // Collect interim results
            interimTranscript += transcript;
          }
        }
        
        // Combine all final transcripts with the current interim transcript
        const fullTranscript = [
          ...transcriptPartsRef.current,
          interimTranscript
        ].join(' ').trim();
        
        setTranscript(fullTranscript);
      };

      recognitionRef.current.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        if (event.error !== 'no-speech') {
          setError(getErrorMessage(event.error));
        }
      };

    } catch (error) {
      console.error('Recognition initialization error:', error);
      setError('Failed to initialize speech recognition. Please refresh and try again.');
    }
  };

  const getErrorMessage = (errorType) => {
    const errorMessages = {
      'network': 'Network error. Please check your internet connection.',
      'no-speech': 'No speech detected. Please try speaking again.',
      'audio-capture': 'No microphone detected. Please check your microphone.',
      'not-allowed': 'Microphone access denied. Please allow microphone access.',
      'aborted': 'Recognition stopped.',
      'default': 'An error occurred. Please try again.'
    };
    return errorMessages[errorType] || errorMessages.default;
  };

  const toggleRecording = async () => {
    if (isRecording) {
      // Stop recording
      recognitionRef.current.stop();
      setIsRecording(false);
      
      // Process the accumulated transcript
      if (transcript.trim()) {
        await processQuestion(transcript);
      }
    } else {
      // Start new recording
      setIsRecording(true);
      setTranscript('');
      setResponse('');
      try {
        recognitionRef.current.start();
      } catch (error) {
        console.error('Error starting recognition:', error);
        setError('Failed to start recording. Please try again.');
      }
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      toggleRecording();
    }
  };

  const processQuestion = async (question) => {
    if (!question || !question.trim()) return;
    
    try {
      setStatus('processing');
      setResponse('Processing your question...');

      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${OPENAI_API_KEY}`
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [
            {
              role: 'system',
              content: 'You are a technical assistant. Provide clear, concise, and technically accurate answers.'
            },
            {
              role: 'user',
              content: question
            }
          ],
          temperature: 0.3,
          max_tokens: 150
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || 'API request failed');
      }

      const data = await response.json();
      const aiResponse = data.choices[0].message.content;
      setResponse(aiResponse);
      setStatus('idle');

    } catch (err) {
      setStatus('error');
      setError(`Error: ${err.message || 'Failed to get AI response'}. Please try again.`);
      console.error('Error:', err);
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto" onKeyPress={handleKeyPress} tabIndex={0}>
      <div className="space-y-6">
        <div className={`text-center p-2 rounded-lg ${status === 'error' ? 'bg-red-50' : 'bg-gray-50'}`}>
          <div className="flex items-center justify-center gap-2">
            {status === 'error' && <AlertCircle className="w-5 h-5 text-red-500" />}
            <span className={`font-medium ${status === 'error' ? 'text-red-500' : 'text-blue-500'}`}>
              {error || (isRecording ? 'Recording... Click button or press Enter to stop and get answer' : 'Click button or press Enter to start recording')}
            </span>
          </div>
        </div>

        <div className="flex items-center justify-center space-x-4">
          <button
            onClick={toggleRecording}
            className={`p-4 rounded-full ${
              isRecording ? 'bg-red-500 hover:bg-red-600' : 'bg-blue-500 hover:bg-blue-600'
            } relative transition-colors duration-200`}
            aria-label={isRecording ? 'Stop recording' : 'Start recording'}
          >
            {isRecording ? (
              <MicOff className="w-6 h-6 text-white" />
            ) : (
              <Mic className="w-6 h-6 text-white" />
            )}
            {isRecording && (
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full animate-pulse" />
            )}
          </button>
        </div>

        <div className="space-y-4">
          <div className="p-4 bg-gray-100 rounded-lg min-h-20">
            <h3 className="font-semibold mb-2">Your technical question:</h3>
            <p>{transcript || 'Click the microphone button or press Enter to start recording'}</p>
          </div>

          <div className="p-4 bg-blue-50 rounded-lg min-h-20">
            <h3 className="font-semibold mb-2">Technical response:</h3>
            <p>{response || 'Waiting for your question...'}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VoiceAssistant;
