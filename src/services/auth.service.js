import { post, get } from "../api/apiHelper";

import {
  REGISTER_URL,
  LOGIN_URL,
  REFRESH_URL,
  LOGOUT_URL,
  CURRENT_USER_URL
} from "../api/urlHelper";

// Register user
export const registerUser = (payload) => post(REGISTER_URL, payload);

// Login user
export const loginUser = (payload) => post(LOGIN_URL, payload);

// Refresh access token
export const refreshAccessToken = () => post(REFRESH_URL);

// Logout user
export const logoutUser = () => post(LOGOUT_URL);

// Current user
export const getCurrentUser = () => get(CURRENT_USER_URL);
