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

  // Update the state based on the current session
 useEffect( () => {
   axios
      .get("http://127.0.0.1:5000/check-session/")
      .then(({ data }) => {
        console.log(data) // this shows you whose profile is returned
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
    <Routes>
      <Route validSession={validSession}
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
            <Login validSession={validSession} setValidSession={setValidSession} setUser={setUser}/>
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
