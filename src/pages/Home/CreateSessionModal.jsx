import React, { useState } from 'react';
import { LuX, LuBriefcase, LuTarget, LuFileText, LuCalendar, LuClock } from 'react-icons/lu';
import { FiUser, FiCpu, FiAlertCircle } from 'react-icons/fi';
import { toast } from "react-toastify";
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPaths';
import { useNavigate } from 'react-router-dom';

const CreateSessionModal = ({ onClose, onSuccess }) => {
  const navigate=useNavigate();
  const [formData, setFormData] = useState({
    role: '',
    experience: '',
    topicsToFocus: '',
    description: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    if (!formData.role.trim()) newErrors.role = 'Role is required';
    if (!formData.experience) newErrors.experience = 'Experience level is required';
    if (!formData.topicsToFocus.trim()) newErrors.topicsToFocus = 'At least one topic is required';
    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      toast.error('Please fill in all required fields');
      return;
    }

    setIsLoading(true);
    try {
      const aiResponse=await axiosInstance.post(API_PATHS.AI.GENERATE_QUESTIONS,
        {
          role:formData.role,
          experience:formData.experience,
          topicsToFocus:formData.topicsToFocus,
          numberOfQuestions:10,
        }
      );
      const generatedQuestions=aiResponse.data;
      const response = await axiosInstance.post(API_PATHS.SESSION.CREATE, { ...formData, questions:generatedQuestions});
      console.log(response.data)
      if(response.data?.session?._id){
       navigate(`/interview-prep/${response.data?.session?._id}`)
      }
    } catch (error) {
      console.error('Error creating session:', error);
      toast.error(error.response?.data?.message || 'Failed to create session');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
      <div className="bg-gray-900 border border-gray-800 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto relative shadow-2xl custom-scrollbar">
        <div className="absolute inset-0 overflow-hidden rounded-2xl pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        </div>
        <div className="sticky top-0 z-10 bg-gray-900/95 backdrop-blur-md border-b border-gray-800 p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-xl flex items-center justify-center border border-cyan-500/30">
                <LuBriefcase className="w-6 h-6 text-cyan-400" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">Create New Session</h2>
                <p className="text-sm text-gray-400 flex items-center mt-1">
                  <FiCpu className="mr-1" />
                  AI-Powered Interview Preparation
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-800 rounded-lg transition-colors group"
            >
              <LuX className="w-5 h-5 text-gray-400 group-hover:text-white" />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="relative p-6 space-y-6">
          <div className="space-y-2">
            <label className="flex items-center text-sm font-medium text-gray-300">
              <FiUser className="mr-2 text-cyan-400" />
              Job Role / Position <span className="text-red-400 ml-1">*</span>
            </label>
            <div className="relative group">
              <input
                type="text"
                name="role"
                value={formData.role}
                onChange={handleChange}
                placeholder="e.g., Frontend Developer, Product Manager, Data Scientist"
                className={`w-full px-4 py-3 bg-gray-800/50 border ${
                  errors.role ? 'border-red-500/50' : 'border-gray-700'
                } rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 transition-all`}
              />
              {errors.role && (
                <p className="absolute -bottom-5 left-0 text-xs text-red-400 flex items-center">
                  <FiAlertCircle className="mr-1" /> {errors.role}
                </p>
              )}
            </div>
          </div>

         
          <div className="space-y-2">
            <label className="flex items-center text-sm font-medium text-gray-300">
              <LuClock className="mr-2 text-blue-400" />
              Experience Level <span className="text-red-400 ml-1">*</span>
            </label>
            <div className="relative">
              <select
                name="experience"
                value={formData.experience}
                onChange={handleChange}
                className={`w-full px-4 py-3 bg-gray-800/50 border ${
                  errors.experience ? 'border-red-500/50' : 'border-gray-700'
                } rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 transition-all appearance-none cursor-pointer`}
              >
                <option value="" className="bg-gray-900">Select experience level</option>
                <option value="0" className="bg-gray-900">Fresher</option>
                <option value="1" className="bg-gray-900">1 year</option>
                <option value="2" className="bg-gray-900">2 years</option>
                <option value="3" className="bg-gray-900">3 years</option>
                <option value="4" className="bg-gray-900">4 years</option>
                <option value="5" className="bg-gray-900">5+ years</option>
                <option value="8" className="bg-gray-900">8+ years</option>
                <option value="10" className="bg-gray-900">10+ years</option>
              </select>
              <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
              {errors.experience && (
                <p className="absolute -bottom-5 left-0 text-xs text-red-400 flex items-center">
                  <FiAlertCircle className="mr-1" /> {errors.experience}
                </p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <label className="flex items-center text-sm font-medium text-gray-300">
              <LuTarget className="mr-2 text-purple-400" />
              Topics to Focus <span className="text-red-400 ml-1">*</span>
            </label>
            <div className="relative group">
              <input
                type="text"
                name="topicsToFocus"
                value={formData.topicsToFocus}
                onChange={handleChange}
                placeholder="e.g., React, System Design, Leadership (comma separated)"
                className={`w-full px-4 py-3 bg-gray-800/50 border ${
                  errors.topicsToFocus ? 'border-red-500/50' : 'border-gray-700'
                } rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 transition-all`}
              />
              {errors.topicsToFocus && (
                <p className="absolute -bottom-5 left-0 text-xs text-red-400 flex items-center">
                  <FiAlertCircle className="mr-1" /> {errors.topicsToFocus}
                </p>
              )}
              <p className="text-xs text-gray-500 mt-2">
                Separate topics with commas (e.g., JavaScript, Algorithms, Communication)
              </p>
            </div>
          </div>

        
          <div className="space-y-2">
            <label className="flex items-center text-sm font-medium text-gray-300">
              <LuFileText className="mr-2 text-green-400" />
              Description (Optional)
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="4"
              placeholder="Add any specific details about the interview, company, or areas you want to focus on..."
              className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 transition-all resize-none"
            />
          </div>

          <div className="bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-500/20 rounded-xl p-4">
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-cyan-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                <FiCpu className="w-4 h-4 text-cyan-400" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-white mb-1">AI-Powered Preparation</h4>
                <p className="text-xs text-gray-400">
                  Based on your inputs, our AI will generate relevant interview questions, 
                  provide real-time feedback, and track your progress throughout the session.
                </p>
              </div>
            </div>
          </div>
        </form>

        <div className="sticky bottom-0 bg-gray-900/95 backdrop-blur-md border-t border-gray-800 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center text-xs text-gray-500">
              <LuCalendar className="mr-2" />
              <span>Your session will be saved immediately</span>
            </div>
            
            <div className="flex gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2 border border-gray-700 rounded-xl text-gray-300 hover:bg-gray-800 transition-all font-medium text-sm"
              >
                Cancel
              </button>
              <button
                type="submit"
                onClick={handleSubmit}
                disabled={isLoading}
                className="px-6 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-xl text-white font-semibold hover:from-cyan-600 hover:to-blue-600 transition-all transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 shadow-lg shadow-cyan-500/25 relative overflow-hidden group text-sm"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                    Creating...
                  </div>
                ) : (
                  <>
                    <span className="relative z-10">Create Session</span>
                    <div className="absolute inset-0 bg-gradient-to-r from-cyan-600 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateSessionModal;