import { useEffect, useState } from "react";
import { Typography, Box, CircularProgress, Button } from "@mui/material";
import { Link } from "react-router-dom";
import axios from "axios";
import LikeButton from "./LikeButton";

/**
forumNames is a static array that doesn’t change between renders, so we have to define it outside of the component.
We have to do this so that it doesn’t get recreated on every render, and the useEffect hook can safely depend on it without triggering unnecessary re-executions.
*/

// Define the list of forumNames
const forumNames = [
  "Physical Health",
  "Finances",
  "Personal Development",
  "Mental Health",
  "Career",
];

function ForumsPreview() {
  const [recentPosts, setRecentPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    // Function to fetch posts for a single forumName
    const fetchPosts = async (forumName) => {
      try {
        // Remove spaces from forumName to match backend expectation
        const noSpacesForumName = forumName.split(" ").join("");
        const response = await axios.get("/api/forums", {
          params: { forumName: noSpacesForumName },
        });
        return response.data;
      } catch (err) {
        if (err.response && err.response.status === 404) {
          // No posts found for this forumName - this is expected
          return [];
        }
        console.error(`Error fetching posts for ${forumName}:`, err);
        setError(true);
        return [];
      }
    };

    // Fetch all posts concurrently
    const fetchAllPosts = async () => {
      try {
        const allPostsPromises = forumNames.map((name) => fetchPosts(name));
        const allPostsArrays = await Promise.all(allPostsPromises);
        // Flatten the array of arrays
        const allPosts = allPostsArrays.flat();
        // Sort by createdAt descending
        allPosts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        // Limit to recent 5 posts
        const limitedPosts = allPosts.slice(0, 5);
        setRecentPosts(limitedPosts);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching all forum posts:", err);
        setError(true);
        setLoading(false);
      }
    };

    fetchAllPosts();
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
              {post.message.length > 50
                ? `${post.message.slice(0, 50)}...`
                : post.message}
            </Typography>
            <Typography variant="caption" sx={{ display: "block", mb: 1 }}>
              Posted in <strong>{post.forumName}</strong> |{" "}
              {new Date(post.createdAt).toLocaleString()}
            </Typography>

            {/* LikeButton component */}
            <LikeButton post={post} selectedGoal={post.forumName} />
          </Box>
        ))
      ) : (
        <Typography variant="body2">
          No forum posts available. Be the first to start a discussion!
        </Typography>
      )}
    </Box>
  );
}

export default ForumsPreview;
