import React, { useState, useEffect } from 'react';
import { 
  BarChart, Bar, PieChart, Pie, LineChart, Line, XAxis, YAxis, CartesianGrid, 
  Tooltip, Legend, ResponsiveContainer, Cell, RadarChart, Radar, PolarGrid,
  PolarAngleAxis, PolarRadiusAxis, ComposedChart, Area, LabelList
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
    
    // Process interest data
    const interestCounts = {
      "Not Interested": 0,
      "Interested": 0
    };
    
    rawData.forEach(entry => {
      if (entry.Interest_In_Org === "Not interested") {
        interestCounts["Not Interested"]++;
      } else {
        // Combine "Somewhat Interested", "Interested", "Very Interested"
        interestCounts["Interested"]++;
      }
    });
    
    // Process motivation data
    const motivationCounts = {};
    rawData.forEach(entry => {
      const motivation = entry.Motivated_By_Service_Requirement;
      motivationCounts[motivation] = (motivationCounts[motivation] || 0) + 1;
    });
    
    // Process volunteering frequency data - group into low and high frequency
    const volunteerCounts = {
      "Low Frequency": 0, // Not at All, Once per Semester
      "High Frequency": 0  // Monthly or more often
    };
    
    rawData.forEach(entry => {
      const frequency = entry.Volunteer_Frequency;
      if (frequency === "Not at All" || frequency === "Once per Semester") {
        volunteerCounts["Low Frequency"]++;
      } else {
        volunteerCounts["High Frequency"]++;
      }
    });
    
    // Convert raw counts to percentages and grouped data
    
    // 1. Waste US Problem: Agree vs Disagree
    const totalWasteUS = Object.values(wasteCounts["Waste_US_Problem"]).reduce((sum, count) => sum + count, 0);
    const wasteUSAgree = (wasteCounts["Waste_US_Problem"]["Somewhat agree"] || 0) + 
                         (wasteCounts["Waste_US_Problem"]["Strongly agree"] || 0);
    const wasteUSDisagree = (wasteCounts["Waste_US_Problem"]["Strongly disagree"] || 0) + 
                            (wasteCounts["Waste_US_Problem"]["Somewhat disagree"] || 0);
    
    const wasteUSProblemData = [
      {
        name: "Agree",
        value: (wasteUSAgree / totalWasteUS) * 100,
        count: wasteUSAgree
      },
      {
        name: "Disagree",
        value: (wasteUSDisagree / totalWasteUS) * 100,
        count: wasteUSDisagree
      }
    ];
    
    // 2. VU Dining Waste: Agree vs Disagree
    const totalVUDining = Object.values(wasteCounts["VU_Dining_Waste"]).reduce((sum, count) => sum + count, 0);
    const vuDiningAgree = (wasteCounts["VU_Dining_Waste"]["Somewhat agree"] || 0) + 
                          (wasteCounts["VU_Dining_Waste"]["Strongly agree"] || 0);
    const vuDiningDisagree = (wasteCounts["VU_Dining_Waste"]["Strongly disagree"] || 0) + 
                             (wasteCounts["VU_Dining_Waste"]["Somewhat disagree"] || 0);
    
    const vuDiningWasteData = [
      {
        name: "Agree",
        value: (vuDiningAgree / totalVUDining) * 100,
        count: vuDiningAgree
      },
      {
        name: "Disagree",
        value: (vuDiningDisagree / totalVUDining) * 100,
        count: vuDiningDisagree
      }
    ];
    
    // 3. Interest in Organization: Interested vs Not Interested
    const totalInterest = Object.values(interestCounts).reduce((sum, count) => sum + count, 0);
    const interestData = [
      {
        name: "Interested",
        value: (interestCounts["Interested"] / totalInterest) * 100,
        count: interestCounts["Interested"]
      },
      {
        name: "Not Interested",
        value: (interestCounts["Not Interested"] / totalInterest) * 100,
        count: interestCounts["Not Interested"]
      }
    ];
    
    // 4. Volunteer Frequency: High vs Low
    const totalVolunteer = Object.values(volunteerCounts).reduce((sum, count) => sum + count, 0);
    const volunteerData = [
      {
        name: "High Frequency",
        value: (volunteerCounts["High Frequency"] / totalVolunteer) * 100,
        count: volunteerCounts["High Frequency"]
      },
      {
        name: "Low Frequency",
        value: (volunteerCounts["Low Frequency"] / totalVolunteer) * 100,
        count: volunteerCounts["Low Frequency"]
      }
    ];
    
    // 5. Self Waste vs Portion Size: Convert to grouped data (Agree vs Disagree)
    const totalSelfWaste = Object.values(wasteCounts["Self_Waste"]).reduce((sum, count) => sum + count, 0);
    const totalPortionSize = Object.values(wasteCounts["Portion_Size_Too_Large"]).reduce((sum, count) => sum + count, 0);
    
    const selfWasteAgree = (wasteCounts["Self_Waste"]["Somewhat agree"] || 0) + 
                          (wasteCounts["Self_Waste"]["Strongly agree"] || 0);
    const selfWasteDisagree = (wasteCounts["Self_Waste"]["Strongly disagree"] || 0) + 
                             (wasteCounts["Self_Waste"]["Somewhat disagree"] || 0);
                             
    const portionSizeAgree = (wasteCounts["Portion_Size_Too_Large"]["Somewhat agree"] || 0) + 
                           (wasteCounts["Portion_Size_Too_Large"]["Strongly agree"] || 0);
    const portionSizeDisagree = (wasteCounts["Portion_Size_Too_Large"]["Strongly disagree"] || 0) + 
                              (wasteCounts["Portion_Size_Too_Large"]["Somewhat disagree"] || 0);
    
    const selfWasteData = [
      {
        name: "Agree",
        "Self Waste": (selfWasteAgree / totalSelfWaste) * 100,
        "Portion Size Too Large": (portionSizeAgree / totalPortionSize) * 100,
        "Self Waste Count": selfWasteAgree,
        "Portion Size Count": portionSizeAgree
      },
      {
        name: "Disagree",
        "Self Waste": (selfWasteDisagree / totalSelfWaste) * 100,
        "Portion Size Too Large": (portionSizeDisagree / totalPortionSize) * 100,
        "Self Waste Count": selfWasteDisagree,
        "Portion Size Count": portionSizeDisagree
      }
    ];
    
    // 6. Motivation by Service Requirement
    const totalMotivation = Object.values(motivationCounts).reduce((sum, count) => sum + count, 0);
    const motivationData = Object.entries(motivationCounts).map(([key, value]) => ({
      name: key,
      value: (value / totalMotivation) * 100,
      count: value
    }));
    
    setData({
      wasteUSProblemData,
      vuDiningWasteData,
      interestData,
      volunteerData,
      selfWasteData,
      motivationData,
      totalResponses: totalWasteUS
    });
    
    setLoading(false);
  };
  
  // Custom tooltip to show both percentage and count
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 shadow-md rounded">
          <p className="font-semibold">{`${label}`}</p>
          {payload.map((entry, index) => {
            const dataKey = entry.dataKey === "value" ? entry.name : entry.dataKey;
            const count = entry.payload[dataKey === "value" ? "count" : `${dataKey} Count`];
            return (
              <p key={`item-${index}`} style={{ color: entry.color }}>
                {`${dataKey === "value" ? "" : dataKey + ": "}${entry.value.toFixed(1)}% (${count} responses)`}
              </p>
            );
          })}
        </div>
      );
    }
    return null;
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
     {/* Chart 1: Food Waste Perception - Horizontal Bar Chart */}
{/* Chart 1: Food Waste Perception - Horizontal Bar Chart */}
<div className="bg-white p-6 rounded-lg shadow-md">
  <div className="flex justify-between items-center mb-4">
    <h2 className="text-xl font-semibold text-gray-800">Student Perspectives on Food Waste</h2>
    <button 
      className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white px-3 py-1 rounded text-sm hover:from-purple-600 hover:to-indigo-700 shadow-md transition-all duration-300"
      onClick={() => downloadChart('chart-food-waste-perceptions', 'food-waste-perceptions.png')}
    >
      Download
    </button>
  </div>
  <div className="h-96">
    <ResponsiveContainer width="100%" height="100%" id="chart-food-waste-perceptions">
      <BarChart
        layout="vertical"
        data={[
          {
            question: "Food waste is a problem in the United States",
            agree: 63,
            disagree: 2,
            total: 65
          },
          {
            question: "Food waste is a problem at Villanova",
            agree: 56,
            disagree: 9,
            total: 65
          },
          {
            question: "Portion sizes at dining halls are too large",
            agree: 30,
            disagree: 35,
            total: 65
          },
          {
            question: "I waste a lot of food each week",
            agree: 22,
            disagree: 43,
            total: 65
          },
          {
            question: "My peers and I throw away half of our portions",
            agree: 19,
            disagree: 46,
            total: 65
          }
        ]}
        margin={{ top: 5, right: 50, left: 20, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis type="number" />
        <YAxis dataKey="question" type="category" width={180} />
        <Tooltip />
        <Legend />
        <Bar dataKey="agree" name="Agree" fill="#4f7cf9" stackId="a">
          <LabelList dataKey="agree" position="center" fill="white" />
        </Bar>
        <Bar dataKey="disagree" name="Disagree" fill="#a855f7" stackId="a">
          <LabelList dataKey="disagree" position="center" fill="white" />
        </Bar>
        <Bar dataKey="total" name="Total" fill="transparent">
          <LabelList dataKey="total" position="right" fill="gray" />
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  </div>
  <div className="flex justify-center mt-4 space-x-8">
    <div className="flex items-center">
      <div className="w-4 h-4 bg-blue-500 mr-2"></div>
      <span className="text-blue-700 font-medium">Agree</span>
    </div>
    <div className="flex items-center">
      <div className="w-4 h-4 bg-purple-500 mr-2"></div>
      <span className="text-purple-700 font-medium">Disagree</span>
    </div>
    <div className="flex items-center">
      <div className="w-4 h-4 border border-gray-500 bg-white mr-2"></div>
      <span className="text-gray-700 font-medium">Total</span>
    </div>
  </div>
</div>
        
        {/* Chart 1B: Is food waste a problem in the US? - Bar */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-800">Is food waste a problem in the US? (Bar)</h2>
            <button 
              className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white px-3 py-1 rounded text-sm hover:from-purple-600 hover:to-indigo-700 shadow-md transition-all duration-300"
              onClick={() => downloadChart('chart-waste-us-problem-bar', 'waste-us-problem-bar.png')}
            >
              Download
            </button>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                id="chart-waste-us-problem-bar"
                data={data.wasteUSProblemData}
                margin={{ top: 20, right: 30, left: 30, bottom: 20 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis tickFormatter={(value) => `${value}%`} domain={[0, 100]} />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Bar dataKey="value" name="Percentage" fill="#8884d8">
                  {data.wasteUSProblemData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={index === 0 ? '#8884d8' : '#ff8042'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        {/* Chart 2: Is food waste a problem in VU dining? - Pie */}
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
              <PieChart id="chart-vu-dining-waste">
                <Pie
                  data={data.vuDiningWasteData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={renderCustomizedLabel}
                  outerRadius={100}
                  fill="#82ca9d"
                  dataKey="value"
                >
                  {data.vuDiningWasteData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={index === 0 ? '#82ca9d' : '#ff8042'} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend layout="vertical" verticalAlign="middle" align="right" />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        {/* Chart 2B: Is food waste a problem in VU dining? - Bar */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-800">Is food waste a problem in VU dining? (Bar)</h2>
            <button 
              className="bg-gradient-to-r from-teal-500 to-green-600 text-white px-3 py-1 rounded text-sm hover:from-teal-600 hover:to-green-700 shadow-md transition-all duration-300"
              onClick={() => downloadChart('chart-vu-dining-waste-bar', 'vu-dining-waste-bar.png')}
            >
              Download
            </button>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                id="chart-vu-dining-waste-bar"
                data={data.vuDiningWasteData}
                margin={{ top: 20, right: 30, left: 30, bottom: 20 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis tickFormatter={(value) => `${value}%`} domain={[0, 100]} />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Bar dataKey="value" name="Percentage" fill="#82ca9d">
                  {data.vuDiningWasteData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={index === 0 ? '#82ca9d' : '#ff8042'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        {/* Chart 3: Interest in Organization - Pie */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-800">Interest in Food Waste Organization</h2>
            <button 
              className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-3 py-1 rounded text-sm hover:from-blue-600 hover:to-indigo-700 shadow-md transition-all duration-300"
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
                    <Cell key={`cell-${index}`} fill={index === 0 ? '#8884d8' : '#ff8042'} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend layout="vertical" verticalAlign="middle" align="right" />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        {/* Chart 3B: Interest in Organization - Bar */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-800">Interest in Food Waste Organization (Bar)</h2>
            <button 
              className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-3 py-1 rounded text-sm hover:from-blue-600 hover:to-indigo-700 shadow-md transition-all duration-300"
              onClick={() => downloadChart('chart-interest-bar', 'interest-in-org-bar.png')}
            >
              Download
            </button>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                id="chart-interest-bar"
                data={data.interestData}
                margin={{ top: 20, right: 30, left: 30, bottom: 20 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis tickFormatter={(value) => `${value}%`} domain={[0, 100]} />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Bar dataKey="value" name="Percentage" fill="#8884d8">
                  {data.interestData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={index === 0 ? '#8884d8' : '#ff8042'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        
       {/* Chart 4: Volunteer Frequency - Pie */}
<div className="bg-white p-6 rounded-lg shadow-md">
  <div className="flex justify-between items-center mb-4">
    <h2 className="text-xl font-semibold text-gray-800">Volunteering Frequency Preference</h2>
    <button 
      className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-3 py-1 rounded text-sm hover:from-blue-600 hover:to-purple-700 shadow-md transition-all duration-300"
      onClick={() => downloadChart('chart-volunteer', 'volunteer-frequency.png')}
    >
      Download
    </button>
  </div>
  <div className="h-80">
    <ResponsiveContainer width="100%" height="100%">
      <PieChart id="chart-volunteer">
        <Pie
          data={[
            {
              name: "Monthly or More Often",
              value: data.volunteerData.find(d => d.name === "High Frequency")?.value || 0,
              count: data.volunteerData.find(d => d.name === "High Frequency")?.count || 0
            },
            {
              name: "Once per Semester or Less",
              value: data.volunteerData.find(d => d.name === "Low Frequency")?.value || 0,
              count: data.volunteerData.find(d => d.name === "Low Frequency")?.count || 0
            }
          ]}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={renderCustomizedLabel}
          outerRadius={100}
          fill="#8884d8"
          dataKey="value"
        >
          <Cell fill="#6366f1" />
          <Cell fill="#ec4899" />
        </Pie>
        <Tooltip content={<CustomTooltip />} />
        <Legend layout="vertical" verticalAlign="middle" align="right" />
      </PieChart>
    </ResponsiveContainer>
  </div>
</div>

{/* Chart 4B: Volunteer Frequency - Bar */}
<div className="bg-white p-6 rounded-lg shadow-md">
  <div className="flex justify-between items-center mb-4">
    <h2 className="text-xl font-semibold text-gray-800">Volunteering Frequency Preference (Bar)</h2>
    <button 
      className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-3 py-1 rounded text-sm hover:from-blue-600 hover:to-purple-700 shadow-md transition-all duration-300"
      onClick={() => downloadChart('chart-volunteer-bar', 'volunteer-frequency-bar.png')}
    >
      Download
    </button>
  </div>
  <div className="h-80">
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        id="chart-volunteer-bar"
        data={[
          {
            name: "Monthly or More Often",
            value: data.volunteerData.find(d => d.name === "High Frequency")?.value || 0,
            count: data.volunteerData.find(d => d.name === "High Frequency")?.count || 0
          },
          {
            name: "Once per Semester or Less",
            value: data.volunteerData.find(d => d.name === "Low Frequency")?.value || 0,
            count: data.volunteerData.find(d => d.name === "Low Frequency")?.count || 0
          }
        ]}
        margin={{ top: 20, right: 30, left: 30, bottom: 20 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis tickFormatter={(value) => `${value}%`} domain={[0, 100]} />
        <Tooltip content={<CustomTooltip />} />
        <Legend />
        <Bar dataKey="value" name="Percentage">
          <Cell fill="#6366f1" />
          <Cell fill="#ec4899" />
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  </div>
</div>
        
        {/* Chart 5: Self Waste vs Portion Size */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-800">Self Waste vs Portion Size Too Large</h2>
            <button 
              className="bg-gradient-to-r from-pink-500 to-purple-600 text-white px-3 py-1 rounded text-sm hover:from-pink-600 hover:to-purple-700 shadow-md transition-all duration-300"
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
                margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                layout="vertical"
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" tickFormatter={(value) => `${value}%`} domain={[0, 100]} />
                <YAxis dataKey="name" type="category" width={80} />
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ paddingTop: "10px" }} />
                <Bar dataKey="Self Waste" fill="#8884d8" />
                <Bar dataKey="Portion Size Too Large" fill="#82ca9d" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        {/* Chart 5B: Self Waste vs Portion Size - Grouped */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-800">Self Waste vs Portion Size (Grouped)</h2>
            <button 
              className="bg-gradient-to-r from-pink-500 to-purple-600 text-white px-3 py-1 rounded text-sm hover:from-pink-600 hover:to-purple-700 shadow-md transition-all duration-300"
              onClick={() => downloadChart('chart-self-waste-grouped', 'self-waste-vs-portion-grouped.png')}
            >
              Download
            </button>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                id="chart-self-waste-grouped"
                data={data.selfWasteData}
                margin={{ top: 20, right: 30, left: 30, bottom: 20 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis tickFormatter={(value) => `${value}%`} domain={[0, 100]} />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Bar dataKey="Self Waste" fill="#8884d8" />
                <Bar dataKey="Portion Size Too Large" fill="#82ca9d" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        {/* Chart 6: Motivation by Service Requirement - Pie */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-800">Motivated by Service Requirement</h2>
            <button 
              className="bg-gradient-to-r from-green-500 to-teal-600 text-white px-3 py-1 rounded text-sm hover:from-green-600 hover:to-teal-700 shadow-md transition-all duration-300"
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
                <Tooltip content={<CustomTooltip />} />
                <Legend layout="vertical" verticalAlign="middle" align="right" />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        {/* Chart 6B: Motivation by Service Requirement - Bar */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-800">Motivated by Service Requirement (Bar)</h2>
            <button 
              className="bg-gradient-to-r from-green-500 to-teal-600 text-white px-3 py-1 rounded text-sm hover:from-green-600 hover:to-teal-700 shadow-md transition-all duration-300"
              onClick={() => downloadChart('chart-motivation-bar', 'motivation-service-bar.png')}
            >
              Download
            </button>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                id="chart-motivation-bar"
                data={data.motivationData}
                margin={{ top: 20, right: 30, left: 30, bottom: 20 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis tickFormatter={(value) => `${value}%`} domain={[0, 100]} />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Bar dataKey="value" name="Percentage" fill="#82ca9d">
                  {data.motivationData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
        
     
      
      <div className="mt-6 text-center">
        <p className="text-gray-600 text-sm">
          Data source: Food Donation Survey | Total responses: {data.totalResponses}
        </p>
      </div>
    </div>
  );
};

export default FoodWasteDashboard;