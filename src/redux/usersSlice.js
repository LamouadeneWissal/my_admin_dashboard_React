import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

/**
 * Async thunk for fetching users from the API
 * @param {number} page - Current page number for pagination (defaults to 1)
 * @returns {Object} - Normalized user data with pagination information
 */
export const fetchUsers = createAsyncThunk(
  'users/fetchUsers',
  async (page = 1, { rejectWithValue }) => {
    try {
      // Using DummyJSON API to fetch 100 random users
      // This gives us enough data to demonstrate pagination client-side
      const userResponse = await fetch('https://dummyjson.com/users?limit=100');
      
      // Handle API errors gracefully
      if (!userResponse.ok) {
        throw new Error('Failed to fetch users');
      }
      
      const userData = await userResponse.json();
      
      // Implement client-side pagination
      const perPage = 10; // Number of users per page
      const start = (page - 1) * perPage;
      const end = start + perPage;
      const paginatedUsers = userData.users.slice(start, end);
      
      // Add additional details to each user or transform existing data
      const usersWithDetails = paginatedUsers.map(user => ({
        id: user.id,
        email: user.email,
        first_name: user.firstName,
        last_name: user.lastName,
        avatar: user.image, // Use the provided image URL
        active: Math.random() > 0.3, // Randomly set some users as inactive
        role: ['Admin', 'User', 'Editor', 'Viewer'][Math.floor(Math.random() * 4)],
        lastActive: new Date(Date.now() - Math.floor(Math.random() * 10000000000)).toISOString(),
        createdAt: new Date(Date.now() - Math.floor(Math.random() * 31536000000)).toISOString()
      }));
      
      return {
        users: usersWithDetails,
        totalPages: Math.ceil(userData.total / perPage),
        totalCount: userData.total,
        page: page
      };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Async thunk for user details
export const fetchUserDetails = createAsyncThunk(
  'users/fetchUserDetails',
  async (userId, { rejectWithValue }) => {
    try {
      const response = await fetch(`https://reqres.in/api/users/${userId}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch user details');
      }
      
      const data = await response.json();
      return data.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const initialState = {
  list: [],
  status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null,
  currentPage: 1,
  totalPages: 0,
  totalCount: 0,
  searchTerm: '',
  selectedUser: null,
  selectedUserStatus: 'idle',
  lastFetch: null // Add this to track when we last fetched data
};

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    toggleUserStatus: (state, action) => {
      const user = state.list.find(user => user.id === action.payload);
      if (user) {
        user.active = !user.active;
      }
    },
    deleteUser: (state, action) => {
      state.list = state.list.filter(user => user.id !== action.payload);
      
      // If we deleted the last user on a page and it's not the first page,
      // we should go back to the previous page
      if (state.list.length === 0 && state.currentPage > 1) {
        state.currentPage -= 1;
      }
    },
    setSearchTerm: (state, action) => {
      state.searchTerm = action.payload;
    },
    setCurrentPage: (state, action) => {
      state.currentPage = action.payload;
    },
    clearSelectedUser: (state) => {
      state.selectedUser = null;
      state.selectedUserStatus = 'idle';
    }
  },
  extraReducers: (builder) => {
    builder
      // Handle fetchUsers lifecycle
      .addCase(fetchUsers.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.list = action.payload.users;
        state.totalPages = action.payload.totalPages;
        state.totalCount = action.payload.totalCount;
        state.currentPage = action.payload.page;
        state.error = null;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      
      // Handle fetchUserDetails lifecycle
      .addCase(fetchUserDetails.pending, (state) => {
        state.selectedUserStatus = 'loading';
      })
      .addCase(fetchUserDetails.fulfilled, (state, action) => {
        state.selectedUserStatus = 'succeeded';
        state.selectedUser = action.payload;
      })
      .addCase(fetchUserDetails.rejected, (state, action) => {
        state.selectedUserStatus = 'failed';
        state.error = action.payload;
      });
  }
});

export const { toggleUserStatus, deleteUser, setSearchTerm, setCurrentPage } = usersSlice.actions;
export default usersSlice.reducer;
