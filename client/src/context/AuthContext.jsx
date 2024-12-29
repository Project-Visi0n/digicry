import { createContext, useState, useEffect, useMemo } from "react";
import axios from "axios";
import PropTypes from "prop-types";

export const AuthContext = createContext();

/**
 * AuthProvider component that provides authentication context to its children
 * This mock version simulates authentication for development purposes
 */
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null); // Not authenticated at first // Stores user info
  const [loading, setLoading] = useState(true); // Indicates if auth state is being determined

  // Fetch user profile from backend to determine authentication
  // Axios Request

  // Check authentication status on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data } = await axios.get("/api/auth/user", {
          withCredentials: true,
        });
        setUser(data);
      } catch (err) {
        console.error("Auth check failed:", err);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  // Login function
  const login = () => {
    window.location.href = "/auth/google";
  };

  // Logout function
  const logout = async () => {
    try {
      await axios.get("/api/auth/logout", { withCredentials: true });
      setUser(null);
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  // Memoize the context value to prevent unnecessary re-renders
  const value = useMemo(
    () => ({
      user,
      loading,
      login,
      logout,
    }),
    [user, loading],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// PropTypes validation
AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
