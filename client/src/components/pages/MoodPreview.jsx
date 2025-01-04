import { useEffect, useState } from "react";
import { Box, CircularProgress, Typography } from "@mui/material";
import { Line } from "react-chartjs-2";
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

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
);

function MoodPreview({ entries }) {
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    if (!entries || entries.length === 0) return;

    // Process last 7 days of entries
    const last7Days = entries
      .slice(0, 7)
      .reverse();

    const data = {
      labels: last7Days.map(entry =>
        new Date(entry.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
      ),
      datasets: [{
        label: 'Mood Score',
        data: last7Days.map(entry => entry.normalizedSentiment),
        borderColor: '#AED9E0',
        backgroundColor: '#B8F2E6',
        tension: 0.4
      }]
    };

    setChartData(data);
  }, [entries]);

  if (!entries || entries.length === 0) {
    return (
      <Box sx={{ p: 2, textAlign: 'center' }}>
        <Typography>No mood data available</Typography>
      </Box>
    );
  }

  if (!chartData) {
    return <CircularProgress />;
  }

  return (

  )
}

export default MoodPreview;
