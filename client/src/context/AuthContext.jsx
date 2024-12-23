import { createContext, useState } from "react";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null); // Not authenticated at first
  const [loading, setLoading] = useState(false);

  const login = () => {
    // Mock login function
    setLoading(true);
    setTimeout(() => {
      setUser({ name: "Test User", email: "test@example.com" });
      setLoading(false);
    }, 1000); // Simulate async login
  };

  const logout = () => {
    // Mock logout function
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
