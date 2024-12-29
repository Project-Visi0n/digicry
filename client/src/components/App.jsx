import { Routes, Route } from "react-router-dom";
import { Typography } from "@mui/material";
import { React, useState, useNavigate, useEffect } from "react";
import Layout from "./Layout";
import Home from "./pages/Home";
import Journal from "./pages/Journal";
import JournalEntry from "./pages/JournalEntry";
import JournalEntryForm from "./pages/JournalEntryForm";
import Events from "./pages/Events";
import ProtectedRoute from "./ProtectedRoute";
import Login from "./Login";
import axios from "axios";

function App() {
  const [validSession, setValidSession] = useState(false);
  const [user, setUser] = useState(null);

  // Update the state based on the current session
  useEffect(() => {
    axios
      .get("http://127.0.0.1:5000/check-session/")
      .then(({ data }) => {
        console.log(data, 'The logged in User model'); 
        if (data) {
          setUser(data[0]);
          setValidSession(true);
        }
      })
      .catch((error) => {
        console.error("Failed to get profile", error);
      });
  }, [validSession]);

  return (
    <div>
      <Login
        validSession={validSession}
        setValidSession={setValidSession}
        setUser={setUser}
      />
      <Routes>
        {/* Parent Route */}
        <Route path="/" element={<Layout />}>
          {/* Public Routes */}
          <Route index element={<Home />} />

          {/* Protected Routes */}
          <Route
            path="journal"
            element={
              <ProtectedRoute>
                <Journal />
              </ProtectedRoute>
            }
          />
          <Route
            path="journal/new"
            element={
              <ProtectedRoute>
                <JournalEntryForm />
              </ProtectedRoute>
            }
          />
          <Route
            path="journal/edit/:id"
            element={
              <ProtectedRoute>
                <JournalEntryForm />
              </ProtectedRoute>
            }
          />
          <Route
            path="journal:id"
            element={
              <ProtectedRoute>
                <JournalEntry />
              </ProtectedRoute>
            }
          />
          <Route
            path="events"
            element={
              <ProtectedRoute>
                <Events />
              </ProtectedRoute>
            }
          />

          {/* Fallback route for 404 */}
          <Route
            path="*"
            element={
              <Typography variant="h4" sx={{ textAlign: "center", mt: 4 }}>
                404 - Page Not Found
              </Typography>
            }
          />
        </Route>
      </Routes>
    </div>
  );
}

export default App;
