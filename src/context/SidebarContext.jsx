import React, { createContext, useContext, useState } from 'react';

// Create context
const SidebarContext = createContext();

/**
 * SidebarProvider Component
 * 
 * Provides a global state for managing the sidebar's collapsed state
 * across components.
 * 
 * @param {Object} props - The component props
 * @param {React.ReactNode} props.children - Child components
 * @returns {JSX.Element} - Context provider
 */
export const SidebarProvider = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);
  
  const toggleSidebar = () => {
    setCollapsed(prev => !prev);
  };
  
  return (
    <SidebarContext.Provider value={{ collapsed, setCollapsed, toggleSidebar }}>
      {children}
    </SidebarContext.Provider>
  );
};

/**
 * Custom hook to use the sidebar context
 * @returns {Object} The sidebar context value
 */
export const useSidebar = () => {
  const context = useContext(SidebarContext);
  if (context === undefined) {
    throw new Error('useSidebar must be used within a SidebarProvider');
  }
  return context;
};
