import React, { useState, useEffect } from "react";
import axios from "axios";
import { Box, TextField, Typography, Button, MenuItem } from "@mui/material";
// import { useParams, useNavigate } from "react-router-dom";

function JournalEntryForm({ entryId, onSuccess }) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [mood, setMood] = useState("😊");
  const [error, setError] = useState(null);

  // If editing, fetch the existing entry
  useEffect(() => {
    if (!entryId) return;

    axios
      .get(`/api/journal/${entryId}`)
      .then((response) => {
        const entry = response.data;
        setTitle(entry.title);
        setContent(entry.content);
        setMood(entry.mood);
      })
      .catch((err) => {
        console.error("[JournalEntryForm] Error fetching existing entry:", err);
        setError("Failed to load entry for editing.");
      });
  }, [entryId]);

  const handleSubmit = () => {
    setError(null);

    // Basic validation
    if (!title.trim() || !content.trim()) {
      setError("Title and Content are required.");
      return;
    }

    // Mock userId if needed (since authentication might not be set up)
    // This might be replaced with a real user ID from context once auth is complete
    const userId = "64342344abc1234567890"; // example ID or from your AuthContext

    const entryData = {
      userId,
      title,
      content,
      mood,
    };

    if (entryId) {
      // EDIT existing
      axios
        .put(`/api/journal/${entryId}`, entryData)
        .then((response) => {
          console.log("[JournalEntryForm] Updated entry:", response.data);
          if (onSuccess) onSuccess();
          // or navigate("/journal");
        })
        .catch((err) => {
          console.error("[JournalEntryForm] Update error:", err);
          setError("Failed to update entry.");
        });
    } else {
      // CREATE new
      axios
        .post("/api/journal", entryData)
        .then((response) => {
          console.log("[JournalEntryForm] Created new entry:", response.data);
          if (onSuccess) onSuccess();
          // or navigate("/journal");
        })
        .catch((err) => {
          console.error("[JournalEntryForm] Create error:", err);
          setError("Failed to create entry.");
        });
    }
  };

  return (
    <Box sx={{ p: 2, maxWidth: 600 }}>
      <Typography variant="h5" sx={{ mb: 2 }}>
        {entryId ? "Edit Entry" : "Create New Entry"}
      </Typography>

      {error && (
        <Typography variant="body2" color="error" sx={{ mb: 2 }}>
          {error}
        </Typography>
      )}

      {/* Title Field */}
      <TextField
        label="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        fullWidth
        sx={{ mb: 2 }}
      />

      {/* Content Field (Multiline) */}
      <TextField
        label="Content"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        fullWidth
        multiline
        rows={4}
        sx={{ mb: 2 }}
      />

      {/* Mood Select (Emojis) */}
      <TextField
        select
        label="Mood"
        value={mood}
        onChange={(e) => setMood(e.target.value)}
        sx={{ mb: 2, width: 120 }}
      >
        {["😊", "😐", "😢", "😡", "😴"].map((emoji) => (
          <MenuItem key={emoji} value={emoji}>
            {emoji}
          </MenuItem>
        ))}
      </TextField>

      {/* Submit Button */}
      <Button variant="contained" onClick={handleSubmit}>
        {entryId ? "Update" : "Create"}
      </Button>
    </Box>
  );
}

export default JournalEntryForm;
