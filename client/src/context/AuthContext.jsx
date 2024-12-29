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
        const { data } = await axios.get("/api/auth/user", { withCredentials: true });
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

  // Mock login function to simulate user authentication
  const login = () => {
    setLoading(true);
    setTimeout(() => {
      setUser({
        name: "John Doe",
        email: "john.doe@example.com",
      });
      setLoading(false);
    }, 1000); // Simulate async login / Network delay
  };

  // Mock logout function to simulate ending user authentication
  const logout = () => {
    setLoading(true);
    setTimeout(() => {
      setUser(null);
      setLoading(false);
    }, 500); // Simulate network delay
  };

  // Memoize the context value to prevent unnecessary re-renders
  const value = useMemo(
    () => ({ user, loading, login, logout }),
    [user, loading],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// PropTypes validation
AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
