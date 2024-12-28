import { useState, useEffect } from "react";
import axios from "axios";
import PropTypes from "prop-types";
import {
  Stack,
  Box,
  Card,
  CardContent,
  Typography,
  IconButton,
  CardActions,
  Fade,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  Snackbar,
  Alert,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useNavigate } from "react-router-dom";

function JournalEntryList({ searchQuery = "" }) {
  const [entries, setEntries] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [deleteDialog, setDeleteDialog] = useState({
    open: false,
    entryId: null,
  });
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const navigate = useNavigate();

  // Fetch entries
  useEffect(() => {
    console.log("[JournalEntryList] Fetching journal entries...");
    setIsLoading(true);
    setError(null);

    axios
      .get("/api/journal")
      .then((response) => {
        console.log(
          "[JournalEntryList] Successfully fetched entries:",
          response.data,
        );
        setEntries(Array.isArray(response.data) ? response.data : []);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error("[JournalEntryList] Error fetching entries:", err);
        setError("Failed to fetch journal entries. Please try again later.");
        setIsLoading(false);
      });
  }, []);

  const handleEdit = (entryId) => {
    navigate(`/journal/edit/${entryId}`);
  };

  const handleDeleteClick = (entryId) => {
    setDeleteDialog({
      open: true,
      entryId,
    });
  };

  const handleDeleteClose = () => {
    setDeleteDialog({
      open: false,
      entryId: null,
    });
  };

  const handleDeleteConfirm = () => {
    const { entryId } = deleteDialog;
    setIsLoading(true);

    axios
      .delete(`/api/journal/${entryId}`)
      .then(() => {
        setEntries(entries.filter((entry) => entry._id !== entryId));
        setSnackbar({
          open: true,
          message: "Entry deleted successfully",
          severity: "success",
        });
      })
      .catch((err) => {
        console.error("Error deleting entry:", err);
        setSnackbar({
          open: true,
          message: "Failed to delete entry. Please try again.",
          severity: "error",
        });
      })
      .finally(() => {
        setIsLoading(false);
        handleDeleteClose();
      });
  };

  const handleSnackbarClose = () => {
    setSnackbar((prev) => ({
      ...prev,
      open: false,
    }));
  };

  // Filter entries based on search query
  const getFilteredEntries = () => {
    if (!searchQuery) return entries;

    const query = String(searchQuery).toLowerCase();
    return entries.filter((entry) => {
      const title = String(entry.title || "").toLowerCase();
      const content = String(entry.content || "").toLowerCase();
      return title.includes(query) || content.includes(query);
    });
  };

  if (isLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Typography color="error" sx={{ p: 2 }}>
        {error}
      </Typography>
    );
  }

  const filteredEntries = getFilteredEntries();

  return (
    <>
      <Stack
        direction={{ xs: "column", sm: "row" }}
        spacing={3}
        sx={{
          width: "100%",
          flexWrap: "wrap",
          "& > *": {
            minWidth: {
              xs: "100%",
              sm: "calc(50% - 16px)",
              lg: "calc(33.333% - 16px)",
            },
          },
        }}
      >
        {filteredEntries.map((entry, index) => (
          <Fade
            in
            style={{ transitionDelay: `${index * 100}ms` }}
            key={entry._id}
          >
            <Card
              className="glass-panel journal-entry-card"
              sx={{
                height: "100%",
                display: "flex",
                flexDirection: "column",
                position: "relative",
                overflow: "visible",
              }}
            >
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography variant="h6" sx={{ mb: 2 }}>
                  {entry.title}
                </Typography>
                <Typography variant="body2" sx={{ mb: 2 }}>
                  {entry.content}
                </Typography>
                <Box
                  sx={{
                    mt: "auto",
                    display: "flex",
                    justifyContent: "space-between",
                  }}
                >
                  <Typography variant="caption">
                    {new Date(entry.createdAt).toLocaleDateString()}
                  </Typography>
                  <Typography>{entry.mood}</Typography>
                </Box>
              </CardContent>
              <CardActions>
                <IconButton onClick={() => handleEdit(entry._id)} size="small">
                  <EditIcon />
                </IconButton>
                <IconButton
                  onClick={() => handleDeleteClick(entry._id)}
                  size="small"
                >
                  <DeleteIcon />
                </IconButton>
              </CardActions>
            </Card>
          </Fade>
        ))}
      </Stack>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialog.open} onClose={handleDeleteClose}>
        <DialogTitle>Delete Entry</DialogTitle>
        <DialogContent>
          Are you sure you want to delete this journal entry?
        </DialogContent>
        <DialogActions>
          <Button className="glass-btn" onClick={handleDeleteClose}>
            Cancel
          </Button>
          <Button className="glass-btn primary" onClick={handleDeleteConfirm}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
}

JournalEntryList.propTypes = {
  searchQuery: PropTypes.string,
};

JournalEntryList.defaultProps = {
  searchQuery: "",
};

export default JournalEntryList;
