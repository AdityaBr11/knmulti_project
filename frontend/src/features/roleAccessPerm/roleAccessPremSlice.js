import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import httpService from "../../lib/httpService";

const initialState = {
  roleAccessParams: [],
  current: null,
  isLoading: false
}

export const getRoleAccessPrem = createAsyncThunk('roleAccessPrem/get', async() => {
  const res = await httpService.get(`/roleaccessprem`);
  return res.data;
});

export const postRoleAccessPrem = createAsyncThunk('roleAccessPrem/post', async(roleAccessData) => {
  const res = await httpService.post(`/roleaccessprem`, roleAccessData);
  return res.data;
});

export const putRoleAccessPrem = createAsyncThunk('roleAccessPrem/put', async(roleAccessData) => {
  const roleId = roleAccessData._id;
  const res = await httpService.put(`/roleaccessprem/${roleId}`, roleAccessData);
  return res.data;
});

export const deleteRoleAccessPrem = createAsyncThunk('roleAccessPrem/delete', async(roleId) => {
  const res = await httpService.delete(`/roleaccessprem/${roleId}`);
  return res.data;
});

export const roleAccessPremSlice = createSlice({
  name: "roleAccessPrem",
  initialState : initialState,
  reducers : {
    reset: (state) => initialState,
    setCurrentRoleAcc: (state, action) => {
      state.current = state.roleAccessParams.filter(r => r._id === action.payload)[0]
    }
  },
  extraReducers : (builder) => {
    builder
      .addCase(getRoleAccessPrem.pending, (state) => {
        state.isLoading = true
      })
      .addCase(getRoleAccessPrem.fulfilled, (state, action) => {
        state.isLoading = false
        state.roleAccessParams = action.payload
      })
      .addCase(getRoleAccessPrem.rejected, (state) => {
        state.isLoading = false
      })
      .addCase(postRoleAccessPrem.pending, (state) => {
        state.isLoading = true
      })
      .addCase(postRoleAccessPrem.fulfilled, (state, action) => {
        state.isLoading = false
        state.roleAccessParams.push(action.payload)
        state.current = action.payload
      })
      .addCase(postRoleAccessPrem.rejected, (state) => {
        state.isLoading = false
      })
      .addCase(putRoleAccessPrem.pending, (state) => {
        state.isLoading = true
      })
      .addCase(putRoleAccessPrem.fulfilled, (state, action) => {
        state.isLoading = false
        state.roleAccessParams = state.roleAccessParams.filter(r => r._id !== action.payload._id)
        state.roleAccessParams.push(action.payload)
        state.current = action.payload
      })
      .addCase(putRoleAccessPrem.rejected, (state) => {
        state.isLoading = false
      })
      .addCase(deleteRoleAccessPrem.pending, (state) => {
        state.isLoading = true
      })
      .addCase(deleteRoleAccessPrem.fulfilled, (state, action) => {
        state.isLoading = false
        state.roleAccessParams = state.roleAccessParams.filter(r => r._id !== action.payload)
      })
      .addCase(deleteRoleAccessPrem.rejected, (state) => {
        state.isLoading = false
      })
  }
});

export const { reset, setCurrentRoleAcc } = roleAccessPremSlice.actions;

export default roleAccessPremSlice.reducer;