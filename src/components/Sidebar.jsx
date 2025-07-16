import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logout } from '../redux/authSlice';
import { cn } from '../lib/utils';
import { useSidebar } from '../context/SidebarContext';
import { getUnreadCount } from '../data/notifications'; // Import getUnreadCount function

/**
 * Sidebar Component
 * 
 * A responsive and collapsible sidebar for navigation with smooth transitions.
 * Features:
 * - Expandable/collapsible with button toggle
 * - Auto-collapse on mobile screens
 * - Icon-only mode when collapsed
 * - Smooth transitions
 * - Full keyboard accessibility
 */
const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { collapsed, setCollapsed } = useSidebar();
  const [isMobile, setIsMobile] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [openDropdowns, setOpenDropdowns] = useState({});
  
  // Toggle dropdown state
  const toggleDropdown = (itemId) => {
    setOpenDropdowns(prev => ({
      ...prev,
      [itemId]: !prev[itemId]
    }));
  };
  
  // Handle window resize with debounce for performance
  const handleResize = useCallback(() => {
    const mobile = window.innerWidth < 1024; // 1024px is the lg breakpoint in Tailwind
    setIsMobile(mobile);
    
    // If we're switching to mobile, ensure the sidebar is collapsed
    if (mobile && !collapsed) {
      setCollapsed(true);
    }
  }, [collapsed]);
  
  // Initialize on mount and handle window resizing
  useEffect(() => {
    // Check on initial load
    handleResize();
    
    // Add event listener with debounce for performance
    let resizeTimer;
    const debouncedResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(handleResize, 100);
    };
    
    window.addEventListener('resize', debouncedResize);
    
    // Clean up
    return () => {
      clearTimeout(resizeTimer);
      window.removeEventListener('resize', debouncedResize);
    };
  }, [handleResize]);
  
  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };
  
  // Get the actual notification count from the notifications data
  const notificationCount = getUnreadCount();
  
  const menuItems = [
    { 
      id: 1, 
      label: 'Dashboard', 
      path: '/dashboard', 
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      )
    },
    {
      id: 7,
      label: 'Notifications',
      path: '/notifications',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
      ),
      badge: {
        count: notificationCount,
        color: 'bg-red-500'
      }
    },
    { 
      id: 2, 
      label: 'Advanced Analytics', 
      path: '/advanced-analytics', 
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      )
    },
    {
      id: 3,
      label: 'Task Management',
      path: '/task-management',
      hasDropdown: true,
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
        </svg>
      ),
      subItems: [
        {
          id: 'kanban',
          label: 'Kanban Board',
          path: '/task-management/kanban',
          icon: (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V6z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 6a2 2 0 012-2h2a2 2 0 012 2v12a2 2 0 01-2 2h-2a2 2 0 01-2-2V6z" />
            </svg>
          )
        },
        {
          id: 'list',
          label: 'Task List',
          path: '/task-management/list',
          icon: (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M3 14h18M3 18h18" />
            </svg>
          )
        },
        {
          id: 'calendar',
          label: 'Calendar View',
          path: '/task-management/calendar',
          icon: (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          )
        }
      ]
    },
    {
      id: 8,
      label: 'Communication',
      path: '/communication',
      hasDropdown: true,
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
        </svg>
      ),
      subItems: [
        {
          id: 'messages',
          label: 'Messages',
          path: '/communication/messages',
          icon: (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          )
        },
        {
          id: 'announcements',
          label: 'Announcements',
          path: '/communication/announcements',
          icon: (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
            </svg>
          )
        },
        {
          id: 'collaboration',
          label: 'Team Spaces',
          path: '/communication/team-spaces',
          icon: (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          )
        },
        {
          id: 'integrations',
          label: 'Email & SMS',
          path: '/communication/integrations',
          icon: (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          )
        }
      ]
    },
    { 
      id: 4, 
      label: 'Users', 
      path: '/users', 
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      )
    },
    {
      id: 5,
      label: 'Settings',
      path: '/settings',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      )
    },
    { 
      id: 6, 
      label: 'UI Components', 
      path: '/ui-components', 
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
        </svg>
      )
    },
  ];
  
  // Toggle sidebar collapse state with callback
  const toggleCollapse = useCallback(() => {
    setCollapsed(prev => !prev);
  }, []);
  
  // Mouse enter/leave handlers for hover effect on collapsed sidebar
  const handleMouseEnter = useCallback(() => {
    if (collapsed && !isMobile) {
      setIsHovering(true);
    }
  }, [collapsed, isMobile]);
  
  const handleMouseLeave = useCallback(() => {
    setIsHovering(false);
  }, []);

  return (
    <aside 
      className={cn(
        "bg-white border-r border-gray-100 shadow-lg min-h-screen flex flex-col transition-all duration-300 fixed lg:relative lg:flex z-30 dark:bg-gray-900 dark:border-gray-800",
        collapsed ? "w-16" : "w-56 lg:w-60",
        isHovering && !isMobile ? "w-56 shadow-xl" : ""
      )}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Header with Logo and Toggle Button */}
      <div className="flex flex-col items-center border-b border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 py-3 relative">
        <div className="w-full flex justify-center items-center">
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            viewBox="0 0 24 24" 
            fill="currentColor" 
            className="w-10 h-10 text-primary-600 dark:text-primary-400"
          >
            <path fillRule="evenodd" d="M8.25 6.75a3.75 3.75 0 117.5 0 3.75 3.75 0 01-7.5 0zM15.75 9.75a3 3 0 116 0 3 3 0 01-6 0zM2.25 9.75a3 3 0 116 0 3 3 0 01-6 0zM6.31 15.117A6.745 6.745 0 0112 12a6.745 6.745 0 016.709 7.498.75.75 0 01-.372.568A12.696 12.696 0 0112 21.75c-2.305 0-4.47-.612-6.337-1.684a.75.75 0 01-.372-.568 6.787 6.787 0 011.019-4.38z" clipRule="evenodd" />
            <path d="M5.082 14.254a8.287 8.287 0 00-1.308 5.135 9.687 9.687 0 01-1.764-.44l-.115-.04a.563.563 0 01-.373-.487l-.01-.121a3.75 3.75 0 013.57-4.047zM20.226 19.389a8.287 8.287 0 00-1.308-5.135 3.75 3.75 0 013.57 4.047l-.01.121a.563.563 0 01-.373.486l-.115.04c-.567.2-1.156.349-1.764.441z" />
          </svg>
        </div>
        
        {/* Enhanced Toggle button */}
        <button 
          onClick={toggleCollapse} 
          className={cn(
            "absolute right-2 top-2 flex items-center justify-center p-1.5 rounded-full bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 focus:outline-none focus:ring-1 focus:ring-gray-300 dark:focus:ring-gray-600 transition-all duration-200",
            "shadow-sm hover:shadow"
          )}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor" 
            className="h-4 w-4 text-gray-600 dark:text-gray-300"
          >
            {collapsed ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
            )}
          </svg>
        </button>
      </div>
      
      {/* Navigation Title - Show when expanded or on hover */}
      {(!collapsed || isHovering) && (
        <div className="pt-4 pb-2 px-4">
          <p className="text-xs font-semibold text-primary-600 dark:text-primary-400 uppercase tracking-wider mb-1 transition-opacity duration-300">Main Navigation</p>
        </div>
      )}
      
      {/* Main Navigation */}
      <nav className={cn("flex-grow", collapsed && !isHovering ? "px-2" : "px-4")}>
        <ul className="space-y-1 pt-3">
          {menuItems.map((item) => (
            <li key={item.id} className="relative">
              {item.hasDropdown ? (
                <div>
                  <button
                    onClick={() => toggleDropdown(item.id)}
                    className={cn(
                      "group flex items-center w-full py-2 rounded-lg text-sm font-medium transition-all duration-200 overflow-hidden whitespace-nowrap",
                      collapsed && !isHovering ? "px-2 justify-center" : "px-3",
                      location.pathname.includes(item.path) 
                        ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-md' 
                        : 'text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-primary-600 dark:hover:text-primary-400'
                    )}
                    title={collapsed && !isHovering ? item.label : ""}
                  >
                    <span className={cn(
                      collapsed && !isHovering ? "flex-shrink-0" : "mr-3",
                      location.pathname.includes(item.path) 
                        ? 'text-white' 
                        : 'text-gray-400 dark:text-gray-500 group-hover:text-primary-500 dark:group-hover:text-primary-400',
                      "flex-shrink-0" // Prevent icon from shrinking
                    )}>
                      {React.cloneElement(item.icon, { className: "h-4 w-4" })}
                    </span>
                    <span className={cn(
                      "transition-opacity duration-300",
                      collapsed && !isHovering ? "opacity-0 w-0" : "opacity-100"
                    )}>
                      {item.label}
                    </span>
                    {(!collapsed || isHovering) && (
                      <svg 
                        xmlns="http://www.w3.org/2000/svg" 
                        className={cn(
                          "h-3.5 w-3.5 ml-auto transition-transform duration-200",
                          openDropdowns[item.id] ? "rotate-180" : "",
                          location.pathname.includes(item.path) ? "text-white" : "text-gray-400"
                        )} 
                        fill="none" 
                        viewBox="0 0 24 24" 
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    )}
                  </button>
                  
                  {/* Dropdown content */}
                  {(openDropdowns[item.id] || (isHovering && collapsed)) && (!collapsed || isHovering) && (
                    <ul 
                      className={cn(
                        "pl-8 mt-1 space-y-1 overflow-hidden transition-all duration-300 max-h-0",
                        openDropdowns[item.id] ? "max-h-96" : "",
                        isHovering && collapsed ? "absolute left-full top-0 pl-2 min-w-44 bg-white dark:bg-gray-900 rounded-lg shadow-lg border border-gray-100 dark:border-gray-800 mt-0 z-20" : ""
                      )}
                    >
                      {item.subItems && item.subItems.map((subItem) => (
                        <li key={subItem.id}>
                          <a
                            href={subItem.path}
                            onClick={(e) => {
                              e.preventDefault();
                              navigate(subItem.path);
                            }}
                            className={cn(
                              "flex items-center py-2 px-3 rounded-lg text-sm transition-all duration-200",
                              location.pathname === subItem.path
                                ? 'bg-primary-50 text-primary-600 dark:bg-primary-900/20 dark:text-primary-400 font-medium'
                                : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-primary-500 dark:hover:text-primary-400'
                            )}
                          >
                            <span className="mr-2 text-current">
                              {subItem.icon}
                            </span>
                            {subItem.label}
                          </a>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ) : (
                <a
                  href={item.path}
                  onClick={(e) => {
                    e.preventDefault();
                    navigate(item.path);
                  }}
                  className={cn(
                    "group flex items-center py-2 rounded-lg text-sm font-medium transition-all duration-200 overflow-hidden whitespace-nowrap",
                    collapsed && !isHovering ? "px-2 justify-center" : "px-3",
                    location.pathname === item.path 
                      ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-md' 
                      : 'text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-primary-600 dark:hover:text-primary-400'
                  )}
                  title={collapsed && !isHovering ? item.label : ""}
                >
                  <span className={cn(
                    collapsed && !isHovering ? "flex-shrink-0" : "mr-3",
                    location.pathname === item.path 
                      ? 'text-white' 
                      : 'text-gray-400 dark:text-gray-500 group-hover:text-primary-500 dark:group-hover:text-primary-400',
                    "flex-shrink-0" // Prevent icon from shrinking
                  )}>
                    {React.cloneElement(item.icon, { className: "h-4 w-4" })}
                  </span>
                  <span className={cn(
                    "transition-opacity duration-300",
                    collapsed && !isHovering ? "opacity-0 w-0" : "opacity-100"
                  )}>
                    {item.label}
                  </span>
                  {item.badge && (!collapsed || isHovering) && (
                    <span className={`ml-auto ${item.badge.color} text-white text-xs font-medium px-1.5 py-0.5 rounded-full`}>
                      {item.badge.count}
                    </span>
                  )}
                  {(!collapsed || isHovering) && !item.badge && location.pathname === item.path && (
                    <span className="ml-auto h-2 w-2 rounded-full bg-white"></span>
                  )}
                </a>
              )}
            </li>
          ))}
        </ul>
      </nav>
      
      {/* Logout Button */}
      <div className={cn(
        "py-3 mt-auto border-t border-gray-100 dark:border-gray-800",
        collapsed && !isHovering ? "px-2" : "px-4"
      )}>
        <button
          onClick={handleLogout}
          className={cn(
            "flex items-center w-full py-2 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400 transition-all duration-200 group overflow-hidden",
            collapsed && !isHovering ? "px-2 justify-center" : "px-3"
          )}
          title={collapsed && !isHovering ? "Sign out" : ""}
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className={cn(
              "h-4 w-4 text-gray-400 dark:text-gray-500 group-hover:text-red-500 dark:group-hover:text-red-400 flex-shrink-0",
              collapsed && !isHovering ? "" : "mr-3"
            )} 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          <span className={cn(
            "transition-all duration-300 whitespace-nowrap",
            collapsed && !isHovering ? "opacity-0 w-0" : "opacity-100"
          )}>
            Sign out
          </span>
        </button>
      </div>
      
      {/* Mobile overlay backdrop when sidebar is open on mobile */}
      {!collapsed && isMobile && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
          onClick={toggleCollapse} 
          aria-hidden="true"
        />
      )}
    </aside>
  );
};

export default Sidebar;
