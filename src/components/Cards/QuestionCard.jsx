import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  FiChevronDown, 
  FiChevronUp, 
  FiBookOpen, 
  FiCpu, 
  FiVolume2 
} from 'react-icons/fi';
import { 
  LuBrain, 
  LuSparkles, 
  LuThumbsUp, 
  LuMessageSquare,
  LuPin
} from 'react-icons/lu';
import AiResponsePreview from '../../pages/InterviewPrep/components/AiResponsePreview';

const QuestionCard = ({ question, answer, onLearnMore, isPinned, onTogglePin, isSelected }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <motion.div
      layout
      className={`group relative bg-gray-800/30 backdrop-blur-sm border rounded-2xl overflow-hidden transition-all duration-300 hover:border-cyan-500/50 hover:shadow-lg hover:shadow-cyan-500/10 ${
        isSelected ? 'border-cyan-500 ring-2 ring-cyan-500/50' : 'border-gray-700'
      } ${isPinned ? 'border-yellow-500/50' : ''}`}
    >
      
      <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/0 via-transparent to-blue-500/0 opacity-0 group-hover:opacity-10 transition-opacity duration-500"></div>

      
      {isPinned && (
        <div className="absolute top-4 right-4 text-yellow-400">
          <LuPin className="w-4 h-4 rotate-45" />
        </div>
      )}

      <div className="relative p-6">
        
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-start space-x-3 flex-1">
            <div className="w-10 h-10 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-xl flex items-center justify-center border border-cyan-500/30 flex-shrink-0">
              <LuBrain className="w-5 h-5 text-cyan-400" />
            </div>
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-1">
                <span className="text-xs font-medium text-cyan-400 uppercase tracking-wider">Question</span>
                {isPinned && (
                  <span className="text-xs bg-yellow-500/20 text-yellow-400 px-2 py-0.5 rounded-full">
                    Pinned
                  </span>
                )}
              </div>
              <h3 className="text-lg font-semibold text-white leading-relaxed">
                {question}
              </h3>
            </div>
          </div>
          
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-2 hover:bg-gray-700/50 rounded-lg transition-colors ml-2"
          >
            {isExpanded ? (
              <FiChevronUp className="w-5 h-5 text-gray-400" />
            ) : (
              <FiChevronDown className="w-5 h-5 text-gray-400" />
            )}
          </button>
        </div>

    
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="pl-13 ml-13 border-l-2 border-cyan-500/30 pl-4">
                <div className="flex items-center space-x-2 mb-3">
                  <div className="w-6 h-6 bg-blue-500/20 rounded-lg flex items-center justify-center">
                    <LuMessageSquare className="w-3 h-3 text-blue-400" />
                  </div>
                  <span className="text-xs font-medium text-blue-400 uppercase tracking-wider">Suggested Answer</span>
                </div>
                
                <div className="text-gray-300 leading-relaxed mb-4">
                  <AiResponsePreview content={answer || "No answer provided yet. Click 'Learn More' to get AI-generated insights and suggested answers."}/>
                </div>


                <div className="flex flex-wrap items-center gap-3 mt-4">
                  <button
                    onClick={onLearnMore}
                    className="group/btn px-4 py-2 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-500/30 rounded-xl text-sm text-cyan-400 hover:from-cyan-500/20 hover:to-blue-500/20 hover:border-cyan-400 transition-all flex items-center space-x-2"
                  >
                    <LuSparkles className="w-4 h-4 group-hover/btn:animate-pulse" />
                    <span>Learn More</span>
                  </button>

                  <button
                    onClick={onTogglePin}
                    className={`px-4 py-2 border rounded-xl text-sm transition-all flex items-center space-x-2 ${
                      isPinned 
                        ? 'bg-yellow-500/20 border-yellow-500/30 text-yellow-400 hover:bg-yellow-500/30' 
                        : 'border-gray-700 text-gray-400 hover:border-gray-600 hover:text-white'
                    }`}
                  >
                    <LuPin className={`w-4 h-4 ${isPinned ? 'rotate-45' : ''}`} />
                    <span>{isPinned ? 'Pinned' : 'Pin'}</span>
                  </button>

                </div>

                <div className="mt-4 p-4 bg-gradient-to-r from-purple-500/5 to-pink-500/5 border border-purple-500/20 rounded-xl">
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-purple-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                      <FiCpu className="w-3 h-3 text-purple-400" />
                    </div>
                    <div>
                      <h4 className="text-xs font-semibold text-purple-400 mb-1">AI Insight</h4>
                      <p className="text-xs text-gray-400">
                        This question tests your problem-solving approach. Focus on providing structured answers with real examples from your experience.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {!isExpanded && (
          <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-800">
            <div className="flex items-center space-x-4">
              <button
                onClick={onLearnMore}
                className="text-xs text-cyan-400 hover:text-cyan-300 transition-colors flex items-center space-x-1"
              >
                <LuSparkles className="w-3 h-3" />
                <span>Get AI insights</span>
              </button>
              <button
                onClick={onTogglePin}
                className={`text-xs transition-colors flex items-center space-x-1 ${
                  isPinned ? 'text-yellow-400' : 'text-gray-400 hover:text-white'
                }`}
              >
                <LuPin className={`w-3 h-3 ${isPinned ? 'rotate-45' : ''}`} />
                <span>{isPinned ? 'Pinned' : 'Pin for later'}</span>
              </button>
            </div>
            
            <div className="flex items-center space-x-1 text-xs text-gray-500">
              <LuThumbsUp className="w-3 h-3" />
              <span>AI-generated</span>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  )
}

export default QuestionCard