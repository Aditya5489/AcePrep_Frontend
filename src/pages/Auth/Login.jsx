import React, { useState } from 'react';
import { EyeIcon, EyeSlashIcon, LockClosedIcon, EnvelopeIcon } from '@heroicons/react/24/outline';
import { ArrowRightIcon } from '@heroicons/react/24/solid';
import { validateEmail } from '../../utils/helper';
import { API_PATHS } from '../../utils/apiPaths';
import axiosInstance from '../../utils/axiosInstance';
import { useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { UserContext } from '../../context/userContext';

const Login = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const { updateUser } = useContext(UserContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateEmail(formData.email)) {
      setError('Please enter a valid email address');
      return;
    }
    
    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    
    setError("");
    setLoading(true);
    
    try {
        const { data } = await axiosInstance.post(
          API_PATHS.AUTH.LOGIN,
          formData
        );

        localStorage.setItem("token", data.token);

        updateUser(data);   

        navigate("/dashboard");

    } catch (error) {
      if (error.response && error.response.data.message) {
        setError(error.response.data.message);
      } else if (error.response && error.response.data.error) {
        setError(error.response.data.error);
      } else {
        setError("An error occurred. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="animate-fadeIn">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-400">
          Welcome Back
        </h2>
        <p className="text-gray-400 mt-2">Sign in to continue your interview preparation</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Email Address
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <EnvelopeIcon className="h-5 w-5 text-gray-500" />
              </div>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="block w-full pl-10 pr-3 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
                placeholder="you@example.com"
                disabled={loading}
              />
            </div>
          </div>

          
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-sm font-medium text-gray-300">
                Password
              </label>
              <a href="#" className="text-sm text-cyan-400 hover:text-cyan-300 transition-colors">
                Forgot password?
              </a>
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <LockClosedIcon className="h-5 w-5 text-gray-500" />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                className="block w-full pl-10 pr-12 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
                placeholder="Enter your password"
                disabled={loading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                disabled={loading}
              >
                {showPassword ? (
                  <EyeSlashIcon className="h-5 w-5 text-gray-500 hover:text-gray-400 transition-colors" />
                ) : (
                  <EyeIcon className="h-5 w-5 text-gray-500 hover:text-gray-400 transition-colors" />
                )}
              </button>
            </div>
          </div>
        </div>

        {error && (
          <p className="text-red-500 text-sm text-center bg-red-500/10 py-2 px-4 rounded-lg">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className={`w-full py-3.5 px-4 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-xl font-semibold text-white hover:from-cyan-600 hover:to-blue-600 transition-all transform hover:scale-[1.02] shadow-lg shadow-cyan-500/25 flex items-center justify-center group ${
            loading ? 'opacity-70 cursor-not-allowed' : ''
          }`}
        >
          {loading ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Signing In...
            </>
          ) : (
            <>
              Sign In
              <ArrowRightIcon className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default Login;