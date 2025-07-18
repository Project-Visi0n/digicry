import { useState, useEffect, useContext } from "react";
import {
  Box,
  Container,
  TextField,
  Typography,
  Button,
  CircularProgress,
  Stack,
} from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";

function JournalEntryForm() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const { id } = useParams();

  const [formData, setFormData] = useState({
    userId: user && user._id ? user._id : "",
    title: "",
    content: "",
    mood: "😊",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // If editing, fetch the existing entry
  useEffect(() => {
    if (!id) return;

    const fetchEntry = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(`/api/journal/${id}`);
        const entry = response.data;
        setFormData({
          userId: entry.userId || "",
          title: entry.title || "",
          content: entry.content || "",
          mood: entry.mood || "😊",
        });
      } catch (err) {
        console.error("Error fetching entry:", err);
        setError("Failed to load entry for editing.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchEntry();
  }, [id]);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    // Set formData by returning a new object with all previous fields plus the updated field
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    console.log("[DEBUG] Submitting form data:", formData);

    try {
      setIsLoading(true);
      if (id) {
        // If we have an id, we're updating
        await axios
          .put(`/api/journal/${id}`, formData, {
            withCredentials: true,
          })
          .catch((err) => {
            console.log("[DEBUG] Error updating entry:", err);
            setError("Failed to update journal entry");
          });
      } else {
        // Otherwise, we're creating a new entry
        await axios
          .post("/api/journal", formData, { withCredentials: true })
          .then((response) => {
            console.log("[DEBUG] Successfully created entry:", response.data);
          })
          .catch((err) => {
            console.log("[DEBUG] Error creating entry:", err);
            setError("Failed to create journal entry");
          });
      }
      navigate("/journal");
    } catch (err) {
      console.error("Error saving entry:", err.toJSON ? err.toJSON() : err);
      setError("Failed to save journal entry");
    } finally {
      setIsLoading(false);
    }
  };

  const moodOptions = ["😊", "😐", "😢", "😡", "😴"];

  if (isLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="md">
      <Box
        component="form"
        onSubmit={handleSubmit}
        className="glass-panel"
        sx={{
          mt: 4,
          p: 4,
          borderRadius: "16px",
        }}
      >
        <Typography
          variant="h4"
          sx={{
            mb: 4,
            fontWeight: "bold",
            background:
              "linear-gradient(45deg, var(--pink) 30%, var(--blue) 90%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          {id ? "Edit Entry" : "New Entry"}
        </Typography>

        {error && (
          <Typography color="error" sx={{ mb: 2 }}>
            {error}
          </Typography>
        )}

        <Stack spacing={3}>
          <TextField
            name="title"
            label="Title"
            value={formData.title}
            onChange={handleInputChange}
            fullWidth
            required
            sx={{
              "& .MuiOutlinedInput-root": {
                backgroundColor: "rgba(255, 255, 255, 0.1)",
                backdropFilter: "blur(10px)",
                "& fieldset": {
                  borderColor: "rgba(255, 255, 255, 0.2)",
                },
              },
            }}
          />

          <TextField
            name="content"
            label="Content"
            value={formData.content}
            onChange={handleInputChange}
            multiline
            rows={6}
            fullWidth
            required
            sx={{
              "& .MuiOutlinedInput-root": {
                backgroundColor: "rgba(255, 255, 255, 0.1)",
                backdropFilter: "blur(10px)",
                "& fieldset": {
                  borderColor: "rgba(255, 255, 255, 0.2)",
                },
              },
            }}
          />

          <Box sx={{ display: "flex", gap: 2 }}>
            {moodOptions.map((mood) => (
              <Button
                key={mood}
                className={`glass-btn ${formData.mood === mood ? "primary" : ""}`}
                onClick={() =>
                  handleInputChange({
                    target: { name: "mood", value: mood },
                  })
                }
                sx={{
                  minWidth: "60px",
                  height: "60px",
                  borderRadius: "12px",
                  fontSize: "24px",
                }}
              >
                {mood}
              </Button>
            ))}
          </Box>

          <Stack direction="row" spacing={2} sx={{ mt: 4 }}>
            <Button className="glass-btn" onClick={() => navigate("/journal")}>
              Cancel
            </Button>
            <Button
              type="submit"
              className="glass-btn primary"
              disabled={isLoading}
            >
              {id ? "Update Entry" : "Create Entry"}
            </Button>
          </Stack>
        </Stack>
      </Box>
    </Container>
  );
}

export default JournalEntryForm;
