import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Provider } from 'react-redux';
import store from './redux/store';
import { SidebarProvider } from './context/SidebarContext';

// Import global dark mode overrides (must be after other imports)
import './darkModeOverrides.css';

// Pages
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Users from './pages/Users';
import Settings from './pages/Settings';
import AdvancedAnalytics from './pages/AdvancedAnalytics';
import TaskManagement from './pages/TaskManagement';
import ShadcnDemo from './components/ShadcnDemo';
import { ToastProvider } from './components/ui/toast-container';
import NotificationsPage from './pages/Notifications';

// Communication pages
import CommunicationHub from './pages/communication';
import MessagesPage from './pages/communication/messages';
import AnnouncementsPage from './pages/communication/announcements';
import TeamSpacesPage from './pages/communication/team-spaces';
import IntegrationsPage from './pages/communication/integrations';

// Task Management subpages
import KanbanBoard from './pages/task-management/KanbanBoard';
import TaskList from './pages/task-management/TaskList';
import CalendarView from './pages/task-management/CalendarView';

// Protected route component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useSelector((state) => state.auth);
  
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  return children;
};

function App() {
  return (
    <Provider store={store}>
      <SidebarProvider>
        <ToastProvider>
          <Router>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route 
                path="/dashboard" 
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/users" 
                element={
                  <ProtectedRoute>
                    <Users />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/settings" 
                element={
                  <ProtectedRoute>
                    <Settings />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/ui-components" 
                element={
                  <ProtectedRoute>
                    <div className="min-h-screen w-full bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
                      <ShadcnDemo />
                    </div>
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/advanced-analytics" 
                element={
                  <ProtectedRoute>
                    <AdvancedAnalytics />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/notifications" 
                element={
                  <ProtectedRoute>
                    <NotificationsPage />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/task-management" 
                element={
                  <ProtectedRoute>
                    <TaskManagement />
                  </ProtectedRoute>
                } 
              />
              {/* Task Management Subpages */}
              <Route 
                path="/task-management/kanban" 
                element={
                  <ProtectedRoute>
                    <KanbanBoard />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/task-management/list" 
                element={
                  <ProtectedRoute>
                    <TaskList />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/task-management/calendar" 
                element={
                  <ProtectedRoute>
                    <CalendarView />
                  </ProtectedRoute>
                } 
              />
              {/* Communication Routes */}
              <Route 
                path="/communication" 
                element={
                  <ProtectedRoute>
                    <CommunicationHub />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/communication/messages" 
                element={
                  <ProtectedRoute>
                    <MessagesPage />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/communication/announcements" 
                element={
                  <ProtectedRoute>
                    <AnnouncementsPage />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/communication/team-spaces" 
                element={
                  <ProtectedRoute>
                    <TeamSpacesPage />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/communication/integrations" 
                element={
                  <ProtectedRoute>
                    <IntegrationsPage />
                  </ProtectedRoute>
                } 
              />
              <Route path="/" element={<Navigate to="/login" />} />
              <Route path="*" element={<Navigate to="/login" />} />
            </Routes>
          </Router>
        </ToastProvider>
      </SidebarProvider>
    </Provider>
  );
}

export default App;
