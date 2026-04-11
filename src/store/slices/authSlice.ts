import { LoginResponse, User } from "@/types/auth-types";
import { PayloadAction } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";

export interface authState {
  accessToken: string | null;
  refreshToken: string | null;
  user: User | null;
  isAuthenticated: boolean;
}
const initialState: authState = {
  accessToken: null,
  refreshToken: null,
  user: null,
  isAuthenticated: false,
};
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAccessToken: (state, action: PayloadAction<string>) => {
      state.accessToken = action.payload;
    },
    setTokens: (
      state,
      action: PayloadAction<{ accessToken: string; refreshToken: string }>,
    ) => {
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
      state.isAuthenticated = true;
    },
    clearAuth: (state) => {
      state.accessToken = null;
      state.refreshToken = null;
      state.user = null;
      state.isAuthenticated = false; // empty for now
    },
    setAuth: (state, action: PayloadAction<LoginResponse>) => {
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
      state.user = action.payload.user;
      state.isAuthenticated = true;
    },
    setUser: (state, action: PayloadAction<Partial<User> & Pick<User, "id">>) => {
      if (!state.user) return;
      state.user = { ...state.user, ...action.payload };
    },
  },
});
export const { setAccessToken, setTokens, clearAuth, setAuth, setUser } =
  authSlice.actions;
export default authSlice.reducer;
