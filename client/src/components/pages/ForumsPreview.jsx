import { useEffect, useState } from "react";
import { Typography, Box, CircularProgress, Button } from "@mui/material";
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
    <Box>
      {/* Map through recentPosts and display each post with a snippet and timestamp */}
      {recentPosts.length > 0 ? (
        recentPosts.map((post) => (
          <Box
            key={post._id}
            sx={{
              mt: 2,
              p: 2,
              borderRadius: "12px",
              background: "rgba(255, 255, 255, 0.1)",
              backdropFilter: "blur(10px)",
            }}
          >
            <Typography variant="h6" sx={{ mb: 1 }}>
              {post.message.slice(0, 50)}...
            </Typography>
            <Typography variant="caption" sx={{ display: "block", mb: 1 }}>
              Posted: {new Date(post.createdAt).toLocaleString()}
            </Typography>

            <LikeButton post={post} selectedGoal={post.forumName} />
          </Box>
        ))
      ) : (
        <Typography variant="body2">
          No forum posts available. Be the first to start a discussion!
        </Typography>
      )}

      {/* Link to Forums Page */}
      <Box sx={{ textAlign: "right", mt: 2 }}>
        <Button
          component={Link}
          to="/forums"
          className="glass-btn primary"
          sx={{ textTransform: "none" }}
        >
          View All Forums
        </Button>
      </Box>
    </Box>
  );
}

export default ForumsPreview;
