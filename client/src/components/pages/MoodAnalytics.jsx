import { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
} from "@mui/material";
import { Line, Bar } from "react-chartjs-2";
import axios from "axios";

function MoodAnalytics() {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch journal data
  useEffect(() => {
    const fetchEntries = async () => {
      try {
        const response = await axios.get("/api/journal");
        setEntries(response.data);
      } catch (err) {
        setError("Failed to fetch journal entries");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchEntries();
  }, []);

  // Transform data for Chart and build Chart Options
  const processTimeSeriesData = () => {
    if (!entries.length) return null;

    const sortedEntries = [...entries].sort(
      (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
    );

    return {
      labels: sortedEntries.map((entry) =>
        new Date(entry.createdAt).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        }),
      ),
      datasets: [
        {
          label: "Mood Score",
          data: sortedEntries.map((entry) => entry.normalizedSentiment),
          borderColor: "#AED9E0",
          backgroundColor: "#B8F2E6",
          tension: 0.4,
        },
      ],
    };
  };

  const processMoodDistribution = () => {
    if (!entries.length) return null;

    const moodCounts = entries.reduce((acc, entry) => {
      acc[entry.mood] = (acc[entry.mood] || 0) + 1;
      return acc;
    }, {});

    return {
      labels: Object.keys(moodCounts),
      datasets: [
        {
          label: "Mood Distribution",
          data: Object.values(moodCounts),
          backgroundColor: [
            "#FFA69E",
            "#FAF3DD",
            "#B8F2E6",
            "#AED9E0",
            "#5E6472",
          ],
        },
      ],
    };
  };

  return (
    <Container maxWidth="xl">
      <Box className="glass-panel" sx={{ mb: 4, p: 3 }}>
        <Typography
          variant="h4"
          sx={{
            background:
              "linear-gradient(45deg, var(--pink) 30%, var(--blue) 90%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            fontWeight: "bold",
          }}
        >
          Mood Analytics
        </Typography>
      </Box>
    </Container>
  );
}

export default MoodAnalytics;
