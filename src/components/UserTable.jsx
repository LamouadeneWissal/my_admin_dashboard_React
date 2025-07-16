import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { toggleUserStatus, deleteUser } from '../redux/usersSlice';

/**
 * UserTable Component
 * 
 * Displays a responsive table of users with actions like toggle status and delete.
 * Includes search filtering and confirmation dialogs for deletions.
 * 
 * @param {Array} users - List of user objects to display in the table
 * @param {string} searchTerm - Current search term to filter users
 * @returns {JSX.Element} - Rendered user table component
 */
const UserTable = ({ users, searchTerm }) => {
  const dispatch = useDispatch();
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  // Filter users based on search term
  const filteredUsers = users.filter(user => {
    const fullName = `${user.first_name} ${user.last_name}`;
    return fullName.toLowerCase().includes(searchTerm.toLowerCase()) || 
           user.email.toLowerCase().includes(searchTerm.toLowerCase());
  });

  /**
   * Toggles the active status of a user
   * @param {number|string} id - User ID to toggle status for
   */
  const handleToggleStatus = (id) => {
    dispatch(toggleUserStatus(id));
  };

  /**
   * Deletes a user after confirmation
   * @param {number|string} id - User ID to delete
   */
  const handleDeleteUser = (id) => {
    dispatch(deleteUser(id));
    setDeleteConfirm(null);
  };

  /**
   * Sets the user ID for which we're showing delete confirmation
   * @param {number|string} id - User ID to confirm deletion
   */
  const confirmDelete = (id) => {
    setDeleteConfirm(id);
  };

  /**
   * Cancels the delete confirmation dialog
   */
  const cancelDelete = () => {
    setDeleteConfirm(null);
  };

  // Show loading state when no users are available
  if (users.length === 0) {
    return (
      <div className="w-full flex justify-center py-12">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
          <p className="mt-4 text-gray-500">Loading users...</p>
        </div>
      </div>
    );
  }

  // Render the users table
  return (
    <div className="bg-white shadow-sm rounded-lg overflow-hidden border border-gray-100">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          {/* Table header with column titles - More compact */}
          <thead className="bg-gradient-to-r from-gray-50 to-white">
            <tr>
              <th scope="col" className="px-3 py-2 text-left text-xs font-semibold text-primary-600 uppercase tracking-wider">
                User
              </th>
              <th scope="col" className="px-3 py-2 text-left text-xs font-semibold text-primary-600 uppercase tracking-wider">
                Email & Role
              </th>
              <th scope="col" className="px-3 py-2 text-left text-xs font-semibold text-primary-600 uppercase tracking-wider">
                Status
              </th>
              <th scope="col" className="px-3 py-2 text-right text-xs font-semibold text-primary-600 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          {/* Table body with user rows - More compact */}
          <tbody className="bg-white divide-y divide-gray-100">
            {filteredUsers.map((user) => (
              <tr key={user.id} className="transition-all duration-200 hover:bg-gray-50">
                {/* User profile info (avatar, name) - More compact */}
                <td className="px-3 py-2 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="h-8 w-8 flex-shrink-0 rounded-md overflow-hidden border border-gray-200 shadow-sm">
                      <img
                        className="h-8 w-8 object-cover"
                        src={user.avatar}
                        alt={`${user.first_name} ${user.last_name}`}
                      />
                    </div>
                    <div className="ml-3">
                      <div className="text-xs font-medium text-gray-900">{`${user.first_name} ${user.last_name}`}</div>
                      <div className="text-xs text-gray-500">{user.role || 'User'}</div>
                    </div>
                  </div>
                </td>
                {/* User contact and activity info - More compact */}
                <td className="px-3 py-2 whitespace-nowrap">
                  <div className="text-xs text-gray-700">{user.email}</div>
                  <div className="text-xs text-gray-400">Last active: {new Date(user.lastActive || Date.now()).toLocaleDateString()}</div>
                </td>
                {/* User status toggle button - More compact */}
                <td className="px-3 py-2 whitespace-nowrap">
                  <button
                    onClick={() => handleToggleStatus(user.id)}
                    className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium transition-all ${
                      user.active
                        ? 'bg-gradient-to-r from-green-500 to-green-400 text-white hover:shadow-md'
                        : 'bg-gradient-to-r from-gray-300 to-gray-200 text-gray-700 hover:shadow-md'
                    }`}
                  >
                    <span className={`mr-1 h-1.5 w-1.5 rounded-full bg-white ${user.active ? 'animate-pulse-subtle' : ''}`}></span>
                    {user.active ? 'Active' : 'Inactive'}
                  </button>
                </td>
                {/* Action buttons or delete confirmation - More compact */}
                <td className="px-3 py-2 whitespace-nowrap text-right text-xs font-medium">
                  {deleteConfirm === user.id ? (
                    // Delete confirmation dialog - More compact
                    <div className="flex items-center justify-end space-x-1">
                      <span className="text-xs text-gray-500">Confirm?</span>
                      <button
                        onClick={() => handleDeleteUser(user.id)}
                        className="inline-flex items-center px-2 py-1 bg-gradient-to-r from-red-500 to-red-600 rounded-md shadow-sm font-medium text-xs text-white hover:from-red-600 hover:to-red-700 focus:outline-none transition-all"
                      >
                        Yes
                      </button>
                      <button
                        onClick={cancelDelete}
                        className="inline-flex items-center px-2 py-1 bg-white border border-gray-200 rounded-md shadow-sm font-medium text-xs text-gray-700 hover:bg-gray-50 focus:outline-none transition-all"
                      >
                        No
                      </button>
                    </div>
                  ) : (
                    // Regular action buttons - More compact
                    <div className="flex items-center justify-end space-x-1">
                      <button
                        onClick={() => {/* View user details */}}
                        className="inline-flex items-center px-1.5 py-1 border border-gray-200 rounded-md text-xs font-medium text-primary-600 bg-white hover:bg-primary-50 transition-colors shadow-sm"
                        title="View Profile"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      </button>
                      <button
                        onClick={() => {/* Edit user */}}
                        className="inline-flex items-center px-1.5 py-1 border border-gray-200 rounded-md text-xs font-medium text-primary-600 bg-white hover:bg-primary-50 transition-colors shadow-sm"
                        title="Edit User"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                        </svg>
                      </button>
                      <button
                        onClick={() => confirmDelete(user.id)}
                        className="inline-flex items-center px-1.5 py-1 border border-red-200 rounded-md text-xs font-medium text-red-500 bg-white hover:bg-red-50 transition-colors shadow-sm"
                        title="Delete User"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* No results message when search returns empty - More compact */}
      {filteredUsers.length === 0 && (
        <div className="flex flex-col items-center justify-center py-6 px-4 text-center">
          <svg className="h-8 w-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 className="mt-1 text-xs font-medium text-gray-900">No users found</h3>
          <p className="mt-0.5 text-xs text-gray-500">No users matching your search criteria.</p>
        </div>
      )}
    </div>
  );
};

export default UserTable;
