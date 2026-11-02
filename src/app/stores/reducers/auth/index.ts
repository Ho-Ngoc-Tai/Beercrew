import { createSlice, PayloadAction, createSelector } from "@reduxjs/toolkit";
import { LOADING_STATUS, LoadingStatus } from "@constants/status";
import { UserProfile, LoginPayload } from "@interfaces/auth";
import type { RootState } from "@stores/index";

export interface AuthState {
  user: UserProfile | null;
  isAuthenticated: boolean;
  status: LoadingStatus;
  error: unknown;
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  status: LOADING_STATUS.IDLE,
  error: null,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginAction: (state, _action: PayloadAction<LoginPayload>) => {
      state.status = LOADING_STATUS.LOADING;
      state.error = null;
    },
    loginSuccess: (state, action: PayloadAction<UserProfile>) => {
      state.status = LOADING_STATUS.SUCCESS;
      state.user = action.payload;
      state.isAuthenticated = true;
      state.error = null;
    },
    loginFailure: (state, action: PayloadAction<unknown>) => {
      state.status = LOADING_STATUS.ERROR;
      state.error = action.payload;
      state.isAuthenticated = false;
    },
    getUserInfoAction: (state) => {
      state.status = LOADING_STATUS.LOADING;
    },
    getUserInfoSuccess: (state, action: PayloadAction<UserProfile>) => {
      state.status = LOADING_STATUS.SUCCESS;
      state.user = action.payload;
      state.isAuthenticated = true;
    },
    getUserInfoFailure: (state, action: PayloadAction<unknown>) => {
      state.status = LOADING_STATUS.IDLE;
      state.error = action.payload;
      state.isAuthenticated = false;
    },
    logoutAction: (state) => {
      state.status = LOADING_STATUS.LOADING;
    },
    logoutSuccess: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.status = LOADING_STATUS.IDLE;
    },
  },
});

export const {
  loginAction,
  loginSuccess,
  loginFailure,
  getUserInfoAction,
  getUserInfoSuccess,
  getUserInfoFailure,
  logoutAction,
  logoutSuccess,
} = authSlice.actions;

export const authSelector = (state: RootState) => state.auth;

export default authSlice.reducer;
