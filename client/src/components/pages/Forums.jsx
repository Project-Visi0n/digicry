import { useState, useEffect } from "react";
import axios from "axios";
import {
  Box,
  Button,
  Typography,
  Container,
  TextField,
  InputAdornment,
  positions,
  Grid,
  Tooltip,
} from "@mui/material";
import LikeButton from "./LikeButton";
function Forums() {
  const [goalPosts, setGoalPosts] = useState([]);
  const [selectedGoal, setSelectedGoal] = useState("?");
  const [goalOptions, setGoalOptions] = useState([
    "Physical Health",
    "Finances",
    "Personal Development",
    "Mental Health",
    "Career",
  ]);

  const handleClick = ({ target: { className } }) => {
    console.log("clicked ", className);
    setSelectedGoal(className);
    const removeSpaces = className.split(" ").join("");
    axios
      .get("/api/forums", { params: { forumName: removeSpaces } })
      .then((posts) => {
        console.log(posts.data);
        setGoalPosts(posts.data);
      })
      .catch((error) => {
        console.error(
          error,
          `error getting ${removeSpaces} forums from server`
        );
      });
  };

  const handleSubmit = (msg) => {
    axios
      .post("api/forums", {
        message: msg.get("msg"),
        selectedGoal,
      })
      .then((data) => {
        console.log(data);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const handleDislike = ({ target: { value } }) => {
    axios
    .post("api/forums/dislike", {
      postId: value,
    })
    .then((data) => {
      console.log(data);
    })
    .catch((error) => {
      console.error(error);
    });
  };

  const handleLike = ({ target: { value } }) => {
    axios
    .post("api/forums/like", {
      postId: value,
    })
    .then((data) => {
      console.log(data);
    })
    .catch((error) => {
      console.error(error);
    });
  };
  return (
    <div>
      <h1> Join a Discussion on Similar Goals! </h1>
      {goalOptions.map((goal) => {
        return (
          <button
            className={goal}
            type="button"
            onClick={handleClick}
            key={goal}
            goal={goal}
          >
            {goal}
          </button>
        );
      })}
      <Box component="form" action={handleSubmit}>
        <label>Say Something Positive!</label>
        <br />
        <TextField
          sx={(theme) => ({
            bgcolor: "#fff",
          })}
          type="text"
          id="msg"
          name="msg"
          placeholder="Spread love!"
        />
        <br />
        <Button type="submit" variant="outlined">
          {" "}
          Submit Post To {selectedGoal}{" "}
        </Button>
      </Box>
      {goalPosts.map((post, i) => {
        return (
          <Grid container spacing={5}>
            <Grid item xs={8}>
              <Box
                sx={() => ({
                  bgcolor: "#fff",
                  color: "grey.800",
                  border: "2px solid",
                  borderColor: "grey.300",
                  p: 2,
                  borderRadius: 2,
                  fontSize: "0.875rem",
                  fontWeight: "700",
                  top: 0,
                  left: "43%",
                  zIndex: "modal",
                })}
              >
                <div>
                  <h4 id={post._id}>{post.forumName}</h4>
                  <h5 className={post._id}>{post.message}</h5>
                </div>
                <br></br>
                <LikeButton post={post}/>
              </Box>
            </Grid>
          </Grid>
        );
      })}
    </div>
  );
}

export default Forums;
