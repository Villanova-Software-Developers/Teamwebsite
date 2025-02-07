import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis
} from 'recharts';
import { 
  TrendingUp, 
  Activity,
  Calendar,
  AlertCircle,
  CheckCircle,
  ArrowUpCircle,
  ArrowDownCircle
} from 'lucide-react';

const progressData = [
  { month: 'Jan', density: 65, growth: 2.1, strength: 70 },
  { month: 'Feb', density: 68, growth: 2.3, strength: 72 },
  { month: 'Mar', density: 72, growth: 2.4, strength: 75 },
  { month: 'Apr', density: 75, growth: 2.6, strength: 78 },
  { month: 'May', density: 78, growth: 2.7, strength: 80 },
  { month: 'Jun', density: 82, growth: 2.9, strength: 83 }
];

const biomarkers = [
  { name: 'Vitamin D', value: 75, fullMark: 100, status: 'optimal' },
  { name: 'Iron', value: 65, fullMark: 100, status: 'normal' },
  { name: 'Zinc', value: 85, fullMark: 100, status: 'optimal' },
  { name: 'Protein', value: 70, fullMark: 100, status: 'normal' },
  { name: 'B12', value: 90, fullMark: 100, status: 'optimal' },
  { name: 'Ferritin', value: 60, fullMark: 100, status: 'normal' },
];

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 shadow-lg rounded-lg border">
        <p className="font-medium">{label}</p>
        {payload.map((item, index) => (
          <p key={index} className="text-sm" style={{ color: item.color }}>
            {item.name}: {item.value}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

const MetricCard = ({ title, value, change, changePeriod = '30d', icon: Icon }) => {
  const isPositive = change > 0;
  
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm text-gray-600 mb-1">{title}</p>
          <h3 className="text-2xl font-bold">{value}</h3>
        </div>
        <div className="w-10 h-10 bg-indigo-50 rounded-lg flex items-center justify-center">
          <Icon className="w-5 h-5 text-indigo-600" />
        </div>
      </div>
      <div className="mt-4 flex items-center">
        {isPositive ? (
          <ArrowUpCircle className="w-4 h-4 text-green-500 mr-1" />
        ) : (
          <ArrowDownCircle className="w-4 h-4 text-red-500 mr-1" />
        )}
        <span className={`text-sm ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
          {Math.abs(change)}%
        </span>
        <span className="text-sm text-gray-500 ml-1">vs last {changePeriod}</span>
      </div>
    </div>
  );
};

const ProgressChart = () => {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm">
      <h3 className="text-lg font-semibold mb-6">Hair Growth Progress</h3>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={progressData}>
            <defs>
              <linearGradient id="density" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#4F46E5" stopOpacity={0.1}/>
                <stop offset="95%" stopColor="#4F46E5" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
            <XAxis 
              dataKey="month"
              stroke="#6B7280"
              fontSize={12}
              tickLine={false}
            />
            <YAxis
              stroke="#6B7280"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip content={<CustomTooltip />} />
            <Line 
              type="monotone" 
              dataKey="density" 
              stroke="#4F46E5" 
              strokeWidth={2}
              dot={{ r: 4, fill: "#4F46E5" }}
              activeDot={{ r: 6 }}
            />
            <Line 
              type="monotone" 
              dataKey="strength" 
              stroke="#10B981" 
              strokeWidth={2}
              dot={{ r: 4, fill: "#10B981" }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

const BiomarkersRadar = () => {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm">
      <h3 className="text-lg font-semibold mb-6">Biomarker Analysis</h3>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart data={biomarkers} margin={{ top: 20, right: 30, bottom: 20, left: 30 }}>
            <PolarGrid stroke="#E5E7EB" />
            <PolarAngleAxis 
              dataKey="name"
              stroke="#6B7280"
              fontSize={12}
            />
            <PolarRadiusAxis 
              stroke="#6B7280"
              fontSize={12}
              angle={30}
            />
            <Radar
              name="Current Levels"
              dataKey="value"
              stroke="#4F46E5"
              fill="#4F46E5"
              fillOpacity={0.3}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

const Timeline = () => {
  const events = [
    { date: 'Jun 15', event: 'Latest Lab Test', status: 'completed' },
    { date: 'May 15', event: 'Treatment Adjustment', status: 'completed' },
    { date: 'Apr 15', event: 'Progress Photos', status: 'completed' },
    { date: 'Mar 15', event: 'Initial Consultation', status: 'completed' },
  ];

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm">
      <h3 className="text-lg font-semibold mb-6">Treatment Timeline</h3>
      <div className="space-y-6">
        {events.map((event, index) => (
          <div
            key={index}
            className="flex items-center gap-4 hover:bg-gray-50 p-2 rounded-lg transition-colors"
          >
            <div className="w-16 text-sm text-gray-600">{event.date}</div>
            <div className="w-8 h-8 bg-indigo-50 rounded-full flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-indigo-600" />
            </div>
            <div className="flex-1">
              <h4 className="font-medium">{event.event}</h4>
              <p className="text-sm text-gray-600 capitalize">{event.status}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const ResultsAnalysisPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Results Analysis</h1>
          <p className="text-gray-600">Track your progress and analyze your treatment results</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <MetricCard
            title="Hair Density"
            value="82%"
            change={5.2}
            icon={TrendingUp}
          />
          <MetricCard
            title="Growth Rate"
            value="2.9cm/month"
            change={8.1}
            icon={Activity}
          />
          <MetricCard
            title="Treatment Adherence"
            value="95%"
            change={2.3}
            icon={CheckCircle}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <ProgressChart />
          <BiomarkersRadar />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <h3 className="text-lg font-semibold mb-6">Treatment Recommendations</h3>
              <div className="space-y-4">
                {[
                  'Continue current treatment protocol',
                  'Increase daily water intake to 3L',
                  'Schedule next blood work in 30 days',
                  'Update progress photos weekly'
                ].map((recommendation, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <AlertCircle className="w-5 h-5 text-indigo-600 mt-0.5" />
                    <p className="text-gray-700">{recommendation}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <Timeline />
        </div>
      </div>
    </div>
  );
};

export default ResultsAnalysisPage;