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
    <Box sx={{ width: "100%", position: "relative" }}>
      <AnimatePresence>
        {filteredEntries.map((entry, index) => (
          <motion.div
            key={entry._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <Box
              className="journal-timeline-entry"
              sx={{
                position: "relative",
                mb: 4,
                ml: isMobile ? 3 : 8,
                "&::before": {
                  content: '""',
                  position: "absolute",
                  left: "-25px",
                  top: 0,
                  bottom: 0,
                  width: "2px",
                  background: `linear-gradient(180deg, 
                    ${getEmotionColor(entry.mood)} 0%, 
                    rgba(255,255,255,0.1) 100%
                  )`,
                },
              }}
            >
              {/* Mood Indicator Dot */}
              <Box
                component={motion.div}
                whileHover={{ scale: 1.2 }}
                sx={{
                  position: "absolute",
                  left: "-34px",
                  top: "20px",
                  width: "20px",
                  height: "20px",
                  borderRadius: "50%",
                  background: getEmotionColor(entry.mood),
                  boxShadow: `0 0 20px ${getEmotionColor(entry.mood)}40`,
                  zIndex: 2,
                }}
              />

              {/* Entry Card */}
              <motion.div
                layoutId={`card-${entry._id}`}
                onClick={() =>
                  setExpandedId(expandedId === entry._id ? null : entry._id)
                }
              >
                <Box
                  sx={{
                    background: "rgba(255, 255, 255, 0.03)",
                    backdropFilter: "blur(10px)",
                    borderRadius: "20px",
                    overflow: "hidden",
                    border: "1px solid rgba(255, 255, 255, 0.1)",
                    transition: "all 0.3s ease",
                    "&:hover": {
                      background: "rgba(255, 255, 255, 0.05)",
                      transform: "translateX(10px)",
                    },
                  }}
                >
                  {/* Header Section */}
                  <Box
                    sx={{
                      p: 3,
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                      borderBottom:
                        expandedId === entry._id
                          ? "1px solid rgba(255,255,255,0.1)"
                          : "none",
                    }}
                  >
                    <Box>
                      <Typography
                        variant="h6"
                        sx={{
                          fontWeight: 600,
                          background: `linear-gradient(45deg, ${getEmotionColor(entry.mood)}, white)`,
                          WebkitBackgroundClip: "text",
                          WebkitTextFillColor: "transparent",
                          mb: 1,
                        }}
                      >
                        {entry.title}
                      </Typography>

                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 2 }}
                      >
                        <Box
                          sx={{ display: "flex", alignItems: "center", gap: 1 }}
                        >
                          <AccessTimeIcon
                            sx={{ fontSize: "0.9rem", opacity: 0.7 }}
                          />
                          <Typography variant="caption" sx={{ opacity: 0.7 }}>
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
                        <Typography
                          sx={{
                            fontSize: "1.5rem",
                            filter:
                              "drop-shadow(0 0 5px rgba(255,255,255,0.2))",
                          }}
                        >
                          {entry.mood}
                        </Typography>
                      </Box>
                    </Box>

                    <Box sx={{ display: "flex", gap: 1 }}>
                      <Tooltip title="Edit Entry" arrow>
                        <IconButton
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEdit(entry._id);
                          }}
                          sx={{
                            background: "rgba(255,255,255,0.05)",
                            "&:hover": {
                              background: "rgba(255,255,255,0.1)",
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
                            background: "rgba(255,255,255,0.05)",
                            "&:hover": {
                              background: "rgba(255,255,255,0.1)",
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
                        <Box sx={{ p: 3, pt: 2 }}>
                          <Typography
                            variant="body1"
                            sx={{
                              lineHeight: 1.8,
                              color: "rgba(255,255,255,0.8)",
                              whiteSpace: "pre-line",
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
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      p: 1,
                      cursor: "pointer",
                    }}
                  >
                    <motion.div
                      animate={{ rotate: expandedId === entry._id ? 180 : 0 }}
                    >
                      <ExpandMoreIcon />
                    </motion.div>
                  </Box>
                </Box>
              </motion.div>
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
            }}
          >
            <Typography
              variant="h5"
              sx={{
                mb: 3,
                background: "linear-gradient(45deg, var(--pink), var(--blue))",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                fontWeight: 600,
              }}
            >
              Your Journal Awaits
            </Typography>
            <Typography
              variant="body1"
              sx={{
                color: "rgba(255,255,255,0.7)",
                mb: 4,
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
                boxShadow: "0 5px 15px rgba(0,0,0,0.2)",
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
