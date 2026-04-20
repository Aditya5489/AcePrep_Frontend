import React from 'react'
import { FiBriefcase, FiTarget, FiClock, FiMessageSquare, FiFileText } from 'react-icons/fi'
import { LuCalendar } from 'react-icons/lu'

const RoleInfoHeader = ({ role, topicsToFocus, experience, question, description, lastUpdated }) => {
  
  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-gray-800/50 to-gray-900/50 border-b border-gray-800">
      
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
      </div>

      <div className="relative container mx-auto px-6 py-8">
       
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
         
          <div className="flex-1">
            <div className="flex items-center space-x-4 mb-4">
              <div className="w-16 h-16 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-2xl flex items-center justify-center shadow-lg shadow-cyan-500/25">
                <FiBriefcase className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl lg:text-4xl font-bold text-white mb-2">
                  {role || "Interview Session"}
                </h1>
                <div className="flex flex-wrap items-center gap-3 text-sm">
                  <span className="px-3 py-1 bg-cyan-500/20 rounded-full text-cyan-300 border border-cyan-500/30">
                    {experience ?? 0} {experience === 1 ? "Year" : "Years"} Experience

                  </span>
                  <span className="flex items-center text-gray-400">
                    <LuCalendar className="mr-1" />
                    {lastUpdated}
                  </span>
                </div>
              </div>
            </div>
            
           
            {description && (
              <p className="text-gray-300 max-w-2xl flex items-start space-x-2">
                <FiFileText className="w-4 h-4 text-gray-500 mt-1 flex-shrink-0" />
                <span>{description}</span>
              </p>
            )}
          </div>

          
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
           
            <div className="bg-gray-800/30 backdrop-blur-sm border border-gray-700 rounded-xl p-4">
              <div className="flex items-center space-x-2 mb-2">
                <FiTarget className="w-4 h-4 text-purple-400" />
                <span className="text-xs text-gray-400 uppercase tracking-wider">Topics</span>
              </div>
              <p className="text-lg font-semibold text-white line-clamp-1" title={topicsToFocus}>
                {topicsToFocus?.split(',').length || 0}
              </p>
              <p className="text-xs text-gray-500 mt-1">focus areas</p>
            </div>

           
            <div className="bg-gray-800/30 backdrop-blur-sm border border-gray-700 rounded-xl p-4">
              <div className="flex items-center space-x-2 mb-2">
                <FiMessageSquare className="w-4 h-4 text-green-400" />
                <span className="text-xs text-gray-400 uppercase tracking-wider">Questions</span>
              </div>
              <p className="text-lg font-semibold text-white">{question}</p>
              <p className="text-xs text-gray-500 mt-1">total Q&A</p>
            </div>

            
            <div className="bg-gray-800/30 backdrop-blur-sm border border-gray-700 rounded-xl p-4 col-span-2 lg:col-span-1">
              <div className="flex items-center space-x-2 mb-2">
                <FiClock className="w-4 h-4 text-cyan-400" />
                <span className="text-xs text-gray-400 uppercase tracking-wider">Updated</span>
              </div>
              <p className="text-sm font-semibold text-white">{lastUpdated || "Recently"}</p>
              <p className="text-xs text-gray-500 mt-1">last active</p>
            </div>
          </div>
        </div>

        
        {topicsToFocus && (
          <div className="mt-6 pt-6 border-t border-gray-800">
            <div className="flex flex-wrap gap-2">
              {topicsToFocus.split(',').map((topic, index) => (
                <span
                  key={index}
                  className="px-3 py-1.5 bg-gray-800/50 border border-gray-700 rounded-lg text-sm text-gray-300 hover:border-cyan-500/50 hover:text-cyan-300 transition-all"
                >
                  {topic.trim()}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default RoleInfoHeader