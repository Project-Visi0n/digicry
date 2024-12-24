import { Routes, Route } from "react-router-dom";
import { Typography } from "@mui/material";
import { React, useState, useNavigate, useEffect } from "react";
import Layout from "./Layout";
import Home from "./pages/Home";
import Journal from "./pages/Journal";
import JournalEntry from "./pages/JournalEntry";
import JournalEntryForm from "./pages/JournalEntryForm";
import Login from "./Login";
import axios from 'axios';

function App() {
  const [validSession, setValidSession] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    console.log('howmany')
   axios
      .get("http://127.0.0.1:5000/check-session/")
      .then((profile) => {
        if (profile.isValid) {
          setValidSession(profile.isValid);
          setUser(profile.user);
        } 
      })
      .catch((error) => {
        console.error("Failed to get profile", error);
      });
      console.log('howmany')
  }, []);

  return (
    <Routes>
      <Route
        path="/"
        element={
          <Layout>
            <Routes>
              <Route index element={<Home />} />
              <Route path="journal" element={<Journal />} />
              <Route path="journal/new" element={<JournalEntryForm />} />
              <Route path="journal/edit/:id" element={<JournalEntryForm />} />
              <Route path="journal:id" element={<JournalEntry />} />
            </Routes>
            <Login validSession={validSession}/>
          </Layout>
        }
      />
      {/* Fallback route for 404 */}
      <Route
        path="*"
        element={
          <Layout>
            <Typography variant="h4" sx={{ textAlign: "center", mt: 4 }}>
              404 - Page Not Found
            </Typography>
          </Layout>
        }
      />
    </Routes>
  );
}

export default App;
