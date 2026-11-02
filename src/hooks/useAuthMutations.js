import { useMutation } from "@tanstack/react-query";

import {
  registerUser,
  loginUser,
  logoutUser,
  refreshAccessToken,
} from "../services/auth.service";

// Register
export const useRegister = () => {
  return useMutation({
    mutationFn: registerUser,
  });
};

// Login
export const useLogin = () => {
  return useMutation({
    mutationFn: loginUser,
  });
};

// Logout
export const useLogout = () => {
  return useMutation({
    mutationFn: logoutUser,
  });
};

// Refresh token
export const useRefreshToken = () => {
  return useMutation({
    mutationFn: refreshAccessToken,
  });
};
