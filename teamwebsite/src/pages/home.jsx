import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { 
  Users, 
  Target, 
  Award, 
  ChevronDown, 
  Code, 
  Share, 
  Trophy, 
  Rocket, 
  ArrowRight,
  X  // Added X icon
} from 'lucide-react';
import AnimatedTitle from '../components/animations/AnimatedTitle';
import CustomCursor from '../components/animations/CustomCursor';


const WhatWeDoCard = ({ icon: Icon, title, description, delay }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const modalContent = {
    title,
    description,
    features: [
      {
        title: 'Learn Together',
        description: 'Join our community workshops and coding sessions.'
      },
      {
        title: 'Build Projects',
        description: 'Work on real-world projects with other members.'
      },
      {
        title: 'Grow Skills',
        description: 'Develop your technical and soft skills through hands-on experience.'
      },
      {
        title: 'Network',
        description: 'Connect with industry professionals and fellow developers.'
      }
    ]
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ delay }}
        className="relative group"
      >
        <div
          onClick={() => setIsModalOpen(true)}
          className="cursor-pointer"
        >
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="bg-white p-8 rounded-2xl shadow-lg overflow-hidden relative z-10"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            
            <div className="relative z-10">
              <div className="mb-4 flex justify-between items-center">
                <div className="p-3 bg-blue-100 rounded-lg w-14 h-14 flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                  <Icon className="w-8 h-8 text-blue-600" />
                </div>
                <motion.div
                  initial={{ x: -10, opacity: 0 }}
                  whileHover={{ x: 0, opacity: 1 }}
                  className="text-blue-600"
                >
                  <ArrowRight className="w-6 h-6" />
                </motion.div>
              </div>
              
              <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                {title}
              </h3>
              <p className="text-gray-600">
                {description}
              </p>
              
              <motion.div
                className="absolute bottom-0 left-0 h-1 bg-blue-500"
                initial={{ width: 0 }}
                whileHover={{ width: '100%' }}
                transition={{ duration: 0.3 }}
              />
            </div>
          </motion.div>
        </div>
      </motion.div>

      <ImmersiveModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        content={modalContent}
      />
    </>
  );
};




// Letter animation component for text popping effect
const AnimatedLetter = ({ letter, delay }) => (
  <motion.span
    initial={{ opacity: 0, scale: 0.5 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{
      duration: 0.5,
      delay,
      type: "spring",
      stiffness: 200,
      damping: 10
    }}
    className="inline-block"
  >
    {letter}
  </motion.span>
);

// Animated heading with letter-by-letter animation
const AnimatedHeading = ({ text, startDelay = 0 }) => (
  <h2 className="text-6xl font-bold text-white tracking-wider font-tech">
    {text.split('').map((letter, index) => (
      <AnimatedLetter
        key={index}
        letter={letter}
        delay={startDelay + index * 0.05}
      />
    ))}
  </h2>
);

const AnimatedText = ({ children, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ 
      duration: 0.6, 
      delay,
      ease: [0.22, 1, 0.36, 1]
    }}
    className="font-tech"
  >
    {children}
  </motion.div>
);

const ImmersiveModal = ({ isOpen, onClose, content }) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50"
      >
        {/* Video Background with Wave Effect */}
        <div className="absolute inset-0 overflow-hidden">
          <video
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover"
          >
            <source src="code3.mp4" type="video/mp4" />
          </video>
          
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-purple-900/90 via-purple-900/80 to-blue-900/90" />
          
          {/* Animated Wave Pattern */}
          <motion.div
            className="absolute inset-0"
            style={{
              backgroundImage: 'url("/wave-pattern.svg")',
              backgroundSize: 'cover',
              opacity: 0.1
            }}
            animate={{
              scale: [1, 1.1, 1],
              opacity: [0.1, 0.15, 0.1],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        </div>

        {/* Content Container */}
        <div className="relative h-full flex items-center justify-center px-4">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="w-full max-w-4xl"
          >
            {/* Close Button */}
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              onClick={onClose}
              className="absolute top-4 right-4 text-white/80 hover:text-white transition-colors"
            >
              <X className="w-8 h-8" />
            </motion.button>

            {/* Content with Enhanced Typography and Animations */}
            <div className="space-y-8">
              <div className="space-y-2">
                <AnimatedHeading text={content.title} startDelay={0.2} />
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: "100%" }}
                  transition={{ delay: 0.8, duration: 0.8 }}
                  className="h-1 bg-white"
                />
              </div>

              <AnimatedText delay={0.6}>
                <p className="text-2xl text-white/90 tracking-wide leading-relaxed">
                  {content.description}
                </p>
              </AnimatedText>

              {/* Features Grid with Enhanced Typography */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12">
                {content.features?.map((feature, index) => (
                  <AnimatedText key={index} delay={0.8 + index * 0.1}>
                    <motion.div
                      whileHover={{ 
                        scale: 1.02,
                        boxShadow: "0 0 20px rgba(59, 130, 246, 0.3)"
                      }}
                      className="bg-white/10 backdrop-blur-lg p-6 rounded-xl border border-white/10 transition-all"
                    >
                      <h3 className="text-2xl font-bold text-white mb-2 tracking-wider">
                        {feature.title}
                      </h3>
                      <p className="text-lg text-white/80 tracking-wide">
                        {feature.description}
                      </p>
                    </motion.div>
                  </AnimatedText>
                ))}
              </div>

              {/* Call to Action */}
              <AnimatedText delay={1.2}>
                <motion.div className="flex justify-center mt-12">
                  <motion.button
                   whileHover={{ 
                    scale: 1.05,
                    boxShadow: "0 0 30px rgba(34, 211, 238, 0.5)" // Updated to cyan color
                  }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-cyan-400 hover:bg-cyan-500 text-white px-10 py-4 rounded-lg text-xl font-bold tracking-wider transition-all shadow-lg"
                  >
                    GET STARTED →
                  </motion.button>
                </motion.div>
              </AnimatedText>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};



const whatWeDoItems = [
  {
    icon: Code,
    title: "Collaborate on Projects",
    description: "Work together on real-world projects and build innovative solutions.",
    link: "/projects",
    delay: 0.2
  },
  {
    icon: Share,
    title: "Learn & Share Coding",
    description: "Exchange knowledge and master new programming techniques together.",
    link: "/members",
    delay: 0.3
  },
  {
    icon: Trophy,
    title: "Participate in Hackathons",
    description: "Compete in hackathons and showcase your problem-solving skills.",
    link: "/projects",
    delay: 0.4
  },
  {
    icon: Rocket,
    title: "Make Real Impact",
    description: "Create solutions that make a difference in the Villanova community.",
    link: "/projects",
    delay: 0.5
  }
];
const Home = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const stats = [
    { icon: Users, label: 'Active Members', value: '50+' },
    { icon: Target, label: 'Projects Completed', value: '25' },
    { icon: Award, label: 'Awards Won', value: '10' },
  ];

  return (
    <div className="bg-gray-50">
      <CustomCursor />
      
      {/* Hero Section with Enhanced Background */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="relative min-h-screen bg-white"
      >


     {/* Animated Background Pattern */}
       {/* Modern Gradient Background */}
       <div className="absolute inset-0 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-indigo-50">
            <motion.div
              className="absolute inset-0 opacity-30"
              style={{
                backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(0,0,0,0.1) 1px, transparent 0)'
              }}
            />
          </div>
        </div>

        {/* Optional: Subtle wave effect */}
        <div className="absolute inset-0 opacity-10">
          <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <motion.path
              d="M0,50 C30,60 70,40 100,50 L100,100 L0,100 Z"
              fill="url(#gentle-wave)"
              animate={{
                d: ["M0,50 C30,60 70,40 100,50 L100,100 L0,100 Z", 
                    "M0,50 C30,40 70,60 100,50 L100,100 L0,100 Z"]
              }}
              transition={{
                duration: 10,
                repeat: Infinity,
                repeatType: "reverse",
                ease: "easeInOut"
              }}
            />
            <defs>
              <linearGradient id="gentle-wave" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor="#3B82F6" />
                <stop offset="100%" stopColor="#93C5FD" />
              </linearGradient>
            </defs>
          </svg>
        </div>

        {/* Floating Circles */}
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-blue-200/20"
            style={{
              width: Math.random() * 300 + 100,
              height: Math.random() * 300 + 100,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -20, 0],
              scale: [1, 1.1, 1],
              opacity: [0.1, 0.2, 0.1],
            }}
            transition={{
              duration: 5 + i,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}

        {/* Hero Content */}
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 min-h-screen flex items-center">
  <div className="w-full md:w-3/5">
    {/* Welcome Badge */}
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="mb-6 inline-block px-4 py-2 bg-blue-100 rounded-full"
    >
      <span className="text-blue-600 font-semibold">Welcome to VSE</span>
    </motion.div>

    {/* Animated Title */}
    <div className="animated-title-container mb-6">
      <AnimatedTitle />
    </div>

    {/* Description */}
    <motion.p
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6 }}
      className="text-xl md:text-2xl text-gray-600 mb-8"
    >
      Where innovation meets collaboration. Join us in creating amazing projects
      and building the future together.
    </motion.p>

    {/* Buttons */}
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.8 }}
      className="flex flex-wrap gap-4"
    >
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="bg-blue-600 text-white px-8 py-3 rounded-lg font-medium shadow-lg hover:bg-blue-700 transition-colors"
      >
        Join Us
      </motion.button>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="bg-white text-blue-600 px-8 py-3 rounded-lg font-medium shadow-lg hover:bg-gray-50 transition-colors border border-blue-200"
      >
        Learn More
      </motion.button>
    </motion.div>
  </div>

          {/* Scroll Indicator */}
          <motion.div 
            className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <ChevronDown className="w-8 h-8 text-gray-400" />
          </motion.div>
        </div>
      </motion.section>

      {/* What We Do Section */}
      <section className="py-24 bg-gray-50 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <motion.h2 
              className="text-4xl font-bold text-gray-900 mb-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              What We Do?
            </motion.h2>
            <motion.p 
              className="text-xl text-gray-600"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              Explore the various ways you can grow with us
            </motion.p>
          </motion.div>

          {/* Animated Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {whatWeDoItems.map((item, index) => (
              <WhatWeDoCard
                key={index}
                icon={item.icon}
                title={item.title}
                description={item.description}
                link={item.link}
                delay={item.delay}
              />
            ))}
          </div>

          {/* Floating decoration elements */}
          <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-96 h-96 bg-blue-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob" />
          <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/2 w-96 h-96 bg-purple-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000" />
        </div>
      </section>

      {/* Stats Section */}
      <section ref={ref} className="py-24 bg-white relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-gray-50/50 to-white" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: index * 0.2 }}
                className="bg-white p-8 rounded-2xl shadow-lg text-center relative overflow-hidden group hover:shadow-xl transition-shadow duration-300"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-indigo-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="relative">
                  <stat.icon className="w-12 h-12 mx-auto text-blue-500" />
                  <motion.h3
                    initial={{ scale: 0 }}
                    animate={inView ? { scale: 1 } : {}}
                    transition={{ delay: index * 0.2 + 0.2 }}
                    className="mt-4 text-4xl font-bold text-gray-900"
                  >
                    {stat.value}
                  </motion.h3>
                  <p className="mt-2 text-gray-600 font-medium">{stat.label}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Collaboration Section with Enhanced Design */}
      <section className="py-24 bg-gray-50 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center"
          >
            <div className="space-y-6">
              <h2 className="text-4xl font-bold text-gray-900 leading-tight">
                Collaborate with Amazing People
              </h2>
              <p className="text-xl text-gray-600">
                Join our community of passionate individuals working together to create
                innovative solutions and tackle challenging problems.
              </p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-blue-600 text-white px-8 py-3 rounded-lg font-medium shadow-lg hover:bg-blue-700 transition-colors"
              >
                Start Collaborating
              </motion.button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <motion.div
                  key={i}
                  whileHover={{ scale: 1.05, rotate: 2 }}
                  className="aspect-square bg-white rounded-xl shadow-lg overflow-hidden"
                >
                  <img
                    src={`/api/placeholder/${400}/${400}`}
                    alt={`Collaboration ${i}`}
                    className="w-full h-full object-cover"
                  />
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Home;