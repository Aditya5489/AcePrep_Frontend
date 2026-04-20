import React, { useState, useEffect } from 'react'
import { LuPlus } from 'react-icons/lu'
import { FiMoreVertical, FiTrash2, FiEdit2, FiClock, FiBriefcase, FiMessageSquare, FiSearch,FiFileText } from 'react-icons/fi'
import { CARD_BG } from "../../utils/data";
import { toast } from "react-toastify";
import DashboardLayout from '../../components/layouts/DashboardLayout';
import { useNavigate } from 'react-router-dom';
import { API_PATHS } from '../../utils/apiPaths';
import moment from 'moment';
import axiosInstance from '../../utils/axiosInstance';
import SummaryCard from '../../components/Cards/SummaryCard';
import CreateSessionModal from './CreateSessionModal';

const Dashboard = () => {
  const navigate = useNavigate();

  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [sessions, setSessions] = useState([]);
  const [filteredSessions, setFilteredSessions] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [openDeleteAlert, setOpenDeleteAlert] = useState({
    open: false,
    data: null,
  });
  const [isLoading, setIsLoading] = useState(false);

  const fetchAllSessions = async () => {
    setIsLoading(true);
    try {
      const response = await axiosInstance.get(API_PATHS.SESSION.GET_ALL);
      setSessions(response.data.session);
      setFilteredSessions(response.data.session);
    } catch (error) {
      console.log("Error fetching session data:", error);
      toast.error("Failed to load sessions");
    } finally {
      setIsLoading(false);
    }
  };

  const deleteSession = async (sessionData) => {
    try {
      await axiosInstance.delete(API_PATHS.SESSION.DELETE(sessionData._id));
      toast.success("Session deleted successfully");
      setOpenDeleteAlert({ open: false, data: null });
      fetchAllSessions();
    } catch (error) {
      console.log("Error deleting session:", error);
      toast.error("Failed to delete session");
    }
  };

  useEffect(() => {
    fetchAllSessions();
  }, []);

  
 useEffect(() => {
  const query = searchQuery?.toLowerCase() || "";

  if (!query.trim()) {
    setFilteredSessions(sessions);
    return;
  }

  const filtered = sessions.filter(session => {
    const role = session?.role?.toLowerCase() || "";
    const topics = session?.topicsToFocus?.toLowerCase() || "";
    const desc = session?.description?.toLowerCase() || "";

    return (
      role.includes(query) ||
      topics.includes(query) ||
      desc.includes(query)
    );
  });

  setFilteredSessions(filtered);
}, [searchQuery, sessions]);

  return (
    <DashboardLayout>
      <div >
        <div className="relative overflow-hidden mb-8">
          <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
          <div className="absolute top-0 -right-4 w-72 h-72 bg-cyan-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-8 left-20 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
          
          <div className="relative container mx-auto px-6 py-12">
            <div className="max-w-4xl">
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-500/30 mb-6">
                <FiBriefcase className="h-4 w-4 mr-2 text-cyan-400" />
                <span className="text-sm text-cyan-300">Your Interview Journey</span>
              </div>
              
              <h1 className="text-5xl md:text-6xl font-bold text-white mb-4">
                Welcome back to your
                <span className="block bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400">
                  Interview Dashboard
                </span>
              </h1>
              <p className="text-xl text-gray-300 max-w-2xl">
                Track your progress, review past sessions, and continue your interview preparation journey.
              </p>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
            <div className="relative w-full md:w-96">
              <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search sessions by role, topic, or description..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 transition-all"
              />
            </div>
            <div className="flex gap-3">
              <button 
                onClick={() => navigate('/resume-analyzer')}
                className="group px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl font-semibold hover:from-purple-600 hover:to-pink-600 transition-all transform hover:scale-105 shadow-lg shadow-purple-500/25 flex items-center whitespace-nowrap"
              >
                <FiFileText className="w-5 h-5 mr-2 group-hover:rotate-12 transition-transform duration-300" />
                Analyze Resume
              </button>
              <button 
              onClick={() => setOpenCreateModal(true)}
              className="group px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-xl font-semibold hover:from-cyan-600 hover:to-blue-600 transition-all transform hover:scale-105 shadow-lg shadow-cyan-500/25 flex items-center whitespace-nowrap"
            >
              <LuPlus className="w-5 h-5 mr-2 group-hover:rotate-90 transition-transform duration-300" />
              Create New Session
            </button>
            </div>
            
            
          </div>
        </div>

        <div className="container mx-auto px-6 py-8">
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="relative">
                <div className="w-20 h-20 border-4 border-gray-700 border-t-cyan-500 rounded-full animate-spin"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-10 h-10 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full animate-pulse"></div>
                </div>
              </div>
            </div>
          ) : (
            <>
              {filteredSessions?.length > 0 ? (
                <>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    <div className="bg-gray-800/30 backdrop-blur-sm border border-gray-700 rounded-xl p-4">
                      <p className="text-gray-400 text-sm">Total Sessions</p>
                      <p className="text-2xl font-bold text-white">{sessions.length}</p>
                    </div>
                    <div className="bg-gray-800/30 backdrop-blur-sm border border-gray-700 rounded-xl p-4">
                      <p className="text-gray-400 text-sm">Questions Answered</p>
                      <p className="text-2xl font-bold text-white">
                        {sessions.reduce((acc, session) => acc + (session.questions?.length || 0), 0)}
                      </p>
                    </div>
                    <div className="bg-gray-800/30 backdrop-blur-sm border border-gray-700 rounded-xl p-4">
                      <p className="text-gray-400 text-sm">Topics Covered</p>
                      <p className="text-2xl font-bold text-white">
                        {new Set(sessions.flatMap(s => s.topicsToFocus?.split(',') || [])).size}
                      </p>
                    </div>
                    <div className="bg-gray-800/30 backdrop-blur-sm border border-gray-700 rounded-xl p-4">
                      <p className="text-gray-400 text-sm">Last Active</p>
                      <p className="text-2xl font-bold text-white">
                        {sessions[0]?.updatedAt ? moment(sessions[0].updatedAt).format("MMM D") : 'N/A'}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredSessions?.map((data, index) => (
                      <SummaryCard 
                        key={data?._id}
                        colors={CARD_BG[index % CARD_BG.length]}
                        role={data?.role || ""}
                        topicsToFocus={data?.topicsToFocus || ""}
                        experience={data?.experience || ""}
                        questions={data?.questions?.length || 0}
                        description={data?.description || ""}
                        lastUpdated={data?.updatedAt ? moment(data.updatedAt).format("MMM D, YYYY") : ""}
                        onSelect={() => navigate(`/interview-prep/${data._id}`)}
                        onDelete={() => setOpenDeleteAlert({ open: true, data })}
                      />
                    ))}
                  </div>
                </>
              ) : (
                <div className="text-center py-20">
                  <div className="relative inline-block">
                    <div className="w-24 h-24 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                      <FiMessageSquare className="w-12 h-12 text-cyan-400" />
                    </div>
                    <div className="absolute -top-2 -right-2">
                      <span className="relative flex h-5 w-5">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-5 w-5 bg-cyan-500"></span>
                      </span>
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-3">No Sessions Yet</h3>
                  <p className="text-gray-400 mb-8 max-w-md mx-auto">
                    Start your first interview practice session now and get personalized AI feedback to improve your skills.
                  </p>
                  <button 
                    onClick={() => setOpenCreateModal(true)}
                    className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-xl font-semibold hover:from-cyan-600 hover:to-blue-600 transition-all transform hover:scale-105 shadow-lg shadow-cyan-500/25"
                  >
                    <LuPlus className="w-5 h-5 mr-2" />
                    Create Your First Session
                  </button>
                </div>
              )}
            </>
          )}
        </div>

        {filteredSessions?.length > 0 && (
          <button 
            onClick={() => setOpenCreateModal(true)}
            className="fixed bottom-8 right-8 md:hidden p-4 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full shadow-xl hover:from-cyan-600 hover:to-blue-600 transition-all transform hover:scale-110 group"
          >
            <LuPlus className="w-6 h-6 text-white group-hover:rotate-90 transition-transform duration-300" />
          </button>
        )}

        {openDeleteAlert.open && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-gray-900 border border-gray-800 rounded-2xl max-w-md w-full p-8 relative animate-fadeIn">
              <h3 className="text-2xl font-bold text-white mb-4">Delete Session</h3>
              <p className="text-gray-300 mb-8">
                Are you sure you want to delete this interview session? This action cannot be undone.
              </p>
              <div className="flex gap-4">
                <button
                  onClick={() => setOpenDeleteAlert({ open: false, data: null })}
                  className="flex-1 px-4 py-3 border border-gray-700 rounded-xl text-gray-300 hover:bg-gray-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => deleteSession(openDeleteAlert.data)}
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-red-500 to-red-600 rounded-xl text-white font-semibold hover:from-red-600 hover:to-red-700 transition-all"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
        {openCreateModal && (
          <CreateSessionModal
            onClose={() => setOpenCreateModal(false)}
            onSuccess={() => {
              fetchAllSessions();
              setOpenCreateModal(false);
            }}
          />
        )}
      </div>
    </DashboardLayout>
  )
}

export default Dashboard;