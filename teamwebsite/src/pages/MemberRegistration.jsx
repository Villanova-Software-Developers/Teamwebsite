import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import MemberRegistrationForm from '../components/MembersRegistrationForm';

const MemberRegistration = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Join Our Team</h1>
          <p className="mt-2 text-lg text-gray-600">
            Submit your application to become a member of our community
          </p>
        </div>
        <MemberRegistrationForm />
      </div>
    </div>
  );
};

export default MemberRegistration;