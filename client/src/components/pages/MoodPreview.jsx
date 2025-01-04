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
import PropTypes from "prop-types";

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
    const last7Days = entries.slice(0, 7).reverse();

    const data = {
      labels: last7Days.map((entry) =>
        new Date(entry.createdAt).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        }),
      ),
      datasets: [
        {
          label: "Mood Score",
          data: last7Days.map((entry) => entry.normalizedSentiment),
          borderColor: "#AED9E0",
          backgroundColor: "#B8F2E6",
          tension: 0.4,
        },
      ],
    };

    setChartData(data);
  }, [entries]);

  if (!entries || entries.length === 0) {
    return (
      <Box sx={{ p: 2, textAlign: "center" }}>
        <Typography>No mood data available</Typography>
      </Box>
    );
  }

  if (!chartData) {
    return <CircularProgress />;
  }

  return (
    <Box sx={{ height: "100%", p: 2 }}>
      <Line
        data={chartData}
        options={{
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            y: {
              beginAtZero: true,
              max: 100,
              grid: {
                color: "rgba(255, 255, 255, 0.1)",
              },
            },
            x: {
              grid: {
                color: "rgba(255, 255, 255, 0.1)",
              },
            },
          },
          plugins: {
            legend: {
              display: false,
            },
          },
        }}
      />
    </Box>
  );
}

MoodPreview.propTypes = {
  entries: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string,
      createdAt: PropTypes.string,
      normalizedSentiment: PropTypes.number,
      title: PropTypes.string,
      content: PropTypes.string,
      mood: PropTypes.string,
    }),
  ),
};

MoodPreview.defaultProps = {
  entries: [],
};

export default MoodPreview;
