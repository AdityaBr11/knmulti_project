import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import httpService from "../../lib/httpService";

const API_URL = `/notify/`;

const initialState = {
  notify: [],
  isSuccess: false,
  isLoading: false
}

// create notification 
export const createNotify = createAsyncThunk('notify/create', async(notifyData, thunkAPI) => {
  
  const response = await httpService.post(API_URL, { ...notifyData });
  console.log('response',notifyData);
  return response.data;
})

// get Notification of the user
export const getNotify = createAsyncThunk('notify/get', async(empId) => {
  const response = await httpService.get(`${API_URL}?createdBy=${empId}`);
  return response.data;
})

export const deleteNotify = createAsyncThunk('notify/delete', async(notifyId) => {
  const response = await httpService.delete(`${API_URL}/${notifyId}`);
  return response.data;
})

export const notifySlice = createSlice({
  name: "notification",
  initialState,
  reducers: {
    reset: (state) => initialState
  },
  extraReducers: (builder) => {
    builder
    .addCase(createNotify.pending, (state) => {
      state.isLoading = true
    })
    .addCase(createNotify.fulfilled, (state, action) => {
      state.isLoading = false
      state.isSuccess = true
      state.notify.unshift(action.payload)
    })
    .addCase(createNotify.rejected, (state) => {
      state.isLoading = false
      state.isSuccess = false
    })
    .addCase(getNotify.pending, (state) => {
      state.isLoading = true
    })
    .addCase(getNotify.fulfilled, (state, action) => {
      state.isLoading = false
      state.isSuccess = true
      state.notify = action.payload
    })
    .addCase(getNotify.rejected, (state) => {
      state.isLoading = false
      state.isSuccess = false
    })
    .addCase(deleteNotify.pending, (state) => {
      state.isLoading = true
    })
    .addCase(deleteNotify.fulfilled, (state, action) => {
      state.isLoading = false
      state.isSuccess = true
      state.notify = state.notify.filter(r => r._id !== action.payload?._id)
    })
    .addCase(deleteNotify.rejected, (state) => {
      state.isLoading = false
      state.isSuccess = false
    })
  }
})

export const { reset } = notifySlice.actions
export default notifySlice.reducer