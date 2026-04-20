import React, { createContext, useState, useEffect } from 'react';
import axiosInstance from '../utils/axiosInstance';
import { API_PATHS } from '../utils/apiPaths';

export const UserContext = createContext();

const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUser = async () => {
            const token = localStorage.getItem("token");
            
            if (!token) {
                setLoading(false);
                return;
            }

            try {
                const response = await axiosInstance.get(API_PATHS.AUTH.GET_PROFILE);
                setUser(response.data);
            } catch (error) {
                console.error("User not authenticated:", error);
                localStorage.removeItem("token");
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, []);

    const updateUser = (userData) => {
        setUser(userData);
        setLoading(false);
    };

    const clearUser = () => {
        setUser(null);
        localStorage.removeItem("token");
        setLoading(false);
    };

    return (
        <UserContext.Provider value={{ user, loading, updateUser, clearUser }}>
            {children}
        </UserContext.Provider>
    );
};

export default UserProvider;