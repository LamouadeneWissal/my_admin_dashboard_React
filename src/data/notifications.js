// Sample notifications data with realistic examples
export const notificationsData = [
  {
    id: 'notif-1',
    title: 'New user registered',
    message: 'John Smith has created a new account and needs approval.',
    type: 'user',
    priority: 'medium',
    read: false,
    timestamp: new Date(2025, 6, 12, 14, 32),
    actions: [
      { id: 'approve', label: 'Approve', variant: 'success' },
      { id: 'reject', label: 'Reject', variant: 'danger' },
      { id: 'view', label: 'View Profile', variant: 'info' }
    ]
  },
  {
    id: 'notif-2',
    title: 'System update completed',
    message: 'System update to version 2.5.1 was successfully completed.',
    type: 'system',
    priority: 'low',
    read: false,
    timestamp: new Date(2025, 6, 12, 10, 15),
    actions: [
      { id: 'details', label: 'View Details', variant: 'info' }
    ]
  },
  {
    id: 'notif-3',
    title: 'Critical error detected',
    message: 'Database connection error detected in the production environment.',
    type: 'error',
    priority: 'high',
    read: false,
    timestamp: new Date(2025, 6, 11, 23, 45),
    actions: [
      { id: 'investigate', label: 'Investigate', variant: 'danger' },
      { id: 'ignore', label: 'Ignore', variant: 'secondary' }
    ]
  },
  {
    id: 'notif-4',
    title: 'Task assigned to you',
    message: 'Alice Johnson assigned you a task "Update pricing model".',
    type: 'task',
    priority: 'medium',
    read: true,
    timestamp: new Date(2025, 6, 10, 9, 30),
    actions: [
      { id: 'view-task', label: 'View Task', variant: 'primary' },
      { id: 'mark-done', label: 'Mark as Done', variant: 'success' }
    ]
  },
  {
    id: 'notif-5',
    title: 'Server resources low',
    message: 'Main application server is running at 92% CPU utilization.',
    type: 'system',
    priority: 'high',
    read: true,
    timestamp: new Date(2025, 6, 9, 15, 22),
    actions: [
      { id: 'optimize', label: 'Optimize', variant: 'primary' },
      { id: 'scale', label: 'Scale Resources', variant: 'info' }
    ]
  },
  {
    id: 'notif-6',
    title: 'New comment on your post',
    message: 'Bob Miller commented on your project update from yesterday.',
    type: 'social',
    priority: 'low',
    read: true,
    timestamp: new Date(2025, 6, 9, 11, 42),
    actions: [
      { id: 'reply', label: 'Reply', variant: 'primary' },
      { id: 'view', label: 'View Comment', variant: 'info' }
    ]
  },
  {
    id: 'notif-7',
    title: 'Payment received',
    message: 'Payment of $1,240.00 received from Client XYZ Corp.',
    type: 'financial',
    priority: 'medium',
    read: true,
    timestamp: new Date(2025, 6, 8, 14, 50),
    actions: [
      { id: 'receipt', label: 'View Receipt', variant: 'primary' },
      { id: 'accounting', label: 'Update Accounting', variant: 'secondary' }
    ]
  }
];

// Helper functions for notifications
export const getUnreadCount = () => {
  return notificationsData.filter(notif => !notif.read).length;
};

export const markAsRead = (notificationId) => {
  const notification = notificationsData.find(n => n.id === notificationId);
  if (notification) {
    notification.read = true;
    return true;
  }
  return false;
};

export const markAllAsRead = () => {
  notificationsData.forEach(notification => {
    notification.read = true;
  });
};

export const deleteNotification = (notificationId) => {
  const index = notificationsData.findIndex(n => n.id === notificationId);
  if (index !== -1) {
    notificationsData.splice(index, 1);
    return true;
  }
  return false;
};

export const getNotificationsByType = (type) => {
  if (type === 'all') return [...notificationsData];
  return notificationsData.filter(notif => notif.type === type);
};

export const getNotificationsByPriority = (priority) => {
  if (priority === 'all') return [...notificationsData];
  return notificationsData.filter(notif => notif.priority === priority);
};

// Notification types with icons and colors
export const notificationTypes = [
  { value: 'all', label: 'All', iconColor: 'text-gray-500' },
  { value: 'system', label: 'System', iconColor: 'text-blue-500' },
  { value: 'user', label: 'User', iconColor: 'text-green-500' },
  { value: 'task', label: 'Task', iconColor: 'text-purple-500' },
  { value: 'error', label: 'Error', iconColor: 'text-red-500' },
  { value: 'financial', label: 'Financial', iconColor: 'text-yellow-500' },
  { value: 'social', label: 'Social', iconColor: 'text-pink-500' }
];

// Notification priorities with colors
export const notificationPriorities = [
  { value: 'all', label: 'All Priorities' },
  { value: 'high', label: 'High', color: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300' },
  { value: 'medium', label: 'Medium', color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300' },
  { value: 'low', label: 'Low', color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300' }
];
