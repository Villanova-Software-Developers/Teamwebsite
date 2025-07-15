import React, { useState, useEffect } from 'react';
import { Upload, Search, MapPin, GraduationCap, Hospital, BookOpen, Copy, Check, AlertCircle, Play, Pause } from 'lucide-react';

// Load XLSX library
const loadXLSX = () => {
  return new Promise((resolve) => {
    if (window.XLSX) {
      resolve(window.XLSX);
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js';
    script.onload = () => resolve(window.XLSX);
    document.head.appendChild(script);
  });
};

const CardiologyPSGenerator = () => {
  const [apiKey, setApiKey] = useState('');
  const [originalPS, setOriginalPS] = useState(`My journey into cardiology began in the most unexpected of ways: as a basic science student in Nepal, crafting straw mosaics of the fetal heart and circulation. I was captivated not only by the elegance of cardiovascular physiology but also by the complexity and adaptability of the heart. That fascination has since evolved into a deep, sustained commitment to cardiology, reinforced through clinical encounters, teaching experiences, and research.

One formative case during medical school involved a patient with bradycardia and hypotension. After an unrevealing initial workup, we uncovered a history of consuming wild honey. The diagnosis—grayanotoxin poisoning—underscored for me the importance of vigilance, curiosity, and diagnostic reasoning, qualities that are essential in cardiology. 

My interest in cardiovascular disease deepened as I assisted a cardiologist in running outpatient cardiology camps across rural and semi-urban Nepal. I saw firsthand the burden of undiagnosed and poorly managed heart disease and hypertension in resource-limited settings. These experiences shaped my commitment to preventive cardiology and community-focused care. Around the same time, I served as a trainer at the National Health Training Center, facilitating workshops for physicians and public health workers as part of the "Package of Essential Noncommunicable Disease" program. These sessions emphasized prevention and reduction of cardiovascular risk management and helped me recognize the critical role of education in combating chronic illness. My interests in preventive cardiology made me collaborate on a unique research study on hypertension and its risk factors in a nomadic hunter-gatherer population, published in BMJ Open.

During residency in the United States, I completed interventional and outpatient cardiology rotations and developed a strong interest in critical care cardiology, drawn to its urgency and physiologic depth. I found particular joy in teaching, especially EKGs. I led multiple lectures and workshops for students and junior residents, an experience that solidified my interest in academic medicine and made me a more thoughtful learner and clinician.

Working at a hospital that serves a predominantly underserved population further sharpened my clinical focus. I was struck by the frequency of readmissions for congestive heart failure. In speaking with patients, I discovered that many were drinking large volumes of lemonade and soda, unaware of the dietary impact on their condition. Recognizing this gap in patient education and care coordination, I partnered with co-residents to develop a quality improvement project targeting modifiable contributors to heart failure readmissions. This initiative not only improved my skills in systems-based practice but also deepened my interest in prevention at both the individual and population levels.

Now, as a chief resident, I have the privilege of leading by example—balancing clinical duties with mentorship, team coordination, and program improvement. My peers and faculty describe me as detail-oriented, approachable, and easy to work with—qualities that I believe are essential in the collaborative world of cardiology.

I am now seeking a clinically focused cardiology fellowship that will help me grow as a future cardiologist and clinician-educator, and help me to learn more about advanced heart failure, critical care cardiology. My long-term goal is to work in a community setting where I can blend high-acuity cardiovascular care with efforts in prevention, education, and health equity. I want to be a cardiologist who not only treats disease but prevents it, who mentors others as I have been mentored, and who contributes meaningfully to both patients and the profession.

Cardiology continues to challenge and inspire me. From straw mosaics to shock rooms, village health posts to tertiary care centers, I have followed this calling with both curiosity and commitment. I am excited to take the next step in fellowship training and contribute meaningfully to this remarkable field.`);
  
  const [programsData, setProgramsData] = useState([]);
  const [filteredPrograms, setFilteredPrograms] = useState([]);
  const [scoreThreshold, setScoreThreshold] = useState(50);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processedEssays, setProcessedEssays] = useState([]);
  const [currentProcessingIndex, setCurrentProcessingIndex] = useState(0);
  const [fileStatus, setFileStatus] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProgram, setSelectedProgram] = useState(null);
  const [editingEssay, setEditingEssay] = useState(null);
  const [copiedIndex, setCopiedIndex] = useState(null);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    const filtered = programsData.filter(program => 
      program.score >= scoreThreshold && 
      program.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredPrograms(filtered);
  }, [programsData, scoreThreshold, searchTerm]);

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setFileStatus('Processing Excel file...');
    
    try {
      const XLSX = await loadXLSX();
      const arrayBuffer = await file.arrayBuffer();
      const workbook = XLSX.read(arrayBuffer);
      
      // Try to find the right sheet - prioritize FinalwithIMGs, then Final list
      let worksheet = null;
      let sheetName = '';
      
      if (workbook.Sheets["FinalwithIMGs"]) {
        worksheet = workbook.Sheets["FinalwithIMGs"];
        sheetName = "FinalwithIMGs";
      } else if (workbook.Sheets["Final list"]) {
        worksheet = workbook.Sheets["Final list"];
        sheetName = "Final list";
      } else {
        throw new Error('Could not find FinalwithIMGs or Final list sheet');
      }
      
      const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
      
      if (jsonData.length < 2) {
        throw new Error('Excel file appears to be empty');
      }

      const headers = jsonData[0];
      console.log('Headers found:', headers);
      
      let programNameIndex = -1;
      let imgIndex = -1;
      let stateIndex = -1;
      
      // Look for the columns in your simplified format
      for (let i = 0; i < headers.length; i++) {
        const header = headers[i];
        if (header) {
          const headerStr = header.toString().toLowerCase();
          if (headerStr.includes('name')) {
            programNameIndex = i;
          } else if (headerStr.includes('img')) {
            imgIndex = i;
          } else if (headerStr.includes('state')) {
            stateIndex = i;
          }
        }
      }
      
      // Fallback to original column names if simplified ones not found
      if (programNameIndex === -1) {
        programNameIndex = headers.indexOf('Program Name');
      }
      if (imgIndex === -1) {
        imgIndex = headers.indexOf('IMGs >50%');
      }
      if (stateIndex === -1) {
        stateIndex = headers.indexOf('Program Directors State');
      }
      
      console.log('Column indices:', { programNameIndex, imgIndex, stateIndex });
      
      if (programNameIndex === -1) {
        throw new Error('Program Name column not found. Looking for "Name" or "Program Name"');
      }
      if (imgIndex === -1) {
        throw new Error('IMG score column not found. Looking for "Img" or "IMGs >50%"');
      }

      const programs = [];
      for (let i = 1; i < jsonData.length; i++) {
        const row = jsonData[i];
        if (row[programNameIndex] && row[imgIndex] !== undefined && row[imgIndex] !== null) {
          const score = parseInt(row[imgIndex]) || 0;
          programs.push({
            id: i,
            name: row[programNameIndex],
            score: score,
            state: row[stateIndex] || 'Unknown',
            processed: false
          });
        }
      }

      // Filter out programs with score 0 unless they explicitly have 0 as a valid score
      const validPrograms = programs.filter(p => p.score > 0);
      
      setProgramsData(validPrograms);
      setFileStatus(`✅ Successfully loaded ${validPrograms.length} programs from ${sheetName} sheet`);
      
    } catch (error) {
      setFileStatus(`❌ Error: ${error.message}`);
      console.error('File processing error:', error);
    }
  };

  const researchProgram = async (programName, state) => {
    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: 'gpt-4o',
          messages: [
            {
              role: 'system',
              content: 'You are a medical research assistant specializing in cardiology fellowship programs. Provide detailed, accurate information about medical programs.'
            },
            {
              role: 'user',
              content: `Research the ${programName} cardiology fellowship program in ${state}. Provide detailed information about:
              1. Program strengths and specialties
              2. Faculty expertise and notable achievements
              3. Research opportunities and focus areas
              4. Clinical sites and facilities
              5. Unique program features
              6. Program culture and values
              7. Recent publications or innovations
              8. Community involvement and outreach
              
              Format as a comprehensive research brief that can be used to tailor a personal statement.`
            }
          ],
          max_tokens: 1500,
          temperature: 0.3
        })
      });

      if (!response.ok) {
        throw new Error(`Research API error: ${response.status}`);
      }

      const data = await response.json();
      return data.choices[0].message.content;
    } catch (error) {
      console.error('Research error:', error);
      return `Basic research for ${programName} - Focus on cardiology excellence and patient care.`;
    }
  };

  const generatePersonalizedEssay = async (program, research) => {
    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: 'gpt-4o',
          messages: [
            {
              role: 'system',
              content: 'You are an expert medical writer specializing in fellowship personal statements. Create compelling, authentic, and well-researched personal statements that feel natural and human-written.'
            },
            {
              role: 'user',
              content: `Using the following research and original personal statement, create a highly personalized version for ${program.name} in ${program.state}:

PROGRAM RESEARCH:
${research}

ORIGINAL PERSONAL STATEMENT:
${originalPS}

INSTRUCTIONS:
1. Incorporate specific details about ${program.name} that align with the candidate's experiences
2. Modify 6-8 sentences throughout to reference program strengths, faculty, or unique features
3. Maintain the original voice and authenticity - make it feel like the same person wrote it
4. Connect the candidate's Nepal experience, teaching interest, and prevention focus to program specifics
6. Ensure the modifications feel natural and not forced
7. Keep the same overall structure and approximate length
8. Make the essay sound like it was written specifically for this program by someone who genuinely researched it
9. Avoid generic statements - be specific about why this program is the right fit

The final essay should demonstrate genuine interest and knowledge of the program while maintaining the candidate's authentic voice and experiences.`
            }
          ],
          max_tokens: 2000,
          temperature: 0.7
        })
      });

      if (!response.ok) {
        throw new Error(`Essay generation error: ${response.status}`);
      }

      const data = await response.json();
      return data.choices[0].message.content;
    } catch (error) {
      console.error('Essay generation error:', error);
      throw error;
    }
  };

  const processAllPrograms = async () => {
    if (!apiKey.trim()) {
      alert('Please enter your OpenAI API key');
      return;
    }

    if (filteredPrograms.length === 0) {
      alert('No programs to process');
      return;
    }

    setIsProcessing(true);
    setProcessedEssays([]);
    setCurrentProcessingIndex(0);
    setIsPaused(false);

    const results = [];

    for (let i = 0; i < filteredPrograms.length; i++) {
      if (isPaused) {
        // Wait for unpause
        await new Promise(resolve => {
          const checkPause = () => {
            if (!isPaused) {
              resolve();
            } else {
              setTimeout(checkPause, 1000);
            }
          };
          checkPause();
        });
      }

      const program = filteredPrograms[i];
      setCurrentProcessingIndex(i + 1);

      try {
        // Research the program
        const research = await researchProgram(program.name, program.state);
        
        // Generate personalized essay
        const personalizedEssay = await generatePersonalizedEssay(program, research);
        
        const result = {
          program,
          research,
          essay: personalizedEssay,
          status: 'success'
        };

        results.push(result);
        setProcessedEssays([...results]);

        // Add delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 2000));

      } catch (error) {
        const result = {
          program,
          research: '',
          essay: '',
          status: 'error',
          error: error.message
        };
        results.push(result);
        setProcessedEssays([...results]);
      }
    }

    setIsProcessing(false);
    setCurrentProcessingIndex(0);
  };

  const copyToClipboard = async (text, index) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const saveEditedEssay = (index, newEssay) => {
    const updated = [...processedEssays];
    updated[index].essay = newEssay;
    setProcessedEssays(updated);
    setEditingEssay(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-blue-800 mb-8 text-center flex items-center justify-center">
            <GraduationCap className="mr-3" />
            Cardiology Fellowship Personal Statement Generator
          </h1>

          {/* API Key Section */}
          <div className="mb-8 p-6 bg-yellow-50 border border-yellow-200 rounded-lg">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <AlertCircle className="mr-2" />
              API Configuration
            </h3>
            <input
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="Enter your OpenAI API key"
              className="w-full p-3 border border-gray-300 rounded-md"
            />
            <p className="text-sm text-yellow-700 mt-2">
              Your API key is stored locally and only sent to OpenAI's servers.
            </p>
          </div>

          {/* Original Personal Statement */}
          <div className="mb-8 p-6 bg-blue-50 border border-blue-200 rounded-lg">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <BookOpen className="mr-2" />
              Original Personal Statement
            </h3>
            <textarea
              value={originalPS}
              onChange={(e) => setOriginalPS(e.target.value)}
              rows={12}
              className="w-full p-3 border border-gray-300 rounded-md font-serif text-sm leading-relaxed"
              placeholder="Enter your original personal statement..."
            />
          </div>

          {/* File Upload Section */}
          <div className="mb-8 p-6 bg-green-50 border border-green-200 rounded-lg">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <Upload className="mr-2" />
              Upload Excel File
            </h3>
            <input
              type="file"
              accept=".xlsx,.xls"
              onChange={handleFileUpload}
              className="w-full p-3 border border-gray-300 rounded-md"
            />
            {fileStatus && (
              <p className={`mt-2 text-sm ${fileStatus.includes('✅') ? 'text-green-600' : 'text-red-600'}`}>
                {fileStatus}
              </p>
            )}
          </div>

          {/* Controls */}
          <div className="mb-8 p-6 bg-gray-50 border border-gray-200 rounded-lg">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium mb-2">Score Threshold</label>
                <input
                  type="number"
                  value={scoreThreshold}
                  onChange={(e) => setScoreThreshold(parseInt(e.target.value))}
                  min="0"
                  max="100"
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Search Programs</label>
                <div className="relative">
                  <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search programs..."
                    className="w-full pl-10 p-2 border border-gray-300 rounded-md"
                  />
                </div>
              </div>
              <div className="flex items-end">
                <button
                  onClick={processAllPrograms}
                  disabled={isProcessing || !apiKey.trim()}
                  className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:bg-gray-400 flex items-center justify-center"
                >
                  {isProcessing ? (
                    <>
                      <Pause className="mr-2 h-4 w-4" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <Play className="mr-2 h-4 w-4" />
                      Generate All Essays
                    </>
                  )}
                </button>
              </div>
            </div>
            
            {isProcessing && (
              <div className="mt-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">
                    Processing {currentProcessingIndex} of {filteredPrograms.length} programs
                  </span>
                  <button
                    onClick={() => setIsPaused(!isPaused)}
                    className="text-sm bg-yellow-500 text-white px-3 py-1 rounded-md hover:bg-yellow-600"
                  >
                    {isPaused ? 'Resume' : 'Pause'}
                  </button>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${(currentProcessingIndex / filteredPrograms.length) * 100}%` }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Programs List */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <Hospital className="mr-2" />
              Programs to Process ({filteredPrograms.length})
            </h3>
            
            {programsData.length > 0 && (
              <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <h4 className="font-semibold text-blue-800 mb-2">📊 Data Summary:</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <span className="font-medium">Total Programs:</span>
                    <span className="ml-2 text-blue-600">{programsData.length}</span>
                  </div>
                  <div>
                    <span className="font-medium">Score ≥{scoreThreshold}:</span>
                    <span className="ml-2 text-green-600">{programsData.filter(p => p.score >= scoreThreshold).length}</span>
                  </div>
                  <div>
                    <span className="font-medium">Highest Score:</span>
                    <span className="ml-2 text-purple-600">{Math.max(...programsData.map(p => p.score))}%</span>
                  </div>
                  <div>
                    <span className="font-medium">Average Score:</span>
                    <span className="ml-2 text-orange-600">{Math.round(programsData.reduce((acc, p) => acc + p.score, 0) / programsData.length)}%</span>
                  </div>
                </div>
              </div>
            )}
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-96 overflow-y-auto">
              {filteredPrograms.map((program) => (
                <div key={program.id} className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <h4 className="font-semibold text-sm mb-2 line-clamp-2">{program.name}</h4>
                  <div className="flex items-center text-sm text-gray-600 mb-2">
                    <MapPin className="h-4 w-4 mr-1" />
                    {program.state}
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-blue-600">
                      Score: {program.score}%
                    </span>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      processedEssays.find(e => e.program.id === program.id)?.status === 'success' 
                        ? 'bg-green-100 text-green-800' 
                        : processedEssays.find(e => e.program.id === program.id)?.status === 'error'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {processedEssays.find(e => e.program.id === program.id)?.status || 'Pending'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Generated Essays */}
          {processedEssays.length > 0 && (
            <div className="space-y-8">
              <h3 className="text-lg font-semibold flex items-center">
                <BookOpen className="mr-2" />
                Generated Personal Statements ({processedEssays.length})
              </h3>
              
              {processedEssays.map((result, index) => (
                <div key={result.program.id} className="bg-white border border-gray-200 rounded-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-lg font-semibold text-blue-800">
                      {result.program.name}
                    </h4>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-600 flex items-center">
                        <MapPin className="h-4 w-4 mr-1" />
                        {result.program.state}
                      </span>
                      <span className="text-sm font-medium text-blue-600">
                        Score: {result.program.score}%
                      </span>
                    </div>
                  </div>

                  {result.status === 'success' ? (
                    <div className="space-y-4">
                      {/* Research Section */}
                      <div className="bg-blue-50 p-4 rounded-lg">
                        <h5 className="font-semibold text-blue-800 mb-2">Program Research:</h5>
                        <p className="text-sm text-blue-700 whitespace-pre-wrap">
                          {result.research}
                        </p>
                      </div>

                      {/* Essay Section */}
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <h5 className="font-semibold text-gray-800">Personalized Essay:</h5>
                          <div className="flex space-x-2">
                            <button
                              onClick={() => setEditingEssay(editingEssay === index ? null : index)}
                              className="text-sm bg-yellow-500 text-white px-3 py-1 rounded-md hover:bg-yellow-600"
                            >
                              {editingEssay === index ? 'Cancel' : 'Edit'}
                            </button>
                            <button
                              onClick={() => copyToClipboard(result.essay, index)}
                              className="text-sm bg-green-500 text-white px-3 py-1 rounded-md hover:bg-green-600 flex items-center"
                            >
                              {copiedIndex === index ? (
                                <>
                                  <Check className="h-4 w-4 mr-1" />
                                  Copied!
                                </>
                              ) : (
                                <>
                                  <Copy className="h-4 w-4 mr-1" />
                                  Copy
                                </>
                              )}
                            </button>
                          </div>
                        </div>
                        
                        {editingEssay === index ? (
                          <div className="space-y-2">
                            <textarea
                              value={result.essay}
                              onChange={(e) => {
                                const updated = [...processedEssays];
                                updated[index].essay = e.target.value;
                                setProcessedEssays(updated);
                              }}
                              rows={15}
                              className="w-full p-3 border border-gray-300 rounded-md font-serif text-sm leading-relaxed"
                            />
                            <button
                              onClick={() => setEditingEssay(null)}
                              className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
                            >
                              Save Changes
                            </button>
                          </div>
                        ) : (
                          <div className="whitespace-pre-wrap font-serif text-sm leading-relaxed text-gray-800 max-h-96 overflow-y-auto border border-gray-200 p-3 rounded-md">
                            {result.essay}
                          </div>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="bg-red-50 p-4 rounded-lg">
                      <p className="text-red-700">
                        Error: {result.error}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CardiologyPSGenerator;