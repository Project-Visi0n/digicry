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
import { useNavigate, Navigate, Link } from "react-router-dom";
import axios from "axios";
import RefreshIcon from "@mui/icons-material/Refresh";
import AddIcon from "@mui/icons-material/Add";
import { AuthContext } from "../../context/AuthContext";
import Events from "./Events";

function Home() {
  const [recentEntries, setRecentEntries] = useState([]);
  const [quote, setQuote] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const { user, login, loading } = useContext(AuthContext);
  // const navigate = useNavigate();
  // useEffect(() => {
  //   console.log("[Home] Fetching recent journal entries...");
  //   axios
  //     .get("/api/journal")
  //     .then((response) => {
  //       console.log("[Home] /api/journal response:", response.data);
  //       const data = response.data || [];
  //       // Slice the first 3 or 5 for recent
  //       const topThree = data.slice(0, 3);
  //       setRecentEntries(topThree);
  //     })
  //     .catch((err) => {
  //       console.error("[Home] Error fetching recent entries:", err);
  //       setError("Failed to load recent entries. Please try again later.");
  //     });
  // }, []);

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

  useEffect(() => {
    fetchQuote();
  }, []);


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

  /**
   ***********************************************************************************************
   * COMMENT OUT WHEN IN DEVELOPMENT MODE
   Render based on authentication state
   if (!loading && user) {
     return <Navigate to="/journal" replace />;
   }
   ***********************************************************************************************
   */

  // Show loading spinner id auth state is loading
  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  /**
   * *****************************************************************************************************************
   * DEVELOPMENT MODE - TEMPORARILY REMOVE AUTH CHECK
  If not authenticated, show login prompt
  if (!user) {
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
        ***************************************************************************************************************************
      */

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
          <Typography variant="h5">Recent Journal Entries</Typography>
          {error && (
            <Typography variant="body2" color="error">
              {error}
            </Typography>
          )}
          {/* If no error, map the recent entries */}
          {recentEntries.map((entry) => (
            <Box
              key={entry._id}
              sx={{
                mt: 2,
                p: 2,
                backgroundColor: "rgba(255,255,255,0.2)",
                backdropFilter: "blur(12px)",
                borderRadius: "8px",
              }}
            >
              <Typography variant="h6">{entry.title}</Typography>
              <Typography variant="body2" sx={{ opacity: 0.7 }}>
                {entry.content.slice(0, 50)}...
              </Typography>
            </Box>
          ))}

          {recentEntries.length === 0 && !error && (
            <Typography variant="body2" sx={{ mt: 2 }}>
              No recent entries found.
            </Typography>
          )}
        </Box>

        {/* VIEW ALL BUTTON */}
        <Button variant="contained" component={Link} to="/journal">
          View All Journal Entries
        </Button>

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
              <Events />
            </Box>
          </Box>
        </Stack>
      </Box>
    </Box>
  );
}

export default Home;
