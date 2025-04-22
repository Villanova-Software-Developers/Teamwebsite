import React, { useState, useEffect } from 'react';
import { 
  BarChart, Bar, PieChart, Pie, LineChart, Line, XAxis, YAxis, CartesianGrid, 
  Tooltip, Legend, ResponsiveContainer, Cell, RadarChart, Radar, PolarGrid,
  PolarAngleAxis, PolarRadiusAxis, ComposedChart, Area
} from 'recharts';

// Color palette for charts
const COLORS = [
  '#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#0088FE', '#00C49F', 
  '#FFBB28', '#FF8042', '#a4de6c', '#d0ed57'
];

const RADIAN = Math.PI / 180;
const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text 
      x={x} 
      y={y} 
      fill="white" 
      textAnchor={x > cx ? 'start' : 'end'} 
      dominantBaseline="central"
    >
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

const downloadChart = (chartId, filename) => {
  const svgElement = document.getElementById(chartId);
  if (!svgElement) return;
  
  const svgData = new XMLSerializer().serializeToString(svgElement);
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  
  const img = new Image();
  img.onload = () => {
    canvas.width = img.width;
    canvas.height = img.height;
    ctx.drawImage(img, 0, 0);
    
    const pngFile = canvas.toDataURL('image/png');
    const downloadLink = document.createElement('a');
    downloadLink.download = filename;
    downloadLink.href = pngFile;
    downloadLink.click();
  };
  
  img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)));
};

const FoodWasteDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/food_donation_data.json');
        const json = await response.json();
        processData(json);
      } catch (error) {
        console.error('Error reading file:', error);
      }
    };
    
    
    fetchData();
  }, []);
  
  const processData = (rawData) => {
    // Agreement levels in order
    const agreementLevels = ["Strongly disagree", "Somewhat disagree", "Somewhat agree", "Strongly agree"];
    const interestLevels = ["Not interested", "Somewhat Interested", "Interested", "Very Interested"];
    const frequencyLevels = ["Not at All", "Once per Semester", "Once per Month", "2-3 Times per Month", "Once per Week", "Multiple Times per Week"];
    
    // Process education and status data
    const educationCounts = {};
    const statusCounts = {};
    rawData.forEach(entry => {
      educationCounts[entry.Education_Level] = (educationCounts[entry.Education_Level] || 0) + 1;
      statusCounts[entry.Student_Status] = (statusCounts[entry.Student_Status] || 0) + 1;
    });
    
    // Process interest data
    const interestCounts = {};
    rawData.forEach(entry => {
      interestCounts[entry.Interest_In_Org] = (interestCounts[entry.Interest_In_Org] || 0) + 1;
    });
    
    // Process volunteer frequency data
    const volunteerCounts = {};
    rawData.forEach(entry => {
      volunteerCounts[entry.Volunteer_Frequency] = (volunteerCounts[entry.Volunteer_Frequency] || 0) + 1;
    });
    
    // Process perception data
    const wasteCounts = {
      "Waste_US_Problem": {},
      "VU_Dining_Waste": {},
      "Self_Waste": {},
      "Portion_Size_Too_Large": {}
    };
    
    rawData.forEach(entry => {
      for (const key of Object.keys(wasteCounts)) {
        const response = entry[key];
        wasteCounts[key][response] = (wasteCounts[key][response] || 0) + 1;
      }
    });
    
    // Process motivation data
    const motivationCounts = {};
    rawData.forEach(entry => {
      const motivation = entry.Motivated_By_Service_Requirement;
      motivationCounts[motivation] = (motivationCounts[motivation] || 0) + 1;
    });
    
    // Process education-interest data
    const educationInterestData = {};
    rawData.forEach(entry => {
      const education = entry.Education_Level;
      const interest = entry.Interest_In_Org;
      
      if (!educationInterestData[education]) {
        educationInterestData[education] = {};
      }
      
      educationInterestData[education][interest] = (educationInterestData[education][interest] || 0) + 1;
    });
    
    // Format data for charts
    
    // 1. Waste US Problem
    const wasteUSProblemData = agreementLevels.map(level => ({
      name: level,
      value: wasteCounts["Waste_US_Problem"][level] || 0
    }));
    
    // 2. VU Dining Waste
    const vuDiningWasteData = agreementLevels.map(level => ({
      name: level,
      value: wasteCounts["VU_Dining_Waste"][level] || 0
    }));
    
    // 3. Interest in Organization
    const interestData = interestLevels.map(level => ({
      name: level,
      value: interestCounts[level] || 0
    }));
    
    // 4. Volunteer Frequency
    const volunteerData = frequencyLevels.map(level => ({
      name: level,
      value: volunteerCounts[level] || 0
    }));
    
    // 5. Self Waste vs Portion Size
    const selfWasteData = agreementLevels.map(level => ({
      name: level,
      'Self Waste': wasteCounts["Self_Waste"][level] || 0,
      'Portion Size Too Large': wasteCounts["Portion_Size_Too_Large"][level] || 0
    }));
    
    // 6. Motivation by Service Requirement
    const motivationData = Object.entries(motivationCounts).map(([key, value]) => ({
      name: key,
      value: value
    }));
    
    // 7. Education and Interest
    const educationInterestChartData = Object.keys(educationInterestData).map(edu => {
      const result = { name: edu };
      interestLevels.forEach(interest => {
        result[interest] = educationInterestData[edu][interest] || 0;
      });
      return result;
    });
    
    setData({
      wasteUSProblemData,
      vuDiningWasteData,
      interestData,
      volunteerData,
      selfWasteData,
      motivationData,
      educationInterestChartData
    });
    
    setLoading(false);
  };
  
  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading data...</div>;
  }
  
  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold text-center mb-6 text-indigo-800">Food Waste Survey Dashboard</h1>
      <p className="text-center mb-8 text-gray-600">
        Analysis of student responses regarding food waste perceptions and volunteer interests
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Chart 1: Is food waste a problem in the US? */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-800">Is food waste a problem in the US?</h2>
            <button 
              className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white px-3 py-1 rounded text-sm hover:from-purple-600 hover:to-indigo-700 shadow-md transition-all duration-300"
              onClick={() => downloadChart('chart-waste-us-problem', 'waste-us-problem.png')}
            >
              Download
            </button>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                id="chart-waste-us-problem"
                data={data.wasteUSProblemData}
                margin={{ top: 5, right: 30, left: 20, bottom: 90 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" angle={-45} textAnchor="end" height={90} interval={0} />
                <YAxis />
                <Tooltip />
                <Legend wrapperStyle={{ paddingTop: "20px" }} />
                <Bar dataKey="value" name="Number of Responses" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        {/* Chart 2: Is food waste a problem in VU dining? */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-800">Is food waste a problem in VU dining?</h2>
            <button 
              className="bg-gradient-to-r from-teal-500 to-green-600 text-white px-3 py-1 rounded text-sm hover:from-teal-600 hover:to-green-700 shadow-md transition-all duration-300"
              onClick={() => downloadChart('chart-vu-dining-waste', 'vu-dining-waste.png')}
            >
              Download
            </button>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                id="chart-vu-dining-waste"
                data={data.vuDiningWasteData}
                margin={{ top: 5, right: 30, left: 20, bottom: 90 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" angle={-45} textAnchor="end" height={90} interval={0} />
                <YAxis />
                <Tooltip />
                <Legend wrapperStyle={{ paddingTop: "20px" }} />
                <Bar dataKey="value" name="Number of Responses" fill="#82ca9d" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        {/* Chart 3: Interest in Organization */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-800">Interest in Food Waste Organization</h2>
            <button 
              className="bg-indigo-600 text-white px-3 py-1 rounded text-sm hover:bg-indigo-700"
              onClick={() => downloadChart('chart-interest', 'interest-in-org.png')}
            >
              Download
            </button>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart id="chart-interest">
                <Pie
                  data={data.interestData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={renderCustomizedLabel}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {data.interestData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend layout="vertical" verticalAlign="middle" align="right" />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        {/* Chart 4: Volunteer Frequency */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-800">Volunteering Frequency Preference</h2>
            <button 
              className="bg-indigo-600 text-white px-3 py-1 rounded text-sm hover:bg-indigo-700"
              onClick={() => downloadChart('chart-volunteer', 'volunteer-frequency.png')}
            >
              Download
            </button>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                id="chart-volunteer"
                data={data.volunteerData}
                margin={{ top: 5, right: 30, left: 20, bottom: 90 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" angle={-45} textAnchor="end" height={90} interval={0} />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="value" name="Number of Responses" fill="#ffc658" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        {/* Chart 5: Self Waste vs Portion Size */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-800">Self Waste vs Portion Size Too Large</h2>
            <button 
              className="bg-indigo-600 text-white px-3 py-1 rounded text-sm hover:bg-indigo-700"
              onClick={() => downloadChart('chart-self-waste', 'self-waste-vs-portion.png')}
            >
              Download
            </button>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                id="chart-self-waste"
                data={data.selfWasteData}
                margin={{ top: 5, right: 30, left: 20, bottom: 90 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" angle={-45} textAnchor="end" height={90} interval={0} />
                <YAxis />
                <Tooltip />
                <Legend wrapperStyle={{ paddingTop: "20px" }} />
                <Bar dataKey="Self Waste" fill="#8884d8" />
                <Bar dataKey="Portion Size Too Large" fill="#82ca9d" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        {/* Chart 6: Motivation by Service Requirement */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-800">Motivated by Service Requirement</h2>
            <button 
              className="bg-indigo-600 text-white px-3 py-1 rounded text-sm hover:bg-indigo-700"
              onClick={() => downloadChart('chart-motivation', 'motivation-service.png')}
            >
              Download
            </button>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart id="chart-motivation">
                <Pie
                  data={data.motivationData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={renderCustomizedLabel}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {data.motivationData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value, name, props) => [value, props.payload.name]} />
                <Legend layout="vertical" verticalAlign="middle" align="right" />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        {/* Chart 7: Education Level vs Interest */}
        <div className="bg-white p-6 rounded-lg shadow-md col-span-1 md:col-span-2">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-800">Education Level vs Interest</h2>
            <button 
              className="bg-indigo-600 text-white px-3 py-1 rounded text-sm hover:bg-indigo-700"
              onClick={() => downloadChart('chart-education-interest', 'education-vs-interest.png')}
            >
              Download
            </button>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                id="chart-education-interest"
                data={data.educationInterestChartData}
                margin={{ top: 5, right: 30, left: 20, bottom: 30 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" interval={0} />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="Not interested" stackId="a" fill="#8884d8" />
                <Bar dataKey="Somewhat Interested" stackId="a" fill="#82ca9d" />
                <Bar dataKey="Interested" stackId="a" fill="#ffc658" />
                <Bar dataKey="Very Interested" stackId="a" fill="#ff8042" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      
      <div className="mt-6 text-center">
        <p className="text-gray-600 text-sm">
          Data source: Food Donation Survey | Total responses: {data.wasteUSProblemData.reduce((sum, item) => sum + item.value, 0)}
        </p>
      </div>
    </div>
  );
};

export default FoodWasteDashboard;