import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import ShadcnButton from './ShadcnButton';
import { cn } from '../lib/utils';
import { format, subDays, subMonths } from 'date-fns';

/**
 * DataFilterControls Component
 * 
 * Advanced filtering controls for dashboard data with date ranges, categories,
 * and real-time update toggles.
 * 
 * @param {Object} props - Component props
 * @param {string} props.className - Additional CSS classes
 * @param {Function} props.onFilterChange - Callback when filters change
 * @returns {JSX.Element} - Data filtering controls component
 */
const DataFilterControls = ({ className, onFilterChange }) => {
  // Filter state
  const [dateRange, setDateRange] = useState('last7days');
  const [categories, setCategories] = useState(['sales', 'users']);
  const [compareMode, setCompareMode] = useState(false);

  // Calculate actual date ranges based on selection
  const getDateRangeText = () => {
    const today = new Date();
    
    switch (dateRange) {
      case 'today':
        return `Today (${format(today, 'MMM d, yyyy')})`;
      case 'yesterday':
        return `Yesterday (${format(subDays(today, 1), 'MMM d, yyyy')})`;
      case 'last7days':
        return `Last 7 Days (${format(subDays(today, 6), 'MMM d')} - ${format(today, 'MMM d, yyyy')})`;
      case 'last30days':
        return `Last 30 Days (${format(subDays(today, 29), 'MMM d')} - ${format(today, 'MMM d, yyyy')})`;
      case 'thisMonth':
        return `This Month (${format(today, 'MMMM yyyy')})`;
      case 'lastMonth':
        return `Last Month (${format(subMonths(today, 1), 'MMMM yyyy')})`;
      default:
        return 'Custom Date Range';
    }
  };

  // Handle date range change
  const handleDateRangeChange = (range) => {
    setDateRange(range);
    if (onFilterChange) {
      onFilterChange({ dateRange: range, categories, compareMode });
    }
  };

  // Toggle a category selection
  const toggleCategory = (category) => {
    const updatedCategories = categories.includes(category)
      ? categories.filter(c => c !== category)
      : [...categories, category];
      
    setCategories(updatedCategories);
    
    if (onFilterChange) {
      onFilterChange({ dateRange, categories: updatedCategories, compareMode });
    }
  };

  // Toggle compare mode
  const toggleCompareMode = () => {
    setCompareMode(!compareMode);
    
    if (onFilterChange) {
      onFilterChange({ dateRange, categories, compareMode: !compareMode });
    }
  };
  
  // Custom button styling with reactive effects
  const buttonVariants = {
    active: {
      base: "relative bg-gradient-to-r from-primary-500/90 to-blue-500/90 text-white shadow-md",
      hover: "hover:from-primary-600 hover:to-blue-600 hover:shadow-lg",
      pressed: "active:scale-95 active:shadow-inner transition-transform"
    },
    inactive: {
      base: "relative bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700",
      hover: "hover:bg-gray-200 dark:hover:bg-gray-700 hover:text-primary-600 dark:hover:text-primary-400",
      pressed: "active:scale-95 active:bg-gray-200 dark:active:bg-gray-700 transition-transform"
    }
  };

  const categoryOptions = [
    { id: 'sales', label: 'Sales' },
    { id: 'users', label: 'Users' },
    { id: 'revenue', label: 'Revenue' },
    { id: 'conversion', label: 'Conversion' },
  ];

  return (
    <Card className={cn("bg-white dark:bg-gray-900 shadow-md", className)}>
      <CardHeader className="pb-4 border-b border-gray-100 dark:border-gray-800 bg-gradient-to-r from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
        <CardTitle className="text-lg font-bold bg-gradient-to-r from-primary-600 to-blue-500 bg-clip-text text-transparent dark:from-primary-400 dark:to-blue-300">Data Filters</CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="space-y-6">
          {/* Date Range Section */}
          <div className="pb-5 border-b border-gray-100 dark:border-gray-800">
            <div className="flex items-center mb-3">
              <span className="w-1 h-4 bg-primary-500 mr-2 rounded"></span>
              <h3 className="text-sm font-semibold text-primary-600 dark:text-primary-400 uppercase tracking-wider">Date Range</h3>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <button 
                className={`flex items-center justify-center px-3 py-2 text-sm font-medium rounded-lg ${
                  dateRange === 'today' 
                    ? `${buttonVariants.active.base} ${buttonVariants.active.hover} ${buttonVariants.active.pressed}` 
                    : `${buttonVariants.inactive.base} ${buttonVariants.inactive.hover} ${buttonVariants.inactive.pressed}`
                }`}
                onClick={() => handleDateRangeChange('today')}
              >
                <span className="text-center w-full">Today</span>
              </button>
              <button 
                className={`flex items-center justify-center px-3 py-2 text-sm font-medium rounded-lg ${
                  dateRange === 'yesterday' 
                    ? `${buttonVariants.active.base} ${buttonVariants.active.hover} ${buttonVariants.active.pressed}` 
                    : `${buttonVariants.inactive.base} ${buttonVariants.inactive.hover} ${buttonVariants.inactive.pressed}`
                }`}
                onClick={() => handleDateRangeChange('yesterday')}
              >
                <span className="text-center w-full flex justify-center items-center">Yesterday</span>
              </button>
              <button 
                className={`flex items-center justify-center px-3 py-2 text-sm font-medium rounded-lg ${
                  dateRange === 'last7days' 
                    ? `${buttonVariants.active.base} ${buttonVariants.active.hover} ${buttonVariants.active.pressed}` 
                    : `${buttonVariants.inactive.base} ${buttonVariants.inactive.hover} ${buttonVariants.inactive.pressed}`
                }`}
                onClick={() => handleDateRangeChange('last7days')}
              >
                <span className="text-center w-full">Last 7 Days</span>
              </button>
              <button 
                className={`flex items-center justify-center px-3 py-2 text-sm font-medium rounded-lg ${
                  dateRange === 'last30days' 
                    ? `${buttonVariants.active.base} ${buttonVariants.active.hover} ${buttonVariants.active.pressed}` 
                    : `${buttonVariants.inactive.base} ${buttonVariants.inactive.hover} ${buttonVariants.inactive.pressed}`
                }`}
                onClick={() => handleDateRangeChange('last30days')}
              >
                <span className="text-center w-full">Last 30 Days</span>
              </button>
              <button 
                className={`flex items-center justify-center px-3 py-2 text-sm font-medium rounded-lg ${
                  dateRange === 'thisMonth' 
                    ? `${buttonVariants.active.base} ${buttonVariants.active.hover} ${buttonVariants.active.pressed}` 
                    : `${buttonVariants.inactive.base} ${buttonVariants.inactive.hover} ${buttonVariants.inactive.pressed}`
                }`}
                onClick={() => handleDateRangeChange('thisMonth')}
              >
                <span className="text-center w-full">This Month</span>
              </button>
              <button 
                className={`flex items-center justify-center px-3 py-2 text-sm font-medium rounded-lg ${
                  dateRange === 'lastMonth' 
                    ? `${buttonVariants.active.base} ${buttonVariants.active.hover} ${buttonVariants.active.pressed}` 
                    : `${buttonVariants.inactive.base} ${buttonVariants.inactive.hover} ${buttonVariants.inactive.pressed}`
                }`}
                onClick={() => handleDateRangeChange('lastMonth')}
              >
                <span className="text-center w-full">Last Month</span>
              </button>
            </div>
            <div className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              {getDateRangeText()}
            </div>
          </div>

          {/* Data Categories Section */}
          <div className="pb-5 border-b border-gray-100 dark:border-gray-800">
            <div className="flex items-center mb-3">
              <span className="w-1 h-4 bg-green-500 mr-2 rounded"></span>
              <h3 className="text-sm font-semibold text-green-600 dark:text-green-400 uppercase tracking-wider">Data Categories</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {categoryOptions.map(category => (
                <button 
                  key={category.id}
                  className={`flex items-center justify-center px-3 py-2 text-sm font-medium rounded-lg ${
                    categories.includes(category.id) 
                      ? `${buttonVariants.active.base} ${buttonVariants.active.hover} ${buttonVariants.active.pressed}` 
                      : `${buttonVariants.inactive.base} ${buttonVariants.inactive.hover} ${buttonVariants.inactive.pressed}`
                  }`}
                  onClick={() => toggleCategory(category.id)}
                >
                  <span className="text-center w-full">{category.label}</span>
                  {categories.includes(category.id) && (
                    <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-white transform -translate-y-1 translate-x-1"></span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Comparison Mode */}
          <div className="pb-5 border-b border-gray-100 dark:border-gray-800">
            <div className="flex items-center mb-3">
              <span className="w-1 h-4 bg-purple-500 mr-2 rounded"></span>
              <h3 className="text-sm font-semibold text-purple-600 dark:text-purple-400 uppercase tracking-wider">Compare With Previous Period</h3>
            </div>
            <button 
              className={`w-full px-4 py-2 text-sm font-medium rounded-lg flex items-center justify-center ${
                compareMode 
                  ? `${buttonVariants.active.base} ${buttonVariants.active.hover} ${buttonVariants.active.pressed}` 
                  : `${buttonVariants.inactive.base} ${buttonVariants.inactive.hover} ${buttonVariants.inactive.pressed}`
              }`}
              onClick={toggleCompareMode}
            >
              <span className="text-center">Comparison Mode: {compareMode ? 'On' : 'Off'}</span>
              {compareMode && (
                <span className="ml-2 inline-block h-3 w-3 rounded-full bg-green-400 animate-pulse"></span>
              )}
            </button>
            <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
              {compareMode ? 'Displaying comparative data against previous period' : 'Enable to compare with previous period'}
            </div>
          </div>

          {/* Apply Filters */}
          <div className="pt-4">
            <button 
              className="w-full px-4 py-2.5 text-sm font-medium rounded-lg bg-gradient-to-r from-primary-600 to-blue-600 hover:from-primary-700 hover:to-blue-700 text-white shadow-md hover:shadow-lg active:scale-95 transition-all flex items-center justify-center"
              onClick={() => onFilterChange && onFilterChange({ dateRange, categories, compareMode })}
            >
              <span className="text-center w-full">Apply Filters</span>
            </button>
            <p className="text-xs text-center text-gray-500 dark:text-gray-400 mt-2">
              Last updated: {new Date().toLocaleString()}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DataFilterControls;
