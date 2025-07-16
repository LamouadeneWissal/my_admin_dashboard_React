import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { cn } from '../lib/utils';

/**
 * ShadcnStatCard Component
 * 
 * Un composant de carte de statistiques basé sur Shadcn UI pour afficher des métriques 
 * avec des options de couleur cohérentes et une icône.
 * 
 * @param {string} title - Titre de la carte
 * @param {string|number} value - Valeur à afficher
 * @param {string} icon - Icône (emoji ou JSX) à afficher
 * @param {string} color - Couleur du thème (blue, green, red, purple, yellow)
 * @param {number} progress - Pourcentage de progression (0-100)
 * @param {string} className - Classes CSS additionnelles
 * @returns {JSX.Element} - Carte de statistiques stylisée
 */
function ShadcnStatCard({ title, value, icon, color = 'blue', progress = 70, className }) {
  const [isDark, setIsDark] = useState(false);
  
  // Use the same approach as ThemeContext to detect dark mode
  useEffect(() => {
    // Function to check dark mode
    const checkDarkMode = () => {
      // Check both the 'dark' class and localStorage
      const isDarkClass = document.documentElement.classList.contains('dark');
      const storedTheme = localStorage.getItem('theme');
      
      // If either is dark, use dark mode
      setIsDark(isDarkClass || storedTheme === 'dark');
    };
    
    // Check initial state
    checkDarkMode();
    
    // Set up observer for theme changes
    const observer = new MutationObserver(checkDarkMode);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    
    // Also check when localStorage changes
    const handleStorageChange = () => checkDarkMode();
    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      observer.disconnect();
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  // Define color styles based on the color prop
  const getColorStyles = () => {
    switch (color) {
      case 'blue':
        return {
          lightBg: 'bg-blue-50',
          darkBg: '#111827',
          lightBorder: 'border-blue-100',
          darkBorder: '#3b82f6',
          lightIcon: 'text-blue-500',
          darkIcon: '#93c5fd',
          lightIconBg: 'bg-blue-100',
          darkIconBg: 'rgba(37, 99, 235, 0.2)',
          lightProgress: 'bg-blue-500',
          darkProgress: '#3b82f6'
        };
      case 'green':
        return {
          lightBg: 'bg-green-50',
          darkBg: '#111827',
          lightBorder: 'border-green-100',
          darkBorder: '#10b981',
          lightIcon: 'text-green-500',
          darkIcon: '#6ee7b7',
          lightIconBg: 'bg-green-100',
          darkIconBg: 'rgba(16, 185, 129, 0.2)',
          lightProgress: 'bg-green-500',
          darkProgress: '#10b981'
        };
      case 'red':
        return {
          lightBg: 'bg-red-50',
          darkBg: '#111827',
          lightBorder: 'border-red-100',
          darkBorder: '#ef4444',
          lightIcon: 'text-red-500',
          darkIcon: '#fca5a5',
          lightIconBg: 'bg-red-100',
          darkIconBg: 'rgba(239, 68, 68, 0.2)',
          lightProgress: 'bg-red-500',
          darkProgress: '#ef4444'
        };
      case 'purple':
        return {
          lightBg: 'bg-purple-50',
          darkBg: '#111827',
          lightBorder: 'border-purple-100',
          darkBorder: '#a855f7',
          lightIcon: 'text-purple-500',
          darkIcon: '#d8b4fe',
          lightIconBg: 'bg-purple-100',
          darkIconBg: 'rgba(168, 85, 247, 0.2)',
          lightProgress: 'bg-purple-500',
          darkProgress: '#a855f7'
        };
      case 'yellow':
        return {
          lightBg: 'bg-yellow-50',
          darkBg: '#111827',
          lightBorder: 'border-yellow-100',
          darkBorder: '#f59e0b',
          lightIcon: 'text-yellow-500',
          darkIcon: '#fcd34d',
          lightIconBg: 'bg-yellow-100',
          darkIconBg: 'rgba(245, 158, 11, 0.2)',
          lightProgress: 'bg-yellow-500',
          darkProgress: '#f59e0b'
        };
      default:
        return {
          lightBg: 'bg-blue-50',
          darkBg: '#111827',
          lightBorder: 'border-blue-100',
          darkBorder: '#3b82f6',
          lightIcon: 'text-blue-500',
          darkIcon: '#93c5fd',
          lightIconBg: 'bg-blue-100',
          darkIconBg: 'rgba(37, 99, 235, 0.2)',
          lightProgress: 'bg-blue-500',
          darkProgress: '#3b82f6'
        };
    }
  };

  const colorStyles = getColorStyles();

  // Card styles with direct inline styling for guaranteed dark mode support
  const cardStyle = {
    backgroundColor: isDark ? colorStyles.darkBg : undefined,
    borderLeft: isDark ? `4px solid ${colorStyles.darkBorder}` : undefined,
    borderTop: isDark ? 0 : undefined,
    borderRight: isDark ? 0 : undefined,
    borderBottom: isDark ? 0 : undefined,
    boxShadow: isDark ? '0 4px 6px -1px rgba(0, 0, 0, 0.2), 0 2px 4px -1px rgba(0, 0, 0, 0.1)' : undefined
  };

  const headerStyle = {
    borderBottomColor: isDark ? 'rgba(75, 85, 99, 0.2)' : undefined
  };

  const titleStyle = {
    color: isDark ? '#e5e7eb' : undefined
  };

  const iconStyle = {
    color: isDark ? colorStyles.darkIcon : undefined
  };

  const iconContainerStyle = {
    backgroundColor: isDark ? colorStyles.darkIconBg : undefined
  };

  const valueStyle = {
    color: isDark ? 'white' : undefined
  };

  const progressBgStyle = {
    backgroundColor: isDark ? 'rgba(55, 65, 81, 0.5)' : undefined
  };

  const progressBarStyle = {
    backgroundColor: isDark ? colorStyles.darkProgress : undefined,
    width: `${progress}%`
  };

  return (
    <Card 
      className={cn(
        "border overflow-hidden transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg relative",
        isDark ? "" : colorStyles.lightBg,
        isDark ? "" : colorStyles.lightBorder,
        className
      )}
      style={cardStyle}
    >
      <CardHeader 
        className="flex flex-row items-center justify-between pb-1 space-y-0 border-b border-opacity-10 border-gray-300"
        style={headerStyle}
      >
        <CardTitle 
          className="text-sm font-medium text-gray-700"
          style={titleStyle}
        >
          {title}
        </CardTitle>
        <div 
          className={cn(
            "flex h-9 w-9 items-center justify-center rounded-lg shadow-sm",
            isDark ? "" : colorStyles.lightIconBg
          )}
          style={iconContainerStyle}
        >
          <span 
            className={cn("text-xl", isDark ? "" : colorStyles.lightIcon)}
            style={iconStyle}
          >
            {icon}
          </span>
        </div>
      </CardHeader>
      <CardContent className="pt-2">
        <div 
          className="text-2xl font-bold text-gray-800"
          style={valueStyle}
        >
          {value}
        </div>
        <div 
          className="mt-2 h-1 w-full rounded-full bg-gray-100 overflow-hidden"
          style={progressBgStyle}
        >
          <div 
            className={cn("h-1 rounded-full", isDark ? "" : colorStyles.lightProgress)}
            style={progressBarStyle}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export { ShadcnStatCard };
// For backward compatibility
export default ShadcnStatCard;
