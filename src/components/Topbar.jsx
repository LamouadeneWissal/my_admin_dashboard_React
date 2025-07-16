import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useTheme } from '../context/ThemeContext';
import { useSidebar } from '../context/SidebarContext';
import { 
  DropdownMenu, 
  DropdownMenuTrigger, 
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator 
} from './ui/dropdown-menu';
import ShadcnButton from './ShadcnButton';
import ShadcnToggle from './ShadcnToggle';

/**
 * Topbar Component
 * 
 * Barre de navigation supérieure avec des actions utilisateur, notifications,
 * toggle de thème et menu déroulant de profil.
 * 
 * @returns {JSX.Element} - Barre supérieure stylisée avec des composants Shadcn UI
 */
const Topbar = () => {
  const admin = useSelector((state) => state.auth.admin);
  const { theme, toggleTheme } = useTheme();
  const { toggleSidebar } = useSidebar();
  const isDarkMode = theme === 'dark';

  // Icons
  const SearchIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
  );

  const NotificationIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
    </svg>
  );

  const SunIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
    </svg>
  );

  const MoonIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
    </svg>
  );

  const ProfileIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-3 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
  );

  const SettingsIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-3 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  );

  const LogoutIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-3 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
    </svg>
  );

  const MenuIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
    </svg>
  );

  return (
    <header className="bg-white border-b border-gray-100 h-16 flex items-center justify-between px-6 sticky top-0 z-10 shadow-sm dark:bg-gray-900 dark:border-gray-800">
      <div className="flex items-center">
        {/* Mobile menu toggle button to control the sidebar */}
        <div className="block lg:hidden mr-4">
          <ShadcnButton
            variant="ghost" 
            size="icon"
            icon={<MenuIcon />}
            onClick={toggleSidebar}
            aria-label="Toggle menu"
            className="text-gray-500 hover:text-primary-600 dark:text-gray-400 dark:hover:text-primary-400"
          />
        </div>
        
        <h2 className="text-lg font-medium text-gray-800 flex items-center dark:text-gray-200">
          <span className="hidden md:inline text-gray-500 dark:text-gray-400">Welcome,</span> 
          <span className="font-semibold text-primary-600 ml-1.5 dark:text-primary-400">{admin.name}</span>
        </h2>
      </div>
      
      <div className="flex items-center space-x-6">
        {/* Search button */}
        <ShadcnButton
          variant="ghost" 
          size="icon"
          icon={<SearchIcon />}
          aria-label="Search"
          className="text-gray-400 hover:text-primary-500 dark:text-gray-400 dark:hover:text-primary-400"
        />
        
        {/* Notifications */}
        <div className="relative">
          <ShadcnButton
            variant="ghost" 
            size="icon"
            icon={<NotificationIcon />}
            aria-label="Notifications"
            className="text-gray-400 hover:text-primary-500 dark:text-gray-400 dark:hover:text-primary-400"
          />
          <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white dark:ring-gray-900 animate-pulse-subtle"></span>
        </div>
        
        {/* Theme toggle */}        <ShadcnButton 
          variant="outline"
          size="icon"
          onClick={toggleTheme}
          icon={isDarkMode ? <SunIcon /> : <MoonIcon />}
          className={isDarkMode 
            ? "bg-gray-800 text-yellow-400 hover:bg-gray-700 hover:text-yellow-300 border-gray-700"
            : "bg-primary-50 text-primary-600 hover:bg-primary-100 border-primary-100"
          }
          aria-label="Toggle theme"
          title={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
        />
        
        {/* Admin profile dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <div className="flex items-center cursor-pointer rounded-full hover:bg-gray-50 dark:hover:bg-gray-800 px-2 py-1 transition-colors">
              <span className="hidden sm:block text-sm font-medium text-gray-700 dark:text-gray-300 mr-2">{admin.email}</span>
              <div className="relative">
                <div className="w-9 h-9 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center overflow-hidden shadow-sm border border-primary-200 dark:border-primary-800">
                  <img 
                    src={admin.avatar} 
                    alt="Admin avatar" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-400 border-2 border-white dark:border-gray-900"></div>
              </div>
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56">
            <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-800">
              <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{admin.name}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{admin.email}</p>
            </div>
            <DropdownMenuItem className="cursor-pointer">
              <ProfileIcon />
              <span>Your Profile</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer">
              <SettingsIcon />
              <span>Settings</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="cursor-pointer text-red-600 hover:text-red-700 dark:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950">
              <LogoutIcon />
              <span>Sign out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default Topbar;
