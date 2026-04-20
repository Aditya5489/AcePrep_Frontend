import React from 'react';
import { UserContext } from '../../context/userContext';
import { useNavigate } from 'react-router-dom';
import { ArrowRightStartOnRectangleIcon, UserCircleIcon } from '@heroicons/react/24/outline';

const ProfileInfoCard = () => {
    const { user, clearUser, loading } = React.useContext(UserContext);
    const navigate = useNavigate();
    
    const handleLogout = () => {
        clearUser();
        navigate("/");
    };

    if (loading) {
        return (
            <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-3 bg-gray-800/50 border border-gray-700 rounded-full py-1.5 pl-1.5 pr-4">
                    <div className="w-8 h-8 rounded-full bg-gray-700 animate-pulse"></div>
                    <div className="w-20 h-4 bg-gray-700 rounded animate-pulse"></div>
                </div>
                <div className="w-16 h-8 bg-gray-700 rounded-lg animate-pulse"></div>
            </div>
        );
    }

    if (!user) return null;

    const getInitials = () => {
        if (!user.name) return 'U';
        return user.name
            .split(' ')
            .map(word => word[0])
            .join('')
            .toUpperCase()
            .substring(0, 2);
    };

    return (
        <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-500/30 rounded-full py-1.5 pl-1.5 pr-4">
                {user?.profilePic ? (
                    <img
                        src={user.profilePic}
                        alt={user.name || "Profile"}
                        className="w-8 h-8 rounded-full border-2 border-cyan-400 object-cover"
                        onError={(e) => {
                            e.target.style.display = 'none';
                            e.target.nextSibling.style.display = 'flex';
                        }}
                    />
                ) : null}
                <div 
                    className={`w-8 h-8 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 flex items-center justify-center text-white font-bold text-sm ${
                        user?.profilePic ? 'hidden' : ''
                    }`}
                >
                    {getInitials()}
                </div>
                
                <span className="text-white font-medium max-w-[150px] truncate">
                    {user?.name || "User"}
                </span>
            </div>
            
            <button
                onClick={handleLogout}
                className="px-4 py-2 text-gray-300 hover:text-white hover:bg-gray-800/50 rounded-lg transition-all flex items-center space-x-2 border border-gray-700 hover:border-cyan-500/30"
                title="Logout"
            >
                <ArrowRightStartOnRectangleIcon className="h-5 w-5" />
                <span className="hidden sm:inline">Logout</span>
            </button>
        </div>
    );
};

export default ProfileInfoCard;