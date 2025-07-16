import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../../components/Sidebar';
import Topbar from '../../components/Topbar';
import { cn } from '../../lib/utils';
import { teams, teamSpacesApi } from '../../data/communications';

const TeamSpacesPage = () => {
  const navigate = useNavigate();
  const messageEndRef = useRef(null);
  const [currentUserId, setCurrentUserId] = useState('user-1'); // Simulating logged-in user
  const [userTeams, setUserTeams] = useState([]);
  const [selectedTeamId, setSelectedTeamId] = useState(null);
  const [teamMessages, setTeamMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [emojiPickerVisible, setEmojiPickerVisible] = useState(false);
  const [selectedMessageForReaction, setSelectedMessageForReaction] = useState(null);
  const [selectedTab, setSelectedTab] = useState('chat'); // 'chat', 'files', 'members'

  // Available emoji reactions
  const availableEmojis = ['👍', '❤️', '😂', '🎉', '🔥', '👏', '🙌', '🤔', '😢', '✅'];

  // Load user teams
  useEffect(() => {
    const teams = teamSpacesApi.getUserTeams(currentUserId);
    setUserTeams(teams);
    
    // Select first team by default
    if (teams.length > 0 && !selectedTeamId) {
      handleSelectTeam(teams[0].id);
    }
  }, [currentUserId]);

  // Load team messages when team is selected
  useEffect(() => {
    if (selectedTeamId) {
      const messages = teamSpacesApi.getTeamMessages(selectedTeamId);
      setTeamMessages(messages);
    } else {
      setTeamMessages([]);
    }
  }, [selectedTeamId]);

  // Scroll to bottom of messages
  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [teamMessages]);

  const handleSelectTeam = (teamId) => {
    setSelectedTeamId(teamId);
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    
    if (!newMessage.trim() || !selectedTeamId) return;
    
    // Send message and update the local state
    const newMsg = teamSpacesApi.sendTeamMessage(selectedTeamId, currentUserId, newMessage);
    const updatedMessages = teamSpacesApi.getTeamMessages(selectedTeamId);
    setTeamMessages(updatedMessages);
    
    setNewMessage('');
  };

  const handleReactionClick = (messageId, emoji) => {
    if (!selectedTeamId) return;
    
    teamSpacesApi.addReaction(selectedTeamId, messageId, currentUserId, emoji);
    
    // Update messages to reflect the reaction
    const updatedMessages = teamSpacesApi.getTeamMessages(selectedTeamId);
    setTeamMessages(updatedMessages);
    
    // Hide emoji picker
    setEmojiPickerVisible(false);
    setSelectedMessageForReaction(null);
  };

  const formatMessageTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit'
    });
  };

  // Filter teams by search query
  const filteredTeams = userTeams.filter(team => 
    team.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    team.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Get selected team
  const selectedTeam = userTeams.find(team => team.id === selectedTeamId);

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Topbar />
        
        <main className="flex-1 overflow-hidden bg-gray-50 dark:bg-gray-900 flex">
          {/* Team Spaces Container */}
          <div className="flex w-full h-full">
            {/* Teams List */}
            <div className="w-full md:w-72 lg:w-80 border-r border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-800 flex flex-col">
              {/* Header */}
              <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-lg font-semibold text-gray-800 dark:text-white">Team Spaces</h2>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Collaborative spaces for your teams
                </p>
              </div>
              
              {/* Search */}
              <div className="p-4">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search teams..."
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
              
              {/* Teams List */}
              <div className="flex-1 overflow-y-auto">
                {filteredTeams.length === 0 ? (
                  <div className="text-center p-6 text-gray-500 dark:text-gray-400">
                    No teams found
                  </div>
                ) : (
                  <ul className="space-y-2 p-4">
                    {filteredTeams.map(team => (
                      <li 
                        key={team.id} 
                        className={cn(
                          "hover:bg-gray-50 dark:hover:bg-gray-750 rounded-lg cursor-pointer",
                          selectedTeamId === team.id ? "bg-primary-50 dark:bg-primary-900/20 border border-primary-200 dark:border-primary-800" : "border border-gray-200 dark:border-gray-700"
                        )}
                        onClick={() => handleSelectTeam(team.id)}
                      >
                        <div className="flex items-center p-3">
                          {/* Team Avatar/Icon */}
                          <div className="flex items-center justify-center h-10 w-10 rounded-lg bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 text-lg font-semibold">
                            {team.avatar}
                          </div>
                          
                          {/* Team Info */}
                          <div className="ml-3 flex-1">
                            <h3 className="text-sm font-medium text-gray-800 dark:text-white">
                              {team.name}
                            </h3>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 truncate">
                              {team.memberDetails.length} members
                            </p>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
            
            {/* Team Chat */}
            <div className="flex-1 flex flex-col bg-white dark:bg-gray-800">
              {selectedTeam ? (
                <>
                  {/* Team Header */}
                  <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
                    <div className="flex items-center">
                      <div className="flex items-center justify-center h-10 w-10 rounded-lg bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 text-lg font-semibold">
                        {selectedTeam.avatar}
                      </div>
                      <div className="ml-3">
                        <h2 className="text-lg font-semibold text-gray-800 dark:text-white">{selectedTeam.name}</h2>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{selectedTeam.description}</p>
                      </div>
                    </div>
                    
                    {/* Tabs */}
                    <div className="flex space-x-1 border border-gray-200 dark:border-gray-700 rounded-lg p-1">
                      <button
                        className={cn(
                          "px-3 py-1 text-sm rounded-md",
                          selectedTab === 'chat' 
                            ? "bg-primary-500 text-white" 
                            : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                        )}
                        onClick={() => setSelectedTab('chat')}
                      >
                        Chat
                      </button>
                      <button
                        className={cn(
                          "px-3 py-1 text-sm rounded-md",
                          selectedTab === 'files' 
                            ? "bg-primary-500 text-white" 
                            : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                        )}
                        onClick={() => setSelectedTab('files')}
                      >
                        Files
                      </button>
                      <button
                        className={cn(
                          "px-3 py-1 text-sm rounded-md",
                          selectedTab === 'members' 
                            ? "bg-primary-500 text-white" 
                            : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                        )}
                        onClick={() => setSelectedTab('members')}
                      >
                        Members
                      </button>
                    </div>
                  </div>
                  
                  {/* Content based on selected tab */}
                  {selectedTab === 'chat' && (
                    <>
                      {/* Messages */}
                      <div className="flex-1 overflow-y-auto p-4">
                        <div className="space-y-4">
                          {teamMessages.map(message => (
                            <div key={message.id} className="relative group">
                              <div className="flex items-start">
                                <img 
                                  src={message.sender.avatar} 
                                  alt={message.sender.name} 
                                  className="h-8 w-8 rounded-full object-cover mr-3"
                                />
                                <div className="flex-1">
                                  <div className="flex items-baseline">
                                    <span className="font-medium text-gray-900 dark:text-white text-sm">
                                      {message.sender.name}
                                    </span>
                                    <span className="ml-2 text-xs text-gray-500 dark:text-gray-400">
                                      {formatMessageTime(message.timestamp)}
                                    </span>
                                  </div>
                                  <div className="mt-1 text-gray-700 dark:text-gray-300 text-sm">
                                    {message.content}
                                  </div>
                                  
                                  {/* Reactions */}
                                  {message.reactions && message.reactions.length > 0 && (
                                    <div className="flex flex-wrap gap-1 mt-2">
                                      {message.reactions.map((reaction, index) => (
                                        <button
                                          key={index}
                                          className={cn(
                                            "inline-flex items-center px-1.5 py-0.5 rounded-full text-xs border",
                                            reaction.users.includes(currentUserId)
                                              ? "bg-primary-50 dark:bg-primary-900/20 border-primary-200 dark:border-primary-800 text-primary-700 dark:text-primary-300"
                                              : "bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300"
                                          )}
                                          onClick={() => handleReactionClick(message.id, reaction.emoji)}
                                        >
                                          {reaction.emoji} {reaction.users.length}
                                        </button>
                                      ))}
                                    </div>
                                  )}
                                </div>
                                
                                {/* Reaction button */}
                                <button 
                                  className="opacity-0 group-hover:opacity-100 p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-opacity"
                                  onClick={() => {
                                    setSelectedMessageForReaction(message.id);
                                    setEmojiPickerVisible(true);
                                  }}
                                >
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                  </svg>
                                </button>
                              </div>
                              
                              {/* Emoji picker */}
                              {emojiPickerVisible && selectedMessageForReaction === message.id && (
                                <div className="absolute top-0 right-0 mt-8 bg-white dark:bg-gray-800 shadow-lg rounded-lg p-2 z-10 border border-gray-200 dark:border-gray-700">
                                  <div className="flex space-x-1">
                                    {availableEmojis.map((emoji, index) => (
                                      <button
                                        key={index}
                                        className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
                                        onClick={() => handleReactionClick(message.id, emoji)}
                                      >
                                        {emoji}
                                      </button>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                          ))}
                          <div ref={messageEndRef} />
                        </div>
                      </div>
                      
                      {/* Message Input */}
                      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                        <form onSubmit={handleSendMessage}>
                          <div className="relative">
                            <input
                              type="text"
                              placeholder="Type your message..."
                              value={newMessage}
                              onChange={(e) => setNewMessage(e.target.value)}
                              className="w-full pl-4 pr-10 py-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500"
                            />
                            <button
                              type="submit"
                              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-primary-500 hover:text-primary-600 dark:text-primary-400 dark:hover:text-primary-300"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                              </svg>
                            </button>
                          </div>
                        </form>
                      </div>
                    </>
                  )}
                  
                  {selectedTab === 'files' && (
                    <div className="flex-1 p-6 overflow-y-auto">
                      <div className="text-center py-10">
                        <div className="mx-auto w-16 h-16 flex items-center justify-center rounded-full bg-gray-100 dark:bg-gray-700">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-500 dark:text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                        </div>
                        <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">No files yet</h3>
                        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400 max-w-md mx-auto">
                          Share documents, images, and other files with your team. Files shared in this space will appear here.
                        </p>
                        <div className="mt-6">
                          <button 
                            className="px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-md text-sm font-medium transition-colors duration-200 inline-flex items-center"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                            </svg>
                            Upload File
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {selectedTab === 'members' && (
                    <div className="flex-1 p-6 overflow-y-auto">
                      <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Team Members</h3>
                      <div className="space-y-2">
                        {selectedTeam.memberDetails.map(member => (
                          <div key={member.id} className="flex items-center p-3 rounded-lg border border-gray-200 dark:border-gray-700">
                            <img 
                              src={member.avatar} 
                              alt={member.name} 
                              className="h-10 w-10 rounded-full object-cover"
                            />
                            <div className="ml-3 flex-1">
                              <div className="flex items-center justify-between">
                                <div>
                                  <h4 className="text-sm font-medium text-gray-800 dark:text-white">{member.name}</h4>
                                  <p className="text-xs text-gray-500 dark:text-gray-400">{member.role}</p>
                                </div>
                                <span className={cn(
                                  "px-2 py-1 text-xs rounded-full",
                                  member.online 
                                    ? "bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-400" 
                                    : "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-400"
                                )}>
                                  {member.online ? 'Online' : 'Offline'}
                                </span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="mt-6 flex justify-center">
                        <button 
                          className="px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-md text-sm font-medium transition-colors duration-200 inline-flex items-center"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                          </svg>
                          Add Member
                        </button>
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center">
                  <div className="text-center p-8 max-w-md">
                    <div className="mx-auto w-16 h-16 flex items-center justify-center rounded-full bg-primary-100 dark:bg-primary-900/30">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary-600 dark:text-primary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                    </div>
                    <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">Select a Team</h3>
                    <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                      Choose a team from the sidebar to view its chat, files, and members.
                    </p>
                    <div className="mt-6">
                      <button 
                        className="px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-md text-sm font-medium transition-colors duration-200"
                      >
                        Create New Team
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default TeamSpacesPage;
