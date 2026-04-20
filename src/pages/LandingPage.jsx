import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Login from './Auth/Login';
import Signup from './Auth/Signup';
import { APP_FEATURES } from '../utils/data';
import { 
  SparklesIcon, 
  ChatBubbleLeftRightIcon, 
  ChartBarIcon, 
  VideoCameraIcon,  
  ArrowRightIcon,
  XMarkIcon,
  PlayCircleIcon,
  ShieldCheckIcon,
  UsersIcon,
  BoltIcon
} from '@heroicons/react/24/outline';
import { UserContext } from '../context/userContext';
import ProfileInfoCard from '../components/Cards/ProfileInfoCard';
import  HeroImage from '../assets/HeroImage.png' 


const LandingPage = () => {
  const {user,loading}=React.useContext(UserContext);
  const navigate = useNavigate();
  const [openAuthModal, setOpenAuthModal] = useState(false);
  const [currentPage, setCurrentPage] = useState('login');

  const handleCTA = () => {
    if(!user){
      setCurrentPage('signup');
      setOpenAuthModal(true);
    }else{
      navigate("/dashboard");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white overflow-hidden">
      
      <nav className="container mx-auto px-6 py-6 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <div className="w-10 h-10 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-lg flex items-center justify-center">
            <SparklesIcon className="h-6 w-6" />
          </div>
          <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-400">
            AcePrep
          </span>
        </div>
        
       
      <div className="flex items-center space-x-4">
        {loading ? (
          <div className="w-32 h-10 bg-gray-800/50 rounded-lg animate-pulse"></div>
        ) : user ? (
          <ProfileInfoCard />
        ) : (
          <>
            <button 
              onClick={() => {
                setCurrentPage('login');
                setOpenAuthModal(true);
              }}
              className="px-4 py-2 rounded-lg hover:text-cyan-300 transition-colors"
            >
              Sign In
            </button>
            <button 
              onClick={handleCTA}
              className="px-6 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-lg font-semibold hover:from-cyan-600 hover:to-blue-600 transition-all transform hover:scale-105 shadow-lg shadow-cyan-500/25"
            >
              Get Started Free
            </button>
          </>
        )}
      </div>
      </nav>
      
      <section className="container mx-auto px-6 py-12 md:py-20">
        <div className="max-w-6xl mx-auto text-center">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-500/30 mb-6">
            <SparklesIcon className="h-4 w-4 mr-2 text-cyan-400" />
            <span className="text-sm">Powered by Advanced AI</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            Ace Your Next Interview with
            <span className="block bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400">
              AI-Powered Coaching
            </span>
          </h1>
          
          <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-10">
            Get personalized mock interviews, real-time feedback, and actionable insights 
            to land your dream job. Our AI understands exactly what recruiters want.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <button 
              onClick={handleCTA}
              className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-xl font-semibold text-lg hover:from-cyan-600 hover:to-blue-600 transition-all transform hover:scale-105 shadow-xl shadow-cyan-500/25 flex items-center justify-center"
            >
              Get Started
              <ArrowRightIcon className="h-5 w-5 ml-2" />
            </button>
            <button className="px-8 py-4 border border-gray-700 rounded-xl font-semibold text-lg hover:bg-gray-800/50 transition-all flex items-center justify-center">
              <PlayCircleIcon className="h-5 w-5 mr-2" />
              Watch Demo
            </button>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto mt-4">
            <div className="text-center p-4">
              <div className="text-3xl font-bold text-cyan-400">98%</div>
              <div className="text-gray-400">Success Rate</div>
            </div>
            <div className="text-center p-4">
              <div className="text-3xl font-bold text-blue-400">10K+</div>
              <div className="text-gray-400">Questions Covered</div>
            </div>
            <div className="text-center p-4">
              <div className="text-3xl font-bold text-purple-400">50+</div>
              <div className="text-gray-400">Industries Covered</div>
            </div>
            <div className="text-center p-4">
              <div className="text-3xl font-bold text-green-400">24/7</div>
              <div className="text-gray-400">AI Availability</div>
            </div>
          </div>
        </div>
      </section>
      
      <section className="container mx-auto px-6 py-12 md:py-16">
        <div className="max-w-6xl mx-auto relative">
          <div className="absolute inset-0 flex justify-center pointer-events-none">
            <div className="w-[600px] h-[600px] bg-gradient-to-r from-cyan-500/20 via-blue-500/20 to-purple-500/20 rounded-full blur-3xl opacity-40"></div>
          </div>
          <div className="relative bg-gray-800/40 backdrop-blur-xl border border-gray-700 rounded-3xl p-6 shadow-2xl shadow-cyan-500/10">
            <div className="text-center mb-8">
              <h2 className="text-3xl md:text-4xl font-bold mb-3">
                See AcePrep in Action
              </h2>
              <p className="text-gray-400 max-w-2xl mx-auto">
                Experience real-time AI interview simulations, instant feedback,
                and personalized insights designed to maximize your success.
              </p>
            </div>
            
            <div className="relative rounded-2xl overflow-hidden border border-gray-700 shadow-xl">
              <img
                src={HeroImage}
                alt="AcePrep Dashboard Preview"
                className="w-full h-auto object-cover rounded-2xl"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
            </div>
          </div>
        </div>
      </section>


     <section id="features" className="container mx-auto px-6 py-12 md:py-16">

        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-4xl font-bold mb-4">Why Choose AcePrep</h2>
            <p className="text-gray-400 text-lg">Cutting-edge features powered by artificial intelligence</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {APP_FEATURES?.map((feature, index) => (
              <div 
                key={index}
                className="bg-gray-800/30 backdrop-blur-sm border border-gray-700 rounded-2xl p-6 hover:border-cyan-500/50 transition-all hover:transform hover:scale-105 group"
              >
                <div className="w-12 h-12 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 rounded-xl flex items-center justify-center mb-4 group-hover:from-cyan-500/30 group-hover:to-blue-500/30">
                  {index % 6 === 0 && (
                    <ChatBubbleLeftRightIcon className="h-6 w-6 text-cyan-400" />
                    )}

                    {index % 6 === 1 && (
                    <VideoCameraIcon className="h-6 w-6 text-blue-400" />
                    )}

                    {index % 6 === 2 && (
                    <ChartBarIcon className="h-6 w-6 text-purple-400" />
                    )}

                    {index % 6 === 3 && (
                    <UsersIcon className="h-6 w-6 text-green-400" />
                    )}

                    {index % 6 === 4 && (
                    <SparklesIcon className="h-6 w-6 text-pink-400" />
                    )}

                    {index % 6 === 5 && (
                    <BoltIcon className="h-6 w-6 text-yellow-400" />
                    )}

                </div>
                <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                <p className="text-gray-400">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      
      <section className="container mx-auto px-6 py-12 md:py-16">
        <div className="max-w-4xl mx-auto text-center bg-gradient-to-r from-gray-800/50 to-gray-900/50 backdrop-blur-sm border border-gray-700 rounded-3xl p-10">
          <h2 className="text-4xl font-bold mb-4">
            Ready to Transform Your Interview Skills?
          </h2>
          <p className="text-xl text-gray-300 mb-6">
            Join thousands of successful candidates who aced their interviews with our AI coach
          </p>
          <button 
            onClick={handleCTA}
            className="px-10 py-4 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-xl font-semibold text-lg hover:from-cyan-600 hover:to-blue-600 transition-all transform hover:scale-105 shadow-xl shadow-cyan-500/25"
          >
            Start Your Free Trial Now
          </button>
          <p className="text-gray-400 mt-4 flex items-center justify-center">
            <ShieldCheckIcon className="h-4 w-4 mr-2" />
            No credit card required • 14-day free trial
          </p>
        </div>
      </section>

     
      <footer className="container mx-auto px-6 py-8 border-t border-gray-800 mt-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center space-x-2">
          <div className="w-10 h-10 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-lg flex items-center justify-center">
            <SparklesIcon className="h-6 w-6" />
          </div>
          <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-400">
            AcePrep
          </span>
        </div>
          <div className="text-gray-400 text-center md:text-right">
            <p>© 2024 InterviewAI. All rights reserved.</p>
            <p className="text-sm mt-2">Powered by GPT-4 & Advanced Speech Recognition</p>
          </div>
        </div>
      </footer>

      
      {openAuthModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 border border-gray-700 rounded-2xl max-w-md w-full p-8 relative animate-fadeIn">
            <button 
              onClick={() => setOpenAuthModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
            
            <div className="mb-8">
              <div className="flex mb-6">
                <button
                  className={`flex-1 py-3 font-semibold ${currentPage === 'login' ? 'border-b-2 border-cyan-500' : 'text-gray-400'}`}
                  onClick={() => setCurrentPage('login')}
                >
                  Sign In
                </button>
                <button
                  className={`flex-1 py-3 font-semibold ${currentPage === 'signup' ? 'border-b-2 border-cyan-500' : 'text-gray-400'}`}
                  onClick={() => setCurrentPage('signup')}
                >
                  Create Account
                </button>
              </div>
              
              {currentPage === 'login' ? <Login /> : <Signup />}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LandingPage;