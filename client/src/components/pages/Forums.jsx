import { useState, useEffect } from "react";
import Goals from "./Goals.jsx";

function Forums() {
  const [goalForum, setGoalForum] = useState([]);
  const [goalOptions, setGoalOptions] = useState([
    "Physical Health",
    "Finances",
    "Personal Development",
    "Mental Health",
    "Career",
  ]);

  useEffect(() => {}, [goalForum]);

  const handleClick = ({ target: { className } }) => {
    console.log("clicked ", className);
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
    </div>
  );
}

export default Forums;
