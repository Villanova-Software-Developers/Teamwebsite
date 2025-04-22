import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

const volunteerData = [
  { name: 'Monthly or More Often', value: 55 },
  { name: 'Once per Semester or Less', value: 45 }
];

const COLORS = ['#6366f1', '#ec4899'];

const FoodWasteChart = () => {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Header */}
      <header className="bg-emerald-600 text-white py-8">
        <div className="max-w-5xl mx-auto px-4">
          <h1 className="text-4xl font-bold text-center">Food Connect On Campus</h1>
          <p className="text-center text-xl mt-2">Rescuing Quality Food, Feeding Communities, Reducing Waste</p>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow px-4 py-8">
        <div className="max-w-5xl mx-auto">
          
          {/* Problem & Solution Section */}
          <section className="mb-12">
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-amber-50 p-6 rounded-lg border-l-4 border-amber-500">
                <h2 className="text-2xl font-bold text-amber-800 mb-4">The Problem</h2>
                <p className="text-gray-700">
                  College dining halls across America throw away hundreds of pounds of perfectly good food daily, while food insecurity affects millions of students and community members. Food Connect needs a creative expansion strategy to grow their impact and reach new markets.
                </p>
              </div>
              
              <div className="bg-emerald-50 p-6 rounded-lg border-l-4 border-emerald-500">
                <h2 className="text-2xl font-bold text-emerald-800 mb-4">Our Solution</h2>
                <p className="text-gray-700">
                  Food Connect On Campus collaborates with student organizations and dining services to rescue leftover quality foods from campus dining facilities. Food Connect will have an established student chapter which will run the operations. Contracted Food Connect drivers or student volunteers deliver food to those in need through campus food pantries and local community organizations.
                </p>
              </div>
            </div>
          </section>
          
          {/* Impact Data Section */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-800 text-center mb-6">Student Volunteer Frequency Survey</h2>
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={volunteerData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({percent}) => `${(percent * 100).toFixed(0)}%`}
                    >
                      {volunteerData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
                <p className="text-center text-sm text-gray-500 mt-2">Student Volunteer Frequency - Total Population Surveyed: 65</p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-bold text-gray-800 mb-4">Villanova University Partnership</h3>
                <p className="text-gray-700 mb-4">
                  In our interviews with Villanova Dining Services, we found enthusiastic support for our initiative. Their team shared that a lot of quality food goes to waste each day across campus dining facilities.
                </p>
                <blockquote className="border-l-4 border-emerald-500 pl-4 italic text-gray-600 mb-4">
                  "We want to have student groups or campus offices come into the dining hall and volunteer to plate the food, instead of adding another responsibility for our staff who are already working early mornings or late nights"
                  <footer className="text-sm mt-2 not-italic">— Andrew Camuso, Executive of Dining Services</footer>
                </blockquote>
              </div>
            </div>
          </section>
          
          {/* How It Works Section */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-800 text-center mb-6">How It Works</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {/* Step 1 */}
              <div className="bg-gray-50 p-5 rounded-lg shadow border-t-4 border-emerald-500">
                <div className="flex items-center justify-center h-12 w-12 rounded-full bg-emerald-500 text-white text-xl font-bold mb-4 mx-auto">1</div>
                <h3 className="text-lg font-bold text-center text-gray-800 mb-2">Collection</h3>
                <p className="text-gray-600 text-center">
                  Student volunteers identify and properly package excess quality food from dining facilities.
                </p>
              </div>
              
              {/* Step 2 */}
              <div className="bg-gray-50 p-5 rounded-lg shadow border-t-4 border-emerald-500">
                <div className="flex items-center justify-center h-12 w-12 rounded-full bg-emerald-500 text-white text-xl font-bold mb-4 mx-auto">2</div>
                <h3 className="text-lg font-bold text-center text-gray-800 mb-2">Transportation</h3>
                <p className="text-gray-600 text-center">
                  Food Connect drivers or student volunteers transport food safely to distribution points.
                </p>
              </div>
              
              {/* Step 3 */}
              <div className="bg-gray-50 p-5 rounded-lg shadow border-t-4 border-emerald-500">
                <div className="flex items-center justify-center h-12 w-12 rounded-full bg-emerald-500 text-white text-xl font-bold mb-4 mx-auto">3</div>
                <h3 className="text-lg font-bold text-center text-gray-800 mb-2">Distribution</h3>
                <p className="text-gray-600 text-center">
                  Food is distributed to campus food pantries and local community organizations.
                </p>
              </div>
            </div>
          </section>
          
          {/* Key Stats Section */}
          <section className="mb-12">
            <div className="bg-emerald-600 rounded-lg shadow-lg text-white p-6">
              <h2 className="text-2xl font-bold text-center mb-6">Our Pilot Program Expectations</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                <div className="p-4">
                  <p className="text-4xl font-bold mb-2">10K+</p>
                  <p className="text-sm">Pounds of Food Rescued</p>
                </div>
                <div className="p-4">
                  <p className="text-4xl font-bold mb-2">30+</p>
                  <p className="text-sm">Student Volunteers</p>
                </div>
                <div className="p-4">
                  <p className="text-4xl font-bold mb-2">3</p>
                  <p className="text-sm">Campus Dining Locations</p>
                </div>
                <div className="p-4">
                  <p className="text-4xl font-bold mb-2">5</p>
                  <p className="text-sm">Community Partners</p>
                </div>
              </div>
            </div>
          </section>
          
          {/* Business Model Section */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-800 text-center mb-6">Business Model Overview</h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-bold text-gray-800 mb-3">Revenue Streams</h3>
                <ul className="list-disc pl-5 text-gray-700 space-y-2">
                  <li>University partnerships through sustainability initiatives</li>
                  <li>Grant funding for campus food security programs</li>
                  <li>Fundraising from 1842 day</li>
                  <li>Alumni network donation drives</li>
                </ul>
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-800 mb-3">Key Partners</h3>
                <ul className="list-disc pl-5 text-gray-700 space-y-2">
                  <li>University dining services</li>
                  <li>Student government associations</li>
                  <li>Campus sustainability offices</li>
                  <li>Local food banks and community organizations</li>
                </ul>
              </div>
            </div>
          </section>
          
          {/* Call to Action */}
          <section>
            <div className="bg-amber-100 rounded-lg shadow-md p-8 text-center">
              <h2 className="text-2xl font-bold text-amber-800 mb-4">Join the Food Connect On Campus Movement</h2>
              <p className="text-gray-700 mb-6">
                We're expanding to campuses nationwide. Help us rescue food, reduce waste, and feed communities.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <button className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 px-6 rounded-lg transition duration-300">
                  Start a Campus Chapter
                </button>
                <button className="bg-amber-500 hover:bg-amber-600 text-white font-bold py-2 px-6 rounded-lg transition duration-300">
                  Partner With Us
                </button>
              </div>
            </div>
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-6">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <p>© 2025 Food Connect On Campus | Email: campus@foodconnect.org | Phone: (215) 555-1234</p>
        </div>
      </footer>
    </div>
  );
};

export default FoodWasteChart;