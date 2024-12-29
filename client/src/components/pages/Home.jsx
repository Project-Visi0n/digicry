import { useContext, useEffect, useState } from "react";
import {
  Typography,
  Box,
  Stack,
  CircularProgress,
  Button,
  Container,
  Card,
  CardContent,
} from "@mui/material";
import { useNavigate, Navigate, Link } from "react-router-dom";
import axios from "axios";
import RefreshIcon from "@mui/icons-material/Refresh";
import AddIcon from "@mui/icons-material/Add";
import { AuthContext } from "../../context/AuthContext";
import Events from "./Events";

function Home() {
  const { user, login, loading } = useContext(AuthContext);
  const [recentEntries, setRecentEntries] = useState([]);
  const [quote, setQuote] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

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
  const fetchQuote = async () => {
    try {
      setIsLoading(true);
      const { data } = await axios.get("/api/stoic-quote");
      setQuote(data.data);
    } catch (err) {
      console.error("Error fetching quote:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchQuote();
  }, []);

  // Helper function to render quote content based on that state
  // const renderQuoteContent = () => {
  //   if (isLoading) {
  //     // Display a loading spinner while fetching the quote
  //     return <CircularProgress />;
  //   }
  //   if (error) {
  //     return (
  //       <Typography variant="body1" color="error">
  //         {error}
  //       </Typography>
  //     );
  //   }
  //   if (quote) {
  //     // Display the fetched quote and author
  //     return (
  //       <Box mt={2}>
  //         <Typography variant="body1" className="motivational-quote">
  //           &quot;{quote.quote}&quot;
  //         </Typography>
  //         <Typography variant="body2" className="quote-author">
  //           - {quote.author}
  //         </Typography>
  //       </Box>
  //     );
  //   }
  //   // In case quote is null but not loading or error
  //   return null;
  // };

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
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "80vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (!user) {
    return (
      <Box
        className="glass-panel"
        sx={{
          textAlign: "center",
          mt: 8,
          p: 6,
          borderRadius: "24px",
          maxWidth: "600px",
          mx: "auto",
          background: "rgba(255, 255, 255, 0.1)",
          backdropFilter: "blur(10px)",
        }}
      >
        <Typography
          variant="h3"
          className="main-title"
          sx={{
            mb: 3,
            background:
              "linear-gradient(45deg, var(--pink) 30%, var(--blue) 90%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            fontWeight: "bold",
          }}
        >
          Welcome to Digi-Cry
        </Typography>
        <Typography
          variant="h6"
          sx={{
            mb: 4,
            color: "rgba(255, 255, 255, 0.8)",
          }}
        >
          Your personal journal to express and analyze your emotions.
        </Typography>
        <Button
          variant="contained"
          size="large"
          onClick={login}
          startIcon={<AddIcon />}
          sx={{
            background:
              "linear-gradient(45deg, var(--pink) 30%, var(--blue) 90%)",
            color: "white",
            px: 4,
            py: 1.5,
            borderRadius: "12px",
            textTransform: "none",
            fontSize: "1.1rem",
            boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
            "&:hover": {
              background:
                "linear-gradient(45deg, var(--pink) 50%, var(--blue) 110%)",
            },
          }}
        >
          Sign in with Google
        </Button>
      </Box>
    );
  }

  const getQuoteText = () => {
    if (!quote) return "";
    return quote.quote || "";
  };

  const getQuoteAuthor = () => {
    if (!quote) return "";
    return quote.author || "";
  };

  // Get user display name safely
  const getUserName = () => {
    if (user && user.name) {
      return user.name;
    }
    return "Friend";
  };

  // If authenticated, render the main content
  return (
    <Container maxWidth="xl">
      {/* Hero Section with Quote */}
      <Box
        className="glass-panel hero-section"
        sx={{
          textAlign: "center",
          py: 6,
          px: 4,
          mb: 4,
          borderRadius: "24px",
        }}
      >
        <Typography
          variant="h3"
          sx={{
            mb: 3,
            background:
              "linear-gradient(45deg, var(--pink) 30%, var(--blue) 90%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          Welcome back, {getUserName()}
        </Typography>

        {/* Quote Display */}
        <Box className="quote-container" sx={{ maxWidth: "800px", mx: "auto" }}>
          {isLoading ? (
            <CircularProgress />
          ) : (
            <>
              <Typography variant="h5" sx={{ fontStyle: "italic", mb: 2 }}>
                &quot;{getQuoteText()}&quot;
              </Typography>
              <Typography variant="subtitle1">- {getQuoteAuthor()}</Typography>
            </>
          )}
        </Box>
      </Box>

      {/* Main Content Stack */}
      <Stack spacing={4}>
        {/* Top Row */}
        <Stack
          direction={{ xs: "column", md: "row" }}
          spacing={4}
          sx={{ width: "100%" }}
        >
          {/* Mood Analytics Section */}
          <Card className="glass-panel analytics-card" sx={{ flex: 1 }}>
            <CardContent>
              <Typography variant="h5" sx={{ mb: 3 }}>
                Mood Analytics
              </Typography>
              <Box className="mood-chart" sx={{ height: "300px" }}>
                {/* Mood chart will go here */}
                <div className="mood-graph-placeholder" />
              </Box>
            </CardContent>
          </Card>

          {/* Recent Journal Entries */}
          <Card className="glass-panel journal-card" sx={{ flex: 1 }}>
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
              direction={{ xs: "column", sm: "row" }}
              spacing={2}
              sx={{ width: "100%" }}
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
