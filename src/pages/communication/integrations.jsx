import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../../components/Sidebar';
import Topbar from '../../components/Topbar';
import { cn } from '../../lib/utils';
import { communicationTemplates, communicationSettings } from '../../data/communications';

const IntegrationsPage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('email');
  const [activeSettingsTab, setActiveSettingsTab] = useState('templates');
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showEditModal, setShowEditModal] = useState(false);
  const [editContent, setEditContent] = useState('');
  const [editSubject, setEditSubject] = useState('');
  const [editName, setEditName] = useState('');

  // Filter templates based on search query and active tab
  const filteredTemplates = activeTab === 'email'
    ? communicationTemplates.email.filter(template => 
        template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        template.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
        template.content.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : communicationTemplates.sms.filter(template => 
        template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        template.content.toLowerCase().includes(searchQuery.toLowerCase())
      );

  // Handler to edit a template
  const handleEditTemplate = (template) => {
    setSelectedTemplate(template);
    setEditName(template.name);
    if (activeTab === 'email') {
      setEditSubject(template.subject);
    }
    setEditContent(template.content);
    setShowEditModal(true);
  };

  // Handler to save edited template
  const handleSaveTemplate = () => {
    // In a real application, this would save to the backend
    // For now, we'll just close the modal
    setShowEditModal(false);
    
    // Reset form values
    setEditName('');
    setEditSubject('');
    setEditContent('');
    setSelectedTemplate(null);
  };

  // Format dates
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Topbar />
        
        <main className="flex-1 overflow-hidden bg-gray-50 dark:bg-gray-900">
          <div className="container mx-auto px-4 py-8">
            <div className="mb-6">
              <h1 className="text-2xl font-semibold text-gray-800 dark:text-white">Email & SMS</h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                Manage your email and SMS templates and integration settings
              </p>
            </div>
            
            {/* Main Tabs */}
            <div className="flex border-b border-gray-200 dark:border-gray-700 mb-6">
              <button
                className={cn(
                  "py-2 px-4 font-medium text-sm focus:outline-none",
                  activeTab === 'email'
                    ? "border-b-2 border-primary-500 text-primary-600 dark:text-primary-400"
                    : "text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white"
                )}
                onClick={() => setActiveTab('email')}
              >
                Email
              </button>
              <button
                className={cn(
                  "py-2 px-4 font-medium text-sm focus:outline-none",
                  activeTab === 'sms'
                    ? "border-b-2 border-primary-500 text-primary-600 dark:text-primary-400"
                    : "text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white"
                )}
                onClick={() => setActiveTab('sms')}
              >
                SMS
              </button>
            </div>
            
            {/* Settings Tabs */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {/* Left Column - Sub-tabs */}
              <div className="md:col-span-1">
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
                  <div className="px-4 py-3 bg-gray-50 dark:bg-gray-750 border-b border-gray-200 dark:border-gray-700">
                    <h3 className="font-medium text-gray-800 dark:text-white">Settings</h3>
                  </div>
                  <div className="p-2">
                    <button
                      className={cn(
                        "w-full text-left px-4 py-2 rounded-md text-sm font-medium transition-colors",
                        activeSettingsTab === 'templates'
                          ? "bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400"
                          : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-750"
                      )}
                      onClick={() => setActiveSettingsTab('templates')}
                    >
                      Templates
                    </button>
                    <button
                      className={cn(
                        "w-full text-left px-4 py-2 rounded-md text-sm font-medium transition-colors",
                        activeSettingsTab === 'configuration'
                          ? "bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400"
                          : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-750"
                      )}
                      onClick={() => setActiveSettingsTab('configuration')}
                    >
                      Configuration
                    </button>
                    <button
                      className={cn(
                        "w-full text-left px-4 py-2 rounded-md text-sm font-medium transition-colors",
                        activeSettingsTab === 'logs'
                          ? "bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400"
                          : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-750"
                      )}
                      onClick={() => setActiveSettingsTab('logs')}
                    >
                      Logs
                    </button>
                  </div>
                </div>
                
                {/* Current Settings Info */}
                <div className="mt-4 bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
                  <div className="px-4 py-3 bg-gray-50 dark:bg-gray-750 border-b border-gray-200 dark:border-gray-700">
                    <h3 className="font-medium text-gray-800 dark:text-white">Current Settings</h3>
                  </div>
                  <div className="p-4">
                    <dl className="space-y-3 text-sm">
                      {activeTab === 'email' ? (
                        <>
                          <div>
                            <dt className="text-gray-500 dark:text-gray-400">Provider</dt>
                            <dd className="mt-1 font-medium text-gray-800 dark:text-white">{communicationSettings.email.provider}</dd>
                          </div>
                          <div>
                            <dt className="text-gray-500 dark:text-gray-400">Server</dt>
                            <dd className="mt-1 font-medium text-gray-800 dark:text-white">{communicationSettings.email.server}</dd>
                          </div>
                          <div>
                            <dt className="text-gray-500 dark:text-gray-400">From</dt>
                            <dd className="mt-1 font-medium text-gray-800 dark:text-white">
                              {communicationSettings.email.fromName} &lt;{communicationSettings.email.fromEmail}&gt;
                            </dd>
                          </div>
                        </>
                      ) : (
                        <>
                          <div>
                            <dt className="text-gray-500 dark:text-gray-400">Provider</dt>
                            <dd className="mt-1 font-medium text-gray-800 dark:text-white">{communicationSettings.sms.provider}</dd>
                          </div>
                          <div>
                            <dt className="text-gray-500 dark:text-gray-400">From Number</dt>
                            <dd className="mt-1 font-medium text-gray-800 dark:text-white">{communicationSettings.sms.fromNumber}</dd>
                          </div>
                          <div>
                            <dt className="text-gray-500 dark:text-gray-400">Auth</dt>
                            <dd className="mt-1 font-medium text-gray-800 dark:text-white">
                              <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-xs">Configured</span>
                            </dd>
                          </div>
                        </>
                      )}
                    </dl>
                  </div>
                </div>
              </div>
              
              {/* Right Column - Content */}
              <div className="md:col-span-3">
                {activeSettingsTab === 'templates' && (
                  <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
                    <div className="px-4 py-3 bg-gray-50 dark:bg-gray-750 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                      <h3 className="font-medium text-gray-800 dark:text-white">
                        {activeTab === 'email' ? 'Email Templates' : 'SMS Templates'}
                      </h3>
                      <button className="px-3 py-1 bg-primary-500 hover:bg-primary-600 text-white rounded-md text-sm transition-colors">
                        New Template
                      </button>
                    </div>
                    
                    {/* Search */}
                    <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                      <div className="relative">
                        <input
                          type="text"
                          placeholder="Search templates..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="w-full px-4 py-2 pr-10 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-gray-200 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500"
                        />
                        <svg 
                          xmlns="http://www.w3.org/2000/svg" 
                          className="h-5 w-5 absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" 
                          fill="none" 
                          viewBox="0 0 24 24" 
                          stroke="currentColor"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                      </div>
                    </div>
                    
                    {/* Templates List */}
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                        <thead className="bg-gray-50 dark:bg-gray-750">
                          <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Name</th>
                            {activeTab === 'email' && (
                              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Subject</th>
                            )}
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Last Updated</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Category</th>
                            <th scope="col" className="relative px-6 py-3">
                              <span className="sr-only">Actions</span>
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                          {filteredTemplates.map((template) => (
                            <tr key={template.id} className="hover:bg-gray-50 dark:hover:bg-gray-750">
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm font-medium text-gray-900 dark:text-white">{template.name}</div>
                              </td>
                              {activeTab === 'email' && (
                                <td className="px-6 py-4">
                                  <div className="text-sm text-gray-700 dark:text-gray-300 max-w-xs truncate">{template.subject}</div>
                                </td>
                              )}
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-500 dark:text-gray-400">{formatDate(template.lastUpdated)}</div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span className="px-2 py-1 inline-flex text-xs leading-5 font-medium rounded-full bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300">
                                  {template.category}
                                </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                <button 
                                  className="text-primary-600 dark:text-primary-400 hover:text-primary-800 dark:hover:text-primary-300 mr-3"
                                  onClick={() => handleEditTemplate(template)}
                                >
                                  Edit
                                </button>
                                <button className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300">
                                  Delete
                                </button>
                              </td>
                            </tr>
                          ))}
                          {filteredTemplates.length === 0 && (
                            <tr>
                              <td colSpan={activeTab === 'email' ? 5 : 4} className="px-6 py-10 text-center text-gray-500 dark:text-gray-400">
                                No templates found matching your search
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
                
                {activeSettingsTab === 'configuration' && (
                  <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
                    <div className="px-4 py-3 bg-gray-50 dark:bg-gray-750 border-b border-gray-200 dark:border-gray-700">
                      <h3 className="font-medium text-gray-800 dark:text-white">
                        {activeTab === 'email' ? 'Email Configuration' : 'SMS Configuration'}
                      </h3>
                    </div>
                    <div className="p-6 space-y-6">
                      {activeTab === 'email' ? (
                        <>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Provider</label>
                              <select className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500">
                                <option>SMTP</option>
                                <option>Amazon SES</option>
                                <option>SendGrid</option>
                                <option>Mailgun</option>
                              </select>
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">SMTP Server</label>
                              <input 
                                type="text" 
                                defaultValue={communicationSettings.email.server}
                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Port</label>
                              <input 
                                type="number" 
                                defaultValue={communicationSettings.email.port}
                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                              />
                            </div>
                            <div className="flex items-center">
                              <input
                                type="checkbox"
                                id="useTLS"
                                defaultChecked={communicationSettings.email.useTLS}
                                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                              />
                              <label htmlFor="useTLS" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                                Use TLS/SSL
                              </label>
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">From Name</label>
                              <input 
                                type="text" 
                                defaultValue={communicationSettings.email.fromName}
                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">From Email</label>
                              <input 
                                type="email" 
                                defaultValue={communicationSettings.email.fromEmail}
                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Daily Email Limit</label>
                              <input 
                                type="number" 
                                defaultValue={communicationSettings.email.maxDailyEmails}
                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                              />
                            </div>
                          </div>
                          <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                            <h4 className="text-sm font-medium text-gray-800 dark:text-white mb-4">SMTP Authentication</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Username</label>
                                <input 
                                  type="text" 
                                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                                />
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Password</label>
                                <input 
                                  type="password"
                                  placeholder="••••••••"
                                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                                />
                              </div>
                            </div>
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Provider</label>
                              <select className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500">
                                <option>Twilio</option>
                                <option>Nexmo</option>
                                <option>MessageBird</option>
                                <option>Plivo</option>
                              </select>
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">From Number</label>
                              <input 
                                type="text" 
                                defaultValue={communicationSettings.sms.fromNumber}
                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Account SID</label>
                              <input 
                                type="text" 
                                defaultValue={communicationSettings.sms.accountSid}
                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Auth Token</label>
                              <input 
                                type="password"
                                placeholder="••••••••"
                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                              />
                            </div>
                          </div>
                        </>
                      )}
                      
                      <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                        <h4 className="text-sm font-medium text-gray-800 dark:text-white mb-4">Notification Settings</h4>
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center">
                              <input
                                id="emailNotifications"
                                type="checkbox"
                                defaultChecked={communicationSettings.notifications.emailNotifications}
                                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                              />
                              <label htmlFor="emailNotifications" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                                Enable email notifications
                              </label>
                            </div>
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center">
                              <input
                                id="smsNotifications"
                                type="checkbox"
                                defaultChecked={communicationSettings.notifications.smsNotifications}
                                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                              />
                              <label htmlFor="smsNotifications" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                                Enable SMS notifications
                              </label>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="pt-4 flex justify-end">
                        <button className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-300 rounded-md mr-3 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors">
                          Cancel
                        </button>
                        <button className="px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-md transition-colors">
                          Save Changes
                        </button>
                      </div>
                    </div>
                  </div>
                )}
                
                {activeSettingsTab === 'logs' && (
                  <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
                    <div className="px-4 py-3 bg-gray-50 dark:bg-gray-750 border-b border-gray-200 dark:border-gray-700">
                      <h3 className="font-medium text-gray-800 dark:text-white">
                        {activeTab === 'email' ? 'Email Logs' : 'SMS Logs'}
                      </h3>
                    </div>
                    <div className="p-4">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex space-x-2">
                          <select className="px-3 py-1.5 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-800 dark:text-white text-sm">
                            <option>All Status</option>
                            <option>Delivered</option>
                            <option>Failed</option>
                            <option>Pending</option>
                          </select>
                          <select className="px-3 py-1.5 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-800 dark:text-white text-sm">
                            <option>Last 7 days</option>
                            <option>Last 30 days</option>
                            <option>Last 90 days</option>
                          </select>
                        </div>
                        <button className="px-3 py-1.5 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-md text-sm flex items-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                          </svg>
                          Export Logs
                        </button>
                      </div>
                      <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                          <thead className="bg-gray-50 dark:bg-gray-750">
                            <tr>
                              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">ID</th>
                              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Recipient</th>
                              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Template</th>
                              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Date</th>
                              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                            </tr>
                          </thead>
                          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                            {/* Sample logs - in a real app these would come from an API */}
                            {[...Array(5)].map((_, index) => (
                              <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-750">
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <div className="text-sm text-gray-900 dark:text-white">MSG-{1000 + index}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  {activeTab === 'email' ? (
                                    <div className="text-sm text-gray-700 dark:text-gray-300">user{index}@example.com</div>
                                  ) : (
                                    <div className="text-sm text-gray-700 dark:text-gray-300">+1555{index}55{index}55</div>
                                  )}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <div className="text-sm text-gray-700 dark:text-gray-300">
                                    {activeTab === 'email' 
                                      ? ['Welcome Email', 'Password Reset', 'Monthly Report'][index % 3]
                                      : ['Two-Factor Auth', 'Appointment Reminder', 'Alert Notification'][index % 3]
                                    }
                                  </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <div className="text-sm text-gray-500 dark:text-gray-400">
                                    {formatDate(new Date(Date.now() - index * 86400000))}
                                  </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <span className={cn(
                                    "px-2 py-1 inline-flex text-xs leading-5 font-medium rounded-full",
                                    index % 3 === 0 
                                      ? "bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-400" 
                                      : index % 3 === 1
                                        ? "bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-400"
                                        : "bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-400"
                                  )}>
                                    {index % 3 === 0 ? 'Delivered' : index % 3 === 1 ? 'Failed' : 'Pending'}
                                  </span>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
      
      {/* Edit Template Modal */}
      {showEditModal && (
        <div className="fixed z-50 inset-0 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            {/* Background overlay */}
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 dark:bg-gray-900 opacity-75"></div>
            </div>
            
            {/* Modal panel */}
            <div className="inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full">
              <div className="px-4 pt-5 pb-4 sm:p-6">
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:text-left w-full">
                    <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">
                      Edit {activeTab === 'email' ? 'Email' : 'SMS'} Template
                    </h3>
                    <div className="mt-4 space-y-4">
                      <div>
                        <label htmlFor="templateName" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                          Template Name
                        </label>
                        <input
                          type="text"
                          id="templateName"
                          value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                          className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                        />
                      </div>
                      
                      {activeTab === 'email' && (
                        <div>
                          <label htmlFor="templateSubject" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Subject Line
                          </label>
                          <input
                            type="text"
                            id="templateSubject"
                            value={editSubject}
                            onChange={(e) => setEditSubject(e.target.value)}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                          />
                        </div>
                      )}
                      
                      <div>
                        <label htmlFor="templateContent" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                          Content
                        </label>
                        <div className="mt-1">
                          <textarea
                            id="templateContent"
                            rows={8}
                            value={editContent}
                            onChange={(e) => setEditContent(e.target.value)}
                            className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                          />
                        </div>
                        <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                          Available variables: {{name}}, {{email}}, {{setupLink}}, {{resetLink}}, etc.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 dark:bg-gray-750 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-primary-500 text-base font-medium text-white hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={handleSaveTemplate}
                >
                  Save Template
                </button>
                <button
                  type="button"
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 dark:border-gray-600 shadow-sm px-4 py-2 bg-white dark:bg-gray-700 text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={() => setShowEditModal(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default IntegrationsPage;
