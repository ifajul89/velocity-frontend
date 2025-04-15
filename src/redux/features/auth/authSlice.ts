import { RootState } from "@/redux/store";
import { createSlice } from "@reduxjs/toolkit";

// User interface matching the API response structure
interface User {
  id: string; // API returns 'id', not '_id'
  name: string;
  email: string;
  role: string;
  isBlocked?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

interface TUser {
  user: User | null;
  token: string | null;
}

const initialState: TUser = {
  user: null,
  token: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action) => {
      // Handle the nested structure from API response
      if (action.payload.data?.verifyUser) {
        // Login response format
        state.user = action.payload.data.verifyUser;
        state.token = action.payload.data.token;
      } else {
        // Direct format (for backward compatibility)
        const { user, token } = action.payload;
        state.user = user;
        state.token = token;
      }
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
    },
  },
});

export const { setUser, logout } = authSlice.actions;

export default authSlice.reducer;
export const currentToken = (state: RootState) => state.auth.token;
export const currentUser = (state: RootState) => state.auth.user;
