import { createContext, useState, useEffect, useCallback } from "react";
import api from "../api/axios";
import { checkUser } from "../api/authApi";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Validate token on app load
  useEffect(() => {
    const validateToken = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          // Call API to verify token and get user data
          const response = await checkUser();
          setUser(response.data.user || response.data);
          setIsAuthenticated(true);
        } catch (error) {
          console.error("Token validation failed:", error);
          localStorage.removeItem("token");
          setUser(null);
          setIsAuthenticated(false);
        }
      }
      setLoading(false);
    };

    validateToken();
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("token");
    setUser(null);
    setIsAuthenticated(false);
  }, []);

  const login = useCallback((userData, token) => {
    localStorage.setItem("token", token);
    setUser(userData);
    setIsAuthenticated(true);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated,
        logout,
        login,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
