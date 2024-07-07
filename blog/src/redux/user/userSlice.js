import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  currentUser: null,
  isLoading: false,
  error: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    // sign in
    start: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    success: (state, action) => {
      state.currentUser = action.payload;
      state.isLoading = false;
      state.error = null;
    },

    failed: (state, action) => {
      state.error = action.payload;
      state.isLoading = false;
    },
  },
});

export const { start, failed, success } = userSlice.actions;

export default userSlice.reducer;
