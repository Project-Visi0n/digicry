/* eslint-disable react/no-unescaped-entities */
import { useContext, useEffect, useState } from "react";
import {
  Typography,
  Box,
  Stack,
  IconButton,
  CircularProgress,
  Button,
  Container,
  Card,
  CardContent
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

  // Get user display name safely
  const getUserName = () => {
    if (user && user.name) {
      return user.name;
    }
    return 'Friend';
  };

  // If authenticated, render the main content
  return (
    <Container maxWidth="xl">
      {/* Hero Section with Quote */}
      <Box 
        className="glass-panel hero-section"
        sx={{
          textAlign: 'center',
          py: 6,
          px: 4,
          mb: 4,
          borderRadius: '24px'
        }}
      >
        <Typography 
          variant="h3" 
          sx={{ 
            mb: 3,
            background: 'linear-gradient(45deg, var(--pink) 30%, var(--blue) 90%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}
        >
          Welcome back, {getUserName()}
        </Typography>
        
        {/* Quote Display */}
        <Box className="quote-container" sx={{ maxWidth: '800px', mx: 'auto' }}>
          {isLoading ? (
            <CircularProgress />
          ) : (
            <>
              <Typography variant="h5" sx={{ fontStyle: 'italic', mb: 2 }}>
                "{quote?.quote}"
              </Typography>
              <Typography variant="subtitle1">
                - {quote?.author}
              </Typography>
            </>
          )}
        </Box>
      </Box>

      {/* Main Content Stack */}
      <Stack spacing={4}>
        {/* Top Row */}
        <Stack
          direction={{ xs: 'column', md: 'row' }}
          spacing={4}
          sx={{ width: '100%' }}
        >
          {/* Mood Analytics Section */}
          <Card
            className="glass-panel analytics-card"
            sx={{ flex: 1 }}
          >
            <CardContent>
              <Typography variant="h5" sx={{ mb: 3 }}>
                Mood Analytics
              </Typography>
              <Box className="mood-chart" sx={{ height: '300px' }}>
                {/* Mood chart will go here */}
                <div className="mood-graph-placeholder" />
              </Box>
            </CardContent>
          </Card>

          {/* Recent Journal Entries */}
          <Card
            className="glass-panel journal-card"
            sx={{ flex: 1 }}
          >
            <CardContent>
              <Typography variant="h5" sx={{ mb: 3 }}>
                Recent Entries
              </Typography>
              <Button
        component={Link}
        to="/journal/new"
        className="glass-btn primary"
        startIcon={<AddIcon />}
      >
        Add Journal Entry
      </Button>
              {/* Journal entries list will go here */}
            </CardContent>
          </Card>
        </Stack>

        {/* Events Section */}
        <Card className="glass-panel events-card">
          <CardContent>
            <Typography variant="h5" sx={{ mb: 3 }}>
              Nearby Events
            </Typography>
            <Stack 
              direction={{ xs: 'column', sm: 'row' }} 
              spacing={2}
              sx={{ width: '100%' }}
            >
              {/* Events will go here */}
            </Stack>
          </CardContent>
        </Card>
      </Stack>
    </Container>
  );
}

export default Home;
