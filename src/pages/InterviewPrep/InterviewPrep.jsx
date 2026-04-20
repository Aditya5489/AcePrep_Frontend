import React from 'react'
import { useParams } from "react-router-dom";
import moment from "moment";
import { AnimatePresence, motion } from 'framer-motion'
import { LuCircleAlert, LuListCollapse, LuLoader, LuCpu, LuBrain, LuMessageSquare } from 'react-icons/lu';
import { FiRefreshCw, FiChevronRight } from 'react-icons/fi';
import { toast } from "react-toastify"
import { useState } from 'react';
import { useEffect } from 'react';
import DashboardLayout from '../../components/layouts/DashboardLayout';
import RoleInfoHeader from './components/RoleInfoHeader';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPaths';
import QuestionCard from '../../components/Cards/QuestionCard';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';


const InterviewPrep = () => {
  const { sessionId } = useParams();
  const [sessionData, setSessionData] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");
  const [openLearnMoreDrawer, setOpenLearnMoreDrawer] = useState(false);
  const [explanation, setExplanation] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isUpdateLoader, setIsUpdateLoader] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState(null);

  const fetchSessionDetailsById = async () => {
    setIsLoading(true);
    try {
      const response = await axiosInstance.get(API_PATHS.SESSION.GET_ONE(sessionId));
  
      if (response.data && response.data.session) {
        setSessionData(response.data.session);
        
      }
    } catch (error) {
      console.log("Error:", error);
      setErrorMsg("Failed to load session data");
      toast.error("Failed to load session data");
    } finally {
      setIsLoading(false);
    }
  };

  const generateConceptExplanation = async (question) => {
  try {
    setSelectedQuestion(question);
    setOpenLearnMoreDrawer(true);
    setIsUpdateLoader(true);

    const response = await axiosInstance.post(
      API_PATHS.AI.GENERATE_EXPLANATION,
      {concept:question}
    );
    console.log(response.data);

    if (response.data) {
      setExplanation(response.data);
      toast.success("Explanation generated successfully!");
    }

  } catch (error) {
    setExplanation(null)
    const msg =
      error.response?.status === 429
        ? "Too many requests! Please try again later."
        : error.response?.status >= 500
        ? "Server is busy. Please try again later."
        : error.response?.data?.message
        ? error.response.data.message
        : "Network error. Please check your connection.";

    setErrorMsg(msg);
    toast.error(msg);
  } finally {
    setIsUpdateLoader(false);
  }
};


  const toggleQuestionPinStatus = async (questionId) => {
  try {
    const response = await axiosInstance.post(
      API_PATHS.QUESTION.PIN(questionId)
    );

    if (response.data.success) {
      setSessionData((prev) => ({
        ...prev,
        questions: prev.questions.map((q) =>
          q._id === questionId
            ? { ...q, isPinned: response.data.isPinned }
            : q
        ),
      }));

      toast.success(
        response.data.isPinned
          ? "Question pinned successfully"
          : "Question unpinned successfully"
      );
    }
  } catch (error) {
    toast.error("Failed to pin question");
  }
};


  const uploadMoreQuestions = async () => {
    if (!sessionData) {
    console.log("Session data not loaded yet");
    return;
  }
  if (!sessionData?.role || sessionData?.experience == null) {
    console.log("Invalid session data", sessionData);
  
    return;
  }
 
    setIsUpdateLoader(true);
    try {
      
      const aiResponse=await axiosInstance.post(API_PATHS.AI.GENERATE_QUESTIONS,
        {
          role:sessionData?.role,
          experience:sessionData?.experience,
          topicsToFocus:sessionData?.topicsToFocus,
          numberOfQuestions:10,
        }
      );
      const generatedQuestions = aiResponse.data;
      console.log("AI RESPONSE:", aiResponse.data);

      const response=await axiosInstance.post(API_PATHS.QUESTION.ADD_TO_SESSION,
        {
          sessionId,
          questions:generatedQuestions,

        }
      );
      if(response.data){
        toast.success("Added more Questions and Answers");
        fetchSessionDetailsById();
      }
      
    } catch (error) {
      const msg =
        error.response?.status === 429
          ? "Too many requests! Please try again later."
          : error.response?.status >= 500
          ? "Server is busy. Please try again later."
          : error.response?.data?.message
          ? error.response.data.message
          : "Network error. Please check your connection.";

      setErrorMsg(msg);
      toast.error(msg);
    } finally {
      setIsUpdateLoader(false);
    }
  };

  useEffect(() => {
    if (sessionId) {
      fetchSessionDetailsById();
    }
    return () => { };
  }, [sessionId]);

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black flex items-center justify-center">
          <div className="relative">
            <div className="w-20 h-20 border-4 border-gray-700 border-t-cyan-500 rounded-full animate-spin"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-10 h-10 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full animate-pulse"></div>
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black">
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-2000"></div>
        </div>

        
        <RoleInfoHeader
          role={sessionData?.role || ""}
          topicsToFocus={sessionData?.topicsToFocus || ""}
          experience={sessionData?.experience}
          question={sessionData?.questions?.length || "-"}
          description={sessionData?.description || ""}
          lastUpdated={
            sessionData?.updatedAt ? moment(sessionData.updatedAt).format("Do MMM YYYY") : ""
          }
        />

        <div className="container mx-auto px-6 py-8 relative">
          <div className="flex justify-between items-center mb-8">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-xl flex items-center justify-center border border-cyan-500/30">
                <LuMessageSquare className="w-6 h-6 text-cyan-400" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">Interview Questions & Answers</h2>
                <p className="text-sm text-gray-400 flex items-center mt-1">
                  <LuCpu className="mr-1" />
                  AI-generated questions based on your role and experience
                </p>
              </div>
            </div>
            
            <button
              onClick={uploadMoreQuestions}
              disabled={isUpdateLoader}
              className="group px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-xl text-gray-300 hover:border-cyan-500/50 hover:text-white transition-all flex items-center space-x-2 disabled:opacity-50"
            >
              {isUpdateLoader ? (
                <LuLoader className="w-4 h-4 animate-spin" />
              ) : (
                <FiRefreshCw className="w-4 h-4 group-hover:rotate-180 transition-transform duration-500" />
              )}
              <span>Generate More</span>
            </button>
          </div>

          
          <div className="flex gap-6">
            <div className={`transition-all duration-300 ${openLearnMoreDrawer ? "w-2/3" : "w-full"}`}>
              <AnimatePresence>
                {sessionData?.questions?.length > 0 ? (
                  <div className="space-y-4">
                    {sessionData?.questions?.map((data, index) => (
                      <motion.div
                        key={data._id || index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{
                          duration: 0.4,
                          type: "spring",
                          stiffness: 100,
                          delay: index * 0.1,
                        }}
                      >
                        <QuestionCard
                          question={data?.question}
                          answer={data?.answer}
                          onLearnMore={() => generateConceptExplanation(data.question)}
                          isPinned={data?.isPinned}
                          onTogglePin={() => toggleQuestionPinStatus(data._id)}
                          isSelected={selectedQuestion === data.question}
                        />
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-20 bg-gray-800/30 backdrop-blur-sm border border-gray-700 rounded-2xl">
                    <div className="w-20 h-20 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                      <LuBrain className="w-10 h-10 text-cyan-400" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">No Questions Yet</h3>
                    <p className="text-gray-400">Generate questions to start your interview preparation</p>
                  </div>
                )}
              </AnimatePresence>
            </div>

            <AnimatePresence>
              {openLearnMoreDrawer && (
                <motion.div
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 50 }}
                  transition={{ duration: 0.3 }}
                  className="w-1/3 bg-gray-800/50 backdrop-blur-md border border-gray-700 rounded-2xl p-6 h-fit sticky top-24"
                >
                  <div className="flex justify-between items-center mb-6">
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-lg flex items-center justify-center">
                        <LuBrain className="w-4 h-4 text-purple-400" />
                      </div>
                      <h3 className="text-lg font-bold text-white">AI Insights</h3>
                    </div>
                    <button
                      onClick={() => setOpenLearnMoreDrawer(false)}
                      className="p-1 hover:bg-gray-700 rounded-lg transition-colors"
                    >
                      <FiChevronRight className="w-5 h-5 text-gray-400" />
                    </button>
                  </div>

                  {isUpdateLoader ? (
                    <div className="flex flex-col items-center justify-center py-12">
                      <LuLoader className="w-8 h-8 text-cyan-400 animate-spin mb-4" />
                      <p className="text-gray-400">AI is analyzing the question...</p>
                    </div>
                  ) : explanation ? (
                    <div className="space-y-6 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                      <div>
                        <h4 className="text-sm font-semibold text-cyan-400 mb-2 sticky top-0 bg-gray-900/90 backdrop-blur-sm py-2 z-10">Question</h4>
                        <div className="text-white text-sm bg-gray-900/50 p-3 rounded-xl border border-gray-700">
                          <ReactMarkdown
                            remarkPlugins={[remarkGfm]}
                            components={{
                              code({ node, inline, className, children, ...props }) {
                                const match = /language-(\w+)/.exec(className || '');
                                
                                if (!inline && match) {
                                  return (
                                    <div className="relative group my-2">
                                      <div className="absolute top-2 right-2 bg-gray-800/80 backdrop-blur-sm border border-gray-700 rounded px-2 py-1 text-xs text-gray-400">
                                        {match[1]}
                                      </div>
                                      <SyntaxHighlighter
                                        style={oneDark}
                                        language={match[1]}
                                        PreTag="div"
                                        className="rounded-lg !mt-0 text-sm"
                                        {...props}
                                      >
                                        {String(children).replace(/\n$/, '')}
                                      </SyntaxHighlighter>
                                    </div>
                                  );
                                }
                                
                                return (
                                  <code className="bg-gray-800/80 text-cyan-300 px-1.5 py-0.5 rounded text-sm font-mono">
                                    {children}
                                  </code>
                                );
                              }
                            }}
                          >
                            {selectedQuestion}
                          </ReactMarkdown>
                        </div>
                      </div>
                     
                      <div>
                        <h4 className="text-sm font-semibold text-blue-400 mb-2 sticky top-0 bg-gray-900/90 backdrop-blur-sm py-2 z-10">Explanation</h4>
                        <div className="text-gray-300 text-sm leading-relaxed bg-gray-900/30 p-3 rounded-xl border border-gray-700">
                          <ReactMarkdown
                            remarkPlugins={[remarkGfm]}
                            components={{
                              p({ children }) {
                                return <p className="mb-3 last:mb-0">{children}</p>;
                              },
                              code({ node, inline, className, children, ...props }) {
                                const match = /language-(\w+)/.exec(className || '');
                                
                                if (!inline && match) {
                                  return (
                                    <div className="relative group my-3">
                                      <div className="absolute top-2 right-2 bg-gray-800/80 backdrop-blur-sm border border-gray-700 rounded px-2 py-1 text-xs text-gray-400">
                                        {match[1]}
                                      </div>
                                      <SyntaxHighlighter
                                        style={oneDark}
                                        language={match[1]}
                                        PreTag="div"
                                        className="rounded-lg !mt-0 text-sm"
                                        {...props}
                                      >
                                        {String(children).replace(/\n$/, '')}
                                      </SyntaxHighlighter>
                                    </div>
                                  );
                                }
                                
                                return (
                                  <code className="bg-gray-800/80 text-cyan-300 px-1.5 py-0.5 rounded text-sm font-mono">
                                    {children}
                                  </code>
                                );
                              },
                              strong({ children }) {
                                return <strong className="font-semibold text-cyan-300">{children}</strong>;
                              },
                              em({ children }) {
                                return <em className="italic text-blue-300">{children}</em>;
                              },
                              ul({ children }) {
                                return <ul className="list-disc list-inside space-y-1 my-2">{children}</ul>;
                              },
                              ol({ children }) {
                                return <ol className="list-decimal list-inside space-y-1 my-2">{children}</ol>;
                              },
                              li({ children }) {
                                return <li className="text-gray-300 marker:text-cyan-500">{children}</li>;
                              }
                            }}
                          >
                            {explanation.explanation}
                          </ReactMarkdown>
                        </div>
                      </div>

                      <div>
                        <h4 className="text-sm font-semibold text-purple-400 mb-2 sticky top-0 bg-gray-900/90 backdrop-blur-sm py-2 z-10">Key Points</h4>
                        <ul className="space-y-2 bg-gray-900/30 p-3 rounded-xl border border-gray-700">
                          {explanation.keyPoints.map((point, idx) => (
                            <li key={idx} className="flex items-start space-x-2 text-sm text-gray-300">
                              <span className="w-1.5 h-1.5 bg-gradient-to-r from-cyan-400 to-blue-400 rounded-full mt-1.5 flex-shrink-0"></span>
                              <span className="flex-1">
                                <ReactMarkdown
                                  remarkPlugins={[remarkGfm]}
                                  components={{
                                    code({ node, inline, className, children, ...props }) {
                                      const match = /language-(\w+)/.exec(className || '');
                                      
                                      if (!inline && match) {
                                        return (
                                          <SyntaxHighlighter
                                            style={oneDark}
                                            language={match[1]}
                                            PreTag="div"
                                            className="rounded-lg text-sm my-1"
                                            {...props}
                                          >
                                            {String(children).replace(/\n$/, '')}
                                          </SyntaxHighlighter>
                                        );
                                      }
                                      
                                      return (
                                        <code className="bg-gray-800/80 text-cyan-300 px-1.5 py-0.5 rounded text-sm font-mono">
                                          {children}
                                        </code>
                                      );
                                    }
                                  }}
                                >
                                  {point}
                                </ReactMarkdown>
                              </span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/20 rounded-xl p-4">
                        <h4 className="text-sm font-semibold text-amber-400 mb-2">💡 Pro Tip</h4>
                        <div className="text-sm text-gray-300">
                          <ReactMarkdown
                            remarkPlugins={[remarkGfm]}
                            components={{
                              code({ node, inline, className, children, ...props }) {
                                const match = /language-(\w+)/.exec(className || '');
                                
                                if (!inline && match) {
                                  return (
                                    <SyntaxHighlighter
                                      style={oneDark}
                                      language={match[1]}
                                      PreTag="div"
                                      className="rounded-lg text-sm my-2"
                                      {...props}
                                    >
                                      {String(children).replace(/\n$/, '')}
                                    </SyntaxHighlighter>
                                  );
                                }
                                
                                return (
                                  <code className="bg-gray-800/80 text-amber-300 px-1.5 py-0.5 rounded text-sm font-mono">
                                    {children}
                                  </code>
                                );
                              }
                            }}
                          >
                            {explanation.tips}
                          </ReactMarkdown>
                        </div>
                      </div>
                    </div>
                  ) : null}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {errorMsg && (
            <div className="mt-6 bg-red-500/10 border border-red-500/30 rounded-xl p-4 flex items-center space-x-3">
              <LuCircleAlert className="w-5 h-5 text-red-400 flex-shrink-0" />
              <p className="text-red-400 text-sm">{errorMsg}</p>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  )
}

export default InterviewPrep