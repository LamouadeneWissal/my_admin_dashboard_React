import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../../components/Sidebar';
import Topbar from '../../components/Topbar';
import { cn } from '../../lib/utils';
import { announcements, users, announcementsApi } from '../../data/communications';

const AnnouncementsPage = () => {
  const navigate = useNavigate();
  const [currentUserId, setCurrentUserId] = useState('user-1'); // Simulating logged-in user
  const [userAnnouncements, setUserAnnouncements] = useState([]);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [filterType, setFilterType] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Form fields for creating a new announcement
  const [newAnnouncement, setNewAnnouncement] = useState({
    title: '',
    content: '',
    important: false,
    audience: 'all',
    hasAttachment: false
  });

  // Load announcements
  useEffect(() => {
    const announcements = announcementsApi.getAnnouncementsForUser(currentUserId);
    setUserAnnouncements(announcements);
  }, [currentUserId]);

  const handleSelectAnnouncement = (announcement) => {
    setSelectedAnnouncement(announcement);
    
    // Mark as read if not already read
    if (!announcement.isRead) {
      announcementsApi.markAnnouncementAsRead(announcement.id, currentUserId);
      
      // Update the announcements list
      setUserAnnouncements(prevAnnouncements => 
        prevAnnouncements.map(ann => 
          ann.id === announcement.id ? { ...ann, isRead: true } : ann
        )
      );
    }
  };

  const handleCreateAnnouncement = () => {
    if (!newAnnouncement.title || !newAnnouncement.content) return;
    
    const announcement = {
      title: newAnnouncement.title,
      content: newAnnouncement.content,
      important: newAnnouncement.important,
      audience: newAnnouncement.audience,
      author: currentUserId,
      hasAttachment: newAnnouncement.hasAttachment
    };
    
    announcementsApi.createAnnouncement(announcement);
    
    // Refresh announcements list
    const announcements = announcementsApi.getAnnouncementsForUser(currentUserId);
    setUserAnnouncements(announcements);
    
    // Reset form and close modal
    setNewAnnouncement({
      title: '',
      content: '',
      important: false,
      audience: 'all',
      hasAttachment: false
    });
    setShowCreateModal(false);
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNewAnnouncement({
      ...newAnnouncement,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const formatAnnouncementDate = (timestamp) => {
    return new Date(timestamp).toLocaleDateString([], { 
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  // Filter announcements
  const filteredAnnouncements = userAnnouncements.filter(announcement => {
    // Filter by read/unread status
    if (filterType === 'unread' && announcement.isRead) return false;
    if (filterType === 'read' && !announcement.isRead) return false;
    if (filterType === 'important' && !announcement.important) return false;
    
    // Filter by search query
    if (searchQuery && 
        !announcement.title.toLowerCase().includes(searchQuery.toLowerCase()) && 
        !announcement.content.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    
    return true;
  });

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Topbar />
        
        <main className="flex-1 overflow-hidden bg-gray-50 dark:bg-gray-900 flex">
          {/* Announcements Container */}
          <div className="flex w-full h-full">
            {/* Announcements List */}
            <div className="w-full md:w-80 lg:w-96 border-r border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-800 flex flex-col">
              {/* Header */}
              <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                <h2 className="text-lg font-semibold text-gray-800 dark:text-white">Announcements</h2>
                <button 
                  className="p-2 rounded-full bg-primary-500 hover:bg-primary-600 text-white"
                  onClick={() => setShowCreateModal(true)}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
              
              {/* Filters and Search */}
              <div className="p-4 space-y-3">
                <div className="flex space-x-2">
                  <button 
                    onClick={() => setFilterType('all')} 
                    className={cn(
                      "px-3 py-1 text-sm rounded-full",
                      filterType === 'all' 
                        ? "bg-primary-500 text-white" 
                        : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                    )}
                  >
                    All
                  </button>
                  <button 
                    onClick={() => setFilterType('unread')} 
                    className={cn(
                      "px-3 py-1 text-sm rounded-full",
                      filterType === 'unread' 
                        ? "bg-primary-500 text-white" 
                        : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                    )}
                  >
                    Unread
                  </button>
                  <button 
                    onClick={() => setFilterType('important')} 
                    className={cn(
                      "px-3 py-1 text-sm rounded-full",
                      filterType === 'important' 
                        ? "bg-primary-500 text-white" 
                        : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                    )}
                  >
                    Important
                  </button>
                </div>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search announcements..."
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
              
              {/* Announcements List */}
              <div className="flex-1 overflow-y-auto">
                {filteredAnnouncements.length === 0 ? (
                  <div className="text-center p-6 text-gray-500 dark:text-gray-400">
                    No announcements found
                  </div>
                ) : (
                  <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                    {filteredAnnouncements.map(announcement => (
                      <li 
                        key={announcement.id} 
                        className={cn(
                          "hover:bg-gray-50 dark:hover:bg-gray-750 cursor-pointer p-4",
                          selectedAnnouncement?.id === announcement.id ? "bg-primary-50 dark:bg-primary-900/20" : "",
                          !announcement.isRead ? "bg-blue-50 dark:bg-blue-900/10" : ""
                        )}
                        onClick={() => handleSelectAnnouncement(announcement)}
                      >
                        <div className="flex items-start">
                          {/* Author Avatar */}
                          <img 
                            src={announcement.author.avatar} 
                            alt={announcement.author.name} 
                            className="h-10 w-10 rounded-full object-cover mt-1"
                          />
                          
                          {/* Announcement Info */}
                          <div className="ml-3 flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <h3 className={cn(
                                "text-sm font-semibold truncate",
                                announcement.isRead 
                                  ? "text-gray-700 dark:text-gray-300" 
                                  : "text-gray-900 dark:text-white"
                              )}>
                                {announcement.important && (
                                  <span className="inline-block w-2 h-2 bg-red-500 rounded-full mr-1"></span>
                                )}
                                {announcement.title}
                              </h3>
                              <span className="text-xs text-gray-500 dark:text-gray-400 ml-2 flex-shrink-0">
                                {formatAnnouncementDate(announcement.createdAt)}
                              </span>
                            </div>
                            
                            <div className="mt-1">
                              <p className={cn(
                                "text-xs text-gray-600 dark:text-gray-400 line-clamp-2",
                                announcement.isRead ? "" : "font-medium text-gray-800 dark:text-gray-200"
                              )}>
                                {announcement.content}
                              </p>
                            </div>
                            
                            <div className="mt-2 flex items-center">
                              <p className="text-xs text-gray-500 dark:text-gray-400">
                                {announcement.author.name}
                              </p>
                              {announcement.hasAttachment && (
                                <span className="ml-2 flex items-center text-xs text-gray-500 dark:text-gray-400">
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                                  </svg>
                                  Attachment
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
            
            {/* Announcement Detail View */}
            <div className="hidden md:flex flex-1 flex-col bg-gray-50 dark:bg-gray-900">
              {selectedAnnouncement ? (
                <div className="h-full flex flex-col">
                  {/* Announcement Header */}
                  <div className="p-6 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                    <div className="flex justify-between items-start">
                      <div>
                        <h2 className="text-xl font-semibold text-gray-800 dark:text-white flex items-center">
                          {selectedAnnouncement.important && (
                            <span className="inline-flex items-center justify-center bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-xs px-2 py-0.5 rounded-full mr-2">
                              Important
                            </span>
                          )}
                          {selectedAnnouncement.title}
                        </h2>
                        <div className="mt-2 flex items-center">
                          <img 
                            src={selectedAnnouncement.author.avatar} 
                            alt={selectedAnnouncement.author.name} 
                            className="h-6 w-6 rounded-full object-cover"
                          />
                          <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">
                            {selectedAnnouncement.author.name} • {formatAnnouncementDate(selectedAnnouncement.createdAt)}
                          </span>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <button className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                          </svg>
                        </button>
                        <button className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                  
                  {/* Announcement Content */}
                  <div className="flex-1 overflow-y-auto p-6">
                    <div className="prose dark:prose-invert max-w-none">
                      <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line">
                        {selectedAnnouncement.content}
                      </p>
                    </div>
                    
                    {selectedAnnouncement.hasAttachment && (
                      <div className="mt-6">
                        <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Attachments</h3>
                        <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-3 bg-white dark:bg-gray-800 flex items-center justify-between">
                          <div className="flex items-center">
                            <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-md text-blue-500 dark:text-blue-400">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                              </svg>
                            </div>
                            <div className="ml-3">
                              <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                {selectedAnnouncement.attachmentName || 'attachment.pdf'}
                              </p>
                              <p className="text-xs text-gray-500 dark:text-gray-400">PDF • 1.2 MB</p>
                            </div>
                          </div>
                          <button className="p-1.5 rounded-md bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full p-8">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-300 dark:text-gray-600 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
                  </svg>
                  <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300">No announcement selected</h3>
                  <p className="text-gray-500 dark:text-gray-400 mt-1 text-center max-w-md">
                    Select an announcement from the list to view details or create a new one.
                  </p>
                  <button
                    onClick={() => setShowCreateModal(true)}
                    className="mt-4 px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-md text-sm font-medium transition-colors duration-200"
                  >
                    Create New Announcement
                  </button>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
      
      {/* Create Announcement Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg w-full max-w-2xl mx-4">
            <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
              <h3 className="text-lg font-medium text-gray-800 dark:text-white">Create Announcement</h3>
              <button 
                onClick={() => setShowCreateModal(false)}
                className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 focus:outline-none"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
            
            <div className="p-4">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Title
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={newAnnouncement.title}
                    onChange={handleInputChange}
                    placeholder="Announcement title"
                    className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Content
                  </label>
                  <textarea
                    name="content"
                    value={newAnnouncement.content}
                    onChange={handleInputChange}
                    placeholder="Write your announcement here..."
                    rows="6"
                    className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  ></textarea>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Audience
                    </label>
                    <select
                      name="audience"
                      value={newAnnouncement.audience}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500"
                    >
                      <option value="all">All Users</option>
                      <option value="team-1">Development Team</option>
                      <option value="team-2">Marketing & Sales</option>
                      <option value="team-3">Product Management</option>
                      <option value="team-4">Design Team</option>
                    </select>
                  </div>
                  
                  <div className="flex items-center mt-6">
                    <input
                      type="checkbox"
                      id="important"
                      name="important"
                      checked={newAnnouncement.important}
                      onChange={handleInputChange}
                      className="h-4 w-4 text-primary-500 border-gray-300 rounded focus:ring-primary-500"
                    />
                    <label htmlFor="important" className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                      Mark as important
                    </label>
                    
                    <input
                      type="checkbox"
                      id="hasAttachment"
                      name="hasAttachment"
                      checked={newAnnouncement.hasAttachment}
                      onChange={handleInputChange}
                      className="h-4 w-4 ml-6 text-primary-500 border-gray-300 rounded focus:ring-primary-500"
                    />
                    <label htmlFor="hasAttachment" className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                      Add attachment
                    </label>
                  </div>
                </div>
                
                {newAnnouncement.hasAttachment && (
                  <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 bg-gray-50 dark:bg-gray-750">
                    <div className="flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500 dark:text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                      </svg>
                      <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                        Drag and drop a file or <span className="text-primary-500 cursor-pointer">browse</span>
                      </span>
                    </div>
                  </div>
                )}
              </div>
              
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 text-sm font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateAnnouncement}
                  disabled={!newAnnouncement.title || !newAnnouncement.content}
                  className="px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-md text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Publish
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AnnouncementsPage;
