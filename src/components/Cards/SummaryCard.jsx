import React, { useState } from 'react'
import { FiMoreVertical, FiTrash2, FiClock, FiBriefcase, FiMessageSquare, FiTarget } from 'react-icons/fi'

const SummaryCard = ({colors, role, topicsToFocus, experience, questions, description, lastUpdated, onSelect, onDelete}) => {
  const [showMenu, setShowMenu] = useState(false);
  
  
  const initials = role
    ?.split(' ')
    .map(word => word[0])
    .slice(0, 2)
    .join('')
    .toUpperCase() || 'IN';

  return (
    <div 
      className="relative group cursor-pointer transform transition-all duration-300 hover:scale-[1.02] hover:-translate-y-1"
      onMouseLeave={() => setShowMenu(false)}
    >
      <div 
        className="relative rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-shadow duration-300"
        onClick={onSelect}
      >
        <div 
          className="absolute inset-0 opacity-90"
          style={{
            background: colors?.bgcolor || 'linear-gradient(135deg, #06b6d4, #3b82f6)'
          }}
        ></div>
        
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transform skew-x-12"></div>
        
        <div className="relative p-6 backdrop-blur-sm bg-white/5 border border-white/10">
          <div className="flex justify-between items-start mb-4">
            <div className="flex items-center space-x-3">
              <div className="w-14 h-14 bg-black/30 backdrop-blur-md rounded-xl flex items-center justify-center border-2 border-white/30 shadow-lg">
                <span className="text-xl font-bold text-white">
                  {initials}
                </span>
              </div>
              
              <div>
                <h3 className="text-xl font-bold text-white mb-1 line-clamp-1">
                  {role || "Untitled Session"}
                </h3>
                <p className="text-sm text-white/70 flex items-center">
                  <FiClock className="mr-1 flex-shrink-0" />
                  <span>Last active {lastUpdated || 'Recently'}</span>
                </p>
              </div>
            </div>
            
            <div className="relative z-20">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowMenu(!showMenu);
                }}
                className="p-2 rounded-lg bg-black/20 backdrop-blur-md border border-white/20 hover:bg-black/40 transition-all group-hover:opacity-100 opacity-70"
              >
                <FiMoreVertical className="w-5 h-5 text-white" />
              </button>
              
              {showMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-gray-900 border border-gray-800 rounded-xl shadow-xl z-30">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete();
                    }}
                    className="w-full flex items-center space-x-2 px-4 py-3 text-left text-red-400 hover:bg-red-500/10 rounded-xl transition-colors"
                  >
                    <FiTrash2 className="w-4 h-4" />
                    <span>Delete Session</span>
                  </button>
                </div>
              )}
            </div>
          </div>

          {description && (
            <p className="text-white/80 text-sm mb-4 line-clamp-2 bg-black/20 p-3 rounded-xl border border-white/10">
              {description}
            </p>
          )}

          <div className="grid grid-cols-3 gap-2 mb-4">
            <div className="bg-black/20 backdrop-blur-sm rounded-xl p-2.5 border border-white/10 text-center">
              <FiBriefcase className="w-4 h-4 text-cyan-300 mx-auto mb-1" />
              <p className="text-[10px] text-white/60 uppercase tracking-wider">EXP</p>
              <p className="text-sm font-semibold text-white">
                {experience || "0"} {experience === 1 ? 'yr' : 'yrs'}
              </p>
            </div>
            
            <div className="bg-black/20 backdrop-blur-sm rounded-xl p-2.5 border border-white/10 text-center">
              <FiMessageSquare className="w-4 h-4 text-blue-300 mx-auto mb-1" />
              <p className="text-[10px] text-white/60 uppercase tracking-wider">Q&A</p>
              <p className="text-sm font-semibold text-white">{questions}</p>
            </div>
            
            <div className="bg-black/20 backdrop-blur-sm rounded-xl p-2.5 border border-white/10 text-center">
              <FiTarget className="w-4 h-4 text-purple-300 mx-auto mb-1" />
              <p className="text-[10px] text-white/60 uppercase tracking-wider">FOCUS</p>
              <p className="text-sm font-semibold text-white truncate" title={topicsToFocus}>
                {topicsToFocus?.split(',')[0] || 'N/A'}
              </p>
            </div>
          </div>

          {topicsToFocus && (
            <div className="flex flex-wrap gap-1.5">
              {topicsToFocus.split(',').slice(0, 3).map((topic, i) => (
                <span 
                  key={i}
                  className="px-2 py-1 text-[10px] font-medium bg-white/10 backdrop-blur-md rounded-full border border-white/20 text-white/90 uppercase tracking-wider"
                >
                  {topic.trim()}
                </span>
              ))}
              {topicsToFocus.split(',').length > 3 && (
                <span className="px-2 py-1 text-[10px] font-medium bg-white/10 backdrop-blur-md rounded-full border border-white/20 text-white/90">
                  +{topicsToFocus.split(',').length - 3}
                </span>
              )}
            </div>
          )}

          <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/30">
            <div 
              className="h-full bg-gradient-to-r from-white/50 to-white/20 rounded-full"
              style={{ width: `${Math.min(questions * 10, 100)}%` }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SummaryCard;