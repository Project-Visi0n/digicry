import React from "react";
import axios from "axios";
import { Box, Button, Typography, Alert, Stack } from "@mui/material";

function PromptGenerator({ prompt, setPrompt, setFormData }) {
  const [savedMessage, setSavedMessage] = React.useState("");
  const [promptId, setPromptId] = React.useState(null);
  const [savedPrompts, setSavedPrompts] = React.useState([]);

  const getPrompt = async () => {
    try {
      const res = await axios.get("/api/ai/prompt");
      setPrompt(res.data.prompt);
      setFormData &&
        setFormData((prev) => ({
          ...prev,
          content: res.data.prompt,
        }));
      setSavedMessage("");
      setPromptId(null);
    } catch (err) {
      console.error("Error fetching prompt", err);
    }
  };

  const savePrompt = async () => {
    try {
      const res = await axios.post("/api/prompts", { text: prompt });
      setSavedMessage("Prompt saved successfully!");
      setPromptId(res.data._id);
      fetchSavedPrompts(); // Refresh list
    } catch (err) {
      console.error("Error saving prompt", err);
    }
  };

  const deletePrompt = async (id) => {
    try {
      await axios.delete(`/api/prompts/${id}`);
      setSavedMessage("Prompt deleted.");
      setPromptId(null);
      fetchSavedPrompts(); // Refresh list
    } catch (err) {
      console.error("Error deleting prompt", err);
    }
  };

  const fetchSavedPrompts = async () => {
    try {
      const res = await axios.get("/api/prompts");
      setSavedPrompts(res.data);
    } catch (err) {
      console.error("Error fetching saved prompts", err);
    }
  };

  React.useEffect(() => {
    fetchSavedPrompts();
  }, []);

  return (
    <Box sx={{ mt: 2, p: 2, border: "1px solid #ccc", borderRadius: 2 }}>
      <Typography variant="h6" gutterBottom>
        Reflective Journal Prompt
      </Typography>

      <Button
        onClick={getPrompt}
        sx={{
          background: "linear-gradient(135deg, #60a5fa 0%, #c084fc 100%)",
          color: "white",
          fontWeight: "bold",
          borderRadius: "12px",
          mb: 2,
          textTransform: "none",
          "&:hover": {
            background: "linear-gradient(135deg, #3b82f6 0%, #a855f7 100%)",
          },
        }}
      >
        Generate Prompt
      </Button>

      {prompt && (
        <>
          <Typography variant="body1" sx={{ mb: 1 }}>
            {prompt}
          </Typography>

          <Stack direction="row" spacing={2}>
            {!promptId ? (
              <Button
                onClick={savePrompt}
                sx={{
                  background: "linear-gradient(135deg, #6ee7b7 0%, #3b82f6 100%)",
                  color: "white",
                  fontWeight: "bold",
                  borderRadius: "12px",
                  textTransform: "none",
                  "&:hover": {
                    background: "linear-gradient(135deg, #34d399 0%, #2563eb 100%)",
                  },
                }}
              >
                Save Prompt
              </Button>
            ) : (
              <Button
                onClick={() => deletePrompt(promptId)}
                sx={{
                  background: "linear-gradient(135deg, #f87171 0%, #f472b6 100%)",
                  color: "white",
                  fontWeight: "bold",
                  borderRadius: "12px",
                  textTransform: "none",
                  "&:hover": {
                    background: "linear-gradient(135deg, #ef4444 0%, #ec4899 100%)",
                  },
                }}
              >
                Delete Prompt
              </Button>
            )}
          </Stack>
        </>
      )}

      {savedMessage && (
        <Alert severity="success" sx={{ mt: 2 }}>
          {savedMessage}
        </Alert>
      )}

      {/* Show saved prompts */}
      {savedPrompts.length > 0 && (
        <Box sx={{ mt: 4 }}>
          <Typography variant="subtitle1" gutterBottom>
            Your Saved Prompts:
          </Typography>
          {savedPrompts.map((p) => (
            <Box
              key={p._id}
              sx={{
                backgroundColor: "rgba(255, 255, 255, 0.05)",
                border: "1px solid rgba(255, 255, 255, 0.1)",
                borderRadius: "8px",
                p: 2,
                mb: 2,
              }}
            >
              <Typography variant="body2">{p.text}</Typography>
              <Button
                size="small"
                onClick={() => deletePrompt(p._id)}
                sx={{
                  mt: 1,
                  background: "linear-gradient(135deg, #f87171 0%, #f472b6 100%)",
                  color: "white",
                  fontWeight: "bold",
                  borderRadius: "8px",
                  textTransform: "none",
                  "&:hover": {
                    background: "linear-gradient(135deg, #ef4444 0%, #ec4899 100%)",
                  },
                }}
              >
                Delete
              </Button>
            </Box>
          ))}
        </Box>
      )}
    </Box>
  );
}

export default PromptGenerator;
