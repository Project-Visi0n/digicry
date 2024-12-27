import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom"; // if using a route param
import axios from "axios";
import { Box, Typography, CircularProgress } from "@mui/material";

function JournalEntry() {
  const { id } = useParams(); // e.g., /journal/:id
  const [entry, setEntry] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch the single entry on mount
  useEffect(() => {
    if (!id) return;

    console.log("[JournalEntry] Fetch single entry, ID:", id);
    setIsLoading(true);
    setError(null);

    axios
      .get(`/api/journal/${id}`)
      .then((response) => {
        console.log("[JournalEntry] Single entry data:", response.data);
        setEntry(response.data);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error("[JournalEntry] Error:", err);
        setError("Failed to load the entry. Please try again later.");
        setIsLoading(false);
      });
  }, [id]);

  if (isLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ mt: 4 }}>
        <Typography variant="body2" color="error">
          {error}
        </Typography>
      </Box>
    );
  }

  if (!entry) {
    return null; // or show "No entry found."
  }

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h5" sx={{ mb: 2 }}>
        {entry.title}
      </Typography>
      <Typography variant="body1" sx={{ whiteSpace: "pre-line" }}>
        {entry.content}
      </Typography>
      <Typography variant="body2" sx={{ mt: 2 }}>
        Mood: {entry.mood}
      </Typography>
      <Typography variant="caption" sx={{ display: "block", mt: 1 }}>
        Created: {new Date(entry.createdAt).toLocaleString()}
      </Typography>
    </Box>
  );
}

export default JournalEntry;
