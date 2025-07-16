import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUsers, setCurrentPage, setSearchTerm } from '../redux/usersSlice';
import Sidebar from '../components/Sidebar';
import Topbar from '../components/Topbar';
import UserTable from '../components/UserTable';
import Pagination from '../components/Pagination';
import ShadcnStatCard from '../components/ShadcnStatCard';

/**
 * Users Management Page Component
 * 
 * Main page for managing users with features like:
 * - Users listing in table format
 * - Search functionality
 * - Pagination controls
 * - User status management
 * - User deletion
 * 
 * Uses Redux for state management and data fetching.
 * 
 * @returns {JSX.Element} - Rendered users management page
 */
const Users = () => {
  const dispatch = useDispatch();
  // Get user-related state from Redux store
  const { list, status, error, currentPage, totalPages, totalCount, searchTerm } = useSelector(state => state.users);
  
  // Local search state to avoid too many dispatches
  const [localSearch, setLocalSearch] = useState(searchTerm);
  
  /**
   * Fetch users data when component mounts or page changes
   */
  useEffect(() => {
    dispatch(fetchUsers(currentPage));
  }, [dispatch, currentPage]);
  
  /**
   * Handle pagination controls
   * @param {number} newPage - The page number to navigate to
   */
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      dispatch(setCurrentPage(newPage));
    }
  };
  
  /**
   * Update local search term state on input change
   * @param {Event} e - Input change event
   */
  const handleSearchChange = (e) => {
    setLocalSearch(e.target.value);
  };
  
  /**
   * Submit search term to Redux store on form submission
   * @param {Event} e - Form submit event
   */
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    dispatch(setSearchTerm(localSearch));
  };
  
  /**
   * Submit search on Enter key press
   * @param {Event} e - Keypress event
   */
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      dispatch(setSearchTerm(localSearch));
    }
  };
  
  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="flex min-h-screen">
        {/* Sidebar Navigation */}
        <Sidebar />
        <div className="flex-1 flex flex-col w-full lg:ml-0">
          {/* Top Navigation Bar */}
          <Topbar />
          <main className="flex-1 w-full px-2 sm:px-3 lg:px-5 py-4">
            <div className="max-w-none w-full">
              {/* Page Header section - More compact */}
              <div className="mb-4">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 mb-3">
                  <div className="flex-1">
                    <h1 className="text-2xl font-bold text-gray-900 mb-1">User Management</h1>
                    <p className="text-sm text-gray-600">Manage your team members and their account permissions</p>
                  </div>
                  {/* Add user button - More compact */}
                  <div className="flex-shrink-0">
                    <button className="px-4 py-2 bg-gradient-to-r from-primary-600 to-primary-500 text-white rounded-xl shadow-md hover:shadow-lg transform transition-all duration-200 hover:-translate-y-1 flex items-center justify-center space-x-2 text-sm font-medium">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                      <span>Add New User</span>
                    </button>
                  </div>
                </div>
              </div>
            
            {/* Stats cards - User metrics - More compact */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
              {/* Total Users card */}
              <ShadcnStatCard
                title="Total Users"
                value={totalCount || '...'}
                icon={
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                }
                color="blue"
              />
              
              {/* Active Users card */}
              <ShadcnStatCard
                title="Active Users"
                value={list.filter(user => user.active).length || '...'}
                icon={
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                }
                color="green"
              />
              
              {/* Inactive Users card */}
              <ShadcnStatCard
                title="Inactive Users"
                value={list.filter(user => !user.active).length || '...'}
                icon={
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                }
                color="red"
              />
              
              {/* Admin Roles card */}
              <ShadcnStatCard
                title="Admin Roles"
                value={list.filter(user => user.role === 'Admin').length || '0'}
                icon={
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                }
                color="purple"
              />
            </div>
            
            {/* Search and filter section - More compact */}
            <div className="mb-4">
              <div className="bg-white rounded-lg shadow-md border border-gray-100 p-3">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
                  <div className="flex-1">
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg className="h-4 w-4 text-primary-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                          <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                        </svg>
                      </div>
                      {/* Search input with handlers for change and enter key - More compact */}
                      <input
                        type="text"
                        placeholder="Search users by name or email..."
                        value={localSearch}
                        onChange={handleSearchChange}
                        onKeyPress={handleKeyPress}
                        className="pl-9 py-2 block w-full rounded-lg border-gray-200 shadow-sm focus:border-primary-500 focus:ring focus:ring-primary-500 focus:ring-opacity-20 transition-all text-sm"
                      />
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {/* Search button - More compact */}
                    <button
                      onClick={handleSearchSubmit}
                      className="px-4 py-2 bg-gradient-to-r from-primary-600 to-primary-500 text-white rounded-lg shadow-md hover:shadow-lg transform transition-all duration-200 hover:-translate-y-1 flex items-center justify-center text-sm font-medium"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                      Search
                    </button>
                    {/* Filter button - More compact */}
                    <button className="px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg shadow-sm hover:bg-gray-50 transition-all hover:shadow-md flex items-center justify-center space-x-1 text-sm font-medium">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                      </svg>
                      <span>Filter</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Error state display - More compact */}
            {error && (
              <div className="bg-white border-l-4 border-red-500 text-red-700 p-3 mb-4 rounded-lg shadow-sm" role="alert">
                <div className="flex items-center">
                  <svg className="h-5 w-5 mr-2 text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  <p className="font-medium text-sm">{error}</p>
                </div>
                <p className="mt-0.5 text-xs">Please try again later or contact support.</p>
              </div>
            )}
            
            {/* Loading state indication - More compact */}
            {status === 'loading' && (
              <div className="flex justify-center items-center p-6">
                <div className="flex flex-col items-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-600 mb-2"></div>
                  <p className="text-gray-500 text-sm">Loading users...</p>
                </div>
              </div>
            )}
            
            {/* User table component - only shown when data is loaded successfully */}
            {status === 'succeeded' && (
              <UserTable users={list} searchTerm={searchTerm} />
            )}
            
            {/* Pagination controls - More compact */}
            {status === 'succeeded' && totalPages > 0 && (
              <div className="mt-4 flex flex-col sm:flex-row items-center justify-between bg-white p-2 rounded-lg shadow-sm border border-gray-100">
                <div className="text-xs text-gray-500 mb-2 sm:mb-0">
                  Showing page {currentPage} of {totalPages}
                </div>
                <Pagination 
                  currentPage={currentPage} 
                  totalPages={totalPages} 
                  onPageChange={handlePageChange} 
                />
              </div>
            )}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default Users;
