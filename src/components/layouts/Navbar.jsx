import React, { useContext } from 'react';
import ProfileInfoCard from '../Cards/ProfileInfoCard';
import { Link, useNavigate } from 'react-router-dom';
import { SparklesIcon } from '@heroicons/react/24/outline';

const Navbar = () => {
  const navigate = useNavigate();
  return (
    <>
      <nav className="container mx-auto px-6 py-6 flex justify-between items-center">
        <Link to="/" className="flex items-center space-x-2">
          <div className="w-10 h-10 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-lg flex items-center justify-center">
            <SparklesIcon className="h-6 w-6 text-white" />
          </div>
          <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-400">
            AcePrep
          </span>
        </Link>
        <div className="flex items-center space-x-4">
          <ProfileInfoCard/>
        </div>
       </nav>
    </>
  );
};

export default Navbar;