import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  ChevronDown, 
  ChevronUp, 
  Clock, 
  BookOpen, 
  Target, 
  GraduationCap,
  Link,
  Wrench,
  CheckCircle
} from 'lucide-react';
import { Tab } from '@headlessui/react';

const WeeklyTasks = () => {
  const [expandedMember, setExpandedMember] = useState(null);
  const [selectedTab, setSelectedTab] = useState(0);


  const weeklyTasks = [
    {
      name: "Swopnil Panday",
      role: "Lead/Backend/ML",
      tasks: [
        {
          title: "Project Setup",
          details: [
            "Create GitHub repository and invite team members",
            "Set up basic Django project structure",
            "Create README with setup instructions",
            "Set up basic project folders"
          ]
        },
        {
          title: "Development Guidelines",
          details: [
            "Write coding standards document",
            "Create branch naming conventions",
            "Document how to run the project locally",
            "Set up team communication channels"
          ]
        }
      ],
      learningFocus: [
        {
          topic: "Project Management",
          resources: [
            "GitHub Project Management basics",
            "Team collaboration tools",
            "Basic Git commands guide"
          ]
        }
      ],
      tools: ["GitHub", "Django", "VS Code"],
      deliverables: [
        "Working repository structure",
        "Project documentation",
        "Development guidelines"
      ]
    },
    {
      name: "Jack McIntyre",
      role: "Frontend",
      tasks: [
        {
          title: "Simple Login Page",
          details: [
            "Create a basic login form with email and password",
            "Add simple form validation (check if fields are empty)",
            "Make the page look nice with TailwindCSS",
            "Add a loading spinner when form submits"
          ]
        },
        {
          title: "User Profile Page",
          details: [
            "Create a form to enter name and bio",
            "Add ability to list skills (simple text input)",
            "Make it mobile-friendly using Tailwind",
            "Add a preview of how profile looks"
          ]
        }
      ],
      learningFocus: [
        {
          topic: "React Basics",
          resources: [
            "How to create React components",
            "Using useState for form handling",
            "Basic TailwindCSS classes"
          ]
        }
      ],
      tools: ["React", "TailwindCSS"],
      deliverables: [
        "Working login form",
        "Basic profile page"
      ]
    },
    {
      name: "Kyle Swett",
      role: "Backend/ML",
      tasks: [
        {
          title: "User Database Setup",
          details: [
            "Create basic User model in Django",
            "Add fields for name, email, and password",
            "Create simple API to create new users",
            "Add API to fetch user details"
          ]
        }
      ],
      learningFocus: [
        {
          topic: "Django Basics",
          resources: [
            "Django model creation guide",
            "Basic database operations",
            "Simple API creation"
          ]
        }
      ],
      tools: ["Django", "SQLite"],
      deliverables: [
        "Working User model",
        "Basic user APIs"
      ]
    },
    {
      name: "Michael",
      role: "Frontend/Chatbot",
      tasks: [
        {
          title: "Simple Chat Interface",
          details: [
            "Create a message input box",
            "Show messages in a list format",
            "Add basic send button",
            "Style the chat window"
          ]
        }
      ],
      learningFocus: [
        {
          topic: "React Components",
          resources: [
            "Component state management",
            "Event handling in React",
            "CSS Flexbox basics"
          ]
        }
      ],
      tools: ["React", "CSS Flexbox"],
      deliverables: [
        "Basic chat interface",
        "Message display system"
      ]
    },
    {
      name: "Julien",
      role: "Machine Learning",
      tasks: [
        {
          title: "Basic Skill Matching",
          details: [
            "Create simple function to match skills",
            "Compare text similarity between skills",
            "Create test data for matching",
            "Write basic matching algorithm"
          ]
        }
      ],
      learningFocus: [
        {
          topic: "Python Basics",
          resources: [
            "Python functions and lists",
            "Basic text processing",
            "Simple matching algorithms"
          ]
        }
      ],
      tools: ["Python", "Pandas"],
      deliverables: [
        "Simple matching function",
        "Test results"
      ]
    },
    {
      name: "Roger",
      role: "Backend",
      tasks: [
        {
          title: "User Authentication",
          details: [
            "Set up basic login endpoint",
            "Create registration endpoint",
            "Add simple password validation",
            "Create logout functionality"
          ]
        }
      ],
      learningFocus: [
        {
          topic: "Django Auth",
          resources: [
            "Django authentication basics",
            "User registration flow",
            "Password handling"
          ]
        }
      ],
      tools: ["Django", "Django REST framework"],
      deliverables: [
        "Working login system",
        "User registration"
      ]
    },
    {
      name: "Rebecca",
      role: "Backend/ML",
      tasks: [
        {
          title: "API Development",
          details: [
            "Create endpoint to save user interests",
            "Add API to get matching projects",
            "Create simple data validation",
            "Add error handling"
          ]
        }
      ],
      learningFocus: [
        {
          topic: "API Basics",
          resources: [
            "REST API concepts",
            "HTTP methods",
            "Basic error handling"
          ]
        }
      ],
      tools: ["Django REST framework", "Postman"],
      deliverables: [
        "Working APIs",
        "API documentation"
      ]
    },
    {
      name: "Mya Dang",
      role: "Backend",
      tasks: [
        {
          title: "File Upload System",
          details: [
            "Create simple file upload endpoint",
            "Add basic file type validation",
            "Create file download endpoint",
            "Add simple error handling"
          ]
        }
      ],
      learningFocus: [
        {
          topic: "File Handling",
          resources: [
            "File upload basics",
            "Django file handling",
            "Basic validation"
          ]
        }
      ],
      tools: ["Django", "Python File Handling"],
      deliverables: [
        "Working file upload",
        "Download functionality"
      ]
    },
    {
      name: "Sophia",
      role: "ML",
      tasks: [
        {
          title: "Interest Categorization",
          details: [
            "Create list of interest categories",
            "Write simple categorization function",
            "Create test data",
            "Add basic matching logic"
          ]
        }
      ],
      learningFocus: [
        {
          topic: "Basic ML Concepts",
          resources: [
            "Python data structures",
            "Basic text classification",
            "Simple matching algorithms"
          ]
        }
      ],
      tools: ["Python", "pandas"],
      deliverables: [
        "Category system",
        "Basic classifier"
      ]
    },
    {
      name: "Michael Murphy",
      role: "Frontend",
      tasks: [
        {
          title: "Project List Page",
          details: [
            "Create simple project cards",
            "Add basic search input",
            "Create filter dropdown",
            "Make the list scrollable"
          ]
        }
      ],
      learningFocus: [
        {
          topic: "React Components",
          resources: [
            "Component props",
            "Event handling",
            "CSS Grid basics"
          ]
        }
      ],
      tools: ["React", "CSS Grid"],
      deliverables: [
        "Project listing page",
        "Search functionality"
      ]
    },
    {
      name: "Fatih & Chris",
      role: "Frontend",
      tasks: [
        {
          title: "Navigation Menu",
          details: [
            "Create simple nav bar",
            "Add responsive menu for mobile",
            "Create navigation links",
            "Style the navigation"
          ]
        }
      ],
      learningFocus: [
        {
          topic: "Frontend Basics",
          resources: [
            "HTML structure",
            "CSS styling basics",
            "Responsive design"
          ]
        }
      ],
      tools: ["React", "TailwindCSS"],
      deliverables: [
        "Working navigation",
        "Mobile menu"
      ]
    },
    {
      name: "Nadden",
      role: "ML Beginner",
      tasks: [
        {
          title: "Data Collection",
          details: [
            "Create simple CSV files with test data",
            "Write basic data loading function",
            "Add simple data validation",
            "Create data documentation"
          ]
        }
      ],
      learningFocus: [
        {
          topic: "Python Basics",
          resources: [
            "CSV file handling",
            "Python functions",
            "Basic data types"
          ]
        }
      ],
      tools: ["Python", "CSV files"],
      deliverables: [
        "Test data sets",
        "Data loading script"
      ]
    },
    {
      name: "Jaylen",
      role: "Machine Learning",
      tasks: [
        {
          title: "Project Recommendations",
          details: [
            "Create simple recommendation function",
            "Add basic scoring system",
            "Create test recommendations",
            "Write basic evaluation"
          ]
        }
      ],
      learningFocus: [
        {
          topic: "Basic ML",
          resources: [
            "Recommendation basics",
            "Python functions",
            "Simple algorithms"
          ]
        }
      ],
      tools: ["Python", "pandas"],
      deliverables: [
        "Basic recommender",
        "Test results"
      ]
    }
  ];
  

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
        opacity: 1,
        transition: { staggerChildren: 0.1 }
      }
    };
  
    const itemVariants = {
      hidden: { opacity: 0, y: 20 },
      visible: { opacity: 1, y: 0 }
    };
  
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Weekly Development Sprint</h1>
            <p className="text-xl text-gray-600">Foundation Building & Learning Phase</p>
            <div className="mt-4 flex justify-center gap-4">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                <Clock className="w-4 h-4 mr-1" />
                Week 1-2
              </span>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                <Target className="w-4 h-4 mr-1" />
                Initial Setup
              </span>
            </div>
          </motion.div>
  
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 gap-6"
          >
            {weeklyTasks.map((member, index) => (
              <motion.div
                key={member.name}
                variants={itemVariants}
                className="bg-white rounded-xl shadow-lg overflow-hidden"
              >
                <div 
                  className="p-6 cursor-pointer hover:bg-gray-50 transition-colors"
                  onClick={() => setExpandedMember(expandedMember === member.name ? null : member.name)}
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900">{member.name}</h3>
                      <p className="text-blue-600 font-medium">{member.role}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-500">
                        {expandedMember === member.name ? 'Less details' : 'More details'}
                      </span>
                      {expandedMember === member.name ? (
                        <ChevronUp className="w-5 h-5 text-gray-500" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-gray-500" />
                      )}
                    </div>
                  </div>
  
                  {expandedMember === member.name && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      transition={{ duration: 0.3 }}
                      className="mt-6 space-y-6"
                    >
                      {/* Tasks Section */}
                      <div>
                        <div className="flex items-center text-gray-700 mb-4">
                          <Target className="w-5 h-5 mr-2" />
                          <h4 className="font-semibold text-lg">Tasks & Objectives</h4>
                        </div>
                        <div className="space-y-4 ml-7">
                          {member.tasks.map((task, i) => (
                            <div key={i} className="bg-gray-50 p-4 rounded-lg">
                              <h5 className="font-medium text-gray-900 mb-2">{task.title}</h5>
                              <ul className="list-disc list-inside text-gray-600 space-y-1">
                                {task.details.map((detail, j) => (
                                  <li key={j}>{detail}</li>
                                ))}
                              </ul>
                            </div>
                          ))}
                        </div>
                      </div>
  
                      {/* Learning Focus Section */}
                      <div>
                        <div className="flex items-center text-gray-700 mb-4">
                          <BookOpen className="w-5 h-5 mr-2" />
                          <h4 className="font-semibold text-lg">Learning Focus</h4>
                        </div>
                        <div className="space-y-4 ml-7">
                          {member.learningFocus.map((focus, i) => (
                            <div key={i} className="bg-gray-50 p-4 rounded-lg">
                              <h5 className="font-medium text-gray-900 mb-2">{focus.topic}</h5>
                              <ul className="list-disc list-inside text-gray-600 space-y-1">
                                {focus.resources.map((resource, j) => (
                                  <li key={j}>{resource}</li>
                                ))}
                              </ul>
                            </div>
                          ))}
                        </div>
                      </div>
  
                      {/* Tools Section */}
                      <div>
                        <div className="flex items-center text-gray-700 mb-4">
                          <Wrench className="w-5 h-5 mr-2" />
                          <h4 className="font-semibold text-lg">Tools & Technologies</h4>
                        </div>
                        <div className="flex flex-wrap gap-2 ml-7">
                          {member.tools.map((tool, i) => (
                            <span key={i} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                              {tool}
                            </span>
                          ))}
                        </div>
                      </div>
  
                      {/* Deliverables Section */}
                      <div>
                        <div className="flex items-center text-gray-700 mb-4">
                          <CheckCircle className="w-5 h-5 mr-2" />
                          <h4 className="font-semibold text-lg">Expected Deliverables</h4>
                        </div>
                        <ul className="list-disc list-inside text-gray-600 ml-7 space-y-1">
                          {member.deliverables.map((deliverable, i) => (
                            <li key={i}>{deliverable}</li>
                          ))}
                        </ul>
                      </div>
  
                      {/* Time Estimate */}
                      <div className="flex items-center text-gray-500 mt-4 pt-4 border-t">
                        <Clock className="w-5 h-5 mr-2" />
                        <span>Expected completion time: 2-3 hours per task</span>
                      </div>
                    </motion.div>
                  )}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    );
  };
  
  export default WeeklyTasks;