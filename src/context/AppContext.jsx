// src/context/AppContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';

const AppContext = createContext();

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
};

export const AppProvider = ({ children }) => {
  // Initialize dark mode from localStorage
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('connectsphere-darkmode');
    return saved ? JSON.parse(saved) : false;
  });
  
  const [toast, setToast] = useState(null);
  const [users, setUsers] = useState(() => {
    const saved = localStorage.getItem('connectsphere-users');
    return saved ? JSON.parse(saved) : [];
  });

  // Apply dark mode to document
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('connectsphere-darkmode', JSON.stringify(darkMode));
  }, [darkMode]);

  // Save users to localStorage
  useEffect(() => {
    localStorage.setItem('connectsphere-users', JSON.stringify(users));
  }, [users]);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
  };

  const toggleDarkMode = () => {
    console.log('🔄 AppContext: Toggling dark mode from', darkMode, 'to', !darkMode);
    setDarkMode(prev => !prev);
  };

  const registerUser = (userData) => {
    setUsers(prev => [...prev, userData]);
  };

  const findUser = (email, password) => {
    return users.find(u => u.email === email && u.password === password);
  };

  return (
    <AppContext.Provider value={{ 
      darkMode, 
      toggleDarkMode, 
      showToast, 
      toast, 
      setToast,
      registerUser,
      findUser,
      users
    }}>
      {children}
    </AppContext.Provider>
  );
};