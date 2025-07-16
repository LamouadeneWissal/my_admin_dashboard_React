import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchUsers } from '../redux/usersSlice';
import Sidebar from '../components/Sidebar';
import Topbar from '../components/Topbar';
import ShadcnStatCard from '../components/ShadcnStatCard';
import ShadcnButton from '../components/ShadcnButton';
import UserGrowthChart from '../components/UserGrowthChart';

/**
 * Dashboard Page Component
 * 
 * The main dashboard view that shows key metrics, user statistics,
 * activity feeds, and charts. Acts as the landing page after login.
 * 
 * Features:
 * - Overview statistics cards
 * - User growth chart
 * - Recent activities feed
 * - Quick action buttons
 * 
 * @returns {JSX.Element} - Rendered dashboard page
 */
const Dashboard = () => {
  const dispatch = useDispatch();
  const { list: users, status } = useSelector(state => state.users);
  const { admin } = useSelector(state => state.auth);
  
  /**
   * Load user data when component mounts if not already loaded
   */
  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchUsers(1));
    }
  }, [dispatch, status]);
  
  // Calculate stats from users data
  const totalUsers = users.length;
  const activeUsers = users.filter(user => user.active).length;
  const inactiveUsers = totalUsers - activeUsers;
  
  /**
   * Sample activity data for the recent activities panel
   * In a real application, this would come from an API
   */
  const recentActivities = [
    { id: 1, user: 'Emma Wong', action: 'logged in', time: '2 minutes ago', avatar: 'https://reqres.in/img/faces/3-image.jpg' },
    { id: 2, user: 'George Bluth', action: 'updated profile', time: '1 hour ago', avatar: 'https://reqres.in/img/faces/1-image.jpg' },
    { id: 3, user: 'Janet Weaver', action: 'deleted a post', time: '3 hours ago', avatar: 'https://reqres.in/img/faces/2-image.jpg' },
    { id: 4, user: 'Tracey Ramos', action: 'commented on a post', time: '4 hours ago', avatar: 'https://reqres.in/img/faces/6-image.jpg' },
    { id: 5, user: admin.name, action: 'published a new post', time: '5 hours ago', avatar: admin.avatar },
    { id: 6, user: 'Charles Morris', action: 'uploaded a document', time: '1 day ago', avatar: 'https://reqres.in/img/faces/5-image.jpg' },
    { id: 7, user: 'Lindsay Ferguson', action: 'created a new project', time: '2 days ago', avatar: 'https://reqres.in/img/faces/7-image.jpg' }
  ];
  
  // Icons
  const ExportIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
    </svg>
  );

  const RefreshIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
    </svg>
  );
  
  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
      <div className="flex min-h-screen">
        {/* Sidebar Navigation */}
        <Sidebar />
        <div className="flex-1 flex flex-col w-full transition-all duration-300 overflow-x-hidden">
          {/* Top Navigation Bar */}
          <Topbar />
          <main className="flex-1 w-full px-2 sm:px-3 lg:px-5 py-4 transition-all duration-300">
            <div className="max-w-none w-full">
              {/* Dashboard Header Section */}
              <div className="mb-4">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 mb-3">
                  <div className="flex-1">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-1">Dashboard</h1>
                    <p className="text-base text-gray-600 dark:text-gray-400">Welcome back, {admin.name}! Here's what's happening today.</p>
                  </div>
                  {/* Quick Actions */}
                  <div className="flex space-x-3">
                    <ShadcnButton
                      variant="outline"
                      icon={<ExportIcon />}
                      className="border-2 border-gray-200 dark:border-gray-700 rounded-xl text-sm"
                    >
                      Export
                    </ShadcnButton>
                    <ShadcnButton 
                      icon={<RefreshIcon />}
                      className="rounded-xl text-sm"
                    >
                      Refresh
                    </ShadcnButton>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Dashboard Content */}
            <div className="space-y-5">
                {/* Stats Cards Grid - Key Metrics Overview */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 mb-5">
                  <ShadcnStatCard 
                    title="Total Users" 
                    value={totalUsers || 0} 
                    icon="👥" 
                    color="blue"
                    progress={90}
                    className="p-1"
                  />
                  <ShadcnStatCard 
                    title="Active Users" 
                    value={activeUsers || 0} 
                    icon="✅" 
                    color="green"
                    progress={activeUsers && totalUsers ? Math.round((activeUsers / totalUsers) * 100) : 0}
                    className="p-1"
                  />
                  <ShadcnStatCard 
                    title="Inactive Users" 
                    value={inactiveUsers || 0} 
                    icon="⏸️" 
                    color="red"
                    progress={inactiveUsers && totalUsers ? Math.round((inactiveUsers / totalUsers) * 100) : 0}
                    className="p-1"
                  />
                  <ShadcnStatCard 
                    title="New Today" 
                    value="7" 
                    icon="🚀" 
                    color="purple"
                    progress={35}
                    className="p-1"
                  />
                </div>

                {/* Enhanced Content Grid with more compact spacing */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 lg:gap-5">
                  {/* Chart Section - Enhanced Modern Design with more compact spacing */}
                  <div className="lg:col-span-2 bg-white dark:bg-gray-900 rounded-xl shadow-md p-4 border border-gray-100 dark:border-gray-800 overflow-hidden transition-all hover:shadow-lg">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-3">
                      <div>
                        <h2 className="text-lg font-bold bg-gradient-to-r from-primary-600 to-blue-500 bg-clip-text text-transparent dark:from-primary-400 dark:to-blue-300">User Growth Analytics</h2>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Trend analysis for the last 12 months</p>
                      </div>
                      <div className="flex space-x-1 p-0.5 bg-gray-50 dark:bg-gray-800/40 rounded-lg self-start">
                        <ShadcnButton variant="ghost" size="sm" className="text-xs px-2 py-0.5 h-auto">Daily</ShadcnButton>
                        <ShadcnButton variant="ghost" size="sm" className="text-xs px-2 py-0.5 h-auto">Weekly</ShadcnButton>
                        <ShadcnButton variant="secondary" size="sm" className="text-xs px-2 py-0.5 h-auto font-medium">Monthly</ShadcnButton>
                      </div>
                    </div>
                    
                    {/* Chart Container with reduced height for more compact view */}
                    <div className="h-[280px] mt-2">
                      <UserGrowthChart />
                    </div>
                    
                    {/* Legend indicators with reduced spacing */}
                    <div className="flex items-center justify-center gap-4 mt-2 pt-1 border-t border-gray-100 dark:border-gray-800">
                      <div className="flex items-center text-xs">
                        <span className="w-2 h-2 rounded-full bg-blue-500 mr-1.5"></span>
                        <span className="text-gray-600 dark:text-gray-300">Active Users</span>
                      </div>
                      <div className="flex items-center text-xs">
                        <span className="w-2 h-2 rounded-full bg-green-500 mr-1.5"></span>
                        <span className="text-gray-600 dark:text-gray-300">New Signups</span>
                      </div>
                    </div>
                  </div>

                  {/* Recent Activity - More compact */}
                  <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm p-4 border border-gray-100 dark:border-gray-800">
                    <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-3">Recent Activity</h2>
                    <div className="space-y-3">
                      {recentActivities.map((activity) => (
                        <div key={activity.id} className="flex items-start space-x-2">
                          <div className="w-8 h-8 rounded-full overflow-hidden shadow-sm border border-gray-100 dark:border-gray-800">
                            <img 
                              src={activity.avatar} 
                              alt={`${activity.user} avatar`} 
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div>
                            <p className="text-xs">
                              <span className="font-medium text-gray-900 dark:text-gray-100">{activity.user}</span>
                              <span className="text-gray-600 dark:text-gray-400"> {activity.action}</span>
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-500">{activity.time}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="mt-3 pt-2 border-t border-gray-100 dark:border-gray-800">
                      <ShadcnButton variant="ghost" className="w-full justify-center text-xs" size="sm">
                        View All Activities
                      </ShadcnButton>
                    </div>
                  </div>
                </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
