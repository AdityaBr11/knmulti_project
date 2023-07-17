import { createSlice } from '@reduxjs/toolkit';

export const holidaySlice = createSlice({
  name: 'holiday',
  initialState: {
    value: [],
    fetched: false,
  },
  reducers: {
    appendHolidayStore: (state, action) => {
      state.value.push(action.payload);
    },
    setHolidayStore: (state, action) => {
      state.value = action.payload;
    },
    setFetched: (state, action) => {
      state.fetched = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { appendHolidayStore, setHolidayStore, setFetched } =
  holidaySlice.actions;

export default holidaySlice.reducer;
