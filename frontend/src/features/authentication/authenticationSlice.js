import { createSlice } from '@reduxjs/toolkit';

export const authenticationSlice = createSlice({
  name: 'authetication',
  initialState: {
    value: {},
  },
  reducers: {
    setAuthticationStore: (state, action) => {
      state.value = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { setAuthticationStore } = authenticationSlice.actions;

export default authenticationSlice.reducer;
