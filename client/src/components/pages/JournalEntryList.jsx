import { useState, useEffect } from "react";
import axios from "axios";
import {
  Box,
  Typography,
  CircularProgress,
  Card,
  CardContent,
  CardActions,
  IconButton,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useNavigate } from "react-router-dom";

function JournalEntryList() {
  return (
    <Box>
      {entries.map((entry) => (
        <Card
          key={entry._id}
          sx={{
            mb: 2,
            backgroundColor: "rgba(255, 255, 255, 0.2)",
            backdropFilter: "blur(8px)",
            border: "1px solid rgba(255, 255, 255, 0.3)",
          }}
        >
          <CardContent>
            {/* Title */}
            <Typography variant="h6" sx={{ fontWeight: "bold" }}>
              {entry.title}
            </Typography>
            {/* Mood */}
            <Typography>Mood: {entry.mood}</Typography>
            {/* Content Snippet */}
            <Typography variant="body2" sx={{ mt: 1 }}>
              {entry.content.slice(0, 60)}...
            </Typography>
            {/* Timestamp */}
            <Typography variant="caption" sx={{ display: "block", mt: 1 }}>
              Created at: {new Date(entry.createdAt).toLocaleString()}
            </Typography>
          </CardContent>
          <CardActions>
            {/* Edit and Delete icons */}
            <IconButton onClick={() => handleEdit(entry._id)}>
              <EditIcon />
            </IconButton>
            <IconButton onClick={() => handleDelete(entry_.id)}>
              <DeleteIcon />
            </IconButton>
          </CardActions>
        </Card>
      ))}

      {/* Handle if there are 0 entries */}
      {entries.length === 0 && (
        <Typography variant="body1" sx={{ mt: 2 }}>
          No journal entries found.
        </Typography>
      )}
    </Box>
  );
}

export default JournalEntryList;
