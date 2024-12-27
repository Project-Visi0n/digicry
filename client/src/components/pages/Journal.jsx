import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  Textfield,
  Stack,
  IconButton,
  Card,
  CardContent,
  CardActions,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { Link } from "react-router-dom";
import JournalEntryList from "./JournalEntryList";
// import axios from "axios";

function Journal() {
  return (
    <Box className="main-container">
      <Typography variant="h4" className="section-title" gutterBottom>
        Your Journal
      </Typography>

      <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2 }}>
        <Button variant="contained" color="primary">
          New Entry
        </Button>
      </Box>

      <JournalEntryList />
    </Box>
  );
}

export default Journal;
