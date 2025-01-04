import { useEffect, useState } from "react";
import { Typography, Box, CircularProgress } from "@mui/material";
import { Link } from "react-router-dom";
import axios from "axios";
import LikeButton from "./LikeButton";

function ForumsPreview() {
  const [recentPosts, setRecentPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  // Fetch recent forum posts
  useEffect(() => {
    axios
      .get("/api/forums", { params: { forumName: "all" } })
      .then((response) => {
        // Limit to 3 posts
        setRecentPosts(response.data.slice(0, 3));
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching forums:", err);
        setError(true);
        setLoading(false);
      });
  }, []);

  // Displays a spinner while data is being fetched
  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
        <CircularProgress />
      </Box>
    );
  }

  // Shows an error message if fetching fails
  if (error) {
    return (
      <Typography variant="body2" color="error">
        Unable to load forum posts.
      </Typography>
    );
  }

  // Rendering Logic
  return (

  )
}

export default ForumsPreview;
