import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import Sidebar from '../components/Sidebar';
import Topbar from '../components/Topbar';
import { useTheme } from '../context/ThemeContext';
import ShadcnButton from '../components/ShadcnButton';
import ShadcnToggle from '../components/ShadcnToggle';
import ShadcnTabs from '../components/ShadcnTabs';
import { Card, CardContent } from '../components/ui/card';
import { Switch } from '../components/ui/switch';

/**
 * Settings Page Component
 * 
 * Cette page permet à l'utilisateur de configurer ses préférences personnelles,
 * les notifications, la sécurité et l'apparence de l'application.
 * 
 * Utilise les composants Shadcn UI pour une expérience utilisateur cohérente
 * et une intégration avec le système de thème.
 * 
 * @returns {JSX.Element} - Page de paramètres rendue avec des composants Shadcn UI
 */
const Settings = () => {
  const { admin } = useSelector(state => state.auth);
  const [activeTab, setActiveTab] = useState('profile');
  const { theme, switchTheme } = useTheme();
  
  const [formData, setFormData] = useState({
    name: admin.name,
    email: admin.email,
    avatar: admin.avatar,
    notificationsEmail: true,
    notificationsApp: true,
    theme: theme,
    language: 'en',
    twoFactorAuth: false
  });

  // Update formData when theme changes in context
  useEffect(() => {
    setFormData(prev => ({
      ...prev,
      theme
    }));
  }, [theme]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    // If theme is changed, update the theme in context
    if (name === 'theme') {
      switchTheme(value);
    }
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleToggleChange = (name) => (checked) => {
    setFormData(prev => ({
      ...prev,
      [name]: checked
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would actually save the settings
    alert('Settings saved successfully!');
  };

  // Profile Tab Content
  const ProfileContent = () => (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Profile Settings</h2>
      
      <form onSubmit={handleSubmit}>
        <div className="space-y-4">
          {/* Avatar */}
          <div className="flex items-center space-x-4">
            <img 
              src={formData.avatar} 
              alt={formData.name} 
              className="h-16 w-16 rounded-full object-cover border border-gray-200 dark:border-gray-700"
            />
            <div>
              <ShadcnButton variant="outline" type="button">
                Change Avatar
              </ShadcnButton>
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">JPG, GIF or PNG. 1MB max.</p>
            </div>
          </div>
          
          {/* Name */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Name</label>
            <input 
              type="text" 
              name="name" 
              id="name" 
              value={formData.name}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm p-2 border dark:bg-gray-800 dark:text-gray-100"
            />
          </div>
          
          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
            <input 
              type="email" 
              name="email" 
              id="email" 
              value={formData.email}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm p-2 border dark:bg-gray-800 dark:text-gray-100"
            />
          </div>

          {/* Language */}
          <div>
            <label htmlFor="language" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Language</label>
            <select 
              name="language" 
              id="language" 
              value={formData.language}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm p-2 border dark:bg-gray-800 dark:text-gray-100"
            >
              <option value="en">English</option>
              <option value="fr">Français</option>
              <option value="es">Español</option>
              <option value="de">Deutsch</option>
            </select>
          </div>
          
          <div className="flex justify-end pt-5">
            <ShadcnButton variant="outline" type="button" className="mr-3">
              Cancel
            </ShadcnButton>
            <ShadcnButton type="submit">
              Save Changes
            </ShadcnButton>
          </div>
        </div>
      </form>
    </div>
  );

  // Notifications Tab Content
  const NotificationsContent = () => (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Notification Preferences</h2>
      
      <div className="space-y-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-medium text-gray-900 dark:text-gray-100">Email Notifications</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">Receive updates, alerts and messages via email</p>
              </div>
              <ShadcnToggle 
                checked={formData.notificationsEmail}
                onCheckedChange={handleToggleChange('notificationsEmail')}
              />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-medium text-gray-900 dark:text-gray-100">Push Notifications</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">Receive in-app notifications for activities and messages</p>
              </div>
              <ShadcnToggle 
                checked={formData.notificationsApp}
                onCheckedChange={handleToggleChange('notificationsApp')}
              />
            </div>
          </CardContent>
        </Card>
        
        <div className="flex justify-end pt-5">
          <ShadcnButton type="button">
            Save Preferences
          </ShadcnButton>
        </div>
      </div>
    </div>
  );

  // Security Tab Content
  const SecurityContent = () => (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Security Settings</h2>
      
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-medium text-gray-900 dark:text-gray-100">Two-Factor Authentication</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">Add an extra layer of security to your account</p>
            </div>
            <ShadcnToggle 
              checked={formData.twoFactorAuth}
              onCheckedChange={handleToggleChange('twoFactorAuth')}
            />
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-6 space-y-4">
          <h3 className="text-base font-medium text-gray-900 dark:text-gray-100">Change Password</h3>
          
          <div>
            <label htmlFor="current-password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Current Password</label>
            <input 
              type="password" 
              id="current-password" 
              className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm p-2 border dark:bg-gray-800 dark:text-gray-100"
            />
          </div>
          
          <div>
            <label htmlFor="new-password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">New Password</label>
            <input 
              type="password" 
              id="new-password" 
              className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm p-2 border dark:bg-gray-800 dark:text-gray-100"
            />
          </div>
          
          <div>
            <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Confirm New Password</label>
            <input 
              type="password" 
              id="confirm-password" 
              className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm p-2 border dark:bg-gray-800 dark:text-gray-100"
            />
          </div>
          
          <div className="flex justify-end pt-5">
            <ShadcnButton variant="destructive" type="button">
              Change Password
            </ShadcnButton>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  // Appearance Tab Content
  const AppearanceContent = () => (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Appearance Settings</h2>
      
      <Card>
        <CardContent className="p-6">
          <div className="space-y-4">
            <div>
              <label className="text-base font-medium text-gray-900 dark:text-gray-100">Theme Mode</label>
              <div className="mt-4 grid grid-cols-2 gap-4">
                <label className={`
                  flex flex-col items-center justify-center p-4 border rounded-lg cursor-pointer
                  ${formData.theme === 'light' 
                    ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300' 
                    : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800'}
                `}>
                  <input 
                    type="radio" 
                    name="theme" 
                    value="light" 
                    checked={formData.theme === 'light'}
                    onChange={handleChange}
                    className="sr-only"
                  />
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                  <span className="mt-1 font-medium">Light Mode</span>
                </label>
                <label className={`
                  flex flex-col items-center justify-center p-4 border rounded-lg cursor-pointer
                  ${formData.theme === 'dark' 
                    ? 'border-primary-500 bg-primary-900/20 text-primary-300' 
                    : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800'}
                `}>
                  <input 
                    type="radio" 
                    name="theme" 
                    value="dark" 
                    checked={formData.theme === 'dark'}
                    onChange={handleChange}
                    className="sr-only"
                  />
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                  </svg>
                  <span className="mt-1 font-medium">Dark Mode</span>
                </label>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  // Define tabs for the ShadcnTabs component
  const tabs = [
    { value: 'profile', label: 'Profile', content: <ProfileContent /> },
    { value: 'notifications', label: 'Notifications', content: <NotificationsContent /> },
    { value: 'security', label: 'Security', content: <SecurityContent /> },
    { value: 'appearance', label: 'Appearance', content: <AppearanceContent /> }
  ];

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
      <div className="flex min-h-screen">
        <Sidebar />
        <div className="flex-1 flex flex-col w-full lg:ml-0">
          <Topbar />
          <main className="flex-1 w-full px-4 sm:px-6 lg:px-8 py-6">
            <div className="max-w-4xl mx-auto">
              {/* Header */}
              <div className="mb-8">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-6">
                  <div className="flex-1">
                    <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-2">Settings</h1>
                    <p className="text-lg text-gray-600 dark:text-gray-400">Manage your account and application preferences</p>
                  </div>
                </div>
              </div>
              
              {/* Settings Tabs */}
              <div className="bg-white dark:bg-gray-900 shadow-card rounded-xl overflow-hidden border border-gray-100 dark:border-gray-800">
                <ShadcnTabs 
                  tabs={tabs} 
                  defaultValue={activeTab} 
                  onValueChange={setActiveTab} 
                  variant="underline"
                />
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default Settings;
