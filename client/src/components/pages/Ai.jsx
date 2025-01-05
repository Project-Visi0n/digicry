import { useEffect, useState } from "react";
import axios from "axios";
import { Box, Button, TextField } from "@mui/material";

function Ai() {
  const [goalAnalysis, setGoalAnalysis] = useState(
    "Our AI will give an analysis on how to acheive your daily goals here!"
  );
  const [centerOrLeft, setCenterOrLeft] = useState("center")
  const postGoal = (e) => {
    e.preventDefault();
    const msg = e.target[0].value;

    axios
      .get("api/forums/ai", { params: { msg } })
      .then((x) => {
        console.log(x.data);
        setGoalAnalysis(x.data);
      })
      .catch((error) => {
        console.error(error, "Failed to create post");
      });
  };

  return (
    <div style={{whiteSpace: "pre-line"}}>
      <Box align="center" component="form" onSubmit={postGoal}>
        <label>Goal Post Analysis</label>
        <br />
        <TextField
          sx={() => ({
            bgcolor: "#fff",
            width: "500px",
          })}
          type="goal"
          id="goal"
          name="goal"
          placeholder="Name ONE Goal You Want to Acheive today!"
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
          Goal Post Analysis{" "}
        </Button>
      </Box>
      <Box>
        <Box align="center" className="glass-panel">
         <th align={centerOrLeft} ><em>{goalAnalysis}</em></th> 
        </Box>
      </Box>
    </div>
  );
}

export default Ai;
