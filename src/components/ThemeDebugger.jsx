import React, { useState } from 'react';
import { useTheme } from '../context/ThemeContext';

const ThemeDebugger = () => {
  const { theme, toggleTheme } = useTheme();
  const [expanded, setExpanded] = useState(false);
  
  // Define color palettes for preview
  const colors = {
    primary: ['500', '600', '700'],
    gray: ['200', '500', '800'],
    dark: ['100', '300', '500']
  };
  
  if (!expanded) {
    return (
      <div 
        className="fixed bottom-4 left-4 z-50 bg-white dark:bg-dark-300 rounded-lg shadow-lg px-4 py-3 text-sm cursor-pointer"
        onClick={() => setExpanded(true)}
      >
        <div className="flex items-center">
          <div className={`w-3 h-3 rounded-full mr-2 ${theme === 'dark' ? 'bg-primary-500' : 'bg-primary-600'}`}></div>
          <span className="font-medium text-gray-800 dark:text-white">Theme: </span>
          <span className={`ml-1 font-bold ${theme === 'dark' ? 'text-primary-500' : 'text-primary-600'}`}>
            {theme}
          </span>
        </div>
      </div>
    );
  }
  
  return (
    <div className="fixed bottom-4 left-4 z-50 bg-white dark:bg-dark-300 rounded-lg shadow-lg p-4 max-w-xs">
      <div className="flex justify-between items-center mb-3">
        <h3 className="font-bold text-gray-900 dark:text-white">Theme Debugger</h3>
        <div className="flex gap-2">
          <button 
            onClick={toggleTheme}
            className="px-3 py-1 bg-primary-600 dark:bg-primary-500 text-white text-xs rounded"
          >
            Toggle
          </button>
          <button 
            onClick={() => setExpanded(false)}
            className="px-2 py-1 bg-gray-200 dark:bg-dark-200 text-gray-700 dark:text-white text-xs rounded"
          >
            ✕
          </button>
        </div>
      </div>
      
      <div className="space-y-3">
        {Object.entries(colors).map(([colorName, shades]) => (
          <div key={colorName}>
            <span className="text-xs font-medium text-gray-700 dark:text-gray-300">{colorName}</span>
            <div className="flex gap-1 mt-1">
              {shades.map((shade) => (
                <div 
                  key={shade} 
                  className={`w-8 h-8 rounded bg-${colorName}-${shade} flex items-center justify-center text-[10px] text-white`}
                  title={`${colorName}-${shade}`}
                >
                  {shade}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-3 pt-3 border-t border-gray-200 dark:border-dark-200">
        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-700 dark:text-gray-300">Current mode:</span>
          <span className="px-2 py-1 bg-gray-100 dark:bg-dark-200 text-xs rounded font-medium text-gray-800 dark:text-white">
            {theme.charAt(0).toUpperCase() + theme.slice(1)}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ThemeDebugger;
