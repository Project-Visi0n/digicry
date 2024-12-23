import { Routes, Route } from "react-router-dom";
import { Typography } from "@mui/material";
import Layout from "./Layout";
import Home from "./pages/Home";
import Journal from "./pages/Journal";
import JournalEntry from "./pages/JournalEntry";
import JournalEntryForm from "./pages/JournalEntryForm";
import Login from "./Login";
import { React, useState, useNavigate } from "react";

function App() {
  const [validSession, setValidSession] = useState(false);

  const validChecker = (validity) => {
    console.log('i was triggered')
    if(validity){
      setValidSession(true);
    } else {
      setValidSession(false);
    }
    console.log(validSession)
  }

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
            <Login valid={validChecker} validSession={validSession}/>
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
