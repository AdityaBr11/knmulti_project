import { createSlice } from '@reduxjs/toolkit';

export const employeeSlice = createSlice({
  name: 'employee',
  initialState: {
    value: [],
    fetched: false,
  },
  reducers: {
    appendEmployeeStore: (state, action) => {
      state.value.push(action.payload);
    },
    setEmployeeStore: (state, action) => {
      state.value = action.payload;
    },
    setFetched: (state, action) => {
      state.fetched = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { appendEmployeeStore, setEmployeeStore, setFetched } =
  employeeSlice.actions;

export default employeeSlice.reducer;
