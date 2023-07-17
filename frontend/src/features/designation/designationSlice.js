import { createSlice } from '@reduxjs/toolkit';

export const designationSlice = createSlice({
  name: 'designation',
  initialState: {
    value: [],
    fetched: false,
  },
  reducers: {
    appendDesignationStore: (state, action) => {
      state.value.push(action.payload);
    },
    setDesignationStore: (state, action) => {
      state.value = action.payload;
    },
    removeDesignation(state, action) {
      state.value = state.value.filter(
        (v) => v.designationId !== action.payload.designationId
      );
    },
    setFetched: (state, action) => {
      state.fetched = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { appendDesignationStore, setDesignationStore, setFetched } =
  designationSlice.actions;

export default designationSlice.reducer;
