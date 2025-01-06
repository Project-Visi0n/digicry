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
    <Container maxWidth="xl">
      {/* Hero Section with Quote */}
      <Box
        className="glass-panel hero-section"
        sx={{
          textAlign: "center",
          py: 2, // Significantly reduced vertical padding
          px: 4, // Kept horizontal padding the same
          mb: 4,
          borderRadius: "24px",
          minHeight: "auto", // Ensures it only takes the space it needs
        }}
      >
        <Typography
          variant="h3"
          sx={{
            mb: 1, // Reduced margin bottom
            background:
              "linear-gradient(45deg, var(--pink) 30%, var(--blue) 90%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          Welcome back, {user.name || "Friend"}
        </Typography>

        {/* Quote Display */}
        <Box
          className="quote-container"
          sx={{
            maxWidth: "800px",
            mx: "auto",
            mt: 1, // Reduced top margin
          }}
        >
          {isLoading ? (
            <CircularProgress />
          ) : (
            <>
              <Typography
                variant="h5"
                sx={{
                  fontStyle: "italic",
                  mb: 0.5, // Reduced margin bottom
                }}
              >
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
          spacing={6}
          sx={{ width: "100%" }}
        >
          {/* Mood Analytics Section */}
          <Card
            className="glass-panel analytics-card"
            sx={{ flex: 1, height: "500px" }}
          >
            {" "}
            {/* Set fixed height */}
            <CardContent
              sx={{
                height: "100%",
                overflow: "hidden",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mb: 2,
                }}
              >
                <Box>
                  <Typography variant="h5" sx={{ mb: 1 }}>
                    Mood Analytics
                  </Typography>
                  <Typography variant="body2" className="section-description">
                    Track your emotional trends over time to gain insights into
                    your well-being.
                  </Typography>
                </Box>
                <Button
                  component={Link}
                  to="/analytics"
                  className="glass-btn primary"
                >
                  See Full Report
                </Button>
              </Box>
              <Box
                sx={{
                  flex: 1,
                  overflow: "auto",
                  "&::-webkit-scrollbar": {
                    width: "8px",
                  },
                  "&::-webkit-scrollbar-track": {
                    background: "rgba(255, 255, 255, 0.1)",
                  },
                  "&::-webkit-scrollbar-thumb": {
                    background: "rgba(174, 217, 224, 0.5)",
                    borderRadius: "4px",
                  },
                  "&::-webkit-scrollbar-thumb:hover": {
                    background: "rgba(174, 217, 224, 0.8)",
                  },
                }}
              >
                <Box className="mood-chart" sx={{ height: "300px" }}>
                  <MoodPreview entries={recentEntries} />
                </Box>
              </Box>
            </CardContent>
          </Card>

          {/* Recent Journal Entries */}
          <Card
            className="glass-panel journal-card"
            sx={{ flex: 1, height: "500px" }}
          >
            <CardContent
              sx={{
                height: "100%",
                overflow: "hidden",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mb: 2,
                }}
              >
                <Box>
                  <Typography variant="h5" sx={{ mb: 1 }}>
                    Recent Journal Entries
                  </Typography>
                  <Typography variant="body2" className="section-description">
                    Digi-Cry today? Writing down your feelings can help you
                    process and understand them better.
                  </Typography>
                </Box>
                <Button
                  component={Link}
                  to="/journal/new"
                  className="glass-btn primary"
                  startIcon={<AddIcon />}
                >
                  Add Journal Entry
                </Button>
              </Box>
              <Box
                sx={{
                  flex: 1,
                  overflow: "auto",
                  "&::-webkit-scrollbar": {
                    width: "8px",
                  },
                  "&::-webkit-scrollbar-track": {
                    background: "rgba(255, 255, 255, 0.1)",
                  },
                  "&::-webkit-scrollbar-thumb": {
                    background: "rgba(174, 217, 224, 0.5)",
                    borderRadius: "4px",
                  },
                  "&::-webkit-scrollbar-thumb:hover": {
                    background: "rgba(174, 217, 224, 0.8)",
                  },
                }}
              >
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
              </Box>
            </CardContent>
          </Card>
        </Stack>

        {/* Middle Row: Forums Preview */}
        <Stack
          direction={{ xs: "column", md: "row" }}
          spacing={4}
          sx={{ width: "100%" }}
        >
          {/* Forums Preview Section */}
          <Card
            className="glass-panel forums-card"
            sx={{ flex: 1, height: "500px" }}
          >
            <CardContent
              sx={{
                height: "100%",
                overflow: "hidden",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mb: 2,
                }}
              >
                <Box>
                  <Typography variant="h5" sx={{ mb: 1 }}>
                    Forums
                  </Typography>
                  <Typography variant="body2" className="section-description">
                    Engage with our community, share your goals, and receive
                    support from others.
                  </Typography>
                </Box>
                <Button
                  component={Link}
                  to="/forums"
                  className="glass-btn primary"
                >
                  View Forums
                </Button>
              </Box>
              <Box
                sx={{
                  flex: 1,
                  overflow: "auto",
                  "&::-webkit-scrollbar": { width: "8px" },
                  "&::-webkit-scrollbar-track": {
                    background: "rgba(255, 255, 255, 0.1)",
                  },
                  "&::-webkit-scrollbar-thumb": {
                    background: "rgba(174, 217, 224, 0.5)",
                    borderRadius: "4px",
                  },
                  "&::-webkit-scrollbar-thumb:hover": {
                    background: "rgba(174, 217, 224, 0.8)",
                  },
                }}
              >
                <ForumsPreview />
              </Box>
            </CardContent>
          </Card>
        </Stack>

        {/* Bottom Row */}
        <Stack
          direction={{ xs: "column", md: "row" }}
          spacing={4}
          sx={{ width: "100%" }}
        >
          {/* Nearby Events Section */}
          <Card
            className="glass-panel events-card"
            sx={{ flex: 1, height: "500px" }}
          >
            <CardContent
              sx={{
                height: "100%",
                overflow: "hidden",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mb: 2,
                }}
              >
                <Box>
                  <Typography variant="h5" sx={{ mb: 1 }}>
                    Nearby Events
                  </Typography>
                  <Typography variant="body2" className="section-description">
                    Discover events in your area to connect and engage with your
                    community.
                  </Typography>
                </Box>
                <Button
                  component={Link}
                  to="/events"
                  className="glass-btn primary"
                >
                  See All Events
                </Button>
              </Box>
              <Box
                sx={{
                  flex: 1,
                  overflow: "auto",
                  "&::-webkit-scrollbar": { width: "8px" },
                  "&::-webkit-scrollbar-track": {
                    background: "rgba(255, 255, 255, 0.1)",
                  },
                  "&::-webkit-scrollbar-thumb": {
                    background: "rgba(174, 217, 224, 0.5)",
                    borderRadius: "4px",
                  },
                  "&::-webkit-scrollbar-thumb:hover": {
                    background: "rgba(174, 217, 224, 0.8)",
                  },
                }}
              >
                <Stack
                  direction={{ xs: "column", sm: "row" }}
                  spacing={2}
                  sx={{ width: "100%" }}
                >
                  <RenderEvents />
                </Stack>
              </Box>
            </CardContent>
          </Card>
        </Stack>
      </Stack>
    </Container>
  );
}

export default Home;
