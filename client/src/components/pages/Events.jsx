import { useState, useEffect } from "react";
import axios from "axios";
import { Box, Typography } from "@mui/material";

function Events() {
  const [events, setEvents] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios
      .get("/api/events/all")
      .then((response) => {
        setEvents(response.data);
      })
      .catch((err) => {
        console.error("Error fetching events:", err);
        setError("Failed to fetch local events. Please try again later.");
      });
  }, []);

  if (error) {
    return <Typography color="error">{error}</Typography>;
  }

  return (
    <Box>
      {events.map((event) => (
        <Box key={event._id} className="event-card-placeholder">
          <Typography variant="h6">{event.title}</Typography>
          <Typography variant="body2">{event.date}</Typography>
          <Typography variant="body2">{event.location}</Typography>
          <Typography variant="body2">{event.description}</Typography>
          <Typography variant="body2">{event.venueName}</Typography>
          <Typography variant="body2">{event.linkUrl}</Typography>
          <Typography variant="body2">{event.thumbnail}</Typography>
          {/* Add more fields as needed */}
        </Box>
      ))}
    </Box>
  );
}

export default Events;
