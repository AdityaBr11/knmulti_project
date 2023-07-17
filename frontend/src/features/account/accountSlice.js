import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import httpService from "../../lib/httpService";

const API_URL = `/generalledger/`;

const initialState = {
  accounts: [],
  userType: {},
  userTrx: [],
  isSuccess: false,
  isLoading: false
}

// create a transaction in a ledger 
export const createLedger = createAsyncThunk('account/create', async (ledgerData, thunkAPI) => {
    // const token = thunkAPI.getState().authentication.value.token;
    const response = await httpService.post(API_URL, ledgerData);
    return response.data
})

// create a transaction in a ledger 
export const updateLedger = createAsyncThunk('account/update', async (ledgerId, ledgerData, thunkAPI) => {
    // const token = thunkAPI.getState().authentication.value.token;
    const response = await httpService.put(`${API_URL}${ledgerId}`, ledgerData);
    return response.data;
})

// get All transaction in a ledger 
export const getLedgers = createAsyncThunk('account/get', async() => {
  const response = await httpService.get(API_URL);
  return response.data;
})

export const getUsertype = createAsyncThunk('account/usertype/get', async() => {
  const response = await httpService.get(`${API_URL}/usertypelist`);
  return response.data;
})

export const getTransactionByUserId = createAsyncThunk('account/trxUser/get', async(userId) => {
  const response = await httpService.get(`${API_URL}/usertransaction?clientName.userId=${userId}`);
  return response.data;
})

export const accountSlice = createSlice({
  name: 'account',
  initialState,
  reducers: {
    reset: (state) => initialState
  },
  extraReducers: (builder) => {
    builder
      .addCase(createLedger.pending, (state) => {
        state.isLoading = true
      })
      .addCase(createLedger.fulfilled, (state, action) => {
        state.isLoading = false
        state.isSuccess = true
        state.accounts.push(action.payload)
      })
      .addCase(createLedger.rejected, (state) => {
        state.isLoading = false
        state.isSuccess = false
      })
      .addCase(updateLedger.pending, (state) => {
        state.isLoading = true
      })
      .addCase(updateLedger.fulfilled, (state, action) => {
        state.isLoading = false
        state.isSuccess = true
        state.accounts = [ ...state.accounts, action.payload ]
      })
      .addCase(updateLedger.rejected, (state) => {
        state.isLoading = false
        state.isSuccess = false
      })
      .addCase(getLedgers.pending, (state) => {
        state.isLoading = true
      })
      .addCase(getLedgers.fulfilled, (state, action) => {
        state.isLoading = false
        state.isSuccess = true
        state.accounts = action.payload
      })
      .addCase(getLedgers.rejected, (state) => {
        state.isLoading = false
        state.isSuccess = false
      })
      .addCase(getUsertype.pending, (state) => {
        state.isLoading = true
      })
      .addCase(getUsertype.fulfilled, (state, action) => {
        state.isLoading = false
        state.isSuccess = true
        state.userType = action.payload
      })
      .addCase(getUsertype.rejected, (state) => {
        state.isLoading = false
        state.isSuccess = false
      })
      .addCase(getTransactionByUserId.pending, (state) => {
        state.isLoading = true
      })
      .addCase(getTransactionByUserId.fulfilled, (state, action) => {
        state.isLoading = false
        state.isSuccess = true
        state.userTrx = action.payload
      })
      .addCase(getTransactionByUserId.rejected, (state) => {
        state.isLoading = false
        state.isSuccess = false
      })
  }
})

export const { reset } = accountSlice.actions
export default accountSlice.reducer