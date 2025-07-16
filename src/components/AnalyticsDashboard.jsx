import React, { useState } from 'react';
import AdvancedCharts from './AdvancedCharts';
import DataFilterControls from './DataFilterControls';
import RealTimeData from './RealTimeData';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import ShadcnButton from './ShadcnButton';
import { cn } from '../lib/utils';

/**
 * AnalyticsDashboard Component
 * 
 * A comprehensive analytics dashboard section that integrates
 * advanced charts, real-time data, and filtering controls.
 * 
 * @param {Object} props - Component props
 * @param {string} props.className - Additional CSS classes
 * @returns {JSX.Element} - Analytics dashboard component
 */
const AnalyticsDashboard = ({ className }) => {
  // State for active filters
  const [activeFilters, setActiveFilters] = useState({
    dateRange: 'last7days',
    categories: ['sales', 'users'],
    compareMode: false
  });

  // Handle filter changes
  const handleFilterChange = (newFilters) => {
    setActiveFilters(newFilters);
    console.log('Filters updated:', newFilters);
    // In a real app, we would fetch new data based on these filters
  };

  // DownloadIcon component
  const DownloadIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
    </svg>
  );

  // RefreshIcon component
  const RefreshIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
    </svg>
  );

  return (
    <div className={cn("space-y-6", className)}>
      {/* Analytics Dashboard Header with Modern Gradient */}
      <div className="relative mb-8 p-6 rounded-2xl overflow-hidden bg-gradient-to-r from-primary-50 via-blue-50 to-indigo-50 dark:from-gray-800 dark:via-gray-800 dark:to-gray-900 border border-primary-100 dark:border-gray-700 shadow-md">
        {/* Decorative background elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-72 h-72 bg-primary-300 dark:bg-primary-600 rounded-full filter blur-3xl -translate-y-1/2 translate-x-1/3"></div>
          <div className="absolute bottom-0 left-0 w-72 h-72 bg-blue-300 dark:bg-blue-600 rounded-full filter blur-3xl translate-y-1/2 -translate-x-1/3"></div>
        </div>

        {/* Content */}
        <div className="relative flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 z-10">
          <div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-primary-600 to-blue-600 bg-clip-text text-transparent dark:from-primary-400 dark:to-blue-400 mb-2">
              Analytics Dashboard
            </h2>
            <p className="text-gray-700 dark:text-gray-300">
              Comprehensive view of your business metrics and performance
            </p>
          </div>
          <div className="flex space-x-3 self-end">
            <ShadcnButton
              variant="outline"
              icon={<DownloadIcon />}
              className="border-2 border-gray-200 dark:border-gray-700 rounded-xl backdrop-blur-sm bg-white/50 dark:bg-gray-800/50 hover:bg-white/80 dark:hover:bg-gray-800/80 transition-all"
            >
              Export Data
            </ShadcnButton>
            <ShadcnButton
              icon={<RefreshIcon />}
              className="rounded-xl shadow-md hover:shadow-lg transition-all"
            >
              Refresh All
            </ShadcnButton>
          </div>
        </div>
      </div>

      {/* Analytics Content */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar with filters - takes 1/4 width on large screens */}
        <div className="lg:col-span-1 space-y-6">
          {/* Enhanced Data Filter Controls with shadows */}
          <DataFilterControls 
            onFilterChange={handleFilterChange}
            className="overflow-hidden border border-gray-100 dark:border-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300" 
          />
          
          {/* Analytics Summary Card with enhanced styling */}
          <Card className="overflow-hidden shadow-lg border border-gray-100 dark:border-gray-800 rounded-xl hover:shadow-xl transition-all duration-300">
            <CardHeader className="border-b border-gray-100 dark:border-gray-800 bg-gradient-to-r from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 pb-4">
              <CardTitle className="text-lg font-semibold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent dark:from-gray-200 dark:to-gray-300">Analytics Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-5 pt-5">
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Active Date Range</p>
                <p className="font-medium text-gray-800 dark:text-gray-200 mt-1">{activeFilters.dateRange === 'last7days' ? 'Last 7 Days' : 'Custom Range'}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Active Categories</p>
                <div className="flex flex-wrap gap-1.5 mt-1.5">
                  {activeFilters.categories.map(category => (
                    <span 
                      key={category}
                      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800 dark:bg-primary-800 dark:text-primary-200 border border-primary-200 dark:border-primary-700 shadow-sm"
                    >
                      {category.charAt(0).toUpperCase() + category.slice(1)}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Comparison Mode</p>
                <div className="mt-1.5 flex items-center">
                  <div className={`w-3 h-3 rounded-full mr-2 ${activeFilters.compareMode ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                  <p className="font-medium text-gray-800 dark:text-gray-200">
                    {activeFilters.compareMode ? 'Enabled' : 'Disabled'}
                  </p>
                </div>
              </div>
              <div className="pt-2">
                <ShadcnButton
                  variant="outline"
                  className="w-full text-sm bg-gradient-to-b from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 border border-gray-200 dark:border-gray-700"
                  onClick={() => {
                    // In a real app, we might save these filters as default
                    console.log('Saving filters as default');
                  }}
                >
                  Save as Default View
                </ShadcnButton>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main content area - takes 3/4 width on large screens */}
        <div className="lg:col-span-3 space-y-8">
          {/* Real-time Data Component with enhanced styling */}
          <RealTimeData 
            title="Live System Activity" 
            className="border border-gray-100 dark:border-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
          />
          
          {/* Advanced Charts Component with enhanced styling */}
          <AdvancedCharts 
            className="border border-gray-100 dark:border-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
          />

          {/* Additional Analytics Sections with improved spacing and effects */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Conversion Metrics Card - Enhanced */}
            <Card className="overflow-hidden border border-gray-100 dark:border-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
              <CardHeader className="border-b border-gray-100 dark:border-gray-800 bg-gradient-to-r from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
                <CardTitle className="text-lg font-semibold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent dark:from-gray-200 dark:to-gray-300">Conversion Metrics</CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-5">
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Visitor to Signup</span>
                      <span className="text-sm font-bold text-blue-600 dark:text-blue-400">2.4%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                      <div className="bg-gradient-to-r from-blue-600 to-blue-400 h-2.5 rounded-full" style={{ width: '2.4%' }}></div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Signup to Active User</span>
                      <span className="text-sm font-bold text-green-600 dark:text-green-400">68%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                      <div className="bg-gradient-to-r from-green-600 to-green-400 h-2.5 rounded-full" style={{ width: '68%' }}></div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Active User to Paying</span>
                      <span className="text-sm font-bold text-purple-600 dark:text-purple-400">12%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                      <div className="bg-gradient-to-r from-purple-600 to-purple-400 h-2.5 rounded-full" style={{ width: '12%' }}></div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Overall Conversion</span>
                      <span className="text-sm font-bold text-primary-600 dark:text-primary-400">1.95%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                      <div className="bg-gradient-to-r from-primary-600 to-primary-400 h-2.5 rounded-full" style={{ width: '1.95%' }}></div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Geographic Distribution Card - Enhanced */}
            <Card className="overflow-hidden border border-gray-100 dark:border-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
              <CardHeader className="border-b border-gray-100 dark:border-gray-800 bg-gradient-to-r from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
                <CardTitle className="text-lg font-semibold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent dark:from-gray-200 dark:to-gray-300">Geographic Distribution</CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  {[
                    { country: 'United States', percentage: 42, users: 8420 },
                    { country: 'Germany', percentage: 18, users: 3680 },
                    { country: 'United Kingdom', percentage: 15, users: 2950 },
                    { country: 'France', percentage: 12, users: 2340 },
                    { country: 'Japan', percentage: 8, users: 1560 },
                    { country: 'Other', percentage: 5, users: 1050 }
                  ].map((item, index) => (
                    <div key={index} className="flex items-center justify-between py-1 border-b border-gray-100 dark:border-gray-800 last:border-0">
                      <div className="flex items-center">
                        <div className="w-3 h-3 rounded-full" style={{
                          background: `linear-gradient(to right, var(--primary-${500 - index * 100 < 200 ? 200 : 500 - index * 100}), var(--primary-${400 - index * 100 < 200 ? 200 : 400 - index * 100}))`,
                          opacity: 1 - (index * 0.08)
                        }}></div>
                        <span className="ml-3 text-sm font-medium text-gray-700 dark:text-gray-300">{item.country}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-xs text-gray-500 dark:text-gray-400">{item.users.toLocaleString()}</span>
                        <span className="text-sm font-bold text-gray-800 dark:text-gray-200">{item.percentage}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;
