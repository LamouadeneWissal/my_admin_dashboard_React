import React from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../../components/Sidebar';
import Topbar from '../../components/Topbar';
import { cn } from '../../lib/utils';

const CommunicationHub = () => {
  const navigate = useNavigate();

  // Communication hub features
  const features = [
    {
      id: 'messages',
      title: 'Messages',
      description: 'Internal messaging system for direct communication',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
      ),
      path: '/communication/messages',
      color: 'bg-blue-500'
    },
    {
      id: 'announcements',
      title: 'Announcements',
      description: 'Broadcast important information to the entire organization',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
        </svg>
      ),
      path: '/communication/announcements',
      color: 'bg-orange-500'
    },
    {
      id: 'team-spaces',
      title: 'Team Spaces',
      description: 'Collaborative spaces for teams to work together',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
      path: '/communication/team-spaces',
      color: 'bg-purple-500'
    },
    {
      id: 'integrations',
      title: 'Email & SMS',
      description: 'Manage email and SMS templates and integrations',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
      path: '/communication/integrations',
      color: 'bg-green-500'
    }
  ];

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Topbar />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 dark:bg-gray-900">
          <div className="container mx-auto px-4 py-8">
            <div className="mb-8">
              <h1 className="text-2xl font-semibold text-gray-800 dark:text-white mb-2">Communication Hub</h1>
              <p className="text-gray-600 dark:text-gray-400">
                Tools and platforms for effective team communication and collaboration
              </p>
            </div>

            {/* Features Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {features.map((feature) => (
                <div
                  key={feature.id}
                  className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 cursor-pointer"
                  onClick={() => navigate(feature.path)}
                >
                  <div className="p-6">
                    <div className="flex items-center mb-4">
                      <div className={cn("p-3 rounded-lg mr-4", feature.color)}>
                        <div className="text-white">
                          {feature.icon}
                        </div>
                      </div>
                      <h3 className="text-xl font-medium text-gray-800 dark:text-white">
                        {feature.title}
                      </h3>
                    </div>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                      {feature.description}
                    </p>
                    <div className="flex justify-end">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(feature.path);
                        }}
                        className="px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-md text-sm font-medium transition-colors duration-200"
                      >
                        Open {feature.title}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Communication Stats */}
            <div className="mt-8 bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              <h2 className="text-xl font-medium text-gray-800 dark:text-white mb-4">Communication Stats</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                  <div className="text-blue-500 dark:text-blue-400 text-3xl font-semibold">15</div>
                  <div className="text-gray-700 dark:text-gray-300 text-sm mt-1">Active Conversations</div>
                </div>
                <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                  <div className="text-green-500 dark:text-green-400 text-3xl font-semibold">4</div>
                  <div className="text-gray-700 dark:text-gray-300 text-sm mt-1">New Announcements</div>
                </div>
                <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
                  <div className="text-purple-500 dark:text-purple-400 text-3xl font-semibold">8</div>
                  <div className="text-gray-700 dark:text-gray-300 text-sm mt-1">Active Team Spaces</div>
                </div>
                <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-lg">
                  <div className="text-orange-500 dark:text-orange-400 text-3xl font-semibold">32</div>
                  <div className="text-gray-700 dark:text-gray-300 text-sm mt-1">Email Templates</div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default CommunicationHub;
