import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { GithubIcon, LinkedinIcon, MailIcon } from 'lucide-react';
import { db } from '../contexts/AuthContext';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';

// SocialLink component remains unchanged
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
    className="bg-white rounded-xl shadow-lg overflow-hidden h-full flex flex-col"
  >
    <div className="p-6 flex flex-col items-center text-center flex-grow">
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
      <p className="text-blue-600 font-medium mb-4">
        {role === 'CO_PRES' ? 'Co-President' : 
         role === 'MEMBER' ? 'Member' : 
         role === 'Head of Frontend' ? 'Head of Frontend' : 
         role === 'ADVISOR' ? 'Advisor' : role}
      </p>
      <p className="text-gray-600 mb-4 flex-grow">{about}</p>
      <div className="flex space-x-4 mt-auto">
        {github && <SocialLink icon={GithubIcon} href={github} />}
        {linkedin && <SocialLink icon={LinkedinIcon} href={linkedin} />}
        {email && <SocialLink icon={MailIcon} href={`mailto:${email}`} />}
      </div>
    </div>
  </motion.div>
);

const Member = ({ name, role, image, about, github, linkedin }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    className="bg-white rounded-xl shadow-lg overflow-hidden h-full flex flex-col"
  >
    <div className="p-6 flex flex-col items-center text-center flex-grow">
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
      <p className="text-blue-600 font-medium mb-4">
        {role === 'CO_PRES' ? 'Co-President' : 
         role === 'MEMBER' ? 'Member' : 
          role === 'Head of Frontend' ? 'Head of Frontend' :
         role === 'ADVISOR' ? 'Advisor' : role}
      </p>
      {about && <p className="text-gray-600 mb-4 flex-grow">{about}</p>}
      <div className="flex space-x-4 mt-auto">
        {github && <SocialLink icon={GithubIcon} href={github} />}
        {linkedin && <SocialLink icon={LinkedinIcon} href={linkedin} />}
      </div>
    </div>
  </motion.div>
);

const Team = () => {
  const [leadership, setLeadership] = useState([]);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Create a query that orders by role (to separate leadership) and then by the order field
    const membersQuery = query(
      collection(db, 'members'),
      orderBy('order', 'asc') // This will use the order field set in admin
    );

    const unsubscribe = onSnapshot(
      membersQuery,
      (snapshot) => {
        const leadershipArray = [];
        const membersArray = [];

        snapshot.docs.forEach(doc => {
          const member = {
            id: doc.id,
            ...doc.data()
          };
          
          // Still separate by role, but maintain order within each group
          if (member.role === 'CO_PRES') {
            leadershipArray.push(member);
          } else {
            membersArray.push(member);
          }
        });

        // If order is not set for some reason, use name as fallback
        const sortByOrderOrName = (a, b) => {
          if (a.order === b.order || (a.order === undefined && b.order === undefined)) {
            return a.name.localeCompare(b.name);
          }
          if (a.order === undefined) return 1;
          if (b.order === undefined) return -1;
          return a.order - b.order;
        };

        // Sort arrays by order field, fall back to name if order is not set
        leadershipArray.sort(sortByOrderOrName);
        membersArray.sort(sortByOrderOrName);

        setLeadership(leadershipArray);
        setMembers(membersArray);
        setLoading(false);
      },
      (error) => {
        console.error('Error fetching members:', error);
        setError('Failed to load team members');
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-2xl text-gray-600">Loading team...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-xl text-red-600">{error}</div>
      </div>
    );
  }

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

        {leadership.length > 0 && (
          <div className="mb-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Leadership</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {leadership.map((leader) => (
                <LeadershipCard key={leader.id} {...leader} />
              ))}
            </div>
          </div>
        )}

        {members.length > 0 && (
          <div className="mb-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Members</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8">
              {members.map((member) => (
                <Member key={member.id} {...member} />
              ))}
            </div>
          </div>
        )}

        {leadership.length === 0 && members.length === 0 && (
          <div className="text-center text-gray-600">
            No team members found
          </div>
        )}
      </div>
    </div>
  );
};

export default Team;