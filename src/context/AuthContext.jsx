
import { createContext, useState, useEffect } from "react";

import { saveAccessToken, clearAccessToken, getAccessToken } from "../api/tokenHelper";

import { useLogin, useLogout } from "../hooks/useAuthMutations";
import { getCurrentUser } from "../services/auth.service";
import { refreshAccessToken } from "../api/apiHelper";

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const storedUser = sessionStorage.getItem("authUser");
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const [isInitializing, setIsInitializing] = useState(true);

  const loginMutation = useLogin();
  const logoutMutation = useLogout();

  // Restore authentication when the app starts
  useEffect(() => {
    const initializeAuth = async () => {
      try {

    if (!getAccessToken()) {
        await refreshAccessToken();
      }
        const response = await getCurrentUser();
        const currentUser = response.data.user;

        setUser(currentUser);
        sessionStorage.setItem("authUser", JSON.stringify(currentUser));
      } catch (error) {
          setUser(null);
          sessionStorage.removeItem("authUser");
          console.log(error)
      } finally {
        setIsInitializing(false);
      }
    };

    initializeAuth();
  }, []);

  // Login
  const login = async (payload) => {
    const response = await loginMutation.mutateAsync(payload);
    const data = response.data;

    saveAccessToken(data.access);
    sessionStorage.setItem("authUser", JSON.stringify(data.user));

    setUser(data.user);

    return data;
  };

  // Logout
  const logout = async () => {
    try {
      await logoutMutation.mutateAsync();
    } finally {
      clearAccessToken();
      sessionStorage.removeItem("authUser");
      setUser(null);
    }
  };

  const value = {
    user,
    isAuthenticated: !!user,
    isLoading: isInitializing || loginMutation.isPending,
    isLoggingOut: logoutMutation.isPending,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
