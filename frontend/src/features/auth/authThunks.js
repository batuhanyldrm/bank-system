import { createAsyncThunk } from "@reduxjs/toolkit";
import { getMeRequest, loginRequest } from "./authService";

export const login = createAsyncThunk(
    "auth/login", async (credentials, { rejectWithValue }) => {
        try {
            const data = await loginRequest(credentials);
            return data.user;
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || "Login failed");
        }
    }
)

export const getMe = createAsyncThunk(
  "users/me",
  async (_, { rejectWithValue }) => {
    try {
      const data = await getMeRequest();
      return data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Authentication failed"
      );
    }
  }
);