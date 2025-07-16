// Sample project data with common project fields
export const projects = [
  {
    id: 'project-1',
    name: 'Website Redesign',
    description: 'Complete overhaul of the company website with new design system',
    startDate: new Date(2025, 5, 15), // June 15, 2025
    dueDate: new Date(2025, 7, 30), // August 30, 2025
    status: 'active',
    progress: 65,
    manager: 'Alice Johnson',
    members: ['Alice Johnson', 'Bob Smith', 'Carlos Diaz', 'Dana Lee'],
    priority: 'high',
    category: 'Development',
    tags: ['website', 'frontend', 'design']
  },
  {
    id: 'project-2',
    name: 'Mobile App Development',
    description: 'Create a new mobile application for customer engagement',
    startDate: new Date(2025, 6, 1), // July 1, 2025
    dueDate: new Date(2025, 9, 15), // October 15, 2025
    status: 'active',
    progress: 30,
    manager: 'Bob Smith',
    members: ['Bob Smith', 'Dana Lee', 'Fiona Chen'],
    priority: 'high',
    category: 'Development',
    tags: ['mobile', 'app', 'ios', 'android']
  },
  {
    id: 'project-3',
    name: 'Marketing Campaign',
    description: 'Q3 marketing campaign for new product launch',
    startDate: new Date(2025, 6, 10), // July 10, 2025
    dueDate: new Date(2025, 7, 15), // August 15, 2025
    status: 'active',
    progress: 45,
    manager: 'Fiona Chen',
    members: ['Fiona Chen', 'Greg Taylor', 'Eddie Wilson'],
    priority: 'medium',
    category: 'Marketing',
    tags: ['campaign', 'social media', 'advertising']
  },
  {
    id: 'project-4',
    name: 'Data Analysis Platform',
    description: 'Internal tool for analyzing customer data and generating insights',
    startDate: new Date(2025, 5, 1), // June 1, 2025
    dueDate: new Date(2025, 7, 1), // August 1, 2025
    status: 'active',
    progress: 80,
    manager: 'Carlos Diaz',
    members: ['Carlos Diaz', 'Alice Johnson', 'Eddie Wilson'],
    priority: 'medium',
    category: 'Analytics',
    tags: ['data', 'analysis', 'dashboard']
  },
  {
    id: 'project-5',
    name: 'Documentation Update',
    description: 'Update all product documentation and create user guides',
    startDate: new Date(2025, 6, 5), // July 5, 2025
    dueDate: new Date(2025, 6, 25), // July 25, 2025
    status: 'active',
    progress: 15,
    manager: 'Eddie Wilson',
    members: ['Eddie Wilson', 'Greg Taylor'],
    priority: 'low',
    category: 'Documentation',
    tags: ['docs', 'guides', 'knowledge base']
  }
];

// Project statuses
export const projectStatuses = [
  { value: 'planning', label: 'Planning' },
  { value: 'active', label: 'Active' },
  { value: 'onHold', label: 'On Hold' },
  { value: 'completed', label: 'Completed' },
  { value: 'cancelled', label: 'Cancelled' }
];

// Project priorities
export const projectPriorities = [
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'high', label: 'High' },
  { value: 'critical', label: 'Critical' }
];

// Common project categories
export const projectCategories = [
  'Development',
  'Design',
  'Marketing',
  'Research',
  'Analytics',
  'Operations',
  'Documentation',
  'Testing',
  'Infrastructure'
];

// Helper functions
export const getProjectById = (projectId) => {
  return projects.find(project => project.id === projectId);
};

export const getProjectsByMember = (memberName) => {
  return projects.filter(project => project.members.includes(memberName));
};

export const getProjectsByStatus = (status) => {
  return projects.filter(project => project.status === status);
};

// Function to delete a project - this modifies the original projects array
export const deleteProject = (projectId) => {
  const index = projects.findIndex(project => project.id === projectId);
  if (index !== -1) {
    projects.splice(index, 1);
    return true;
  }
  return false;
};
