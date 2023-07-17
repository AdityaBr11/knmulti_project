import { createSlice } from '@reduxjs/toolkit';

export const locationSlice = createSlice({
  name: 'location',
  initialState: {
    value: [],
    fetched: false,
  },
  reducers: {
    appendLocationStore: (state, action) => {
      state.value.push(action.payload);
    },
    setLocationStore: (state, action) => {
      state.value = action.payload;
    },
    removeLocation(state, action) {
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
export const {
  appendLocationStore,
  setLocationStore,
  setFetched,
  removeLocation,
} = locationSlice.actions;

export default locationSlice.reducer;
