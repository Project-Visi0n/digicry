import { useState, useEffect } from "react";
import axios from "axios";
import Goals from "./Goals.jsx";

function Forums() {
  const [goalPosts, setGoalPosts] = useState([]);
  const [selectedGoal, setSelectedGoal] = useState('?')
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
        console.log(posts);
        setGoalPosts(posts);
      })
      .catch((error) => {
        console.error(
          error,
          `error getting ${removeSpaces} forums from server`
        );
      });
  };

  const handleSubmit = (e) => {
    axios.post("api/forums", { data: e })
    .then((data) => {
      console.log(data)
    })
    .catch((error) => {
      console.error(error)
    })
  }

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
      {goalPosts.map((post) => {
        return (
          <div>
            <h1>{post.message}</h1>
          </div>
        );
      })}
      <form>
        <label htmlFor="msg">Say Something Positive!</label>
        <br />
        <input type="text" id="msg" name="msg" />
        <br />
        <button type="button" onClick={handleSubmit}> Submit Post To {selectedGoal} </button>
      </form>
    </div>
  );
}

export default Forums;
