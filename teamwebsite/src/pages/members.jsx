import React from 'react';
import { motion } from 'framer-motion';
import { GithubIcon, LinkedinIcon, MailIcon } from 'lucide-react';

const SocialLink = ({ icon: Icon, href }) => (
  <motion.a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    whileHover={{ scale: 1.1 }}
    whileTap={{ scale: 0.9 }}
    className="text-gray-600 hover:text-blue-600"
  >
    <Icon className="w-5 h-5" />
  </motion.a>
);

const LeadershipCard = ({ name, role, image, about, github, linkedin, email }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    className="bg-white rounded-xl shadow-lg overflow-hidden"
  >
    <div className="p-6 flex flex-col items-center text-center">
      <motion.div
        whileHover={{ scale: 1.05 }}
        className="mb-6"
      >
        <img
          src={image || "/api/placeholder/400/400"}
          alt={name}
          className="w-48 h-48 object-cover rounded-full"
        />
      </motion.div>
      <h3 className="text-2xl font-bold text-gray-900 mb-2">{name}</h3>
      <p className="text-blue-600 font-medium mb-4">{role}</p>
      <p className="text-gray-600 mb-4">{about}</p>
      <div className="flex space-x-4">
        {github && <SocialLink icon={GithubIcon} href={github} />}
        {linkedin && <SocialLink icon={LinkedinIcon} href={linkedin} />}
        {email && <SocialLink icon={MailIcon} href={`mailto:${email}`} />}
      </div>
    </div>
  </motion.div>
);

const Member = ({ name, role, image, github, linkedin }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    className="bg-white rounded-xl shadow-lg overflow-hidden"
  >
    <div className="p-6 flex flex-col items-center text-center">
      <motion.div
        whileHover={{ scale: 1.05 }}
        className="mb-4"
      >
        <img
          src={image || "/api/placeholder/400/400"}
          alt={name}
          className="w-32 h-32 object-cover rounded-full"
        />
      </motion.div>
      <h3 className="text-xl font-bold text-gray-900 mb-2">{name}</h3>
      <p className="text-blue-600 font-medium mb-4">{role}</p>
      <div className="flex space-x-4">
        {github && <SocialLink icon={GithubIcon} href={github} />}
        {linkedin && <SocialLink icon={LinkedinIcon} href={linkedin} />}
      </div>
    </div>
  </motion.div>
);

const Team = () => {
  const leadership = [
    {
      name: "Swopnil Panday",
      role: "Co-President",
      about: "Computer Science senior with a passion for AI and machine learning. Leading VSE's initiative for more inclusive tech education.",
      github: "https://github.com",
      linkedin: "https://linkedin.com",
      email: "spanday@villanova.edu"
    },
    {
      name: "Chris Marquez",
      role: "Co-President",
      about: "Software Engineering junior focused on web development and cloud computing. Organizing VSE's annual hackathon.",
      github: "https://github.com",
      linkedin: "https://linkedin.com",
      email: "cmarquez@villanova.edu"
    },
    {
      name: "Jaylen Bradley",
      role: "Co-President",
      about: "Computer Engineering senior specializing in IoT and embedded systems. Managing VSE's industry partnership program.",
      github: "https://github.com",
      linkedin: "https://linkedin.com",
      email: "jbradley@villanova.edu"
    }
  ];

  const members = [
    {
      name: "Sarah Wilson",
      role: "Members",
      github: "https://github.com",
      linkedin: "https://linkedin.com"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Our Team</h1>
          <p className="text-gray-600">Meet the amazing people behind VSE</p>
        </motion.div>

        <div className="mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Leadership</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {leadership.map((leader, index) => (
              <LeadershipCard key={index} {...leader} />
            ))}
          </div>
        </div>

        <div className="mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Members</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {members.map((member, index) => (
              <Member key={index} {...member} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Team;