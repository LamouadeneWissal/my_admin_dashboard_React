import React from 'react';
import Sidebar from '../components/Sidebar';
import Topbar from '../components/Topbar';
import AdvancedCharts from '../components/AdvancedCharts';
import DataFilterControls from '../components/DataFilterControls';

/**
 * Advanced Analytics Page Component
 * 
 * A dedicated page for in-depth analytics and data visualization
 * with advanced charts, real-time data, and filtering capabilities.
 * 
 * @returns {JSX.Element} - Rendered Advanced Analytics page
 */
const AdvancedAnalytics = () => {
  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
      <div className="flex min-h-screen">
        {/* Sidebar Navigation */}
        <Sidebar />
        <div className="flex-1 flex flex-col w-full transition-all duration-300 overflow-x-hidden">
          {/* Top Navigation Bar */}
          <Topbar />
          <main className="flex-1 w-full px-4 sm:px-6 lg:px-8 py-6 transition-all duration-300">
            <div className="max-w-none w-full">
              {/* Page Header */}
              <div className="mb-8">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-6">
                  <div className="flex-1">
                    <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-2">Advanced Analytics</h1>
                    <p className="text-lg text-gray-600 dark:text-gray-400">
                      In-depth data analysis and visualization for your business metrics
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Advanced Analytics Content */}
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* Sidebar with filters - takes 1/4 width on large screens */}
                <div className="lg:col-span-1 space-y-6">
                  {/* Enhanced Data Filter Controls with shadows */}
                  <DataFilterControls 
                    onFilterChange={(filters) => console.log('Filters updated:', filters)}
                    className="sticky top-6 overflow-hidden border border-gray-100 dark:border-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300" 
                  />
                </div>

                {/* Main content area - takes 3/4 width on large screens */}
                <div className="lg:col-span-3 space-y-8">
                  {/* Advanced Charts Component with white background styling */}
                  <AdvancedCharts 
                    className="rounded-xl shadow-md"
                  />
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default AdvancedAnalytics;
