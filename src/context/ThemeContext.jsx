import React, { createContext, useContext, useState, useEffect } from 'react';

// Create context
const ThemeContext = createContext();

// Custom hook to use the theme context
export const useTheme = () => useContext(ThemeContext);

// Theme provider component
export const ThemeProvider = ({ children }) => {
  // Check if there's a saved theme preference in localStorage
  const getSavedTheme = () => {
    const savedTheme = localStorage.getItem('theme');
    
    // If user has set a preference
    if (savedTheme) {
      return savedTheme;
    }
    
    // Check for system preference
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
    
    // Default to light
    return 'light';
  };

  const [theme, setTheme] = useState(getSavedTheme);

  // Apply theme to the document when theme changes
  useEffect(() => {
    const root = window.document.documentElement;
    
    // Remove old theme class
    root.classList.remove('light-mode', 'dark-mode');
    
    // Add new theme class
    root.classList.add(`${theme}-mode`);
    
    // Save theme to localStorage
    localStorage.setItem('theme', theme);
    
    // Apply dark mode to body and html elements
    if (theme === 'dark') {
      document.body.classList.add('dark');
      root.classList.add('dark');
    } else {
      document.body.classList.remove('dark');
      root.classList.remove('dark');
    }
  }, [theme]);

  // Toggle theme function
  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
  };

  // Switch to a specific theme
  const switchTheme = (newTheme) => {
    if (newTheme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      setTheme(systemTheme);
      
      // Add listener for system theme changes
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      mediaQuery.addEventListener('change', (e) => {
        setTheme(e.matches ? 'dark' : 'light');
      });
    } else {
      setTheme(newTheme);
    }
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, switchTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeContext;
