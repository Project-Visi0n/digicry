import { useState, useEffect } from "react";
import axios from "axios";
import PropTypes from "prop-types";
import {
  Box,
  Typography,
  IconButton,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  Snackbar,
  Alert,
  Tooltip,
  Zoom,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { motion, AnimatePresence } from "framer-motion";
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
  const [selectedEntry, setSelectedEntry] = useState(null);
  const [expandedId, setExpandedId] = useState(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

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

  const getEmotionColor = (mood) => {
    const colors = {
      "😊": "var(--blue)",
      "😐": "var(--cream)",
      "😢": "var(--gray)",
      "😡": "var(--pink)",
      "😴": "var(--mint)",
    };
    return colors[mood] || "var(--blue)";
  };

  return (
    <Box
      sx={{
        width: "100%",
        position: "relative",
        p: { xs: 2, md: 4 },
      }}
    >
      <AnimatePresence>
        {filteredEntries.map((entry, index) => (
          <motion.div
            key={entry._id}
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Box
              className="glass-panel"
              sx={{
                mb: 2,
                p: 3,
                position: "relative",
                overflow: "hidden",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  mb: 2,
                }}
              >
                <Box>
                  <Typography
                    className="welcome-text"
                    sx={{
                      fontSize: "1.5rem",
                      mb: 1,
                      color: "var(--grey)",
                      fontWeight: "600",
                    }}
                  >
                    {entry.title}
                  </Typography>

                  <Box
                    sx={{ display: "flex", alignItems: "center", gap: 2 }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                        background: "rgba(255, 255, 255, 0.2)",
                        padding: "4px 12px",
                        borderRadius: "12px",
                        backdropFilter: "blur(5px)",
                      }}
                    >
                      <AccessTimeIcon
                        sx={{
                          fontSize: "0.9rem",
                          color: "var(--grey)",
                        }}
                      />
                      <Typography
                        variant="caption"
                        sx={{
                          color: "var(--grey)",
                          fontSize: "0.85rem",
                        }}
                      >
                        {new Date(entry.createdAt).toLocaleDateString(
                          undefined,
                          {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          },
                        )}
                      </Typography>
                    </Box>
                    <Box
                      sx={{
                        background: "rgba(255, 255, 255, 0.2)",
                        borderRadius: "12px",
                        padding: "4px 12px",
                        backdropFilter: "blur(5px)",
                      }}
                    >
                      <Typography
                        sx={{
                          fontSize: "1.2rem",
                          color: "var(--grey)",
                        }}
                      >
                        {entry.mood}
                      </Typography>
                    </Box>
                  </Box>
                </Box>

                <Box sx={{ display: "flex", gap: 1 }}>
                  <Tooltip title="Edit Entry" arrow>
                    <IconButton
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEdit(entry._id);
                      }}
                      className="glass-button"
                      sx={{
                        background: "rgba(255,255,255,0.1)",
                        backdropFilter: "blur(5px)",
                        color: "white",
                        transition: "all 0.3s ease",
                        "&:hover": {
                          background: "rgba(255,255,255,0.2)",
                          transform: "translateY(-2px)",
                        },
                      }}
                    >
                      <EditIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Delete Entry" arrow>
                    <IconButton
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteClick(entry._id);
                      }}
                      sx={{
                        background: "rgba(255,255,255,0.1)",
                        backdropFilter: "blur(5px)",
                        color: "white",
                        transition: "all 0.3s ease",
                        "&:hover": {
                          background: "rgba(255,255,255,0.2)",
                          transform: "translateY(-2px)",
                        },
                      }}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </Box>
              </Box>

              {/* Content Section */}
              <AnimatePresence>
                {expandedId === entry._id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Box
                      sx={{
                        p: 3,
                        pt: 0,
                        position: "relative",
                        zIndex: 1,
                      }}
                    >
                      <Typography
                        variant="body1"
                        sx={{
                          color: "var(--grey)",
                          fontSize: "1rem",
                          lineHeight: 1.6,
                          maxHeight:
                            expandedId === entry._id ? "none" : "3.2em",
                          overflow: "hidden",
                          display: "-webkit-box",
                          WebkitLineClamp:
                            expandedId === entry._id ? "unset" : 2,
                          WebkitBoxOrient: "vertical",
                        }}
                      >
                        {entry.content}
                      </Typography>
                    </Box>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Expand Button */}
              <Box
                onClick={() =>
                  setExpandedId(expandedId === entry._id ? null : entry._id)
                }
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  p: 1,
                  cursor: "pointer",
                  background: "rgba(255,255,255,0.05)",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    background: "rgba(255,255,255,0.1)",
                  },
                }}
              >
                <motion.div
                  animate={{ rotate: expandedId === entry._id ? 180 : 0 }}
                >
                  <ExpandMoreIcon sx={{ color: "var(--grey)" }} />
                </motion.div>
              </Box>
            </Box>
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Empty State */}
      {filteredEntries.length === 0 && !isLoading && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Box
            sx={{
              textAlign: "center",
              py: 8,
              px: 2,
              background: "rgba(20, 20, 25, 0.95)",
              borderRadius: "24px",
              border: "1px solid rgba(255, 255, 255, 0.2)",
              boxShadow: "0 8px 32px rgba(0, 0, 0, 0.4)",
            }}
          >
            <Typography
              variant="h5"
              sx={{
                mb: 3,
                color: "white",
                fontWeight: 600,
                textShadow: "0 2px 4px rgba(0,0,0,0.3)",
              }}
            >
              Your Journal Awaits
            </Typography>

            <Typography
              variant="body1"
              sx={{
                color: "rgba(255,255,255,0.9)",
                mb: 4,
                fontSize: "1.1rem",
              }}
            >
              {searchQuery
                ? "No entries match your search. Try different keywords."
                : "Start documenting your journey with your first entry."}
            </Typography>
            <Button
              component={motion.button}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate("/journal/new")}
              sx={{
                background:
                  "linear-gradient(45deg, var(--pink) 30%, var(--blue) 90%)",
                color: "white",
                px: 4,
                py: 2,
                borderRadius: "15px",
                textTransform: "none",
                fontSize: "1.1rem",
                boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3)",
                "&:hover": {
                  boxShadow: "0 12px 40px rgba(0, 0, 0, 0.4)",
                },
              }}
            >
              Create Your First Entry
            </Button>
          </Box>
        </motion.div>
      )}

      {/* Loading State */}
      {isLoading && (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "200px",
          }}
        >
          <CircularProgress
            sx={{
              color: "var(--blue)",
            }}
          />
        </Box>
      )}

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
    </Box>
  );
}

JournalEntryList.propTypes = {
  searchQuery: PropTypes.string,
};

JournalEntryList.defaultProps = {
  searchQuery: "",
};

export default JournalEntryList;
