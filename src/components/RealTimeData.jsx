import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { cn } from '../lib/utils';
import ShadcnButton from './ShadcnButton';

/**
 * RealTimeData Component
 * 
 * A component that displays real-time updated data with automatic 
 * refreshing and visual indicators.
 * 
 * @param {Object} props - Component props
 * @param {string} props.title - Title of the real-time data component
 * @param {string} props.className - Additional CSS classes
 * @returns {JSX.Element} - Real-time data component
 */
const RealTimeData = ({ title, className }) => {
  // State for real-time data
  const [data, setData] = useState([]);
  const [isActive, setIsActive] = useState(true);
  const [refreshInterval, setRefreshInterval] = useState(5); // seconds
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [recentUpdates, setRecentUpdates] = useState([]);
  const [updateCount, setUpdateCount] = useState(0);
  
  // Generate mock real-time data
  const generateMockData = () => {
    const currentTime = new Date();
    const formattedTime = currentTime.toLocaleTimeString();
    
    // Generate random metrics
    const newData = [
      {
        id: 'active_users',
        label: 'Active Users',
        value: Math.floor(Math.random() * 500) + 200,
        trend: Math.random() > 0.5 ? 'up' : 'down',
        change: Math.floor(Math.random() * 10) + 1,
      },
      {
        id: 'page_views',
        label: 'Page Views',
        value: Math.floor(Math.random() * 1000) + 500,
        trend: Math.random() > 0.5 ? 'up' : 'down',
        change: Math.floor(Math.random() * 20) + 5,
      },
      {
        id: 'conversion_rate',
        label: 'Conversion Rate',
        value: (Math.random() * 5 + 1).toFixed(2) + '%',
        trend: Math.random() > 0.5 ? 'up' : 'down',
        change: (Math.random() * 0.5).toFixed(2) + '%',
      },
      {
        id: 'server_load',
        label: 'Server Load',
        value: (Math.random() * 70 + 10).toFixed(1) + '%',
        trend: Math.random() > 0.5 ? 'up' : 'down',
        change: (Math.random() * 5).toFixed(1) + '%',
      }
    ];
    
    // Generate a new random event
    const events = [
      'New user signed up',
      'Purchase completed',
      'Support ticket opened',
      'Error detected in production',
      'Content published',
      'API request spike detected',
      'Database query optimized',
      'Cache cleared automatically'
    ];
    
    const newEvent = {
      id: Date.now(),
      event: events[Math.floor(Math.random() * events.length)],
      time: formattedTime,
    };
    
    // Update the state
    setData(newData);
    setLastUpdated(currentTime);
    setRecentUpdates(prev => [newEvent, ...prev].slice(0, 5)); // Keep only latest 5 updates
    setUpdateCount(prev => prev + 1);
  };
  
  // Set up interval for real-time updates
  useEffect(() => {
    // Initial data
    generateMockData();
    
    // Set up interval for updates if active
    let interval;
    if (isActive) {
      interval = setInterval(() => {
        generateMockData();
      }, refreshInterval * 1000);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, refreshInterval]);
  
  // Toggle real-time updates
  const toggleUpdates = () => {
    setIsActive(!isActive);
  };
  
  // Change refresh interval
  const changeRefreshInterval = (seconds) => {
    setRefreshInterval(seconds);
  };
  
  // Get time since last update
  const getTimeSinceUpdate = () => {
    const seconds = Math.floor((new Date() - lastUpdated) / 1000);
    
    if (seconds < 60) {
      return `${seconds} seconds ago`;
    } else if (seconds < 3600) {
      return `${Math.floor(seconds / 60)} minutes ago`;
    } else {
      return `${Math.floor(seconds / 3600)} hours ago`;
    }
  };
  
  // Render trend indicator
  const renderTrendIndicator = (trend) => {
    if (trend === 'up') {
      return (
        <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
        </svg>
      );
    } else {
      return (
        <svg className="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      );
    }
  };
  
  return (
    <Card className={cn("shadow-md", className)}>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CardTitle className="text-lg font-semibold text-gray-800 dark:text-gray-100">
              {title || 'Real-Time Activity'}
            </CardTitle>
            {isActive && (
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <div className="flex space-x-1">
              <ShadcnButton 
                variant={refreshInterval === 2 ? "default" : "outline"} 
                size="sm"
                onClick={() => changeRefreshInterval(2)}
                className="h-8 px-2 text-xs"
              >
                2s
              </ShadcnButton>
              <ShadcnButton 
                variant={refreshInterval === 5 ? "default" : "outline"}
                size="sm"
                onClick={() => changeRefreshInterval(5)}
                className="h-8 px-2 text-xs"
              >
                5s
              </ShadcnButton>
              <ShadcnButton 
                variant={refreshInterval === 10 ? "default" : "outline"}
                size="sm"
                onClick={() => changeRefreshInterval(10)}
                className="h-8 px-2 text-xs"
              >
                10s
              </ShadcnButton>
            </div>
            <ShadcnButton 
              variant={isActive ? "default" : "outline"} 
              size="sm"
              onClick={toggleUpdates}
              className="ml-2 h-8"
            >
              {isActive ? 'Pause' : 'Resume'}
            </ShadcnButton>
          </div>
        </div>
        <div className="text-xs text-gray-500 dark:text-gray-400 mt-1 flex items-center justify-between">
          <div>
            Last updated: {getTimeSinceUpdate()} • Total updates: {updateCount}
          </div>
          <div>
            Refresh interval: {refreshInterval}s
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white dark:bg-gray-900 rounded-lg p-4 border border-gray-100 dark:border-gray-800">
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              Current Metrics
            </h3>
            <div className="space-y-4">
              {data.map(item => (
                <div key={item.id} className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">{item.label}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-base font-semibold text-gray-800 dark:text-gray-200">{item.value}</span>
                    <div className="flex items-center gap-1">
                      {renderTrendIndicator(item.trend)}
                      <span className={cn(
                        "text-xs font-medium",
                        item.trend === 'up' ? 'text-green-500' : 'text-red-500'
                      )}>
                        {item.change}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-white dark:bg-gray-900 rounded-lg p-4 border border-gray-100 dark:border-gray-800">
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              Recent Events
            </h3>
            <div className="space-y-3">
              {recentUpdates.length > 0 ? (
                recentUpdates.map(update => (
                  <div key={update.id} className="flex items-start space-x-2 pb-2 border-b border-gray-100 dark:border-gray-800 last:border-0">
                    <div className="w-2 h-2 mt-1.5 rounded-full bg-blue-500"></div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-800 dark:text-gray-200">{update.event}</p>
                      <span className="text-xs text-gray-500 dark:text-gray-400">{update.time}</span>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-500 dark:text-gray-400">No recent events to display</p>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default RealTimeData;
