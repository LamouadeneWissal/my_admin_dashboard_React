import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../../components/Sidebar';
import Topbar from '../../components/Topbar';
import { cn } from '../../lib/utils';
import { users, messagesApi } from '../../data/communications';

const MessagesPage = () => {
  const navigate = useNavigate();
  const messageEndRef = useRef(null);
  const [currentUserId, setCurrentUserId] = useState('user-1'); // Simulating logged-in user
  const [conversations, setConversations] = useState([]);
  const [selectedConversationId, setSelectedConversationId] = useState(null);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [newMessage, setNewMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [showNewMessageModal, setShowNewMessageModal] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [availableUsers, setAvailableUsers] = useState([]);

  // Load conversations
  useEffect(() => {
    const userConversations = messagesApi.getConversationsForUser(currentUserId);
    setConversations(userConversations);
    
    // Set available users for new conversations (excluding current user)
    setAvailableUsers(users.filter(user => user.id !== currentUserId));

    // Select first conversation by default if none is selected
    if (userConversations.length > 0 && !selectedConversationId) {
      handleSelectConversation(userConversations[0].id);
    }
  }, [currentUserId]);

  // Load selected conversation
  useEffect(() => {
    if (selectedConversationId) {
      const conversation = messagesApi.getConversation(selectedConversationId);
      if (conversation) {
        setSelectedConversation(conversation);
        // Mark as read when selecting conversation
        messagesApi.markAsRead(selectedConversationId, currentUserId);
      }
    } else {
      setSelectedConversation(null);
    }
  }, [selectedConversationId, currentUserId]);

  // Scroll to bottom of messages
  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [selectedConversation]);

  const handleSelectConversation = (conversationId) => {
    setSelectedConversationId(conversationId);
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    
    if (!newMessage.trim() || !selectedConversationId) return;
    
    messagesApi.sendMessage(selectedConversationId, currentUserId, newMessage);
    
    // Update the conversation list and selected conversation
    const updatedConversations = messagesApi.getConversationsForUser(currentUserId);
    setConversations(updatedConversations);
    setSelectedConversation(messagesApi.getConversation(selectedConversationId));
    
    setNewMessage('');
  };

  const handleStartNewConversation = () => {
    if (selectedUsers.length === 0) return;
    
    // For simplicity, just create a conversation with the first selected user
    const otherUserId = selectedUsers[0];
    
    const newConv = messagesApi.createConversation([currentUserId, otherUserId], {
      senderId: currentUserId,
      content: 'Hello there!'
    });
    
    // Update conversations list
    const updatedConversations = messagesApi.getConversationsForUser(currentUserId);
    setConversations(updatedConversations);
    
    // Select the new conversation
    setSelectedConversationId(newConv.id);
    
    // Close modal
    setShowNewMessageModal(false);
    setSelectedUsers([]);
  };

  const handleToggleUserSelect = (userId) => {
    if (selectedUsers.includes(userId)) {
      setSelectedUsers(selectedUsers.filter(id => id !== userId));
    } else {
      setSelectedUsers([...selectedUsers, userId]);
    }
  };

  const formatMessageTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit'
    });
  };

  // Filter conversations by search query
  const filteredConversations = conversations.filter(conv => 
    conv.otherParticipant.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Topbar />
        
        <main className="flex-1 overflow-hidden bg-gray-50 dark:bg-gray-900 flex">
          {/* Messages Container */}
          <div className="flex w-full h-full">
            {/* Conversations List */}
            <div className="w-full md:w-72 lg:w-80 border-r border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-800 flex flex-col">
              {/* Header */}
              <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                <h2 className="text-lg font-semibold text-gray-800 dark:text-white">Messages</h2>
                <button 
                  className="p-2 rounded-full bg-primary-500 hover:bg-primary-600 text-white"
                  onClick={() => setShowNewMessageModal(true)}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
              
              {/* Search */}
              <div className="p-4">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search messages..."
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
              
              {/* Conversations List */}
              <div className="flex-1 overflow-y-auto">
                {filteredConversations.length === 0 ? (
                  <div className="text-center p-6 text-gray-500 dark:text-gray-400">
                    No conversations found
                  </div>
                ) : (
                  <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                    {filteredConversations.map(conversation => (
                      <li 
                        key={conversation.id} 
                        className={cn(
                          "hover:bg-gray-50 dark:hover:bg-gray-750 cursor-pointer",
                          selectedConversationId === conversation.id ? "bg-primary-50 dark:bg-primary-900/20" : ""
                        )}
                        onClick={() => handleSelectConversation(conversation.id)}
                      >
                        <div className="flex items-center p-4">
                          {/* Avatar */}
                          <div className="relative">
                            <img 
                              src={conversation.otherParticipant.avatar} 
                              alt={conversation.otherParticipant.name} 
                              className="h-10 w-10 rounded-full object-cover"
                            />
                            {conversation.otherParticipant.online && (
                              <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 border-2 border-white dark:border-gray-800"></span>
                            )}
                          </div>
                          
                          {/* Message Info */}
                          <div className="ml-3 flex-1 min-w-0">
                            <div className="flex justify-between items-baseline">
                              <h3 className={cn(
                                "text-sm font-semibold truncate",
                                conversation.unreadCount ? "text-gray-900 dark:text-white" : "text-gray-700 dark:text-gray-300"
                              )}>
                                {conversation.otherParticipant.name}
                              </h3>
                              <span className="text-xs text-gray-500 dark:text-gray-400">
                                {conversation.lastMessage && formatMessageTime(conversation.lastMessage.timestamp)}
                              </span>
                            </div>
                            <div className="flex items-center">
                              <p className={cn(
                                "text-xs truncate flex-1",
                                conversation.unreadCount ? "font-semibold text-gray-800 dark:text-gray-200" : "text-gray-500 dark:text-gray-400"
                              )}>
                                {conversation.lastMessage ? (
                                  conversation.lastMessage.senderId === currentUserId ? (
                                    <span className="text-gray-400 dark:text-gray-500">You: </span>
                                  ) : null
                                ) : null}
                                {conversation.lastMessage ? conversation.lastMessage.content : "No messages yet"}
                              </p>
                              {conversation.unreadCount > 0 && (
                                <span className="ml-2 bg-primary-500 text-white text-xs font-medium px-1.5 py-0.5 rounded-full">
                                  {conversation.unreadCount}
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
            
            {/* Conversation View */}
            <div className="hidden md:flex flex-1 flex-col bg-gray-50 dark:bg-gray-900">
              {selectedConversation ? (
                <>
                  {/* Conversation Header */}
                  <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 flex items-center">
                    <div className="relative">
                      <img 
                        src={selectedConversation.participants.find(id => id !== currentUserId).avatar || 'https://via.placeholder.com/40'} 
                        alt="Avatar" 
                        className="h-10 w-10 rounded-full object-cover"
                      />
                      <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 border-2 border-white dark:border-gray-800"></span>
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-semibold text-gray-800 dark:text-white">
                        {users.find(user => user.id === selectedConversation.participants.find(id => id !== currentUserId))?.name || 'Unknown User'}
                      </h3>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {users.find(user => user.id === selectedConversation.participants.find(id => id !== currentUserId))?.role || 'No role'}
                      </p>
                    </div>
                    <div className="ml-auto flex space-x-2">
                      <button className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                      </button>
                      <button className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                      </button>
                      <button className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                        </svg>
                      </button>
                    </div>
                  </div>
                  
                  {/* Messages */}
                  <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {selectedConversation.messages.map(message => {
                      const isCurrentUser = message.senderId === currentUserId;
                      const sender = users.find(user => user.id === message.senderId);
                      
                      return (
                        <div 
                          key={message.id} 
                          className={cn(
                            "flex",
                            isCurrentUser ? "justify-end" : "justify-start"
                          )}
                        >
                          <div className="flex items-end">
                            {!isCurrentUser && (
                              <img 
                                src={sender?.avatar || 'https://via.placeholder.com/32'} 
                                alt="Avatar" 
                                className="h-8 w-8 rounded-full object-cover mr-2 mb-1"
                              />
                            )}
                            <div className={cn(
                              "max-w-xs px-4 py-2 rounded-lg",
                              isCurrentUser 
                                ? "bg-primary-500 text-white" 
                                : "bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 border border-gray-200 dark:border-gray-700"
                            )}>
                              <p className="text-sm">{message.content}</p>
                              <span className={cn(
                                "text-xs block mt-1",
                                isCurrentUser 
                                  ? "text-primary-100" 
                                  : "text-gray-500 dark:text-gray-400"
                              )}>
                                {formatMessageTime(message.timestamp)}
                              </span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                    <div ref={messageEndRef} />
                  </div>
                  
                  {/* Message Input */}
                  <div className="p-4 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
                    <form onSubmit={handleSendMessage} className="flex items-center">
                      <button 
                        type="button"
                        className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400 mr-2"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                        </svg>
                      </button>
                      <input
                        type="text"
                        placeholder="Type your message..."
                        className="flex-1 px-4 py-2 rounded-full border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                      />
                      <button 
                        type="submit"
                        className="p-2 ml-2 rounded-full bg-primary-500 hover:bg-primary-600 text-white disabled:opacity-50"
                        disabled={!newMessage.trim()}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                        </svg>
                      </button>
                    </form>
                  </div>
                </>
              ) : (
                <div className="flex flex-col items-center justify-center h-full">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-300 dark:text-gray-600 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                  <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300">No conversation selected</h3>
                  <p className="text-gray-500 dark:text-gray-400 mt-1 text-center max-w-md px-6">
                    Select a conversation from the list or start a new one.
                  </p>
                  <button
                    onClick={() => setShowNewMessageModal(true)}
                    className="mt-4 px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-md text-sm font-medium transition-colors duration-200"
                  >
                    Start a new conversation
                  </button>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
      
      {/* New Message Modal */}
      {showNewMessageModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg w-full max-w-md mx-4">
            <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
              <h3 className="text-lg font-medium text-gray-800 dark:text-white">New Message</h3>
              <button 
                onClick={() => {
                  setShowNewMessageModal(false);
                  setSelectedUsers([]);
                }}
                className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 focus:outline-none"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
            
            <div className="p-4">
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Select users to message
                </label>
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {availableUsers.map(user => (
                    <div 
                      key={user.id} 
                      className="flex items-center p-2 hover:bg-gray-50 dark:hover:bg-gray-750 rounded-lg cursor-pointer"
                      onClick={() => handleToggleUserSelect(user.id)}
                    >
                      <div className="flex items-center flex-1">
                        <div className="relative">
                          <img 
                            src={user.avatar} 
                            alt={user.name} 
                            className="h-10 w-10 rounded-full object-cover"
                          />
                          {user.online && (
                            <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-green-500 border-2 border-white dark:border-gray-800"></span>
                          )}
                        </div>
                        <div className="ml-3">
                          <p className="text-sm font-medium text-gray-800 dark:text-white">{user.name}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">{user.role}</p>
                        </div>
                      </div>
                      <div className="flex-shrink-0">
                        <input 
                          type="checkbox"
                          checked={selectedUsers.includes(user.id)}
                          onChange={() => {}}
                          className="h-5 w-5 text-primary-500 border-gray-300 rounded focus:ring-primary-500"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="flex justify-end space-x-3 mt-4">
                <button
                  onClick={() => {
                    setShowNewMessageModal(false);
                    setSelectedUsers([]);
                  }}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 text-sm font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={handleStartNewConversation}
                  disabled={selectedUsers.length === 0}
                  className="px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-md text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Start Conversation
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MessagesPage;
