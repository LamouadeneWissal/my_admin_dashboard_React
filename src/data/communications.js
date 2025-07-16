/**
 * Communications Data Module
 * 
 * This file contains mock data for the Communication Tools section:
 * - Messages: Internal messaging system
 * - Announcements: Broadcast announcements
 * - Team Spaces: Collaboration spaces for teams
 * - Email/SMS Integration: Email and SMS templates and settings
 */

import { v4 as uuidv4 } from 'uuid';

// Generate a date in the past (for created_at timestamps)
const generatePastDate = (daysAgo) => {
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);
  return date;
};

// Mock users for communications
export const users = [
  { 
    id: 'user-1',
    name: 'John Smith',
    avatar: 'https://randomuser.me/api/portraits/men/41.jpg',
    email: 'john.smith@example.com',
    role: 'Admin',
    online: true,
  },
  { 
    id: 'user-2',
    name: 'Sarah Johnson',
    avatar: 'https://randomuser.me/api/portraits/women/33.jpg',
    email: 'sarah.johnson@example.com',
    role: 'Product Manager',
    online: true,
  },
  { 
    id: 'user-3',
    name: 'Michael Brown',
    avatar: 'https://randomuser.me/api/portraits/men/15.jpg',
    email: 'michael.brown@example.com',
    role: 'Developer',
    online: false,
    lastSeen: generatePastDate(0.25), // Few hours ago
  },
  { 
    id: 'user-4',
    name: 'Emily Davis',
    avatar: 'https://randomuser.me/api/portraits/women/65.jpg',
    email: 'emily.davis@example.com',
    role: 'Designer',
    online: true,
  },
  { 
    id: 'user-5',
    name: 'Robert Wilson',
    avatar: 'https://randomuser.me/api/portraits/men/22.jpg',
    email: 'robert.wilson@example.com',
    role: 'Marketing',
    online: false,
    lastSeen: generatePastDate(1), // 1 day ago
  }
];

// Mock teams for team spaces
export const teams = [
  {
    id: 'team-1',
    name: 'Development Team',
    description: 'Software development and engineering',
    avatar: '💻',
    members: ['user-1', 'user-3', 'user-4'],
    createdAt: generatePastDate(60),
  },
  {
    id: 'team-2',
    name: 'Marketing & Sales',
    description: 'Marketing strategies and sales operations',
    avatar: '📈',
    members: ['user-2', 'user-5'],
    createdAt: generatePastDate(45),
  },
  {
    id: 'team-3',
    name: 'Product Management',
    description: 'Product roadmap and feature planning',
    avatar: '🔍',
    members: ['user-1', 'user-2', 'user-4'],
    createdAt: generatePastDate(30),
  },
  {
    id: 'team-4',
    name: 'Design Team',
    description: 'UX/UI design and visual assets',
    avatar: '🎨',
    members: ['user-4', 'user-5'],
    createdAt: generatePastDate(20),
  }
];

// Mock conversations for the messaging system
export const conversations = [
  {
    id: 'conv-1',
    participants: ['user-1', 'user-2'],
    unreadCount: 2,
    lastMessage: {
      id: 'msg-101',
      senderId: 'user-2',
      content: 'When can we discuss the Q3 roadmap?',
      timestamp: generatePastDate(0.05), // Few hours ago
      read: false
    },
    messages: [
      {
        id: 'msg-100',
        senderId: 'user-1',
        content: 'Hi Sarah, do you have the latest product metrics?',
        timestamp: generatePastDate(0.1),
        read: true
      },
      {
        id: 'msg-101',
        senderId: 'user-2',
        content: 'When can we discuss the Q3 roadmap?',
        timestamp: generatePastDate(0.05),
        read: false
      }
    ]
  },
  {
    id: 'conv-2',
    participants: ['user-1', 'user-3'],
    unreadCount: 0,
    lastMessage: {
      id: 'msg-202',
      senderId: 'user-1',
      content: 'Great work on the new feature implementation!',
      timestamp: generatePastDate(1.2),
      read: true
    },
    messages: [
      {
        id: 'msg-200',
        senderId: 'user-3',
        content: 'I\'ve pushed the latest code changes. Can you review?',
        timestamp: generatePastDate(1.5),
        read: true
      },
      {
        id: 'msg-201',
        senderId: 'user-1',
        content: 'I\'ll take a look this afternoon.',
        timestamp: generatePastDate(1.3),
        read: true
      },
      {
        id: 'msg-202',
        senderId: 'user-1',
        content: 'Great work on the new feature implementation!',
        timestamp: generatePastDate(1.2),
        read: true
      }
    ]
  },
  {
    id: 'conv-3',
    participants: ['user-1', 'user-4'],
    unreadCount: 1,
    lastMessage: {
      id: 'msg-301',
      senderId: 'user-4',
      content: 'I\'ve uploaded the new dashboard mockups to Figma.',
      timestamp: generatePastDate(0.3),
      read: false
    },
    messages: [
      {
        id: 'msg-300',
        senderId: 'user-1',
        content: 'Emily, when will the design mockups be ready?',
        timestamp: generatePastDate(0.4),
        read: true
      },
      {
        id: 'msg-301',
        senderId: 'user-4',
        content: 'I\'ve uploaded the new dashboard mockups to Figma.',
        timestamp: generatePastDate(0.3),
        read: false
      }
    ]
  }
];

// Mock team chat messages for collaboration spaces
export const teamMessages = {
  'team-1': [
    {
      id: uuidv4(),
      senderId: 'user-1',
      content: 'Team, our sprint planning is scheduled for tomorrow at 10am.',
      timestamp: generatePastDate(0.8),
      reactions: [
        { emoji: '👍', users: ['user-3'] },
        { emoji: '✅', users: ['user-4'] }
      ]
    },
    {
      id: uuidv4(),
      senderId: 'user-3',
      content: 'I\'ve found a bug in the login system. Created ticket #452 to track it.',
      timestamp: generatePastDate(0.5),
      reactions: [
        { emoji: '🐛', users: ['user-1'] }
      ]
    },
    {
      id: uuidv4(),
      senderId: 'user-4',
      content: 'The new UI components are ready for review. Here\'s the link: [Figma Link]',
      timestamp: generatePastDate(0.2),
      reactions: [
        { emoji: '🎉', users: ['user-1', 'user-3'] }
      ]
    }
  ],
  'team-2': [
    {
      id: uuidv4(),
      senderId: 'user-5',
      content: 'The Q3 marketing campaign is ready to launch next week.',
      timestamp: generatePastDate(1.2),
      reactions: [
        { emoji: '🚀', users: ['user-2'] }
      ]
    },
    {
      id: uuidv4(),
      senderId: 'user-2',
      content: 'Sales numbers for June are looking great! We\'re up 15% from last month.',
      timestamp: generatePastDate(0.9),
      reactions: [
        { emoji: '📈', users: ['user-5'] },
        { emoji: '🎉', users: ['user-5'] }
      ]
    }
  ],
  'team-3': [
    {
      id: uuidv4(),
      senderId: 'user-1',
      content: 'Updated the product roadmap for Q4. Please review by Friday.',
      timestamp: generatePastDate(2.5),
      reactions: [
        { emoji: '👍', users: ['user-2'] }
      ]
    },
    {
      id: uuidv4(),
      senderId: 'user-2',
      content: 'Customer feedback analysis is ready. Top request: improved dashboard filters.',
      timestamp: generatePastDate(1.5),
      reactions: [
        { emoji: '👀', users: ['user-1'] },
        { emoji: '📊', users: ['user-4'] }
      ]
    },
    {
      id: uuidv4(),
      senderId: 'user-4',
      content: 'Design concepts for the new dashboard filters are almost ready.',
      timestamp: generatePastDate(0.7),
      reactions: []
    }
  ],
  'team-4': [
    {
      id: uuidv4(),
      senderId: 'user-4',
      content: 'New brand guidelines have been finalized. I\'ll share the document later today.',
      timestamp: generatePastDate(1.2),
      reactions: [
        { emoji: '👏', users: ['user-5'] }
      ]
    },
    {
      id: uuidv4(),
      senderId: 'user-5',
      content: 'Need help with the marketing landing page design. Anyone available?',
      timestamp: generatePastDate(0.4),
      reactions: [
        { emoji: '🙋‍♀️', users: ['user-4'] }
      ]
    }
  ]
};

// Mock announcements
export const announcements = [
  {
    id: 'ann-1',
    title: 'Office Closure - July 15th',
    content: 'Please note that the office will be closed on July 15th for building maintenance. All employees are encouraged to work from home that day.',
    author: 'user-1',
    createdAt: generatePastDate(2),
    important: true,
    audience: 'all',
    hasAttachment: false,
    readBy: ['user-2', 'user-3']
  },
  {
    id: 'ann-2',
    title: 'New Product Launch: Dashboard 2.0',
    content: 'We\'re excited to announce that Dashboard 2.0 will be launching next week! This update includes all the features and improvements we\'ve been working on for the past quarter.',
    author: 'user-2',
    createdAt: generatePastDate(3),
    important: true,
    audience: 'team-3',
    hasAttachment: true,
    attachmentName: 'launch-details.pdf',
    readBy: ['user-1', 'user-4']
  },
  {
    id: 'ann-3',
    title: 'Team Building Event - July 28th',
    content: 'Join us for a fun team building event at Central Park on July 28th from 2pm to 5pm. Activities, food, and drinks will be provided.',
    author: 'user-5',
    createdAt: generatePastDate(4),
    important: false,
    audience: 'all',
    hasAttachment: true,
    attachmentName: 'event-details.docx',
    readBy: ['user-1', 'user-2', 'user-4']
  },
  {
    id: 'ann-4',
    title: 'System Maintenance Notice',
    content: 'The system will undergo maintenance this weekend from Saturday 10pm to Sunday 2am. Some services might be unavailable during this time.',
    author: 'user-1',
    createdAt: generatePastDate(1),
    important: true,
    audience: 'all',
    hasAttachment: false,
    readBy: ['user-3']
  }
];

// Email/SMS templates
export const communicationTemplates = {
  email: [
    {
      id: 'email-1',
      name: 'Welcome Email',
      subject: 'Welcome to Our Platform',
      content: 'Hello {{name}},\n\nWelcome to our platform! We\'re excited to have you on board.\n\nTo get started, click on the link below to set up your account.\n\n{{setupLink}}\n\nIf you have any questions, feel free to reply to this email.\n\nBest,\nThe Team',
      createdAt: generatePastDate(30),
      lastUpdated: generatePastDate(5),
      lastUsed: generatePastDate(0.5),
      category: 'onboarding'
    },
    {
      id: 'email-2',
      name: 'Password Reset',
      subject: 'Password Reset Request',
      content: 'Hello {{name}},\n\nWe received a request to reset your password.\n\nClick the link below to create a new password. This link will expire in 24 hours.\n\n{{resetLink}}\n\nIf you didn\'t request this, please ignore this email.\n\nBest,\nThe Team',
      createdAt: generatePastDate(25),
      lastUpdated: generatePastDate(25),
      lastUsed: generatePastDate(2),
      category: 'account'
    },
    {
      id: 'email-3',
      name: 'Monthly Report',
      subject: 'Your Monthly Activity Report',
      content: 'Hello {{name}},\n\nHere\'s your activity report for the month of {{month}}.\n\n{{reportSummary}}\n\nTo view the full report, click here: {{reportLink}}\n\nBest,\nThe Team',
      createdAt: generatePastDate(15),
      lastUpdated: generatePastDate(10),
      lastUsed: generatePastDate(1),
      category: 'reports'
    }
  ],
  sms: [
    {
      id: 'sms-1',
      name: 'Two-Factor Authentication',
      content: 'Your verification code is: {{code}}. This code will expire in 5 minutes.',
      createdAt: generatePastDate(20),
      lastUpdated: generatePastDate(20),
      lastUsed: generatePastDate(0.1),
      category: 'security'
    },
    {
      id: 'sms-2',
      name: 'Appointment Reminder',
      content: 'Reminder: You have an appointment scheduled for {{date}} at {{time}}. Reply YES to confirm or NO to reschedule.',
      createdAt: generatePastDate(15),
      lastUpdated: generatePastDate(5),
      lastUsed: generatePastDate(3),
      category: 'reminders'
    },
    {
      id: 'sms-3',
      name: 'Alert Notification',
      content: 'ALERT: {{alertType}} detected in your account. Please log in to review or contact support if this wasn\'t you.',
      createdAt: generatePastDate(10),
      lastUpdated: generatePastDate(10),
      lastUsed: generatePastDate(5),
      category: 'security'
    }
  ]
};

// Communication settings
export const communicationSettings = {
  email: {
    provider: 'SMTP',
    server: 'smtp.example.com',
    port: 587,
    useTLS: true,
    fromName: 'System Admin',
    fromEmail: 'noreply@example.com',
    maxDailyEmails: 10000,
    templates: ['email-1', 'email-2', 'email-3']
  },
  sms: {
    provider: 'Twilio',
    accountSid: '[PLACEHOLDER_TWILIO_SID]',
    authToken: '[PLACEHOLDER_TWILIO_TOKEN]',
    fromNumber: '+1555XXXXXXX',
    templates: ['sms-1', 'sms-2', 'sms-3']
  },
  notifications: {
    emailNotifications: true,
    smsNotifications: true,
    emailDigestFrequency: 'daily',
    digestTime: '08:00',
    allowWeekendDigests: false
  }
};

// Helpers for messages
export const messagesApi = {
  // Get all conversations for a user
  getConversationsForUser: (userId) => {
    return conversations.filter(conv => 
      conv.participants.includes(userId)
    ).map(conv => {
      // Find the other participant
      const otherParticipantId = conv.participants.find(id => id !== userId);
      const otherParticipant = users.find(user => user.id === otherParticipantId);
      
      return {
        ...conv,
        otherParticipant
      };
    });
  },
  
  // Get a single conversation
  getConversation: (conversationId) => {
    return conversations.find(conv => conv.id === conversationId);
  },
  
  // Send a message
  sendMessage: (conversationId, senderId, content) => {
    const conversation = conversations.find(conv => conv.id === conversationId);
    if (!conversation) return false;
    
    const newMessage = {
      id: `msg-${Date.now()}`,
      senderId,
      content,
      timestamp: new Date(),
      read: false
    };
    
    conversation.messages.push(newMessage);
    conversation.lastMessage = newMessage;
    
    // Update unread count for other participants
    const otherParticipants = conversation.participants.filter(id => id !== senderId);
    conversation.unreadCount = (conversation.unreadCount || 0) + otherParticipants.length;
    
    return newMessage;
  },
  
  // Mark conversation as read
  markAsRead: (conversationId, userId) => {
    const conversation = conversations.find(conv => conv.id === conversationId);
    if (!conversation) return false;
    
    conversation.messages.forEach(msg => {
      if (msg.senderId !== userId) {
        msg.read = true;
      }
    });
    
    if (conversation.lastMessage && conversation.lastMessage.senderId !== userId) {
      conversation.lastMessage.read = true;
    }
    
    conversation.unreadCount = 0;
    
    return true;
  },
  
  // Get unread count for a user
  getUnreadCountForUser: (userId) => {
    return conversations.reduce((count, conv) => {
      if (conv.participants.includes(userId)) {
        return count + (conv.unreadCount || 0);
      }
      return count;
    }, 0);
  },
  
  // Create a new conversation
  createConversation: (participants, initialMessage) => {
    if (participants.length < 2) return null;
    
    const existingConversation = conversations.find(conv => {
      // Check if participants are the same (for 2 participants)
      if (conv.participants.length === participants.length && 
          participants.every(p => conv.participants.includes(p))) {
        return true;
      }
      return false;
    });
    
    if (existingConversation) {
      if (initialMessage) {
        messagesApi.sendMessage(
          existingConversation.id, 
          initialMessage.senderId, 
          initialMessage.content
        );
      }
      return existingConversation;
    }
    
    const newConversation = {
      id: `conv-${Date.now()}`,
      participants,
      unreadCount: initialMessage ? 1 : 0,
      messages: [],
      lastMessage: null
    };
    
    if (initialMessage) {
      const message = {
        id: `msg-${Date.now()}`,
        senderId: initialMessage.senderId,
        content: initialMessage.content,
        timestamp: new Date(),
        read: false
      };
      
      newConversation.messages.push(message);
      newConversation.lastMessage = message;
    }
    
    conversations.push(newConversation);
    return newConversation;
  }
};

// Helpers for announcements
export const announcementsApi = {
  // Get all announcements for a user
  getAnnouncementsForUser: (userId) => {
    const user = users.find(u => u.id === userId);
    if (!user) return [];
    
    // Get the teams the user belongs to
    const userTeams = teams.filter(team => 
      team.members.includes(userId)
    ).map(team => team.id);
    
    // Return announcements for all users or specific teams the user belongs to
    return announcements.filter(ann => 
      ann.audience === 'all' || userTeams.includes(ann.audience)
    ).map(ann => {
      const author = users.find(u => u.id === ann.author);
      const isRead = ann.readBy.includes(userId);
      
      return {
        ...ann,
        author,
        isRead
      };
    });
  },
  
  // Create a new announcement
  createAnnouncement: (announcement) => {
    const newAnnouncement = {
      id: `ann-${Date.now()}`,
      ...announcement,
      createdAt: new Date(),
      readBy: []
    };
    
    announcements.unshift(newAnnouncement);
    return newAnnouncement;
  },
  
  // Mark announcement as read
  markAnnouncementAsRead: (announcementId, userId) => {
    const announcement = announcements.find(ann => ann.id === announcementId);
    if (!announcement) return false;
    
    if (!announcement.readBy.includes(userId)) {
      announcement.readBy.push(userId);
    }
    
    return true;
  },
  
  // Get unread announcements count for a user
  getUnreadCount: (userId) => {
    const userAnnouncements = announcementsApi.getAnnouncementsForUser(userId);
    return userAnnouncements.filter(ann => !ann.isRead).length;
  }
};

// Helpers for team spaces
export const teamSpacesApi = {
  // Get all teams a user belongs to
  getUserTeams: (userId) => {
    return teams.filter(team => 
      team.members.includes(userId)
    ).map(team => {
      const memberDetails = team.members.map(memberId => 
        users.find(user => user.id === memberId)
      );
      
      return {
        ...team,
        memberDetails
      };
    });
  },
  
  // Get team messages
  getTeamMessages: (teamId) => {
    const messages = teamMessages[teamId] || [];
    
    return messages.map(msg => {
      const sender = users.find(user => user.id === msg.senderId);
      return {
        ...msg,
        sender
      };
    });
  },
  
  // Send a team message
  sendTeamMessage: (teamId, senderId, content) => {
    if (!teamMessages[teamId]) {
      teamMessages[teamId] = [];
    }
    
    const newMessage = {
      id: uuidv4(),
      senderId,
      content,
      timestamp: new Date(),
      reactions: []
    };
    
    teamMessages[teamId].push(newMessage);
    return newMessage;
  },
  
  // Add reaction to a message
  addReaction: (teamId, messageId, userId, emoji) => {
    if (!teamMessages[teamId]) return false;
    
    const message = teamMessages[teamId].find(msg => msg.id === messageId);
    if (!message) return false;
    
    const existingReaction = message.reactions.find(r => r.emoji === emoji);
    if (existingReaction) {
      if (!existingReaction.users.includes(userId)) {
        existingReaction.users.push(userId);
      } else {
        // Remove the user if they've already reacted
        existingReaction.users = existingReaction.users.filter(id => id !== userId);
        if (existingReaction.users.length === 0) {
          // Remove the reaction if no users are left
          message.reactions = message.reactions.filter(r => r.emoji !== emoji);
        }
      }
    } else {
      message.reactions.push({
        emoji,
        users: [userId]
      });
    }
    
    return true;
  }
};

export default {
  users,
  teams,
  conversations,
  announcements,
  messagesApi,
  announcementsApi,
  teamSpacesApi,
  communicationTemplates,
  communicationSettings
};
