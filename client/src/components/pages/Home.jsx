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
  Grid,
} from "@mui/material";
import { Link } from "react-router-dom";
import axios from "axios";
import AddIcon from "@mui/icons-material/Add";

// Chart.js imports & registration
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";

// Importing custom components
import { AuthContext } from "../../context/AuthContext";
import Login from "../Login";
import RenderEvents from "../RenderEvents";
import MoodPreview from "./MoodPreview";
import ForumsPreview from "./ForumsPreview";

// Register Chart.js modules
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
);

function Home() {
  const [recentEntries, setRecentEntries] = useState([]);
  const [quote, setQuote] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // For error handling
  const [error, setError] = useState(null);

  // Access user & session from AuthContext
  const { user, setUser, validSession, setValidSession, loading } =
    useContext(AuthContext);

  /** *******************************
   * FETCH MOTIVATIONAL QUOTE
   ******************************** */

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

  /** **********************************
   * FETCH RECENT JOURNAL ENTRIES
   *********************************** */
  useEffect(() => {
    console.log("[Home] Fetching recent journal entries...");
    axios
      .get("/api/journal")
      .then((response) => {
        console.log("[Home] /api/journal response:", response.data);
        const data = response.data || [];
        // Just keep the top 3 for display
        const topThree = data.slice(0, 3);
        setRecentEntries(topThree);
      })
      .catch((err) => {
        console.error("[Home] Error fetching recent entries:", err);
        setError("Failed to load recent entries. Please try again later.");
      });
  }, []);

  /** **********************************
   * SHOW LOADING SPINNER IF NEEDED
   *********************************** */
  if (loading) {
    // If Auth Context is still checking for a user session, show spinner
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

  /** **********************************
   * IF NO USER, SHOW LOGIN PROMPT
   *********************************** */
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

  /** **********************************
   * IF AUTHENTICATED, SHOW MAIN UI
   *********************************** */
  return (
    <Container maxWidth={false} sx={{ maxWidth: "1800px", mx: "auto" }}>
      <Box>
        {/* Hero Section */}
        <Box className="dashboard-container">
          <Box className="dashboard-main">
            <Card className="glass-panel hero-section">
              <Typography className="welcome-text">
                Welcome back, {user.username}!
              </Typography>
              {quote && (
                <Typography className="quote-text">
                  &quot;{quote.quote}&quot;
                  {quote.author && (
                    <Typography
                      component="span"
                      sx={{
                        display: "block",
                        mt: 1,
                        color: "var(--pink)",
                        fontStyle: "italic",
                      }}
                    >
                      — {quote.author}
                    </Typography>
                  )}
                </Typography>
              )}
            </Card>

            <Grid container spacing={2}>
              {/* Mood Analytics */}
              <Grid item xs={12} md={6}>
                <Card className="glass-panel dashboard-card analytics-card">
                  <CardContent className="dashboard-card-content">
                    <Box className="dashboard-card-header">
                      <Typography variant="h6">Mood Analytics</Typography>
                      <Button size="small" className="glass-btn primary">
                        View Full Report
                      </Button>
                    </Box>
                    <Box className="dashboard-card-body">
                      <MoodPreview entries={recentEntries} />
                    </Box>
                  </CardContent>
                </Card>
              </Grid>

              {/* Recent Journal Entries */}
              <Grid item xs={12} md={6}>
                <Card className="glass-panel dashboard-card journal-card">
                  <CardContent className="dashboard-card-content">
                    <Box className="dashboard-card-header">
                      <Typography variant="h6">
                        Recent Journal Entries
                      </Typography>
                      <Button
                        component={Link}
                        to="/journal/new"
                        size="small"
                        className="glass-btn primary"
                        startIcon={<AddIcon />}
                      >
                        New Entry
                      </Button>
                    </Box>
                    <Box className="dashboard-card-body custom-scrollbar">
                      {error && (
                        <Typography variant="body2" color="error">
                          {error}
                        </Typography>
                      )}
                      {recentEntries && recentEntries.length > 0 ? (
                        <Stack spacing={1}>
                          {recentEntries.map((entry) => (
                            <Box
                              key={entry._id}
                              sx={{
                                p: 1.5,
                                borderRadius: "8px",
                                background: "rgba(255, 255, 255, 0.1)",
                                backdropFilter: "blur(10px)",
                                transition: "transform 0.2s ease",
                                cursor: "pointer",
                                "&:hover": {
                                  transform: "scale(1.01)",
                                  background: "rgba(255, 255, 255, 0.15)",
                                },
                              }}
                            >
                              <Typography variant="subtitle1" sx={{ mb: 0.5 }}>
                                {entry.title}
                              </Typography>
                              <Typography
                                variant="body2"
                                sx={{
                                  mb: 0.5,
                                  display: "-webkit-box",
                                  WebkitLineClamp: 2,
                                  WebkitBoxOrient: "vertical",
                                  overflow: "hidden",
                                }}
                              >
                                {entry.content}
                              </Typography>
                              <Box
                                sx={{
                                  display: "flex",
                                  justifyContent: "space-between",
                                  alignItems: "center",
                                }}
                              >
                                <Typography
                                  variant="caption"
                                  sx={{
                                    color: "var(--pink)",
                                    fontWeight: 500,
                                  }}
                                >
                                  Mood: {entry.mood}
                                </Typography>
                                <Typography
                                  variant="caption"
                                  sx={{ color: "text.secondary" }}
                                >
                                  {new Date(entry.createdAt).toLocaleString()}
                                </Typography>
                              </Box>
                            </Box>
                          ))}
                        </Stack>
                      ) : (
                        <Typography variant="body2">
                          No recent entries found.
                        </Typography>
                      )}
                    </Box>
                  </CardContent>
                </Card>
              </Grid>

              {/* Forums Preview - Full Width */}
              <Grid item xs={12}>
                <Card className="glass-panel dashboard-card forums-card">
                  <CardContent className="dashboard-card-content">
                    <Box className="dashboard-card-header">
                      <Typography variant="h6">Forums</Typography>
                      <Button size="small" className="glass-btn primary">
                        View All
                      </Button>
                    </Box>
                    <Box className="dashboard-card-body custom-scrollbar">
                      <ForumsPreview />
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Box>

          {/* Sidebar */}
          <Box className="dashboard-sidebar">
            <Card className="glass-panel dashboard-card events-card">
              <CardContent className="dashboard-card-content">
                <Box className="dashboard-card-header">
                  <Typography variant="h6">Nearby Events</Typography>
                  <Button size="small" className="glass-btn primary">
                    View All
                  </Button>
                </Box>
                <Box className="dashboard-card-body custom-scrollbar">
                  <RenderEvents />
                </Box>
              </CardContent>
            </Card>
          </Box>
        </Box>
      </Box>
    </Container>
  );
}

export default Home;
