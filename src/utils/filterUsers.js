/**
 * Filter users based on search term
 * @param {Array} users - Array of user objects
 * @param {String} searchTerm - Search string to filter by
 * @returns {Array} Filtered array of users
 */
export const filterUsers = (users, searchTerm) => {
  if (!searchTerm || searchTerm.trim() === '') {
    return users;
  }
  
  const term = searchTerm.toLowerCase();
  
  return users.filter(user => {
    const fullName = `${user.first_name} ${user.last_name}`.toLowerCase();
    const email = user.email.toLowerCase();
    
    return fullName.includes(term) || email.includes(term);
  });
};
