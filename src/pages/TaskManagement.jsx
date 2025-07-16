import React, { useEffect } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';

/**
 * TaskManagement Component
 * 
 * This component redirects to the default Task Management view (Kanban Board)
 * since we've moved all task management functionality to separate pages.
 */
const TaskManagement = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    navigate('/task-management/kanban');
  }, [navigate]);
  
  return <Navigate to="/task-management/kanban" replace />;
};

export default TaskManagement;
