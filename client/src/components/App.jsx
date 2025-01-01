import { Routes, Route } from "react-router-dom";
import { Typography } from "@mui/material";
import Layout from "./Layout";
import Home from "./pages/Home";
import Journal from "./pages/Journal";
import JournalEntry from "./pages/JournalEntry";
import JournalEntryForm from "./pages/JournalEntryForm";
import Events from "./pages/Events";
import ProtectedRoute from "./ProtectedRoute";
import Forums from "./pages/Forums";

function App() {
  return (
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
        <Route
          path="forums"
          element={
            <ProtectedRoute>
              <Forums />
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
  );
}

export default App;
