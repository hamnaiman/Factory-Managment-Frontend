import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  isAuthenticated: false,
  loading: true,
};


const authSlice = createSlice({
  name: "auth",
  initialState,

  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload;
    },

    loginSuccess: (state, action) => {
      state.user = action.payload;
      state.isAuthenticated = true;
      state.loading = false;
    },

    logoutSuccess: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.loading = false;
    },
    setUser: (state, action) => {
  state.user = action.payload;
  state.isAuthenticated = true;
  state.loading = false;
},
finishLoading: (state) => {
  state.loading = false;
},
  },
});

export const {
  setLoading,
  loginSuccess,
  logoutSuccess,
  setUser,
   finishLoading,
} = authSlice.actions;

export default authSlice.reducer;