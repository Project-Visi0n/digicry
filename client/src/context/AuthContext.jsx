import {
  createContext,
  useState,
  useEffect,
  useMemo,
  useCallback,
} from "react";
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
  const [validSession, setValidSession] = useState(false);

  // Logout
  const logout = () => {
    setValidSession(false);
    setUser(null);
    axios
      .get(`${process.env.AUTH_PREFIX}/logout`) // /authorization/logout here when in development
      .then(() => {
        console.log("successful logout");
      })
      .catch((error) => {
        console.error("failed logout ", error);
      });
  };

  // Function to update user model
  const updateUserModel = useCallback(
    async (updates) => {
      if (!user || !user.oAuthId) return;

      try {
        const { data } = await axios.put(
          `${process.env.SERVER_URL}/api/users/${user.oAuthId}`,
          updates,
        );
        setUser(data);
      } catch (err) {
        console.error("Failed to update user:", err);
      }
      console.log("[DEBUG] AuthContext user after check-session:", user);
    },
    [user],
  );

  // Check session and get user model on mount
  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data } = await axios.get(
          `${process.env.AUTH_PREFIX}/check-session/`,
        ); // /authorization/check-session/ here when in development
        if (data && data[0]) {
          console.log("[DEBUG] check-session response data:", data);
          // data[0] contains the User model from MongoDB
          setUser(data[0]);
          setValidSession(true);
        }
      } catch (err) {
        console.error("Session check failed:", err);
        setUser(null);
        setValidSession(false);
      } finally {
        setLoading(false);
      }
    };

    checkSession();
  }, []);

  const value = useMemo(
    () => ({
      user,
      setUser,
      loading,
      logout,
      validSession,
      setValidSession,
      updateUserModel,
    }),
    [user, loading, validSession, updateUserModel],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// PropTypes validation
AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
