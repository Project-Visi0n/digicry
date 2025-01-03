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
import { Link } from "react-router-dom";
import axios from "axios";
import AddIcon from "@mui/icons-material/Add";
import { AuthContext } from "../../context/AuthContext";
import Login from "../Login";
import RenderEvents from "../RenderEvents";

function Home() {
  const [recentEntries, setRecentEntries] = useState([]);
  const [quote, setQuote] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  // For error handling
  const [error, setError] = useState(null);
  // const navigate = useNavigate();

  // Access user & session from AuthContext
  const { user, setUser, validSession, setValidSession, loading } =
    useContext(AuthContext);

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

  // Fetch recent journal entries
  useEffect(() => {
    console.log("[Home] Fetching recent journal entries...");
    axios
      .get("/api/journal")
      .then((response) => {
        console.log("[Home] /api/journal response:", response.data);
        const data = response.data || [];
        // Slice the first 3 or 5 for recent
        const topThree = data.slice(0, 3);
        setRecentEntries(topThree);
      })
      .catch((err) => {
        console.error("[Home] Error fetching recent entries:", err);
        setError("Failed to load recent entries. Please try again later.");
      });
  }, []);

  // Show spinner auth is loading
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

  // If no user is logged in, show login section
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
        <Typography variant="h3" className="main-title">
          Welcome to Digi-Cry
        </Typography>

        <Typography variant="h6">
          Your personal journal to express and analyze your emotions.
        </Typography>

        <Login
          validSession={validSession}
          setValidSession={setValidSession}
          setUser={setUser}
        />
      </Box>
    );
  }

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
          Welcome back, {user.name || "Friend"}
        </Typography>

        {/* Quote Display */}
        <Box className="quote-container" sx={{ maxWidth: "800px", mx: "auto" }}>
          {isLoading ? (
            <CircularProgress />
          ) : (
            <>
              <Typography variant="h5" sx={{ fontStyle: "italic", mb: 2 }}>
                &quot;{quote.quote}&quot;
              </Typography>
              <Typography variant="subtitle1">- {quote.author}</Typography>
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

              {/* Journal entries list */}
              {error && (
                <Typography variant="body2" color="error" sx={{ mt: 2 }}>
                  {error}
                </Typography>
              )}

              {recentEntries && recentEntries.length > 0 ? (
                recentEntries.map((entry) => (
                  <Box
                    key={entry._id}
                    sx={{
                      mt: 2,
                      p: 2,
                      borderRadius: "12px",
                      background: "rgba(255, 255, 255, 0.1)",
                      backdropFilter: "blur(10px)",
                    }}
                  >
                    <Typography variant="h6" sx={{ mb: 1 }}>
                      {entry.title}
                    </Typography>
                    <Typography variant="body2">
                      {entry.content.slice(0, 100)}...
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{ display: "block", mt: 1 }}
                    >
                      Mood: {entry.mood} | Created:{" "}
                      {new Date(entry.createdAt).toLocaleString()}
                    </Typography>
                  </Box>
                ))
              ) : (
                <Typography sx={{ mt: 2 }} variant="body1">
                  No recent entries found.
                </Typography>
              )}
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
              <RenderEvents />
            </Stack>
          </CardContent>
        </Card>
      </Stack>
    </Container>
  );
}

export default Home;
