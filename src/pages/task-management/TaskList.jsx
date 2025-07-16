import React, { useState, useEffect } from 'react';
import { cn } from '../../lib/utils';
import Sidebar from '../../components/Sidebar';
import Topbar from '../../components/Topbar';

// Import project data
import { projects as initialProjects, getProjectById, deleteProject } from '../../data/projects';

// Sample initial data for tasks
const initialTasks = [
  { id: 'task-1', content: 'Update user dashboard UI', assignedTo: 'Alice Johnson', dueDate: new Date(2025, 6, 15), priority: 'high', status: 'todo', projectId: 'project-1' },
  { id: 'task-2', content: 'Fix login page responsiveness', assignedTo: 'Bob Smith', dueDate: new Date(2025, 6, 16), priority: 'medium', status: 'todo', projectId: 'project-1' },
  { id: 'task-3', content: 'Add data visualization charts', assignedTo: 'Carlos Diaz', dueDate: new Date(2025, 6, 14), priority: 'high', status: 'inProgress', projectId: 'project-4' },
  { id: 'task-4', content: 'Implement dark mode toggle', assignedTo: 'Dana Lee', dueDate: new Date(2025, 6, 18), priority: 'low', status: 'inProgress', projectId: 'project-1' },
  { id: 'task-5', content: 'Create admin documentation', assignedTo: 'Eddie Wilson', dueDate: new Date(2025, 6, 17), priority: 'medium', status: 'review', projectId: 'project-5' },
  { id: 'task-6', content: 'Set up analytics tracking', assignedTo: 'Fiona Chen', dueDate: new Date(2025, 6, 19), priority: 'high', status: 'done', projectId: 'project-3' },
  { id: 'task-7', content: 'User testing coordination', assignedTo: 'Greg Taylor', dueDate: new Date(2025, 6, 20), priority: 'medium', status: 'done', projectId: 'project-2' },
];

// Sample users for assignment
const users = [
  { id: 'user-1', name: 'Alice Johnson', avatar: '👩‍💼', role: 'Designer' },
  { id: 'user-2', name: 'Bob Smith', avatar: '👨‍💻', role: 'Developer' },
  { id: 'user-3', name: 'Carlos Diaz', avatar: '👨‍🔧', role: 'DevOps' },
  { id: 'user-4', name: 'Dana Lee', avatar: '👩‍💻', role: 'Developer' },
  { id: 'user-5', name: 'Eddie Wilson', avatar: '📝', role: 'Content' },
  { id: 'user-6', name: 'Fiona Chen', avatar: '📊', role: 'Analyst' },
  { id: 'user-7', name: 'Greg Taylor', avatar: '🧪', role: 'QA' },
];

const TaskList = () => {
  const [tasks, setTasks] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [projects, setProjects] = useState(initialProjects);
  const [newTask, setNewTask] = useState({
    content: '',
    assignedTo: '',
    dueDate: '',
    priority: 'medium',
    status: 'todo',
    projectId: ''
  });
  const [editingTask, setEditingTask] = useState(null);
  const [selectedProject, setSelectedProject] = useState('all');
  const [showProjectModal, setShowProjectModal] = useState(false);
  const [newProject, setNewProject] = useState({
    name: '',
    description: '',
    startDate: '',
    dueDate: '',
    status: 'active',
    priority: 'medium',
    manager: '',
    members: [],
    category: 'Development',
    tags: []
  });
  
  // Filters
  const [filters, setFilters] = useState({
    status: 'all',
    priority: 'all',
    assignee: 'all',
    project: 'all',
    search: ''
  });
  
  // Sort
  const [sortOption, setSortOption] = useState('dueDate-asc');

  // Initialize tasks
  useEffect(() => {
    setTasks(initialTasks);
    setFilteredTasks(initialTasks);
  }, []);

  // Apply filters and sort whenever tasks or filters change
  useEffect(() => {
    let result = [...tasks];
    
    // Apply status filter
    if (filters.status !== 'all') {
      result = result.filter(task => task.status === filters.status);
    }
    
    // Apply priority filter
    if (filters.priority !== 'all') {
      result = result.filter(task => task.priority === filters.priority);
    }
    
    // Apply assignee filter
    if (filters.assignee !== 'all') {
      result = result.filter(task => task.assignedTo === filters.assignee);
    }
    
    // Apply project filter
    if (filters.project !== 'all') {
      result = result.filter(task => task.projectId === filters.project);
    }
    
    // Apply search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      result = result.filter(task => 
        task.content.toLowerCase().includes(searchLower) ||
        task.assignedTo?.toLowerCase().includes(searchLower)
      );
    }
    
    // Apply sorting
    const [sortBy, sortOrder] = sortOption.split('-');
    
    result.sort((a, b) => {
      let comparison = 0;
      
      if (sortBy === 'dueDate') {
        comparison = a.dueDate - b.dueDate;
      } else if (sortBy === 'priority') {
        const priorityValues = { high: 3, medium: 2, low: 1 };
        comparison = priorityValues[a.priority] - priorityValues[b.priority];
      } else if (sortBy === 'status') {
        const statusValues = { todo: 1, inProgress: 2, review: 3, done: 4 };
        comparison = statusValues[a.status] - statusValues[b.status];
      } else if (sortBy === 'content') {
        comparison = a.content.localeCompare(b.content);
      }
      
      return sortOrder === 'asc' ? comparison : -comparison;
    });
    
    setFilteredTasks(result);
  }, [tasks, filters, sortOption]);

  // Handle form input changes for new task
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewTask(prev => ({ ...prev, [name]: value }));
  };

  // Add new task
  const handleAddTask = () => {
    if (!newTask.content.trim()) return;
    if (!newTask.projectId) {
      alert('Please select a project for this task.');
      return;
    }

    const taskId = `task-${Date.now()}`;
    const createdTask = {
      id: taskId,
      content: newTask.content,
      assignedTo: newTask.assignedTo,
      dueDate: new Date(newTask.dueDate),
      priority: newTask.priority,
      status: newTask.status,
      projectId: newTask.projectId
    };

    setTasks(prev => [...prev, createdTask]);

    // Reset form
    setNewTask({
      content: '',
      assignedTo: '',
      dueDate: '',
      priority: 'medium',
      status: 'todo',
      projectId: selectedProject !== 'all' ? selectedProject : ''
    });
  };

  // Edit task
  const handleEditTask = (task) => {
    setEditingTask({...task, dueDate: task.dueDate.toISOString().split('T')[0]});
  };

  // Save edited task
  const handleSaveEdit = () => {
    if (!editingTask.content.trim()) return;

    const updatedTask = {
      ...editingTask,
      dueDate: new Date(editingTask.dueDate)
    };

    // Update tasks
    setTasks(prev => prev.map(task => 
      task.id === updatedTask.id ? updatedTask : task
    ));

    // Reset editing state
    setEditingTask(null);
  };

  // Delete task
  const handleDeleteTask = (taskId) => {
    setTasks(prev => prev.filter(task => task.id !== taskId));
    
    // Clear editing state if needed
    if (editingTask && editingTask.id === taskId) {
      setEditingTask(null);
    }
  };
  
  // Delete project
  const handleDeleteProject = (projectId) => {
    // First, check if there are any tasks associated with this project
    const tasksInProject = tasks.filter(task => task.projectId === projectId);
    
    if (tasksInProject.length > 0) {
      if (window.confirm(`This project has ${tasksInProject.length} task(s). Deleting it will also remove all associated tasks. Continue?`)) {
        // Delete project from global projects array (for other components)
        deleteProject(projectId);
        
        // Update local projects state
        setProjects(prev => prev.filter(project => project.id !== projectId));
        
        // Remove all tasks associated with the project
        setTasks(prev => prev.filter(task => task.projectId !== projectId));
        
        // Reset selected project if it was the deleted one
        if (selectedProject === projectId) {
          setSelectedProject('all');
        }
      }
    } else {
      // No tasks associated, just confirm deletion
      if (window.confirm('Are you sure you want to delete this project?')) {
        // Delete project from global projects array (for other components)
        deleteProject(projectId);
        
        // Update local projects state
        setProjects(prev => prev.filter(project => project.id !== projectId));
        
        // Reset selected project if it was the deleted one
        if (selectedProject === projectId) {
          setSelectedProject('all');
        }
      }
    }
  };

  // Handle filter changes
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  // Clear all filters
  const clearFilters = () => {
    setFilters({
      status: 'all',
      priority: 'all',
      assignee: 'all',
      project: 'all',
      search: ''
    });
    setSortOption('dueDate-asc');
  };

  // Get status badge
  const getStatusBadge = (status) => {
    const statusConfig = {
      todo: { color: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300', label: 'To Do' },
      inProgress: { color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300', label: 'In Progress' },
      review: { color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300', label: 'Review' },
      done: { color: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300', label: 'Done' }
    };
    
    return (
      <span className={cn(
        "px-2 py-1 text-xs font-medium rounded-full", 
        statusConfig[status].color
      )}>
        {statusConfig[status].label}
      </span>
    );
  };

  // Get priority badge
  const getPriorityBadge = (priority) => {
    const priorityConfig = {
      low: { color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300' },
      medium: { color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300' },
      high: { color: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300' }
    };
    
    return (
      <span className={cn(
        "px-2 py-1 text-xs font-medium rounded-full", 
        priorityConfig[priority].color
      )}>
        {priority.charAt(0).toUpperCase() + priority.slice(1)}
      </span>
    );
  };

  // Get project name
  const getProjectName = (projectId) => {
    const project = getProjectById(projectId);
    return project ? project.name : 'Unassigned';
  };

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Topbar />
        
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
              <h1 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4 md:mb-0">Task Management</h1>
              
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <select
                    value={selectedProject}
                    onChange={(e) => setSelectedProject(e.target.value)}
                    className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white pr-8"
                  >
                    <option value="all">All Projects</option>
                    {projects.map(project => (
                      <option key={project.id} value={project.id}>
                        {project.name}
                      </option>
                    ))}
                  </select>
                </div>

                <button
                  onClick={() => setShowProjectModal(true)}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg flex items-center shadow-sm hover:shadow transition-all duration-200"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  New Project
                </button>
                
                <button 
                  onClick={() => document.getElementById('newTaskModal').classList.remove('hidden')}
                  className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg flex items-center shadow-sm hover:shadow transition-all duration-200"
                  disabled={!selectedProject || selectedProject === 'all'}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Add Task
                </button>
              </div>
            </div>
            
            {/* Task Section Header */}
            <div className="mt-4 mb-4 task-section-header">
              <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">Tasks</h2>
            </div>
            
            {/* Filters */}
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 mb-6 shadow-sm">
              <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-700 dark:text-gray-400 mb-1">Search</label>
                  <input
                    type="text"
                    name="search"
                    value={filters.search}
                    onChange={handleFilterChange}
                    placeholder="Search tasks..."
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white text-sm"
                  />
                </div>
                
                <div>
                  <label className="block text-xs font-medium text-gray-700 dark:text-gray-400 mb-1">Status</label>
                  <select
                    name="status"
                    value={filters.status}
                    onChange={handleFilterChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white text-sm"
                  >
                    <option value="all">All Statuses</option>
                    <option value="todo">To Do</option>
                    <option value="inProgress">In Progress</option>
                    <option value="review">Review</option>
                    <option value="done">Done</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-xs font-medium text-gray-700 dark:text-gray-400 mb-1">Priority</label>
                  <select
                    name="priority"
                    value={filters.priority}
                    onChange={handleFilterChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white text-sm"
                  >
                    <option value="all">All Priorities</option>
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-xs font-medium text-gray-700 dark:text-gray-400 mb-1">Assignee</label>
                  <select
                    name="assignee"
                    value={filters.assignee}
                    onChange={handleFilterChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white text-sm"
                  >
                    <option value="all">All Assignees</option>
                    {users.map(user => (
                      <option key={user.id} value={user.name}>
                        {user.name}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-xs font-medium text-gray-700 dark:text-gray-400 mb-1">Project</label>
                  <select
                    name="project"
                    value={filters.project}
                    onChange={handleFilterChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white text-sm"
                  >
                    <option value="all">All Projects</option>
                    {projects.map(project => (
                      <option key={project.id} value={project.id}>
                        {project.name}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-xs font-medium text-gray-700 dark:text-gray-400 mb-1">Sort By</label>
                  <select
                    value={sortOption}
                    onChange={(e) => setSortOption(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white text-sm"
                  >
                    <option value="dueDate-asc">Due Date (Earliest)</option>
                    <option value="dueDate-desc">Due Date (Latest)</option>
                    <option value="priority-desc">Priority (High to Low)</option>
                    <option value="priority-asc">Priority (Low to High)</option>
                    <option value="status-asc">Status</option>
                    <option value="content-asc">Name (A-Z)</option>
                    <option value="content-desc">Name (Z-A)</option>
                  </select>
                </div>
                
                <div className="md:col-span-6 flex justify-end">
                  <button
                    onClick={clearFilters}
                    className="px-3 py-1 text-xs text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white transition-colors"
                  >
                    Clear Filters
                  </button>
                </div>
              </div>
            </div>
            
            {/* Task List */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider border-b border-gray-200 dark:border-gray-700">
                      <th className="px-4 py-3">Task</th>
                      <th className="px-4 py-3">Assigned To</th>
                      <th className="px-4 py-3">Due Date</th>
                      <th className="px-4 py-3">Priority</th>
                      <th className="px-4 py-3">Status</th>
                      <th className="px-4 py-3">Project</th>
                      <th className="px-4 py-3">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                    {filteredTasks.length > 0 ? (
                      filteredTasks.map(task => (
                        <tr key={task.id} className="hover:bg-gray-50 dark:hover:bg-gray-750">
                          <td className="px-4 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-800 dark:text-gray-200">{task.content}</div>
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-600 dark:text-gray-400">{task.assignedTo || 'Unassigned'}</div>
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-600 dark:text-gray-400">
                              {task.dueDate ? task.dueDate.toLocaleDateString() : 'No due date'}
                            </div>
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap">
                            {getPriorityBadge(task.priority)}
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap">
                            {getStatusBadge(task.status)}
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-600 dark:text-gray-400">{getProjectName(task.projectId)}</div>
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap">
                            <div className="flex space-x-2">
                              <button
                                onClick={() => handleEditTask(task)}
                                className="text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 transition-colors"
                                title="Edit task"
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                </svg>
                              </button>
                              <button
                                onClick={() => handleDeleteTask(task.id)}
                                className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 transition-colors"
                                title="Delete task"
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="7" className="px-4 py-6 text-center text-gray-500 dark:text-gray-400">
                          No tasks found. Try clearing filters or create a new task.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
              
              {/* Task List Stats */}
              <div className="px-4 py-3 border-t border-gray-200 dark:border-gray-700 text-xs text-gray-500 dark:text-gray-400">
                Showing {filteredTasks.length} of {tasks.length} tasks
              </div>
            </div>
            
            {/* Projects Table */}
            <div className="mt-8 mb-4">
              <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">Projects List</h2>
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-gray-750">
                    <tr>
                      <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Name</th>
                      <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Category</th>
                      <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Priority</th>
                      <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                      <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Progress</th>
                      <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Manager</th>
                      <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Deadline</th>
                      <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    {projects.map(project => (
                      <tr key={project.id} className="hover:bg-gray-50 dark:hover:bg-gray-750">
                        <td className="px-4 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div>
                              <div className="text-sm font-medium text-gray-800 dark:text-gray-200">{project.name}</div>
                              <div className="text-xs text-gray-500 dark:text-gray-400 mt-1 line-clamp-1">{project.description}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                            {project.category}
                          </span>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          {getPriorityBadge(project.priority)}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <span className={cn(
                            "px-2 py-1 text-xs font-medium rounded-full",
                            project.status === 'active' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' :
                            project.status === 'completed' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300' :
                            project.status === 'planning' ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300' :
                            'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300'
                          )}>
                            {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
                          </span>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                            <div 
                              className={cn(
                                "h-2.5 rounded-full",
                                project.progress >= 80 ? 'bg-green-600' :
                                project.progress >= 50 ? 'bg-blue-600' :
                                project.progress >= 30 ? 'bg-yellow-600' : 'bg-red-600'
                              )}
                              style={{ width: `${project.progress}%` }}
                            ></div>
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400 mt-1 text-right">{project.progress}%</div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-600 dark:text-gray-400">{project.manager}</div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-600 dark:text-gray-400">
                            {project.dueDate.toLocaleDateString()}
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            {Math.ceil((project.dueDate - new Date()) / (1000 * 60 * 60 * 24))} days left
                          </div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <div className="flex space-x-2">
                            <button
                              onClick={() => {
                                setSelectedProject(project.id);
                                // Scroll to the task section
                                document.querySelector('.task-section-header').scrollIntoView({ behavior: 'smooth' });
                              }}
                              className="text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 transition-colors"
                              title="View project tasks"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                              </svg>
                            </button>
                            <button
                              onClick={() => {
                                // Ideally, edit project functionality would go here
                                const projectToEdit = {...project};
                                projectToEdit.startDate = project.startDate.toISOString().split('T')[0];
                                projectToEdit.dueDate = project.dueDate.toISOString().split('T')[0];
                                setNewProject(projectToEdit);
                                setShowProjectModal(true);
                              }}
                              className="text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300 transition-colors"
                              title="Edit project"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                              </svg>
                            </button>
                            <button
                              onClick={() => handleDeleteProject(project.id)}
                              className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 transition-colors"
                              title="Delete project"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              {/* Projects List Stats */}
              <div className="px-4 py-3 border-t border-gray-200 dark:border-gray-700 text-xs text-gray-500 dark:text-gray-400">
                Showing {projects.length} projects
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* New Task Modal */}
      <div id="newTaskModal" className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 hidden">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 w-full max-w-md">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Add New Task</h3>
            <button 
              onClick={() => document.getElementById('newTaskModal').classList.add('hidden')}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <form onSubmit={(e) => { e.preventDefault(); handleAddTask(); document.getElementById('newTaskModal').classList.add('hidden'); }}>
            <div className="mb-4">
              <label htmlFor="content" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Task Description</label>
              <input 
                type="text" 
                id="content" 
                name="content" 
                value={newTask.content} 
                onChange={handleInputChange} 
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white" 
                required 
              />
            </div>
            
            <div className="mb-4">
              <label htmlFor="assignedTo" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Assigned To</label>
              <select 
                id="assignedTo" 
                name="assignedTo" 
                value={newTask.assignedTo} 
                onChange={handleInputChange} 
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white" 
              >
                <option value="">Select a user</option>
                {users.map(user => (
                  <option key={user.id} value={user.name}>
                    {user.avatar} {user.name} ({user.role})
                  </option>
                ))}
              </select>
            </div>
            
            <div className="mb-4">
              <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Due Date</label>
              <input 
                type="date" 
                id="dueDate" 
                name="dueDate" 
                value={newTask.dueDate} 
                onChange={handleInputChange} 
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white" 
              />
            </div>
            
            <div className="mb-4">
              <label htmlFor="priority" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Priority</label>
              <select 
                id="priority" 
                name="priority" 
                value={newTask.priority} 
                onChange={handleInputChange} 
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white" 
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
            
            <div className="mb-4">
              <label htmlFor="status" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Status</label>
              <select 
                id="status" 
                name="status" 
                value={newTask.status} 
                onChange={handleInputChange} 
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white" 
              >
                <option value="todo">To Do</option>
                <option value="inProgress">In Progress</option>
                <option value="review">Review</option>
                <option value="done">Done</option>
              </select>
            </div>
            
            <div className="mb-4">
              <label htmlFor="projectId" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Project</label>
              <select 
                id="projectId" 
                name="projectId" 
                value={newTask.projectId} 
                onChange={handleInputChange} 
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white" 
              >
                <option value="">Select a project</option>
                {projects.map(project => (
                  <option key={project.id} value={project.id}>
                    {project.name}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="flex justify-end">
              <button 
                type="button" 
                onClick={() => document.getElementById('newTaskModal').classList.add('hidden')} 
                className="mr-3 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                Cancel
              </button>
              <button 
                type="submit" 
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                Add Task
              </button>
            </div>
          </form>
        </div>
      </div>
      
      {/* Edit Task Modal */}
      {editingTask && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Edit Task</h3>
              <button 
                onClick={() => setEditingTask(null)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <form onSubmit={(e) => { e.preventDefault(); handleSaveEdit(); }}>
              <div className="mb-4">
                <label htmlFor="edit-content" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Task Description</label>
                <input 
                  type="text" 
                  id="edit-content" 
                  value={editingTask.content} 
                  onChange={(e) => setEditingTask({...editingTask, content: e.target.value})} 
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white" 
                  required 
                />
              </div>
              
              <div className="mb-4">
                <label htmlFor="edit-assignedTo" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Assigned To</label>
                <select 
                  id="edit-assignedTo" 
                  value={editingTask.assignedTo} 
                  onChange={(e) => setEditingTask({...editingTask, assignedTo: e.target.value})} 
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white" 
                >
                  <option value="">Select a user</option>
                  {users.map(user => (
                    <option key={user.id} value={user.name}>
                      {user.avatar} {user.name} ({user.role})
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="mb-4">
                <label htmlFor="edit-dueDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Due Date</label>
                <input 
                  type="date" 
                  id="edit-dueDate" 
                  value={editingTask.dueDate} 
                  onChange={(e) => setEditingTask({...editingTask, dueDate: e.target.value})} 
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white" 
                />
              </div>
              
              <div className="mb-4">
                <label htmlFor="edit-priority" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Priority</label>
                <select 
                  id="edit-priority" 
                  value={editingTask.priority} 
                  onChange={(e) => setEditingTask({...editingTask, priority: e.target.value})} 
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white" 
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
              
              <div className="mb-4">
                <label htmlFor="edit-status" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Status</label>
                <select 
                  id="edit-status" 
                  value={editingTask.status} 
                  onChange={(e) => setEditingTask({...editingTask, status: e.target.value})} 
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white" 
                >
                  <option value="todo">To Do</option>
                  <option value="inProgress">In Progress</option>
                  <option value="review">Review</option>
                  <option value="done">Done</option>
                </select>
              </div>
              
              <div className="mb-4">
                <label htmlFor="edit-projectId" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Project</label>
                <select 
                  id="edit-projectId" 
                  value={editingTask.projectId} 
                  onChange={(e) => setEditingTask({...editingTask, projectId: e.target.value})} 
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white" 
                >
                  <option value="">Select a project</option>
                  {projects.map(project => (
                    <option key={project.id} value={project.id}>
                      {project.name}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="flex justify-end">
                <button 
                  type="button" 
                  onClick={() => setEditingTask(null)} 
                  className="mr-3 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Project Modal */}
      <div 
        id="projectModal"
        className={`fixed inset-0 z-50 flex items-center justify-center p-4 ${showProjectModal ? '' : 'hidden'}`}
      >
        <div className="absolute inset-0 bg-black bg-opacity-50" onClick={() => setShowProjectModal(false)}></div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto relative z-10 p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">Create New Project</h3>
            <button 
              className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300" 
              onClick={() => setShowProjectModal(false)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <form onSubmit={(e) => { 
            e.preventDefault(); 
            // Create new project
            const projectId = `project-${Date.now()}`;
            const createdProject = {
              id: projectId,
              ...newProject,
              startDate: new Date(newProject.startDate),
              dueDate: new Date(newProject.dueDate),
              progress: 0,
              tags: newProject.tags.filter(Boolean)
            };
            
            // Add to projects (in a real app, this would be an API call)
            projects.push(createdProject);
            
            // Set as selected project
            setSelectedProject(projectId);
            
            // Reset form and close modal
            setNewProject({
              name: '',
              description: '',
              startDate: '',
              dueDate: '',
              status: 'active',
              priority: 'medium',
              manager: '',
              members: [],
              category: 'Development',
              tags: []
            });
            setShowProjectModal(false);
          }}>
            <div className="mb-4">
              <label htmlFor="projectName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Project Name*</label>
              <input 
                type="text" 
                id="projectName" 
                name="name" 
                value={newProject.name} 
                onChange={(e) => setNewProject(prev => ({ ...prev, name: e.target.value }))} 
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white" 
                required 
              />
            </div>
            
            <div className="mb-4">
              <label htmlFor="projectDescription" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label>
              <textarea 
                id="projectDescription" 
                name="description" 
                value={newProject.description} 
                onChange={(e) => setNewProject(prev => ({ ...prev, description: e.target.value }))
                }
                rows="3" 
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white" 
              ></textarea>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label htmlFor="projectStartDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Start Date*</label>
                <input 
                  type="date" 
                  id="projectStartDate" 
                  name="startDate" 
                  value={newProject.startDate} 
                  onChange={(e) => setNewProject(prev => ({ ...prev, startDate: e.target.value }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white" 
                  required
                />
              </div>
              
              <div>
                <label htmlFor="projectDueDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Due Date*</label>
                <input 
                  type="date" 
                  id="projectDueDate" 
                  name="dueDate" 
                  value={newProject.dueDate} 
                  onChange={(e) => setNewProject(prev => ({ ...prev, dueDate: e.target.value }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white" 
                  required
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label htmlFor="projectStatus" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Status</label>
                <select 
                  id="projectStatus" 
                  name="status" 
                  value={newProject.status} 
                  onChange={(e) => setNewProject(prev => ({ ...prev, status: e.target.value }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white" 
                >
                  <option value="planning">Planning</option>
                  <option value="active">Active</option>
                  <option value="onhold">On Hold</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
              
              <div>
                <label htmlFor="projectPriority" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Priority</label>
                <select 
                  id="projectPriority" 
                  name="priority" 
                  value={newProject.priority} 
                  onChange={(e) => setNewProject(prev => ({ ...prev, priority: e.target.value }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white" 
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
            </div>
            
            <div className="mb-4">
              <label htmlFor="projectManager" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Project Manager</label>
              <select 
                id="projectManager" 
                name="manager" 
                value={newProject.manager} 
                onChange={(e) => setNewProject(prev => ({ ...prev, manager: e.target.value }))
                }
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white" 
              >
                <option value="">Select a manager</option>
                {users.map(user => (
                  <option key={user.id} value={user.name}>
                    {user.name}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="mb-4">
              <label htmlFor="projectCategory" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Category</label>
              <select 
                id="projectCategory" 
                name="category" 
                value={newProject.category} 
                onChange={(e) => setNewProject(prev => ({ ...prev, category: e.target.value }))
                }
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white" 
              >
                {['Development', 'Design', 'Marketing', 'Research', 'Analytics', 'Operations', 'Documentation', 'Testing'].map(category => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="flex justify-end">
              <button 
                type="button" 
                onClick={() => setShowProjectModal(false)} 
                className="mr-3 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                Cancel
              </button>
              <button 
                type="submit" 
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Create Project
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default TaskList;
