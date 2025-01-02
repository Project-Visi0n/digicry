import { useState, useEffect } from "react";
import axios from "axios";
import {
  Box,
  Button,
  Typography,
  Container,
  TextField,
  InputAdornment,
} from "@mui/material";

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

  useEffect(() => {}, [goalPosts]);

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
      <form action={handleSubmit}>
        <label>Say Something Positive!</label>
        <br />
        <input type="text" id="msg" name="msg" />
        <br />
        <button type="submit"> Submit Post To {selectedGoal} </button>
      </form>
      {goalPosts.map((post, i) => {
        return (
          <div>
            <h4 id={post._id}>{post.forumName}</h4>
            <h5 className={post._id}>{post.message}</h5>
          </div>
        );
      })}
    </div>
  );
}

export default Forums;
