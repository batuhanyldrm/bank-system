import { createAsyncThunk } from "@reduxjs/toolkit";
import { loginRequest } from "./authService";

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