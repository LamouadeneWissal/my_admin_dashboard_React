import React, { useState, useEffect } from 'react';
import { cn } from '../../lib/utils';
import Sidebar from '../../components/Sidebar';
import Topbar from '../../components/Topbar';

// Import project data
import { projects, getProjectById } from '../../data/projects';

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

const KanbanBoard = () => {
  const [tasks, setTasks] = useState([]);
  const [columnTasks, setColumnTasks] = useState({
    'todo': [],
    'inProgress': [],
    'review': [],
    'done': [],
  });
  const [newTask, setNewTask] = useState({
    content: '',
    assignedTo: '',
    dueDate: '',
    priority: 'medium',
    status: 'todo',
    projectId: ''
  });
  const [editingTask, setEditingTask] = useState(null);
  const [selectedTask, setSelectedTask] = useState(null);
  const [showTaskSidebar, setShowTaskSidebar] = useState(false);
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
  
  // Initialize tasks and columns
  useEffect(() => {
    setTasks(initialTasks);
    
    const columnMapping = {
      'todo': [],
      'inProgress': [],
      'review': [],
      'done': []
    };

    // Filter tasks by project if a specific project is selected
    const filteredTasks = selectedProject === 'all' 
      ? initialTasks 
      : initialTasks.filter(task => task.projectId === selectedProject);

    filteredTasks.forEach(task => {
      if (columnMapping[task.status]) {
        columnMapping[task.status].push(task);
      }
    });

    setColumnTasks({
      'todo': columnMapping.todo,
      'inProgress': columnMapping.inProgress,
      'review': columnMapping.review,
      'done': columnMapping.done,
    });
  }, [selectedProject]);

  // Handle form input changes for new task
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewTask(prev => ({ ...prev, [name]: value }));
  };

  // Add new task
  const handleAddTask = () => {
    if (!newTask.content.trim()) return;

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
    
    // Update column tasks
    setColumnTasks(prev => {
      const columnTasksCopy = { ...prev };
      columnTasksCopy[newTask.status] = [...columnTasksCopy[newTask.status], createdTask];
      return columnTasksCopy;
    });

    // Reset form
    setNewTask({
      content: '',
      assignedTo: '',
      dueDate: '',
      priority: 'medium',
      status: 'todo',
      projectId: ''
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

    // Update column tasks
    const oldTask = tasks.find(task => task.id === updatedTask.id);
    const oldStatus = oldTask.status;
    const newStatus = updatedTask.status;

    if (oldStatus === newStatus) {
      // Same column, just update the task
      setColumnTasks(prev => ({
        ...prev,
        [newStatus]: prev[newStatus].map(task => 
          task.id === updatedTask.id ? updatedTask : task
        )
      }));
    } else {
      // Move between columns
      setColumnTasks(prev => ({
        ...prev,
        [oldStatus]: prev[oldStatus].filter(task => task.id !== updatedTask.id),
        [newStatus]: [...prev[newStatus], updatedTask]
      }));
    }

    // Reset editing state
    setEditingTask(null);
  };

  // Move task between columns
  const moveTask = (taskId, newStatus) => {
    const taskToMove = tasks.find(task => task.id === taskId);
    if (!taskToMove) return;

    const oldStatus = taskToMove.status;
    if (oldStatus === newStatus) return; // No change needed

    const updatedTask = { ...taskToMove, status: newStatus };

    // Update tasks array
    setTasks(prev => prev.map(task => 
      task.id === taskId ? updatedTask : task
    ));

    // Update columns
    setColumnTasks(prev => ({
      ...prev,
      [oldStatus]: prev[oldStatus].filter(task => task.id !== taskId),
      [newStatus]: [...prev[newStatus], updatedTask]
    }));
  };

  // Delete task
  const handleDeleteTask = (taskId) => {
    const taskToDelete = tasks.find(task => task.id === taskId);
    if (!taskToDelete) return;

    // Remove from tasks
    setTasks(prev => prev.filter(task => task.id !== taskId));

    // Remove from column
    setColumnTasks(prev => ({
      ...prev,
      [taskToDelete.status]: prev[taskToDelete.status].filter(task => task.id !== taskId)
    }));

    // Clear editing state if needed
    if (editingTask && editingTask.id === taskId) {
      setEditingTask(null);
    }
  };

  // Render task card
  const TaskCard = ({ task }) => {
    const priorityClasses = {
      low: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
      medium: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300',
      high: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
    };

    return (
      <div 
        className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 mb-3 border border-gray-100 dark:border-gray-700 hover:shadow-md transition-all duration-200 cursor-pointer"
        draggable
        onDragStart={(e) => e.dataTransfer.setData('taskId', task.id)}
        onClick={() => {
          setSelectedTask(task);
          setShowTaskSidebar(true);
        }}
      >
        <div className="flex justify-between items-start mb-2">
          <h4 className="font-medium text-gray-800 dark:text-gray-200">{task.content}</h4>
          <div className="flex space-x-1">
            <button 
              onClick={(e) => {
                e.stopPropagation();
                handleEditTask(task);
              }}
              className="text-gray-400 hover:text-primary-500 dark:hover:text-primary-400"
              title="Edit task"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
              </svg>
            </button>
            <button 
              onClick={(e) => {
                e.stopPropagation();
                handleDeleteTask(task.id);
              }}
              className="text-gray-400 hover:text-red-500 dark:hover:text-red-400"
              title="Delete task"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        </div>
        
        <div className="flex items-center text-sm text-gray-600 dark:text-gray-400 mb-2">
          <span className="mr-1">{task.assignedTo ? `Assigned to: ${task.assignedTo}` : 'Unassigned'}</span>
        </div>
        
        <div className="flex items-center justify-between">
          <span 
            className={cn(
              "text-xs px-2 py-1 rounded-full font-medium", 
              priorityClasses[task.priority]
            )}
          >
            {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
          </span>
          
          <span className="text-xs text-gray-500 dark:text-gray-400">
            {task.dueDate ? task.dueDate.toLocaleDateString() : 'No due date'}
          </span>
        </div>
      </div>
    );
  };

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Topbar />
        
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
              <h1 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4 md:mb-0">Kanban Board</h1>
              
              <button 
                onClick={() => document.getElementById('newTaskModal').classList.remove('hidden')}
                className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg flex items-center shadow-sm hover:shadow transition-all duration-200"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Add New Task
              </button>
            </div>
            
            {/* Quick Action Bar */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm mb-6 p-4 flex flex-wrap gap-3 items-center">
              <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Quick Actions:</span>
              
              <button 
                onClick={() => setShowProjectModal(true)}
                className="inline-flex items-center px-3 py-1.5 text-sm bg-green-50 hover:bg-green-100 text-green-700 rounded-md dark:bg-green-900/20 dark:text-green-400 dark:hover:bg-green-900/30 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Add Project
              </button>
              
              <button className="inline-flex items-center px-3 py-1.5 text-sm bg-primary-50 hover:bg-primary-100 text-primary-700 rounded-md dark:bg-primary-900/20 dark:text-primary-400 dark:hover:bg-primary-900/30 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" />
                </svg>
                Sort by Priority
              </button>
              
              <button className="inline-flex items-center px-3 py-1.5 text-sm bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-md dark:bg-blue-900/20 dark:text-blue-400 dark:hover:bg-blue-900/30 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                Group by Due Date
              </button>
              
              <button className="inline-flex items-center px-3 py-1.5 text-sm bg-yellow-50 hover:bg-yellow-100 text-yellow-700 rounded-md dark:bg-yellow-900/20 dark:text-yellow-400 dark:hover:bg-yellow-900/30 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                Group by Assignee
              </button>
              
              <button className="inline-flex items-center px-3 py-1.5 text-sm bg-green-50 hover:bg-green-100 text-green-700 rounded-md dark:bg-green-900/20 dark:text-green-400 dark:hover:bg-green-900/30 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Export Board
              </button>
              
              <div className="ml-auto">
                <select 
                  className="text-sm bg-gray-50 border border-gray-200 rounded-md px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
                  value={selectedProject}
                  onChange={(e) => setSelectedProject(e.target.value)}
                >
                  <option value="all">All Projects</option>
                  {projects.map(project => (
                    <option key={project.id} value={project.id}>{project.name}</option>
                  ))}
                </select>
              </div>
            </div>
            
            {/* Modern Project Timeline */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg mb-6 p-6 overflow-hidden relative">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary-300 via-primary-500 to-primary-700"></div>
              
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h3 className="text-base font-semibold text-gray-800 dark:text-gray-100">Project Timeline</h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Current progress: Development phase</p>
                </div>
                <div className="flex items-center space-x-4 text-xs">
                  <div className="flex items-center bg-gray-100 dark:bg-gray-700 rounded-full px-3 py-1">
                    <div className="w-2.5 h-2.5 bg-gray-400 dark:bg-gray-500 rounded-full mr-1.5 shadow-sm"></div>
                    <span className="text-gray-600 dark:text-gray-300">Planned</span>
                  </div>
                  <div className="flex items-center bg-blue-50 dark:bg-blue-900/30 rounded-full px-3 py-1">
                    <div className="w-2.5 h-2.5 bg-primary-500 rounded-full mr-1.5 shadow-sm animate-pulse"></div>
                    <span className="text-primary-600 dark:text-primary-400">Current</span>
                  </div>
                  <div className="flex items-center bg-green-50 dark:bg-green-900/30 rounded-full px-3 py-1">
                    <div className="w-2.5 h-2.5 bg-green-500 rounded-full mr-1.5 shadow-sm"></div>
                    <span className="text-green-600 dark:text-green-400">Completed</span>
                  </div>
                </div>
              </div>
              
              <div className="relative pt-3 px-2">
                {/* Timeline track with gradient */}
                <div className="absolute left-0 right-0 h-1.5 top-7 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div className="absolute left-0 top-0 bottom-0 right-[60%] bg-gradient-to-r from-green-400 to-primary-400 rounded-full"></div>
                </div>
                
                <div className="flex justify-between relative z-10">
                  {/* Project Start - Completed */}
                  <div className="flex flex-col items-center group cursor-pointer transition-transform duration-300 hover:translate-y-[-2px]">
                    <div className="w-5 h-5 rounded-full bg-green-500 mb-2 shadow-md ring-4 ring-green-100 dark:ring-green-900/40 flex items-center justify-center">
                      <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="flex flex-col items-center">
                      <span className="text-xs font-medium text-gray-700 dark:text-gray-200 whitespace-nowrap group-hover:text-primary-500 dark:group-hover:text-primary-400 transition-colors">Project Start</span>
                      <span className="text-xs text-gray-500 dark:text-gray-500 mt-0.5">Jul 1</span>
                    </div>
                  </div>
                  
                  {/* Planning - Completed */}
                  <div className="flex flex-col items-center group cursor-pointer transition-transform duration-300 hover:translate-y-[-2px]">
                    <div className="w-5 h-5 rounded-full bg-green-500 mb-2 shadow-md ring-4 ring-green-100 dark:ring-green-900/40 flex items-center justify-center">
                      <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="flex flex-col items-center">
                      <span className="text-xs font-medium text-gray-700 dark:text-gray-200 whitespace-nowrap group-hover:text-primary-500 dark:group-hover:text-primary-400 transition-colors">Planning</span>
                      <span className="text-xs text-gray-500 dark:text-gray-500 mt-0.5">Jul 5</span>
                    </div>
                  </div>
                  
                  {/* Development - Current */}
                  <div className="flex flex-col items-center group cursor-pointer transition-transform duration-300 hover:translate-y-[-2px]">
                    <div className="w-6 h-6 rounded-full bg-primary-500 mb-2 shadow-md ring-4 ring-primary-100 dark:ring-primary-900/40 animate-pulse">
                    </div>
                    <div className="flex flex-col items-center">
                      <span className="text-xs font-medium text-primary-600 dark:text-primary-400 whitespace-nowrap">Development</span>
                      <span className="text-xs text-gray-500 dark:text-gray-500 mt-0.5">Jul 13</span>
                    </div>
                  </div>
                  
                  {/* Testing - Planned */}
                  <div className="flex flex-col items-center group cursor-pointer transition-transform duration-300 hover:translate-y-[-2px]">
                    <div className="w-5 h-5 rounded-full bg-gray-300 dark:bg-gray-600 mb-2 shadow-sm ring-4 ring-gray-100 dark:ring-gray-800"></div>
                    <div className="flex flex-col items-center">
                      <span className="text-xs font-medium text-gray-600 dark:text-gray-300 whitespace-nowrap group-hover:text-primary-500 dark:group-hover:text-primary-400 transition-colors">Testing</span>
                      <span className="text-xs text-gray-500 dark:text-gray-500 mt-0.5">Jul 20</span>
                    </div>
                  </div>
                  
                  {/* Launch - Planned */}
                  <div className="flex flex-col items-center group cursor-pointer transition-transform duration-300 hover:translate-y-[-2px]">
                    <div className="w-5 h-5 rounded-full bg-gray-300 dark:bg-gray-600 mb-2 shadow-sm ring-4 ring-gray-100 dark:ring-gray-800"></div>
                    <div className="flex flex-col items-center">
                      <span className="text-xs font-medium text-gray-600 dark:text-gray-300 whitespace-nowrap group-hover:text-primary-500 dark:group-hover:text-primary-400 transition-colors">Launch</span>
                      <span className="text-xs text-gray-500 dark:text-gray-500 mt-0.5">Jul 30</span>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Days remaining indicator */}
              <div className="mt-6 pt-3 border-t border-gray-100 dark:border-gray-700 flex justify-between items-center">
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  Project completion: <span className="text-primary-500 font-medium">60%</span>
                </div>
                <div className="bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 text-xs py-1 px-3 rounded-full font-medium">
                  17 days remaining
                </div>
              </div>
            </div>
            
            {/* Kanban Board */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* To Do Column */}
              <div 
                className="bg-gray-100 dark:bg-gray-800/50 rounded-lg p-4"
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault();
                  const taskId = e.dataTransfer.getData('taskId');
                  moveTask(taskId, 'todo');
                }}
              >
                <div className="flex items-center mb-4">
                  <div className="h-4 w-4 rounded-full bg-gray-400 mr-2"></div>
                  <h3 className="font-medium text-gray-700 dark:text-gray-200">To Do</h3>
                  <span className="ml-auto bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs py-0.5 px-2 rounded-full">
                    {columnTasks.todo.length}
                  </span>
                </div>
                <div>
                  {columnTasks.todo.map(task => (
                    <TaskCard key={task.id} task={task} />
                  ))}
                </div>
              </div>
              
              {/* In Progress Column */}
              <div 
                className="bg-gray-100 dark:bg-gray-800/50 rounded-lg p-4"
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault();
                  const taskId = e.dataTransfer.getData('taskId');
                  moveTask(taskId, 'inProgress');
                }}
              >
                <div className="flex items-center mb-4">
                  <div className="h-4 w-4 rounded-full bg-yellow-400 mr-2"></div>
                  <h3 className="font-medium text-gray-700 dark:text-gray-200">In Progress</h3>
                  <span className="ml-auto bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs py-0.5 px-2 rounded-full">
                    {columnTasks.inProgress.length}
                  </span>
                </div>
                <div>
                  {columnTasks.inProgress.map(task => (
                    <TaskCard key={task.id} task={task} />
                  ))}
                </div>
              </div>
              
              {/* Review Column */}
              <div 
                className="bg-gray-100 dark:bg-gray-800/50 rounded-lg p-4"
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault();
                  const taskId = e.dataTransfer.getData('taskId');
                  moveTask(taskId, 'review');
                }}
              >
                <div className="flex items-center mb-4">
                  <div className="h-4 w-4 rounded-full bg-blue-400 mr-2"></div>
                  <h3 className="font-medium text-gray-700 dark:text-gray-200">Review</h3>
                  <span className="ml-auto bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs py-0.5 px-2 rounded-full">
                    {columnTasks.review.length}
                  </span>
                </div>
                <div>
                  {columnTasks.review.map(task => (
                    <TaskCard key={task.id} task={task} />
                  ))}
                </div>
              </div>
              
              {/* Done Column */}
              <div 
                className="bg-gray-100 dark:bg-gray-800/50 rounded-lg p-4"
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault();
                  const taskId = e.dataTransfer.getData('taskId');
                  moveTask(taskId, 'done');
                }}
              >
                <div className="flex items-center mb-4">
                  <div className="h-4 w-4 rounded-full bg-green-400 mr-2"></div>
                  <h3 className="font-medium text-gray-700 dark:text-gray-200">Done</h3>
                  <span className="ml-auto bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs py-0.5 px-2 rounded-full">
                    {columnTasks.done.length}
                  </span>
                </div>
                <div>
                  {columnTasks.done.map(task => (
                    <TaskCard key={task.id} task={task} />
                  ))}
                </div>
              </div>
            </div>
            
            {/* Task Summary & Analytics */}
            <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Task Summary */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-5">
                <h3 className="text-lg font-medium text-gray-800 dark:text-white mb-4">Task Summary</h3>
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg">
                    <p className="text-sm text-gray-500 dark:text-gray-400">Total Tasks</p>
                    <p className="text-2xl font-semibold text-gray-800 dark:text-white mt-1">{tasks.length}</p>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg">
                    <p className="text-sm text-gray-500 dark:text-gray-400">Completed</p>
                    <p className="text-2xl font-semibold text-green-600 dark:text-green-400 mt-1">{columnTasks.done.length}</p>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg">
                    <p className="text-sm text-gray-500 dark:text-gray-400">In Progress</p>
                    <p className="text-2xl font-semibold text-yellow-600 dark:text-yellow-400 mt-1">{columnTasks.inProgress.length}</p>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg">
                    <p className="text-sm text-gray-500 dark:text-gray-400">Completion Rate</p>
                    <p className="text-2xl font-semibold text-primary-600 dark:text-primary-400 mt-1">
                      {tasks.length > 0 ? Math.round((columnTasks.done.length / tasks.length) * 100) : 0}%
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Priority Breakdown */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-5">
                <h3 className="text-lg font-medium text-gray-800 dark:text-white mb-4">Priority Breakdown</h3>
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium text-red-600 dark:text-red-400">High Priority</span>
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        {tasks.filter(task => task.priority === 'high').length} tasks
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div 
                        className="bg-red-500 h-2 rounded-full" 
                        style={{ width: `${tasks.length > 0 ? (tasks.filter(task => task.priority === 'high').length / tasks.length) * 100 : 0}%` }}
                      ></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium text-yellow-600 dark:text-yellow-400">Medium Priority</span>
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        {tasks.filter(task => task.priority === 'medium').length} tasks
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div 
                        className="bg-yellow-500 h-2 rounded-full" 
                        style={{ width: `${tasks.length > 0 ? (tasks.filter(task => task.priority === 'medium').length / tasks.length) * 100 : 0}%` }}
                      ></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium text-blue-600 dark:text-blue-400">Low Priority</span>
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        {tasks.filter(task => task.priority === 'low').length} tasks
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div 
                        className="bg-blue-500 h-2 rounded-full" 
                        style={{ width: `${tasks.length > 0 ? (tasks.filter(task => task.priority === 'low').length / tasks.length) * 100 : 0}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Recent Activity */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-5">
                <h3 className="text-lg font-medium text-gray-800 dark:text-white mb-4">Team Workload</h3>
                <div className="space-y-3">
                  {users.filter((user, index) => index < 4).map(user => (
                    <div key={user.id} className="flex items-center">
                      <div className="flex-shrink-0 text-lg mr-2">{user.avatar}</div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-800 dark:text-white truncate">{user.name}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{user.role}</p>
                      </div>
                      <div className="flex flex-col items-end">
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          {tasks.filter(task => task.assignedTo === user.name).length} tasks
                        </span>
                        <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                          tasks.filter(task => task.assignedTo === user.name).length > 3 
                            ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300' 
                            : 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                        }`}>
                          {tasks.filter(task => task.assignedTo === user.name).length > 3 ? 'Heavy' : 'Normal'}
                        </span>
                      </div>
                    </div>
                  ))}
                  {users.length > 4 && (
                    <button className="text-sm text-primary-600 dark:text-primary-400 hover:underline mt-2">
                      View all team members
                    </button>
                  )}
                </div>
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
      
      {/* New Project Modal */}
      {showProjectModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Create New Project</h3>
              <button 
                onClick={() => setShowProjectModal(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <form onSubmit={(e) => { e.preventDefault(); handleAddProject(); }}>
              <div className="mb-4">
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Project Name</label>
                <input 
                  type="text" 
                  id="name" 
                  name="name" 
                  value={newProject.name} 
                  onChange={handleProjectInputChange} 
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white" 
                  required 
                />
              </div>
              
              <div className="mb-4">
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label>
                <textarea 
                  id="description" 
                  name="description" 
                  value={newProject.description} 
                  onChange={handleProjectInputChange} 
                  rows="3"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white" 
                />
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                <div>
                  <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Start Date</label>
                  <input 
                    type="date" 
                    id="startDate" 
                    name="startDate" 
                    value={newProject.startDate} 
                    onChange={handleProjectInputChange} 
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white" 
                  />
                </div>
                
                <div>
                  <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Due Date</label>
                  <input 
                    type="date" 
                    id="dueDate" 
                    name="dueDate" 
                    value={newProject.dueDate} 
                    onChange={handleProjectInputChange} 
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white" 
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                <div>
                  <label htmlFor="status" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Status</label>
                  <select 
                    id="status" 
                    name="status" 
                    value={newProject.status} 
                    onChange={handleProjectInputChange} 
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white" 
                  >
                    <option value="planning">Planning</option>
                    <option value="active">Active</option>
                    <option value="onHold">On Hold</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>
                
                <div>
                  <label htmlFor="priority" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Priority</label>
                  <select 
                    id="priority" 
                    name="priority" 
                    value={newProject.priority} 
                    onChange={handleProjectInputChange} 
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white" 
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="critical">Critical</option>
                  </select>
                </div>
              </div>
              
              <div className="mb-4">
                <label htmlFor="manager" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Project Manager</label>
                <select 
                  id="manager" 
                  name="manager" 
                  value={newProject.manager} 
                  onChange={handleProjectInputChange} 
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white" 
                >
                  <option value="">Select a manager</option>
                  {users.map(user => (
                    <option key={user.id} value={user.name}>
                      {user.name} ({user.role})
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="mb-4">
                <label htmlFor="members" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Team Members</label>
                <select 
                  id="members" 
                  name="members" 
                  multiple
                  size="4"
                  onChange={handleMemberSelection} 
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white" 
                >
                  {users.map(user => (
                    <option key={user.id} value={user.name}>
                      {user.name} ({user.role})
                    </option>
                  ))}
                </select>
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">Hold Ctrl/Cmd to select multiple members</p>
              </div>
              
              <div className="mb-4">
                <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Category</label>
                <select 
                  id="category" 
                  name="category" 
                  value={newProject.category} 
                  onChange={handleProjectInputChange} 
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white" 
                >
                  {['Development', 'Design', 'Marketing', 'Research', 'Analytics', 'Operations', 'Documentation', 'Testing', 'Infrastructure'].map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>
              
              <div className="mb-4">
                <label htmlFor="tags" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Tags</label>
                <input 
                  type="text" 
                  id="tags" 
                  name="tags" 
                  placeholder="Enter tags separated by commas" 
                  onChange={handleTagsInput} 
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white" 
                />
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">Example: frontend, design, urgent</p>
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
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                >
                  Create Project
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      
      {/* Task Details Sidebar */}
      <div className={cn(
        "fixed top-0 right-0 h-screen bg-white dark:bg-gray-800 shadow-xl border-l border-gray-200 dark:border-gray-700 z-40 transition-all duration-300 transform",
        showTaskSidebar ? "translate-x-0 w-80" : "translate-x-full w-0"
      )}>
        {selectedTask && (
          <div className="h-full flex flex-col">
            <div className="flex justify-between items-center border-b border-gray-200 dark:border-gray-700 p-4">
              <h3 className="font-medium text-lg text-gray-800 dark:text-gray-200">Task Details</h3>
              <button 
                onClick={() => setShowTaskSidebar(false)} 
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4">
              <div className="mb-5">
                <h4 className="text-lg font-medium text-gray-800 dark:text-gray-200">{selectedTask.content}</h4>
                <div className={cn(
                  "inline-block px-2 py-1 mt-2 text-xs font-medium rounded-full",
                  {
                    'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300': selectedTask.status === 'todo',
                    'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300': selectedTask.status === 'inProgress',
                    'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300': selectedTask.status === 'review',
                    'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300': selectedTask.status === 'done',
                  }
                )}>
                  {selectedTask.status === 'todo' && 'To Do'}
                  {selectedTask.status === 'inProgress' && 'In Progress'}
                  {selectedTask.status === 'review' && 'Review'}
                  {selectedTask.status === 'done' && 'Done'}
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <h5 className="text-xs uppercase font-semibold text-gray-500 dark:text-gray-400 mb-1">Assigned To</h5>
                  <div className="flex items-center">
                    <div className="h-8 w-8 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center text-primary-600 dark:text-primary-400 font-medium text-sm mr-2">
                      {selectedTask.assignedTo ? selectedTask.assignedTo.charAt(0) : '?'}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-800 dark:text-gray-200">
                        {selectedTask.assignedTo || 'Unassigned'}
                      </p>
                      {selectedTask.assignedTo && (
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {users.find(u => u.name === selectedTask.assignedTo)?.role || 'Team Member'}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
                
                <div>
                  <h5 className="text-xs uppercase font-semibold text-gray-500 dark:text-gray-400 mb-1">Due Date</h5>
                  <div className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 012 2z" />
                    </svg>
                    <p className="text-sm text-gray-800 dark:text-gray-200">
                      {selectedTask.dueDate ? selectedTask.dueDate.toLocaleDateString() : 'No due date set'}
                    </p>
                  </div>
                </div>
                
                <div>
                  <h5 className="text-xs uppercase font-semibold text-gray-500 dark:text-gray-400 mb-1">Priority</h5>
                  <div className="flex items-center">
                    {selectedTask.priority === 'high' && (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                        </svg>
                        High Priority
                      </span>
                    )}
                    {selectedTask.priority === 'medium' && (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                        </svg>
                        Medium Priority
                      </span>
                    )}
                    {selectedTask.priority === 'low' && (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-4 4m0 0l-4-4m4 4V3" />
                        </svg>
                        Low Priority
                      </span>
                    )}
                  </div>
                </div>
                
                <div>
                  <h5 className="text-xs uppercase font-semibold text-gray-500 dark:text-gray-400 mb-2">Description</h5>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    This task involves {selectedTask.content.toLowerCase()}. Please ensure all requirements are met before moving this task to the next stage.
                  </p>
                </div>
                
                <div>
                  <h5 className="text-xs uppercase font-semibold text-gray-500 dark:text-gray-400 mb-2">Attachments</h5>
                  <div className="space-y-2">
                    <div className="flex items-center p-2 bg-gray-50 dark:bg-gray-700/50 rounded-md">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                      </svg>
                      <span className="text-sm text-gray-700 dark:text-gray-300">requirements.pdf</span>
                      <button className="ml-auto text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                        </svg>
                      </button>
                    </div>
                    
                    <div className="flex items-center p-2 bg-gray-50 dark:bg-gray-700/50 rounded-md">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      <span className="text-sm text-gray-700 dark:text-gray-300">data.xlsx</span>
                      <button className="ml-auto text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                        </svg>
                      </button>
                    </div>
                  </div>
                  
                  <button className="mt-3 text-sm text-primary-600 dark:text-primary-400 hover:underline flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    Add Attachment
                  </button>
                </div>
              </div>
            </div>
            
            <div className="border-t border-gray-200 dark:border-gray-700 p-4">
              <div className="grid grid-cols-2 gap-3">
                <button 
                  onClick={() => handleEditTask(selectedTask)}
                  className="px-4 py-2 bg-primary-50 text-primary-700 hover:bg-primary-100 dark:bg-primary-900/20 dark:text-primary-400 dark:hover:bg-primary-900/30 rounded-md text-sm font-medium flex items-center justify-center"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                  </svg>
                  Edit
                </button>
                <button 
                  onClick={() => {
                    handleDeleteTask(selectedTask.id);
                    setShowTaskSidebar(false);
                  }}
                  className="px-4 py-2 bg-red-50 text-red-700 hover:bg-red-100 dark:bg-red-900/20 dark:text-red-400 dark:hover:bg-red-900/30 rounded-md text-sm font-medium flex items-center justify-center"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* New Project Modal */}
      {showProjectModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Create New Project</h3>
              <button 
                onClick={() => setShowProjectModal(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <form onSubmit={(e) => { e.preventDefault(); handleAddProject(); }}>
              <div className="mb-4">
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Project Name</label>
                <input 
                  type="text" 
                  id="name" 
                  name="name" 
                  value={newProject.name} 
                  onChange={handleProjectInputChange} 
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white" 
                  required 
                />
              </div>
              
              <div className="mb-4">
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label>
                <textarea 
                  id="description" 
                  name="description" 
                  value={newProject.description} 
                  onChange={handleProjectInputChange} 
                  rows="3"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white" 
                />
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                <div>
                  <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Start Date</label>
                  <input 
                    type="date" 
                    id="startDate" 
                    name="startDate" 
                    value={newProject.startDate} 
                    onChange={handleProjectInputChange} 
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white" 
                  />
                </div>
                
                <div>
                  <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Due Date</label>
                  <input 
                    type="date" 
                    id="dueDate" 
                    name="dueDate" 
                    value={newProject.dueDate} 
                    onChange={handleProjectInputChange} 
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white" 
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                <div>
                  <label htmlFor="status" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Status</label>
                  <select 
                    id="status" 
                    name="status" 
                    value={newProject.status} 
                    onChange={handleProjectInputChange} 
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white" 
                  >
                    <option value="planning">Planning</option>
                    <option value="active">Active</option>
                    <option value="onHold">On Hold</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>
                
                <div>
                  <label htmlFor="priority" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Priority</label>
                  <select 
                    id="priority" 
                    name="priority" 
                    value={newProject.priority} 
                    onChange={handleProjectInputChange} 
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white" 
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="critical">Critical</option>
                  </select>
                </div>
              </div>
              
              <div className="mb-4">
                <label htmlFor="manager" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Project Manager</label>
                <select 
                  id="manager" 
                  name="manager" 
                  value={newProject.manager} 
                  onChange={handleProjectInputChange} 
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white" 
                >
                  <option value="">Select a manager</option>
                  {users.map(user => (
                    <option key={user.id} value={user.name}>
                      {user.name} ({user.role})
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="mb-4">
                <label htmlFor="members" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Team Members</label>
                <select 
                  id="members" 
                  name="members" 
                  multiple
                  size="4"
                  onChange={handleMemberSelection} 
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white" 
                >
                  {users.map(user => (
                    <option key={user.id} value={user.name}>
                      {user.name} ({user.role})
                    </option>
                  ))}
                </select>
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">Hold Ctrl/Cmd to select multiple members</p>
              </div>
              
              <div className="mb-4">
                <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Category</label>
                <select 
                  id="category" 
                  name="category" 
                  value={newProject.category} 
                  onChange={handleProjectInputChange} 
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white" 
                >
                  {['Development', 'Design', 'Marketing', 'Research', 'Analytics', 'Operations', 'Documentation', 'Testing', 'Infrastructure'].map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>
              
              <div className="mb-4">
                <label htmlFor="tags" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Tags</label>
                <input 
                  type="text" 
                  id="tags" 
                  name="tags" 
                  placeholder="Enter tags separated by commas" 
                  onChange={handleTagsInput} 
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white" 
                />
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">Example: frontend, design, urgent</p>
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
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                >
                  Create Project
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default KanbanBoard;
