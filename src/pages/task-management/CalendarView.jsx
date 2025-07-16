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

const CalendarView = () => {
  const [tasks, setTasks] = useState([]);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [calendarDays, setCalendarDays] = useState([]);
  const [tasksByDate, setTasksByDate] = useState({});
  const [newTask, setNewTask] = useState({
    content: '',
    assignedTo: '',
    dueDate: '',
    priority: 'medium',
    status: 'todo',
    projectId: ''
  });
  const [editingTask, setEditingTask] = useState(null);
  const [selectedDay, setSelectedDay] = useState(null);
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
  
  // Month navigation
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  
  // Initialize tasks
  useEffect(() => {
    // Filter tasks by project if a specific project is selected
    const filteredTasks = selectedProject === 'all' 
      ? initialTasks 
      : initialTasks.filter(task => task.projectId === selectedProject);
      
    setTasks(filteredTasks);
  }, [selectedProject]);
  
  // Update calendar days when the current date changes
  useEffect(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    
    // Get first day of the month and the last day
    const firstDayOfMonth = new Date(year, month, 1);
    const lastDayOfMonth = new Date(year, month + 1, 0);
    
    // Get the day of the week of the first day (0 = Sunday, 6 = Saturday)
    const firstDayWeekday = firstDayOfMonth.getDay();
    
    // Create array for all days in the calendar view
    const daysArray = [];
    
    // Add days from previous month to fill the first row
    const daysFromPrevMonth = firstDayWeekday;
    const prevMonthLastDay = new Date(year, month, 0).getDate();
    
    for (let i = daysFromPrevMonth - 1; i >= 0; i--) {
      const dayDate = new Date(year, month - 1, prevMonthLastDay - i);
      daysArray.push({
        date: dayDate,
        isCurrentMonth: false,
        isToday: false,
      });
    }
    
    // Add days from current month
    for (let i = 1; i <= lastDayOfMonth.getDate(); i++) {
      const dayDate = new Date(year, month, i);
      const isToday = isDateEqual(dayDate, new Date());
      
      daysArray.push({
        date: dayDate,
        isCurrentMonth: true,
        isToday,
      });
    }
    
    // Add days from next month to complete the grid (6 rows of 7 days)
    const totalCalendarDays = 42; // 6 rows of 7 days
    const remainingDays = totalCalendarDays - daysArray.length;
    
    for (let i = 1; i <= remainingDays; i++) {
      const dayDate = new Date(year, month + 1, i);
      daysArray.push({
        date: dayDate,
        isCurrentMonth: false,
        isToday: false,
      });
    }
    
    setCalendarDays(daysArray);
  }, [currentDate]);
  
  // Group tasks by date
  useEffect(() => {
    const groupedTasks = {};
    
    tasks.forEach(task => {
      if (!task.dueDate) return;
      
      const dateKey = formatDate(task.dueDate);
      if (!groupedTasks[dateKey]) {
        groupedTasks[dateKey] = [];
      }
      
      groupedTasks[dateKey].push(task);
    });
    
    setTasksByDate(groupedTasks);
  }, [tasks]);
  
  // Helper function to format date to YYYY-MM-DD for using as keys
  const formatDate = (date) => {
    return date.toISOString().split('T')[0];
  };
  
  // Helper function to check if two dates are the same day
  const isDateEqual = (date1, date2) => {
    return (
      date1.getDate() === date2.getDate() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getFullYear() === date2.getFullYear()
    );
  };
  
  // Navigate to previous month
  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };
  
  // Navigate to next month
  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };
  
  // Navigate to current month
  const goToToday = () => {
    setCurrentDate(new Date());
  };
  
  // Handle selecting a day
  const selectDay = (day) => {
    setSelectedDay(day);
    // Pre-fill due date for new task
    setNewTask(prev => ({
      ...prev,
      dueDate: formatDate(day.date)
    }));
    // Show the day detail modal
    document.getElementById('dayDetailModal').classList.remove('hidden');
  };
  
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
      dueDate: selectedDay ? formatDate(selectedDay.date) : '',
      priority: 'medium',
      status: 'todo',
      projectId: selectedProject !== 'all' ? selectedProject : ''
    });
  };

  // Edit task
  const handleEditTask = (task) => {
    setEditingTask({...task, dueDate: formatDate(task.dueDate)});
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
  
  // Get color for priority
  const getPriorityColor = (priority) => {
    switch(priority) {
      case 'high': return 'bg-red-100 border-red-300 dark:bg-red-900/30 dark:border-red-800';
      case 'medium': return 'bg-yellow-100 border-yellow-300 dark:bg-yellow-900/30 dark:border-yellow-800';
      case 'low': return 'bg-blue-100 border-blue-300 dark:bg-blue-900/30 dark:border-blue-800';
      default: return 'bg-gray-100 border-gray-300 dark:bg-gray-700 dark:border-gray-600';
    }
  };
  
  // Get color for status
  const getStatusColor = (status) => {
    switch(status) {
      case 'done': return 'bg-green-100 dark:bg-green-900/30';
      case 'review': return 'bg-blue-100 dark:bg-blue-900/30';
      case 'inProgress': return 'bg-yellow-100 dark:bg-yellow-900/30';
      case 'todo': return 'bg-gray-100 dark:bg-gray-700';
      default: return 'bg-gray-100 dark:bg-gray-700';
    }
  };
  
  // Render tasks for a specific day
  const renderTasksForDay = (day) => {
    const dateKey = formatDate(day.date);
    const dayTasks = tasksByDate[dateKey] || [];
    const maxVisibleTasks = 2;
    
    return (
      <>
        {dayTasks.slice(0, maxVisibleTasks).map((task) => (
          <div 
            key={task.id}
            className={`text-xs p-1 mb-1 truncate rounded border ${getPriorityColor(task.priority)} text-gray-700 dark:text-gray-300`}
            title={task.content}
          >
            {task.content}
          </div>
        ))}
        {dayTasks.length > maxVisibleTasks && (
          <div className="text-xs text-primary-600 dark:text-primary-400 p-1">
            +{dayTasks.length - maxVisibleTasks} more
          </div>
        )}
      </>
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
              <h1 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4 md:mb-0">Calendar View</h1>
              
              <div className="flex space-x-2">
                <button 
                  onClick={goToToday}
                  className="px-3 py-1.5 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  Today
                </button>
                <button 
                  onClick={prevMonth}
                  className="p-1.5 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <button 
                  onClick={nextMonth}
                  className="p-1.5 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
                
                <h2 className="text-lg font-medium text-gray-800 dark:text-gray-200 px-2">
                  {months[currentDate.getMonth()]} {currentDate.getFullYear()}
                </h2>
                
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <select
                      value={selectedProject}
                      onChange={(e) => setSelectedProject(e.target.value)}
                      className="px-3 py-1.5 border border-gray-300 dark:border-gray-600 rounded-md text-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white pr-8"
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
                    className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md flex items-center shadow-sm hover:shadow transition-all duration-200"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    New Project
                  </button>
                  
                  <button 
                    onClick={() => document.getElementById('newTaskModal').classList.remove('hidden')}
                    className="px-3 py-1.5 bg-primary-600 hover:bg-primary-700 text-white rounded-md flex items-center shadow-sm hover:shadow transition-all duration-200"
                    disabled={!selectedProject || selectedProject === 'all'}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Add Task
                  </button>
                </div>
              </div>
            </div>
            
            {/* Calendar */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
              {/* Calendar header */}
              <div className="grid grid-cols-7 border-b border-gray-200 dark:border-gray-700">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                  <div 
                    key={day} 
                    className="px-2 py-2 text-center text-sm font-medium text-gray-500 dark:text-gray-400 border-r last:border-r-0 border-gray-200 dark:border-gray-700"
                  >
                    {day}
                  </div>
                ))}
              </div>
              
              {/* Calendar grid */}
              <div className="grid grid-cols-7 grid-rows-6 h-[600px]">
                {calendarDays.map((day, index) => (
                  <div 
                    key={index}
                    className={cn(
                      "border-r border-b last:border-r-0 border-gray-200 dark:border-gray-700 p-1 overflow-hidden",
                      !day.isCurrentMonth && "bg-gray-50 dark:bg-gray-850",
                      day.isToday && "bg-primary-50 dark:bg-primary-900/10",
                    )}
                    onClick={() => selectDay(day)}
                  >
                    <div className="flex items-center justify-between">
                      <span 
                        className={cn(
                          "text-sm font-medium p-1", 
                          day.isCurrentMonth 
                            ? day.isToday 
                              ? "bg-primary-600 text-white rounded-full w-7 h-7 flex items-center justify-center" 
                              : "text-gray-700 dark:text-gray-300" 
                            : "text-gray-400 dark:text-gray-500"
                        )}
                      >
                        {day.date.getDate()}
                      </span>
                      
                      {/* Day tasks indicator */}
                      {tasksByDate[formatDate(day.date)]?.length > 0 && (
                        <span className="h-1.5 w-1.5 rounded-full bg-primary-600 dark:bg-primary-400"></span>
                      )}
                    </div>
                    
                    {/* Task preview in calendar */}
                    <div className="mt-1">
                      {renderTasksForDay(day)}
                    </div>
                  </div>
                ))}
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
      
      {/* Day Detail Modal */}
      <div id="dayDetailModal" className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 hidden">
        {selectedDay && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 w-full max-w-md max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                {selectedDay.date.toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
              </h3>
              <button 
                onClick={() => document.getElementById('dayDetailModal').classList.add('hidden')}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            {/* Tasks for selected day */}
            <div className="mb-4">
              <div className="flex justify-between items-center">
                <h4 className="text-md font-medium text-gray-800 dark:text-gray-200">Tasks</h4>
                <button 
                  onClick={() => {
                    document.getElementById('dayDetailModal').classList.add('hidden');
                    document.getElementById('newTaskModal').classList.remove('hidden');
                  }}
                  className="text-xs flex items-center text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Add Task
                </button>
              </div>
              
              <div className="mt-2 space-y-2">
                {tasksByDate[formatDate(selectedDay.date)]?.length > 0 ? (
                  tasksByDate[formatDate(selectedDay.date)].map((task) => (
                    <div 
                      key={task.id} 
                      className={`p-3 rounded-lg border ${getPriorityColor(task.priority)} ${getStatusColor(task.status)}`}
                    >
                      <div className="flex justify-between">
                        <span className="font-medium text-gray-800 dark:text-gray-200">{task.content}</span>
                        <div className="flex space-x-1">
                          <button 
                            onClick={() => {
                              handleEditTask(task);
                              document.getElementById('dayDetailModal').classList.add('hidden');
                            }}
                            className="text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300"
                            title="Edit task"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                            </svg>
                          </button>
                          <button 
                            onClick={() => handleDeleteTask(task.id)}
                            className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                            title="Delete task"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </div>
                      
                      <div className="flex items-center mt-2 text-xs text-gray-600 dark:text-gray-400">
                        <span className="mr-2">
                          {task.assignedTo ? `Assigned to: ${task.assignedTo}` : 'Unassigned'}
                        </span>
                        <span className={cn(
                          "px-1.5 py-0.5 rounded-full text-xs font-medium", 
                          {
                            'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300': task.priority === 'high',
                            'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300': task.priority === 'medium',
                            'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300': task.priority === 'low'
                          }
                        )}>
                          {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                        </span>
                        <span className="ml-auto">
                          {getStatusBadge(task.status)}
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mx-auto mb-2 text-gray-400 dark:text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                    </svg>
                    <p>No tasks scheduled for this day</p>
                    <button 
                      className="mt-2 text-primary-600 dark:text-primary-400 hover:underline"
                      onClick={() => {
                        document.getElementById('dayDetailModal').classList.add('hidden');
                        document.getElementById('newTaskModal').classList.remove('hidden');
                      }}
                    >
                      + Add a task
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
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
                  onChange={(e) => setNewProject(prev => ({ ...prev, startDate: e.target.value }))}
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
                  onChange={(e) => setNewProject(prev => ({ ...prev, dueDate: e.target.value }))}
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
                  onChange={(e) => setNewProject(prev => ({ ...prev, status: e.target.value }))}
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
                  onChange={(e) => setNewProject(prev => ({ ...prev, priority: e.target.value }))}
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
                onChange={(e) => setNewProject(prev => ({ ...prev, manager: e.target.value }))}
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
                onChange={(e) => setNewProject(prev => ({ ...prev, category: e.target.value }))}
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
      
      {/* Helper function for status badges */}
      {(() => {
        function getStatusBadge(status) {
          const statusConfig = {
            todo: { color: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300', label: 'To Do' },
            inProgress: { color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300', label: 'In Progress' },
            review: { color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300', label: 'Review' },
            done: { color: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300', label: 'Done' }
          };
          
          return (
            <span className={cn(
              "px-1.5 py-0.5 text-xs font-medium rounded-full", 
              statusConfig[status].color
            )}>
              {statusConfig[status].label}
            </span>
          );
        }
        
        // For use in JSX
        return null;
      })()}
    </div>
  );
};

export default CalendarView;
