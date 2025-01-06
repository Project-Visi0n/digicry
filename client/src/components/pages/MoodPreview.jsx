import { useEffect, useState } from "react";
import { Typography } from "@mui/material";
import PropTypes from "prop-types";

// Import Chart.js items & register them:
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

function MoodPreview({ entries }) {
  const [chartData, setChartData] = useState(null);

  // Helper to transform the entries into chart-friendly data
  function prepareChartDataMini(journalEntries) {
    // Limit to the first 5 entries for demonstration
    const sliceEntries = journalEntries.slice(0, 5);

    // Create arrays for labels and data
    const labels = [];
    const dataPoints = [];

    sliceEntries.forEach((entry) => {
      // Convert createdAt to a short date string
      const dateObj = new Date(entry.createdAt);
      const shortDate = `${dateObj.getMonth() + 1}/${dateObj.getDate()}`;

      labels.push(shortDate);

      dataPoints.push(entry.sentimentScore);
    });

    // Return in the shape react-chartjs-2 expects
    return {
      labels,
      datasets: [
        {
          label: "Recent Mood",
          data: dataPoints,
          borderColor: "#FFA69E", // Pink color
          backgroundColor: "rgba(255, 166, 158, 0.2)",
          borderWidth: 2,
          tension: 0.3,
          pointRadius: 4,
        },
      ],
    };
  }
  // Build the chart data whenever `entries` change
  useEffect(() => {
    if (entries && entries.length > 0) {
      const prepared = prepareChartDataMini(entries);
      setChartData(prepared);
    } else {
      setChartData(null);
    }
  }, [entries]);

  // If we have no chartData, we can show a placeholder
  if (!chartData) {
    return (
      <Typography variant="body2">
        Not enough data to display a chart.
      </Typography>
    );
  }

  // Chart options for a small preview
  const previewOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
      },
    },
  };

  return <Line data={chartData} options={previewOptions} />;
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
