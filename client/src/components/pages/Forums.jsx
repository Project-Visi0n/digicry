import { useState, useEffect } from "react";
import axios from "axios";
import { Box, Button, TextField } from "@mui/material";
import LikeButton from "./LikeButton";
import Ai from "./Ai";

function Forums() {
  const [goalPosts, setGoalPosts] = useState([]);
  const [selectedGoal, setSelectedGoal] = useState("?");
  const [submit, setSubmit] = useState(false);
  const [goalOptions] = useState([
    "Physical Health",
    "Finances",
    "Personal Development",
    "Mental Health",
    "Career",
  ]);

  const removeSpaces = (string) => {
    const copy = string.split(" ").join("");
    return copy;
  };

  const goalClicked = ({ target: { value } }) => {
    setSelectedGoal(value);
  };

  // Sets the age of posts.

  const minutesAgo = (isoDateString) => {
    const date = new Date(isoDateString);
    const now = new Date();
    const diffMilliseconds = now.getTime() - date.getTime();
    const diffMinutes = Math.floor(diffMilliseconds / (1000 * 60));
    const diffHours = Math.floor(diffMinutes / 60);
    const remainingMinutes = diffMinutes % 60;
    const diffDays = Math.floor(diffHours / 24);

    if (diffMinutes <= 2) {
      return "just now!";
    }
    if (diffMinutes < 60) {
      return `${diffMinutes} minutes ago`;
    }
    if (diffHours < 24) {
      return `${diffHours}hrs and ${remainingMinutes} minutes ago`;
    }
    if (diffDays < 2) {
      return "yesterday";
    }
    return `${diffDays} days ago`;
  };

  // Post element msg to the server

  const postMsg = (e) => {
    e.preventDefault();
    const msg = e.target[0].value;

    axios
      .post("api/forums", {
        message: msg,
        selectedGoal,
      })
      .then(() => {
        setSubmit(!submit);
        e.target[0].value = "";
      })
      .catch((error) => {
        console.error(error, "Failed to create post");
      });
  };

  // Reloads the page contents when things are submitted.

  useEffect(() => {
    if (selectedGoal !== "?") {
      const forumName = removeSpaces(selectedGoal);
      axios
        .get("/api/forums", { params: { forumName } })
        .then((posts) => {
          setGoalPosts(posts.data);
        })
        .catch((error) => {
          console.error(error, `Error getting ${forumName} forums from server`);
        });
    }
  }, [submit, selectedGoal]);

  return (
    <Box>
      <Box
        sx={() => ({
          background: "transparent",
          backdropFilter: "blur(12px)",
          border: "1px solid",
          borderRadius: "24px",
          padding: "2rem",
          overflow: "hidden",
          position: "relative",
          fontSize: "35px",
        })}
        align="center"
      >
        {" "}
        Join a Discussion on Similar Goals!{" "}
      </Box>
      <br />
      <Box align="center">
        {goalOptions.map((goal) => {
          return (
            <Button
              className="glass-btn"
              type="button"
              onClick={goalClicked}
              key={goal}
              goal={goal}
              value={goal}
            >
              {goal}
            </Button>
          );
        })}
      </Box>
      <br />
      <Box align="center" component="form" onSubmit={postMsg}>
        <label> Say Something Positive!</label>
        <br />
        <TextField
          sx={() => ({
            bgcolor: "#fff",
            width: "500px",
          })}
          type="msg"
          id="msg"
          name={selectedGoal}
          placeholder="Spread love!"
        />
        <br />
        <br />
        <Button
          type="submit"
          variant="outlined"
          sx={() => ({
            ":hover": {
              boxShadow: 6,
              opacity: 0.95,
              bgcolor: "#FAF3DD",
            },
          })}
        >
          {" "}
          Submit Post To {selectedGoal}{" "}
        </Button>
      </Box>
      <br />
      <Ai />
      <br />
      <Box>
        {goalPosts.reverse().map((post, i) => {
          return (
            <Box align="center" container spacing={5}>
              <Box
                sx={() => ({
                  bgcolor: "rgb(255, 255, 255)",
                  opacity: 0.65,
                  color: "grey.800",
                  border: "2px solid",
                  borderColor: "black",
                  p: 2,
                  borderRadius: 2,
                  fontSize: "0.875rem",
                  fontWeight: "700",
                  top: 0,
                  left: "43%",
                  zIndex: "modal",
                  width: "700px",
                  ":hover": {
                    boxShadow: 20,
                    opacity: 0.95,
                  },
                })}
                id={selectedGoal}
              >
                <Box align="left">
                  <h4 style={{ color: "black" }} id={post._id}>
                    {post.forumName}
                  </h4>
                  <br />
                  <h4 style={{ color: "black" }} className={post._id}>
                    <em>{post.message}</em>
                  </h4>
                  <br />
                  <h6>{minutesAgo(post.createdAt)}</h6>
                </Box>
                <br />
                <LikeButton
                  key={post._id}
                  selectedGoal={selectedGoal}
                  post={post}
                />
              </Box>

              <Box style={{ height: "2px" }} />
            </Box>
          );
        })}
      </Box>
    </Box>
  );
}

export default Forums;
