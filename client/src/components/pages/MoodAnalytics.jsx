import { useState, useEffect } from "react";
import {
  Typography,
  Box,
  Card,
  CardContent,
  CircularProgress,
} from "@mui/material";
import { Line } from "react-chartjs-2";
import axios from "axios";

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

// Registers the chart building blocks with Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
);

/**
 * 1. Create local state for 'journalEntries', 'loading' and 'error'
 * 2. useEffect: fetch /api/journal when component first renders
 * 3. Transform the data into labels and data arrays for chart
 * 4. Render line chart with that data
 * 5. Optionally display an average sentiment or other stats
 */

function MoodAnalytics() {
  const [journalEntries, setJournalEntries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Fetch journal data
  useEffect(() => {
    console.log("[Analytics] Fetching journal entries for analytics...");
    setLoading(true);

    axios
      .get("/api/journal")
      .then((response) => {
        console.log("[Analytics] Successfully fetched data:", response.data);
        // Log the data we received from the server
        setJournalEntries(response.data);
        // Store the data in state for rendering the chart
        setLoading(false);
      })
      .catch((err) => {
        console.error("[Analytics] Error fetching data:", err);
        setError("Failed to load analytics data.");
        setLoading(false);
      });
  }, []);

  // TRANSFORM DATA FOR CHART
  // Define a function that groups entries by their creation date
  function prepareChartData(entries) {
    // Create an object { dateString: [sentiments] }
    const groupedByDate = {};

    entries.forEach((entry) => {
      // Convert createdAt into just a date string (YYYY-MM-DD)
      const dateObj = new Date(entry.createdAt);
      const dateStr = dateObj.toISOString().split("T")[0];
      /* The method .toISOString() returns something like "2023-02-12T01:23:45.678Z".
         .split("T")[0] takes the substring before the 'T', so, "2023-02-12". */

      if (!groupedByDate[dateStr]) {
        groupedByDate[dateStr] = [];
      }
      // Push the normalizedSentiment or sentimentScore to that date's array
      groupedByDate[dateStr].push(
        entry.normalizedSentiment || entry.sentimentScore,
      );
      /* Our Journal model has 'normalizedSentiment' (0-100)
         and 'sentimentScore' (-1 to 1). We use whichever is available. */
    });

    // Create arrays for labels (dateStr) and data (average sentiment for that date)
    const labels = [];
    const dataPoints = [];

    Object.keys(groupedByDate)
      .sort()
      .forEach((dateKey) => {
        // Sort the dates so the chart is in chronological order
        labels.push(dateKey);
        const arr = groupedByDate[dateKey];
        // compute average
        const avgSentiment =
          arr.reduce((acc, val) => acc + val, 0) / arr.length;
        dataPoints.push(Math.round(avgSentiment));
      });

    return { labels, dataPoints };
  }

  // Prepare the chart data
  const { labels, dataPoints } = prepareChartData(journalEntries);

  // BUILD CHART OPTIONS
  const chartData = {
    labels,
    // x-axis labels = array of date strings

    datasets: [
      {
        label: "Average Sentiment Over Time",
        data: dataPoints,
        // y-axis data points = average sentiment for each date
        borderColor: "rgba(255, 166, 158, 1)",
        // line color from pink variable (#FFA69E)
        backgroundColor: "rgba(255, 166, 158, 0.2)",
        // fill color
        pointBackgroundColor: "#FFA69E",
        // color of each data point
        tension: 0.2,
        // how curvy the line is, 0 for straight lines
        borderWidth: 2,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
      },
      title: {
        display: true,
        text: "Mood Trend by Date",
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
        // If normalizedSentiment is used, it might range up to 100
      },
    },
  };

  // CALCULATE SOME BASIC ANALYTICS
  let averageAllTime = 0;
  if (journalEntries.length > 0) {
    const total = journalEntries.reduce(
      (acc, e) => acc + (e.normalizedSentiment || 0),
      0,
    );
    averageAllTime = Math.round(total / journalEntries.length);
  }
  // Sum up all normalizedSentiments and divide by total count then round to nearest integer

  // Render Component
  return (
    <Box sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h3" sx={{ mb: 4 }}>
        Mood Analytics
      </Typography>

      {loading && (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
          <CircularProgress />
        </Box>
      )}

      {error && (
        <Typography variant="body2" color="error" sx={{ mt: 2 }}>
          {error}
        </Typography>
      )}

      {!loading && !error && journalEntries.length > 0 && (
        <Card className="glass-panel" sx={{ p: 2, mb: 3 }}>
          <CardContent>
            <Typography variant="h5" sx={{ mb: 2 }}>
              Overall Average Sentiment: {averageAllTime} / 100
            </Typography>
            <Box sx={{ height: "400px" }}>
              <Line data={chartData} options={chartOptions} />
              {/* Pass chartData and chartOptions to <Line /> from react-chartjs-2. */}
            </Box>
          </CardContent>
        </Card>
      )}

      {!loading && !error && journalEntries.length === 0 && (
        <Typography sx={{ mt: 2 }}>No journal entries found.</Typography>
      )}
    </Box>
  );
}

export default MoodAnalytics;

