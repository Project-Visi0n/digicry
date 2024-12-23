/* eslint-disable react/no-unescaped-entities */
import { useContext, useEffect, useState } from "react";
import {
  Typography,
  Box,
  Stack,
  IconButton,
  CircularProgress,
  Button,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import RefreshIcon from "@mui/icons-material/Refresh";
import AddIcon from "@mui/icons-material/Add";
import { AuthContext } from "../../context/AuthContext";

function Home() {
  const [quote, setQuote] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const { user, login, loading } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && user) {
      // If authenticated, redirect to journal
      navigate("/journal");
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  // Function to fetch quote from the API
  const fetchQuote = () => {
    // Log to the console to indicate that quote fetching has started
    console.log("Fetching motivational quote...");

    // Set is loading to true before starting the fetch
    setIsLoading(true);
    setError(null); // Reset any previous errors

    // Make a GET request to the Stoicism Quote API
    axios
      .get("/api/stoic-quote")
      .then((response) => {
        // Log the successful response
        console.log("Quote fetched successfully:", response.data);

        // Extract quote data from the response
        const fetchedQuote = response.data.data;

        // Update the 'quote' state with the fetched data
        setQuote(fetchedQuote);

        // Set loading to false as the data has been fetched
        setIsLoading(false);
      })
      .catch((err) => {
        // Log the error
        console.error("Error fetching quote:", err);

        // Update the 'error' state with the error message
        setError("Failed to fetch quote. Please try again later.");

        // Set loading to false as the fetch attempt has concluded
        setIsLoading(false);
      });
  };

  // Fetch motivational quote when the component mounts
  useEffect(() => {
    // Call the fetchQuote function
    fetchQuote();
  }, []); // Empty dependency array ensures this runs once when the component mounts

  // Helper function to render quote content based on that state
  const renderQuoteContent = () => {
    if (isLoading) {
      // Display a loading spinner while fetching the quote
      return <CircularProgress />;
    }
    if (error) {
      return (
        <Typography variant="body1" color="error">
          {error}
        </Typography>
      );
    }
    if (quote) {
      // Display the fetched quote and author
      return (
        <Box mt={2}>
          <Typography variant="body1" className="motivational-quote">
            "{quote.quote}"
          </Typography>
          <Typography variant="body2" className="quote-author">
            - {quote.author}
          </Typography>
        </Box>
      );
    }
    // In case quote is null but not loading or error
    return null;
  };

  // Render based on authentication state
  if (!user) {
    // If not authenticated, show login prompt
    return (
      <Box className="main-container" sx={{ textAlign: "center", mt: 8 }}>
        <Typography variant="h3" className="main-title" gutterBottom>
          Welcome to Digi-Cry
        </Typography>
        <Typography variant="h6" sx={{ mb: 4 }}>
          Your personal journal to express and analyze your emotions.
        </Typography>
        <Button
          variant="contained"
          color="primary"
          size="large"
          onClick={login}
          startIcon={<AddIcon />}
        >
          Sign in with Google
        </Button>
      </Box>
    );
  }

  // If authenticated, render the main content
  return (
    <Box className="main-container">
      <Box>
        {/* Daily Inspiration Section */}
        <Box className="glass-panel quote-panel" sx={{ mb: 4 }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 2,
            }}
          >
            <Typography variant="h4" className="section-title">
              Daily Inspiration
            </Typography>
            <IconButton onClick={fetchQuote} disabled={isLoading}>
              <RefreshIcon />
            </IconButton>
          </Box>
          {renderQuoteContent()}
        </Box>

        <Box className="glass-panel voice-panel" sx={{ mb: 4 }}>
          <Typography variant="h4" className="section-title">
            Mood Analytics
          </Typography>
          <Box className="voice-analytics-container">
            <Box className="voice-visualization-placeholder">
              <Typography variant="body1" sx={{ opacity: 0.7 }}>
                Share how you're feeling...
              </Typography>
            </Box>
          </Box>
        </Box>

        <Stack spacing={4} className="content-stack">
          <Box className="glass-panel mood-panel">
            <Typography variant="h4" className="section-title">
              Track Your Mood
            </Typography>
            <Typography variant="body1" className="section-description">
              Document your emotional journey and gain insights into your
              well-being
            </Typography>
            <Box className="mood-preview">
              <div className="mood-graph-placeholder" />
            </Box>
          </Box>

          <Box className="glass-panel events-panel">
            <Typography variant="h4" className="section-title">
              Local Events
            </Typography>
            <Typography variant="body1" className="section-description">
              Connect with your community
            </Typography>
            <Box className="events-preview">
              <div className="event-card-placeholder" />
              <div className="event-card-placeholder" />
            </Box>
          </Box>
        </Stack>
      </Box>
    </Box>
  );
}

export default Home;
