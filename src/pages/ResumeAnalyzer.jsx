import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  SparklesIcon, 
  DocumentTextIcon,
  ChartBarIcon,
  CheckCircleIcon,
  XCircleIcon,
  ArrowUpTrayIcon,
  LightBulbIcon,
  CodeBracketIcon,
  ArrowPathIcon,
  DocumentMagnifyingGlassIcon,
  ClockIcon,
  TrashIcon,
  ChevronDownIcon,
  ChevronUpIcon
} from '@heroicons/react/24/outline';
import { UserContext } from '../context/userContext';
import ProfileInfoCard from '../components/Cards/ProfileInfoCard';
import axiosInstance from '../utils/axiosInstance'; 
import { API_PATHS } from '../utils/apiPaths';

const ResumeAnalyzer = () => {
  const {user, loading} = React.useContext(UserContext);
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [resumeHistory, setResumeHistory] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [selectedResumeId, setSelectedResumeId] = useState(null);
  const [jobDescription, setJobDescription] = useState('');
  const [showJobDescription, setShowJobDescription] = useState(false);
  const [error, setError] = useState('');
  const [showHistory, setShowHistory] = useState(false);

  
  useEffect(() => {
    if (user) {
      fetchResumeHistory();
    }
  }, [user]);

  const fetchResumeHistory = async () => {
    setLoadingHistory(true);
    try {
      const response = await axiosInstance.get(API_PATHS.RESUME.GET_HISTORY);
      if (response.data.success) {
        setResumeHistory(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching resume history:', error);
      setError('Failed to load resume history');
    } finally {
      setLoadingHistory(false);
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndSetFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      validateAndSetFile(e.target.files[0]);
    }
  };

  const validateAndSetFile = (file) => {
  if (file.size > 5 * 1024 * 1024) {
    setError('File size must be less than 5MB');
    return;
  }

  const allowedTypes = ['.pdf', '.doc', '.docx', '.txt'];
  const fileExt = '.' + file.name.split('.').pop().toLowerCase();

  if (!allowedTypes.includes(fileExt)) {
    setError('Invalid file type. Only PDF, DOC, DOCX, and TXT files are allowed');
    return;
  }

  setError('');
  setFile(file);
  setShowJobDescription(true);
};


  const handleAnalyze = async () => {
    if (!file) return;
    if (!jobDescription || jobDescription.trim() === '') {
      setError('Please add a job description for targeted analysis');
      return;
    }
    
    setIsAnalyzing(true);
    setError('');
    
    const formData = new FormData();
    formData.append('resume', file);
    if (jobDescription) {
      formData.append('jobDescription', jobDescription);
    }

    try {
      const response = await axiosInstance.post(
        API_PATHS.RESUME.ANALYZE, 
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      );
      
      if (response.data.success) {
        setAnalysisResult(response.data.data.analysis);
        setSelectedResumeId(response.data.data.id);
        fetchResumeHistory();
      }
    } catch (error) {
      console.error('Analysis error:', error);

      const status = error.response?.status;

      if (status === 429) {
        setError('⚠️ Server is busy right now (Too Many Requests). Please try again in a few moments.');
      } else if (status === 503) {
        setError('⚠️ AI service is temporarily unavailable. Please try again later.');
      } else if (!error.response) {
        setError('⚠️ Network error. Please check your internet connection.');
      } else {
        setError(error.response?.data?.message || 'Failed to analyze resume. Please try again.');
      }
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleReset = () => {
    setFile(null);
    setAnalysisResult(null);
    setSelectedResumeId(null);
    setJobDescription('');
    setError('');
  };

  const handleViewPreviousAnalysis = async (id) => {
    try {
      const response = await axiosInstance.get(API_PATHS.RESUME.GET_ONE(id));
      if (response.data.success) {
        setAnalysisResult(response.data.data.analysis);
        setSelectedResumeId(response.data.data._id);
        setFile(null);
      }
    } catch (error) {
      console.error('Error fetching analysis:', error);
      setError('Failed to load previous analysis');
    }
  };

  const handleDeleteResume = async (id, e) => {
    e.stopPropagation();
    if (!window.confirm('Are you sure you want to delete this analysis?')) return;

    try {
      const response = await axiosInstance.delete(API_PATHS.RESUME.DELETE(id));
      if (response.data.success) {
        setResumeHistory(prev => prev.filter(item => item._id !== id));
        if (selectedResumeId === id) {
          setAnalysisResult(null);
          setSelectedResumeId(null);
        }
      }
    } catch (error) {
      console.error('Error deleting resume:', error);
      setError('Failed to delete resume');
    }
  };

  const handleDownloadReport = async () => {
    if (!selectedResumeId) return;

    try {
      const response = await axiosInstance.get(
        API_PATHS.RESUME.DOWNLOAD_REPORT(selectedResumeId),
        {
          responseType: 'blob'
        }
      );

      const blob = new Blob([response.data], { type: 'text/html' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `resume-analysis-${selectedResumeId}.html`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Download error:', error);
      setError('Failed to download report');
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-8">
          <DocumentMagnifyingGlassIcon className="h-20 w-20 text-cyan-400 mx-auto mb-6" />
          <h1 className="text-3xl font-bold mb-4">Sign in to Analyze Your Resume</h1>
          <p className="text-gray-400 mb-8">Create an account or sign in to get instant AI-powered feedback on your resume.</p>
          <button
            onClick={() => navigate('/')}
            className="px-8 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-xl font-semibold hover:from-cyan-600 hover:to-blue-600 transition-all transform hover:scale-105"
          >
            Go to Homepage
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
      <nav className="container mx-auto px-6 py-6 flex justify-between items-center border-b border-gray-800">
        <div className="flex items-center space-x-2 cursor-pointer" onClick={() => navigate('/')}>
          <div className="w-10 h-10 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-lg flex items-center justify-center">
            <SparklesIcon className="h-6 w-6" />
          </div>
          <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-400">
            AcePrep
          </span>
        </div>
        <div className="flex items-center space-x-4">
          <button 
            onClick={() => navigate('/dashboard')}
            className="px-4 py-2 rounded-lg hover:text-cyan-300 transition-colors"
          >
            Dashboard
          </button>
          <ProfileInfoCard />
        </div>
      </nav>

      
      <div className="container mx-auto px-6 py-8">
        <div className="flex gap-6">
          {resumeHistory.length > 0 && (
            <div className={`${showHistory ? 'w-80' : 'w-16'} transition-all duration-300 ease-in-out`}>
              <div className="sticky top-6 bg-gray-800/30 backdrop-blur-sm border border-gray-700 rounded-2xl overflow-hidden">
                <button
                  onClick={() => setShowHistory(!showHistory)}
                  className="w-full p-4 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border-b border-gray-700 flex items-center justify-between hover:from-cyan-500/30 hover:to-blue-500/30 transition-all"
                >
                  <div className="flex items-center space-x-2">
                    <ClockIcon className={`h-5 w-5 text-cyan-400 ${!showHistory && 'mx-auto'}`} />
                    {showHistory && <span className="font-semibold">Previous Analyses</span>}
                  </div>
                  {showHistory ? (
                    <ChevronUpIcon className="h-4 w-4 text-gray-400" />
                  ) : (
                    <ChevronDownIcon className="h-4 w-4 text-gray-400" />
                  )}
                </button>

                {showHistory && (
                  <div className="p-4 max-h-[calc(100vh-200px)] overflow-y-auto">
                    {loadingHistory ? (
                      <div className="text-center py-4">
                        <ArrowPathIcon className="h-6 w-6 text-cyan-400 animate-spin mx-auto" />
                      </div>
                    ) : resumeHistory.length > 0 ? (
                      <div className="space-y-2">
                        {resumeHistory.map((item) => (
                          <div
                            key={item._id}
                            onClick={() => handleViewPreviousAnalysis(item._id)}
                            className={`p-3 bg-gray-900/50 border rounded-xl transition-all cursor-pointer group relative ${
                              selectedResumeId === item._id 
                                ? 'border-cyan-500 bg-cyan-500/10' 
                                : 'border-gray-700 hover:border-cyan-500/50'
                            }`}
                          >
                            <div className="flex items-start justify-between">
                              <div className="flex items-center space-x-2 min-w-0 flex-1">
                                <DocumentTextIcon className={`h-4 w-4 flex-shrink-0 ${
                                  selectedResumeId === item._id ? 'text-cyan-400' : 'text-gray-400'
                                }`} />
                                <div className="min-w-0 flex-1">
                                  <p className="text-sm font-medium truncate">{item.fileName}</p>
                                  <p className="text-xs text-gray-400">{formatDate(item.createdAt)}</p>
                                </div>
                              </div>
                              <button
                                onClick={(e) => handleDeleteResume(item._id, e)}
                                className="p-1 hover:bg-red-500/20 rounded-lg transition-colors opacity-0 group-hover:opacity-100 ml-2"
                              >
                                <TrashIcon className="h-3 w-3 text-gray-400 hover:text-red-400" />
                              </button>
                            </div>
                            {item.analysis?.score && (
                              <div className="mt-2 flex items-center justify-between">
                                <span className="text-xs text-gray-400">Score</span>
                                <span className={`text-xs font-semibold ${
                                  item.analysis.score >= 80 ? 'text-green-400' :
                                  item.analysis.score >= 60 ? 'text-yellow-400' :
                                  'text-orange-400'
                                }`}>
                                  {item.analysis.score}%
                                </span>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-center text-gray-400 text-sm py-4">
                        No previous analyses
                      </p>
                    )}
                  </div>
                )}

                
                {!showHistory && (
                  <div className="py-4 flex flex-col items-center space-y-4">
                    <div className="w-1 h-1 bg-cyan-400 rounded-full"></div>
                    <div className="w-1 h-1 bg-cyan-400 rounded-full"></div>
                    <div className="w-1 h-1 bg-cyan-400 rounded-full"></div>
                    <span className="text-xs text-cyan-400 writing-mode-vertical">
                      {resumeHistory.length} saved
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}

          
          <div className={`flex-1 ${!resumeHistory.length ? 'mx-auto max-w-4xl' : ''}`}>
            <div className="text-center mb-8">
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-500/30 mb-4">
                <DocumentTextIcon className="h-4 w-4 mr-2 text-cyan-400" />
                <span className="text-sm">AI-Powered Resume Analysis</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-3">
                Analyze Your Resume
              </h1>
              <p className="text-gray-400 max-w-2xl mx-auto">
                Get instant feedback and actionable insights to make your resume stand out to recruiters and ATS systems.
              </p>
            </div>

           
            {error && (
              <div className="max-w-3xl mx-auto mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-xl">
                <p className="text-red-400 text-center">{error}</p>
              </div>
            )}

            {!analysisResult ? (
              
              <div className="max-w-3xl mx-auto">
                <div 
                  className={`relative border-2 border-dashed rounded-2xl p-12 text-center transition-all ${
                    dragActive 
                      ? 'border-cyan-500 bg-cyan-500/10' 
                      : 'border-gray-700 hover:border-cyan-500/50 bg-gray-800/30'
                  }`}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                >
                  <input
                    type="file"
                    id="resume-upload"
                    className="hidden"
                    accept=".pdf,.doc,.docx,.txt"
                    onChange={handleFileChange}
                  />
                  
                  <div className="space-y-4">
                    <div className="flex justify-center">
                      <div className="w-20 h-20 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-2xl flex items-center justify-center">
                        <ArrowUpTrayIcon className="h-10 w-10 text-cyan-400" />
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-xl font-semibold mb-2">
                        {file ? file.name : 'Upload your resume'}
                      </h3>
                      <p className="text-gray-400 text-sm mb-4">
                        {file 
                          ? `Size: ${(file.size / 1024).toFixed(2)} KB` 
                          : 'Drag and drop or click to browse (PDF, DOC, DOCX, TXT)'}
                      </p>
                    </div>

                    {file && (
                      <div className="mb-4">
                        <button
                          onClick={() => setShowJobDescription(!showJobDescription)}
                          className="text-sm text-cyan-400 hover:text-cyan-300 flex items-center justify-center space-x-1 mx-auto"
                        >
                          <span>Add job description for targeted analysis</span>
                          {showJobDescription ? (
                            <ChevronUpIcon className="h-4 w-4" />
                          ) : (
                            <ChevronDownIcon className="h-4 w-4" />
                          )}
                        </button>
                        
                        {showJobDescription && (
                          <textarea
                            value={jobDescription}
                            onChange={(e) => setJobDescription(e.target.value)}
                            placeholder="Paste the job description here for more accurate keyword matching..."
                            className="mt-4 w-full p-4 bg-gray-900/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:border-cyan-500 focus:outline-none"
                            rows="4"
                          />
                        )}
                      </div>
                    )}

                    {!file ? (
                      <button
                        onClick={() => document.getElementById('resume-upload').click()}
                        className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-xl font-semibold hover:from-cyan-600 hover:to-blue-600 transition-all transform hover:scale-105 inline-flex items-center"
                      >
                        <DocumentTextIcon className="h-5 w-5 mr-2" />
                        Select Resume
                      </button>
                    ) : (
                      <div className="flex items-center justify-center space-x-4">
                        <button
                          onClick={handleAnalyze}
                          disabled={isAnalyzing}
                          className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-xl font-semibold hover:from-cyan-600 hover:to-blue-600 transition-all transform hover:scale-105 inline-flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {isAnalyzing ? (
                            <>
                              <ArrowPathIcon className="h-5 w-5 mr-2 animate-spin" />
                              Analyzing...
                            </>
                          ) : (
                            <>
                              <ChartBarIcon className="h-5 w-5 mr-2" />
                              Analyze Resume
                            </>
                          )}
                        </button>
                        <button
                          onClick={handleReset}
                          className="px-6 py-3 border border-gray-700 rounded-xl font-semibold hover:bg-gray-800/50 transition-all"
                        >
                          Choose Different File
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                <div className="grid md:grid-cols-3 gap-6 mt-12">
                  <div className="bg-gray-800/30 backdrop-blur-sm border border-gray-700 rounded-xl p-6 text-center">
                    <div className="w-12 h-12 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                      <ChartBarIcon className="h-6 w-6 text-cyan-400" />
                    </div>
                    <h3 className="font-semibold mb-2">ATS Compatibility</h3>
                    <p className="text-sm text-gray-400">Check if your resume passes Applicant Tracking Systems</p>
                  </div>
                  
                  <div className="bg-gray-800/30 backdrop-blur-sm border border-gray-700 rounded-xl p-6 text-center">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                      <LightBulbIcon className="h-6 w-6 text-purple-400" />
                    </div>
                    <h3 className="font-semibold mb-2">Smart Suggestions</h3>
                    <p className="text-sm text-gray-400">Get AI-powered recommendations for improvement</p>
                  </div>
                  
                  <div className="bg-gray-800/30 backdrop-blur-sm border border-gray-700 rounded-xl p-6 text-center">
                    <div className="w-12 h-12 bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                      <CheckCircleIcon className="h-6 w-6 text-green-400" />
                    </div>
                    <h3 className="font-semibold mb-2">Keyword Analysis</h3>
                    <p className="text-sm text-gray-400">Identify missing keywords for your target role</p>
                  </div>
                </div>
              </div>
            ) : (
              
              <div className="max-w-5xl mx-auto">
                <div className="bg-gradient-to-r from-gray-800/50 to-gray-900/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-8 mb-6">
                  <div className="flex flex-col md:flex-row items-center justify-between">
                    <div className="flex items-center space-x-4 mb-4 md:mb-0">
                      <div className="relative">
                        <svg className="w-24 h-24">
                          <circle
                            className="text-gray-700"
                            strokeWidth="8"
                            stroke="currentColor"
                            fill="transparent"
                            r="40"
                            cx="48"
                            cy="48"
                          />
                          <circle
                            className="text-cyan-400"
                            strokeWidth="8"
                            strokeLinecap="round"
                            stroke="currentColor"
                            fill="transparent"
                            r="40"
                            cx="48"
                            cy="48"
                            strokeDasharray={`${2 * Math.PI * 40}`}
                            strokeDashoffset={`${2 * Math.PI * 40 * (1 - analysisResult.score / 100)}`}
                            transform="rotate(-90 48 48)"
                          />
                        </svg>
                        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-2xl font-bold text-cyan-400">
                          {analysisResult.score}
                        </div>
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold mb-1">Overall Resume Score</h2>
                        <p className="text-gray-400">{analysisResult.summary}</p>
                      </div>
                    </div>
                    
                    <div className="flex space-x-3">
                      <button
                        onClick={handleDownloadReport}
                        className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-xl font-semibold hover:from-cyan-600 hover:to-blue-600 transition-all flex items-center"
                      >
                        <DocumentTextIcon className="h-5 w-5 mr-2" />
                        Download Report
                      </button>
                      <button
                        onClick={handleReset}
                        className="px-6 py-3 border border-gray-700 rounded-xl font-semibold hover:bg-gray-800/50 transition-all flex items-center"
                      >
                        <ArrowPathIcon className="h-5 w-5 mr-2" />
                        New Analysis
                      </button>
                    </div>
                  </div>
                </div>

                
                <div className="grid md:grid-cols-2 gap-6 mb-6">
                  <div className="bg-gray-800/30 backdrop-blur-sm border border-gray-700 rounded-2xl p-6">
                    <h3 className="text-lg font-semibold mb-4 flex items-center">
                      <CheckCircleIcon className="h-5 w-5 text-green-400 mr-2" />
                      Strengths
                    </h3>
                    <ul className="space-y-3">
                      {analysisResult.strengths.map((strength, index) => (
                        <li key={index} className="flex items-start space-x-2">
                          <CheckCircleIcon className="h-5 w-5 text-green-400 flex-shrink-0 mt-0.5" />
                          <span className="text-gray-300">{strength}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                 
                  <div className="bg-gray-800/30 backdrop-blur-sm border border-gray-700 rounded-2xl p-6">
                    <h3 className="text-lg font-semibold mb-4 flex items-center">
                      <XCircleIcon className="h-5 w-5 text-orange-400 mr-2" />
                      Areas for Improvement
                    </h3>
                    <ul className="space-y-3">
                      {analysisResult.improvements.map((improvement, index) => (
                        <li key={index} className="flex items-start space-x-2">
                          <XCircleIcon className="h-5 w-5 text-orange-400 flex-shrink-0 mt-0.5" />
                          <span className="text-gray-300">{improvement}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                
                <div className="bg-gray-800/30 backdrop-blur-sm border border-gray-700 rounded-2xl p-6 mb-6">
                  <h3 className="text-lg font-semibold mb-4 flex items-center">
                    <CodeBracketIcon className="h-5 w-5 text-cyan-400 mr-2" />
                    Keyword Match Analysis
                  </h3>
                  <div className="grid md:grid-cols-3 gap-4">
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-gray-400">Technical</span>
                        <span className="text-cyan-400 font-semibold">{analysisResult.keywordMatch.technical}%</span>
                      </div>
                      <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full"
                          style={{ width: `${analysisResult.keywordMatch.technical}%` }}
                        ></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-gray-400">Soft Skills</span>
                        <span className="text-purple-400 font-semibold">{analysisResult.keywordMatch.soft}%</span>
                      </div>
                      <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"
                          style={{ width: `${analysisResult.keywordMatch.soft}%` }}
                        ></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-gray-400">Industry</span>
                        <span className="text-green-400 font-semibold">{analysisResult.keywordMatch.industry}%</span>
                      </div>
                      <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-green-500 to-emerald-500 rounded-full"
                          style={{ width: `${analysisResult.keywordMatch.industry}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>

                
                <div className="bg-gray-800/30 backdrop-blur-sm border border-gray-700 rounded-2xl p-6 mb-6">
                  <h3 className="text-lg font-semibold mb-4 flex items-center">
                    <DocumentTextIcon className="h-5 w-5 text-blue-400 mr-2" />
                    Section Analysis
                  </h3>

                  <div className="grid md:grid-cols-2 gap-6">
                    {Object.entries(analysisResult.sections).map(([key, value]) => (
                      <div
                        key={key}
                        className="bg-gray-900/50 rounded-xl p-4 grid grid-cols-[180px_1fr] gap-6 items-start"
                      >
                        <div className="flex items-center space-x-2">
                          {value.status === 'good' && (
                            <CheckCircleIcon className="h-5 w-5 text-green-400" />
                          )}
                          {value.status === 'missing' && (
                            <XCircleIcon className="h-5 w-5 text-red-400" />
                          )}
                          {value.status === 'needs-work' && (
                            <LightBulbIcon className="h-5 w-5 text-yellow-400" />
                          )}
                          <span className="capitalize font-medium text-white">
                            {key}
                          </span>
                        </div>

                        <div>
                          <span className="text-sm text-gray-400 leading-relaxed">
                            {value.message}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>  
                <div className="bg-gradient-to-r from-cyan-500/10 to-blue-500/10 backdrop-blur-sm border border-cyan-500/30 rounded-2xl p-6">
                  <h3 className="text-lg font-semibold mb-4 flex items-center">
                    <LightBulbIcon className="h-5 w-5 text-cyan-400 mr-2" />
                    AI-Powered Suggestions
                  </h3>
                  <div className="space-y-4">
                    {analysisResult.suggestions.map((suggestion, index) => (
                      <div key={index} className="border-l-2 border-cyan-500 pl-4">
                        <h4 className="font-semibold text-cyan-400 mb-1">{suggestion.title}</h4>
                        <p className="text-sm text-gray-400 mb-2">{suggestion.description}</p>
                        <div className="bg-gray-900/50 p-3 rounded-lg">
                          <p className="text-sm text-gray-300">
                            <span className="text-gray-500">Example: </span>
                            {suggestion.example}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      
      <style jsx>{`
        .writing-mode-vertical {
          writing-mode: vertical-rl;
          text-orientation: mixed;
        }
      `}</style>
    </div>
  );
};

export default ResumeAnalyzer;