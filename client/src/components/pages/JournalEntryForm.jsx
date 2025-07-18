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
  const [prompt, setPrompt] = useState("");
  const [promptLoading, setPromptLoading] = useState(false);

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
        await axios
          .put(`/api/journal/${id}`, formData, {
            withCredentials: true,
          })
          .catch((err) => {
            console.log("[DEBUG] Error updating entry:", err);
            setError("Failed to update journal entry");
          });
      } else {
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

  const fetchPrompt = async () => {
    setPromptLoading(true);
    try {
      const res = await axios.get("http://localhost:3001/api/gemini/prompts");
      setPrompt(res.data.prompt);

      // Optional: autofill content with the prompt
      // setFormData((prev) => ({
      //   ...prev,
      //   content: res.data.prompt,
      // }));
    } catch (err) {
      console.error("Error fetching prompt:", err);
      setPrompt("Couldn't load a prompt right now. Try again later.");
    } finally {
      setPromptLoading(false);
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
          {/* AI Prompt Box */}
          <Box
            sx={{
              background: "rgba(255, 255, 255, 0.1)",
              backdropFilter: "blur(10px)",
              borderRadius: "12px",
              p: 2,
              fontStyle: "italic",
              fontSize: "1rem",
              color: "#444",
            }}
          >
            {promptLoading
              ? "✨ Generating prompt..."
              : prompt || "Need help starting? Click below to generate a prompt."}
          </Box>

          <Button
            onClick={fetchPrompt}
            variant="outlined"
            sx={{
              width: "fit-content",
              alignSelf: "flex-start",
              px: 2,
              py: 1,
              borderRadius: "12px",
              background: "rgba(255, 255, 255, 0.1)",
              color: "#444",
              textTransform: "none",
              "&:hover": {
                background: "rgba(255, 255, 255, 0.2)",
              },
            }}
          >
            ✨ Generate AI-powered Prompt ✨ 
          </Button>

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
