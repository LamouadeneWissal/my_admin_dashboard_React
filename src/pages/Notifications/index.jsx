import React, { useState, useEffect } from 'react';
import { cn } from '../../lib/utils';
import Sidebar from '../../components/Sidebar';
import Topbar from '../../components/Topbar';
import { 
  notificationsData, 
  notificationTypes, 
  notificationPriorities, 
  markAsRead,
  markAllAsRead, 
  deleteNotification 
} from '../../data/notifications';

const NotificationsPage = () => {
  const [notifications, setNotifications] = useState([]);
  const [filteredNotifications, setFilteredNotifications] = useState([]);
  const [filters, setFilters] = useState({
    type: 'all',
    priority: 'all',
    readStatus: 'all',
    date: 'all',
    search: ''
  });
  
  // Initialize notifications
  useEffect(() => {
    // Clone the notifications data to avoid mutations
    setNotifications([...notificationsData]);
    setFilteredNotifications([...notificationsData]);
  }, []);

  // Apply filters whenever notifications or filters change
  useEffect(() => {
    let result = [...notifications];
    
    // Apply type filter
    if (filters.type !== 'all') {
      result = result.filter(notification => notification.type === filters.type);
    }
    
    // Apply priority filter
    if (filters.priority !== 'all') {
      result = result.filter(notification => notification.priority === filters.priority);
    }
    
    // Apply read status filter
    if (filters.readStatus === 'read') {
      result = result.filter(notification => notification.read);
    } else if (filters.readStatus === 'unread') {
      result = result.filter(notification => !notification.read);
    }
    
    // Apply date filter
    if (filters.date === 'today') {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      result = result.filter(notification => notification.timestamp >= today);
    } else if (filters.date === 'week') {
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      result = result.filter(notification => notification.timestamp >= weekAgo);
    }
    
    // Apply search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      result = result.filter(notification => 
        notification.title.toLowerCase().includes(searchLower) ||
        notification.message.toLowerCase().includes(searchLower)
      );
    }
    
    // Sort by date (newest first)
    result.sort((a, b) => b.timestamp - a.timestamp);
    
    setFilteredNotifications(result);
  }, [notifications, filters]);

  // Handle filter changes
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  // Clear all filters
  const clearFilters = () => {
    setFilters({
      type: 'all',
      priority: 'all',
      readStatus: 'all',
      date: 'all',
      search: ''
    });
  };

  // Handle marking a notification as read
  const handleMarkAsRead = (id) => {
    markAsRead(id);
    setNotifications(prevNotifications => 
      prevNotifications.map(notif => 
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
  };

  // Handle marking all notifications as read
  const handleMarkAllAsRead = () => {
    markAllAsRead();
    setNotifications(prevNotifications => 
      prevNotifications.map(notif => ({ ...notif, read: true }))
    );
  };

  // Handle deleting a notification
  const handleDeleteNotification = (id) => {
    deleteNotification(id);
    setNotifications(prevNotifications => 
      prevNotifications.filter(notif => notif.id !== id)
    );
  };

  // Handle executing a notification action
  const handleAction = (notificationId, actionId) => {
    console.log(`Executing action ${actionId} for notification ${notificationId}`);
    // Here you would implement the actual action logic
    // For now, just mark as read after any action
    handleMarkAsRead(notificationId);
    
    // Example of what a real implementation might do:
    // if (actionId === 'approve') {
    //   approveUser(notificationId);
    // } else if (actionId === 'reject') {
    //   rejectUser(notificationId);
    // }
  };

  // Function to render the notification icon based on its type
  const renderNotificationIcon = (type) => {
    const iconType = notificationTypes.find(t => t.value === type) || notificationTypes[0];
    
    switch(type) {
      case 'system':
        return (
          <div className={cn("p-2 rounded-full bg-blue-100 dark:bg-blue-900/30", iconType.iconColor)}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
        );
      case 'user':
        return (
          <div className={cn("p-2 rounded-full bg-green-100 dark:bg-green-900/30", iconType.iconColor)}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
        );
      case 'error':
        return (
          <div className={cn("p-2 rounded-full bg-red-100 dark:bg-red-900/30", iconType.iconColor)}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        );
      case 'task':
        return (
          <div className={cn("p-2 rounded-full bg-purple-100 dark:bg-purple-900/30", iconType.iconColor)}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
            </svg>
          </div>
        );
      case 'financial':
        return (
          <div className={cn("p-2 rounded-full bg-yellow-100 dark:bg-yellow-900/30", iconType.iconColor)}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        );
      case 'social':
        return (
          <div className={cn("p-2 rounded-full bg-pink-100 dark:bg-pink-900/30", iconType.iconColor)}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </div>
        );
      default:
        return (
          <div className={cn("p-2 rounded-full bg-gray-100 dark:bg-gray-700", iconType.iconColor)}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
          </div>
        );
    }
  };

  // Function to render the priority badge
  const getPriorityBadge = (priority) => {
    const priorityConfig = notificationPriorities.find(p => p.value === priority) || notificationPriorities[0];
    
    return (
      <span className={cn(
        "px-2 py-1 text-xs font-medium rounded-full", 
        priorityConfig.color
      )}>
        {priorityConfig.label}
      </span>
    );
  };

  // Function to format the timestamp
  const formatTimestamp = (timestamp) => {
    const now = new Date();
    const timeDiff = now - timestamp;
    const daysDiff = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
    const hoursDiff = Math.floor(timeDiff / (1000 * 60 * 60));
    const minutesDiff = Math.floor(timeDiff / (1000 * 60));
    
    if (daysDiff > 0) {
      return `${daysDiff} day${daysDiff > 1 ? 's' : ''} ago`;
    } else if (hoursDiff > 0) {
      return `${hoursDiff} hour${hoursDiff > 1 ? 's' : ''} ago`;
    } else if (minutesDiff > 0) {
      return `${minutesDiff} minute${minutesDiff > 1 ? 's' : ''} ago`;
    } else {
      return 'Just now';
    }
  };

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Topbar />
        
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 dark:bg-gray-900">
          <div className="container mx-auto px-4 py-6">
            <div className="mb-6">
              <h1 className="text-2xl font-semibold text-gray-800 dark:text-white">Notifications</h1>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                View and manage your system notifications
              </p>
            </div>
            
            {/* Filters Section */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm mb-6 p-4">
              <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
                <h2 className="text-lg font-medium text-gray-800 dark:text-white">Filters</h2>
                <button 
                  onClick={clearFilters}
                  className="text-sm text-primary-600 dark:text-primary-400 hover:underline"
                >
                  Clear all filters
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                {/* Type Filter */}
                <div>
                  <label htmlFor="typeFilter" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Type
                  </label>
                  <select
                    id="typeFilter"
                    name="type"
                    value={filters.type}
                    onChange={handleFilterChange}
                    className="w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary-500 dark:focus:ring-primary-400"
                  >
                    {notificationTypes.map(type => (
                      <option key={type.value} value={type.value}>{type.label}</option>
                    ))}
                  </select>
                </div>
                
                {/* Priority Filter */}
                <div>
                  <label htmlFor="priorityFilter" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Priority
                  </label>
                  <select
                    id="priorityFilter"
                    name="priority"
                    value={filters.priority}
                    onChange={handleFilterChange}
                    className="w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary-500 dark:focus:ring-primary-400"
                  >
                    {notificationPriorities.map(priority => (
                      <option key={priority.value} value={priority.value}>{priority.label}</option>
                    ))}
                  </select>
                </div>
                
                {/* Read Status Filter */}
                <div>
                  <label htmlFor="readStatusFilter" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Status
                  </label>
                  <select
                    id="readStatusFilter"
                    name="readStatus"
                    value={filters.readStatus}
                    onChange={handleFilterChange}
                    className="w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary-500 dark:focus:ring-primary-400"
                  >
                    <option value="all">All Status</option>
                    <option value="unread">Unread</option>
                    <option value="read">Read</option>
                  </select>
                </div>
                
                {/* Date Filter */}
                <div>
                  <label htmlFor="dateFilter" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Date
                  </label>
                  <select
                    id="dateFilter"
                    name="date"
                    value={filters.date}
                    onChange={handleFilterChange}
                    className="w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary-500 dark:focus:ring-primary-400"
                  >
                    <option value="all">All Time</option>
                    <option value="today">Today</option>
                    <option value="week">Last 7 Days</option>
                  </select>
                </div>
                
                {/* Search Filter */}
                <div>
                  <label htmlFor="searchFilter" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Search
                  </label>
                  <input
                    id="searchFilter"
                    type="text"
                    name="search"
                    value={filters.search}
                    onChange={handleFilterChange}
                    placeholder="Search notifications..."
                    className="w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary-500 dark:focus:ring-primary-400"
                  />
                </div>
              </div>
            </div>
            
            {/* Action Bar */}
            <div className="flex items-center justify-between mb-4">
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Showing {filteredNotifications.length} of {notifications.length} notifications
              </div>
              <button
                onClick={handleMarkAllAsRead}
                className="px-3 py-1.5 bg-primary-500 hover:bg-primary-600 text-white text-sm font-medium rounded-lg"
              >
                Mark all as read
              </button>
            </div>
            
            {/* Notifications List */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
              {filteredNotifications.length === 0 ? (
                <div className="p-8 text-center">
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    className="h-16 w-16 mx-auto text-gray-400 dark:text-gray-600 mb-4" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                  </svg>
                  <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300">No notifications found</h3>
                  <p className="text-gray-500 dark:text-gray-400 mt-1">
                    Try adjusting your filters or check back later
                  </p>
                </div>
              ) : (
                <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                  {filteredNotifications.map(notification => (
                    <li 
                      key={notification.id} 
                      className={cn(
                        "relative p-4 hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors duration-150",
                        notification.read ? "" : "bg-primary-50 dark:bg-primary-900/10"
                      )}
                    >
                      <div className="flex">
                        {/* Notification Icon */}
                        <div className="flex-shrink-0 mr-4">
                          {renderNotificationIcon(notification.type)}
                        </div>
                        
                        {/* Notification Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <h3 className={cn(
                              "text-sm font-semibold truncate",
                              notification.read 
                                ? "text-gray-700 dark:text-gray-300" 
                                : "text-gray-900 dark:text-white"
                            )}>
                              {notification.title}
                            </h3>
                            <div className="flex items-center">
                              {getPriorityBadge(notification.priority)}
                              <span className="ml-2 text-xs text-gray-500 dark:text-gray-400">
                                {formatTimestamp(notification.timestamp)}
                              </span>
                            </div>
                          </div>
                          
                          <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                            {notification.message}
                          </p>
                          
                          {/* Action Buttons */}
                          <div className="flex items-center space-x-2">
                            {notification.actions.map(action => (
                              <button
                                key={action.id}
                                onClick={() => handleAction(notification.id, action.id)}
                                className={cn(
                                  "px-2.5 py-1 text-xs font-medium rounded-full transition-colors",
                                  action.variant === 'primary' && "bg-primary-100 text-primary-600 hover:bg-primary-200 dark:bg-primary-900/20 dark:text-primary-400 dark:hover:bg-primary-900/40",
                                  action.variant === 'success' && "bg-green-100 text-green-600 hover:bg-green-200 dark:bg-green-900/20 dark:text-green-400 dark:hover:bg-green-900/40",
                                  action.variant === 'danger' && "bg-red-100 text-red-600 hover:bg-red-200 dark:bg-red-900/20 dark:text-red-400 dark:hover:bg-red-900/40",
                                  action.variant === 'info' && "bg-blue-100 text-blue-600 hover:bg-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:hover:bg-blue-900/40",
                                  action.variant === 'secondary' && "bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
                                )}
                              >
                                {action.label}
                              </button>
                            ))}
                            
                            {/* Management buttons */}
                            <div className="ml-auto flex items-center space-x-2">
                              {!notification.read && (
                                <button
                                  onClick={() => handleMarkAsRead(notification.id)}
                                  className="text-xs text-gray-500 hover:text-primary-600 dark:text-gray-400 dark:hover:text-primary-400"
                                >
                                  Mark as read
                                </button>
                              )}
                              <button
                                onClick={() => handleDeleteNotification(notification.id)}
                                className="text-xs text-gray-500 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400"
                              >
                                Delete
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      {!notification.read && (
                        <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-primary-500 rounded-r-full" />
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default NotificationsPage;
