import { createSlice } from '@reduxjs/toolkit';

export const departmentSlice = createSlice({
  name: 'dartment',
  initialState: {
    value: [],
    fetched: false,
  },
  reducers: {
    appendDepartmentStore: (state, action) => {
      state.value.push(action.payload);
    },
    setDepartmentStore: (state, action) => {
      state.value = action.payload;
    },
    removeDepartment(state, action) {
      state.value = state.value.filter(
        (v) => v.departmentId !== action.payload.departmentId
      );
    },
    setFetched: (state, action) => {
      state.fetched = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { appendDepartmentStore, setDepartmentStore, setFetched } =
  departmentSlice.actions;

export default departmentSlice.reducer;
