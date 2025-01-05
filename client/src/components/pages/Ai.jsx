import { useEffect, useState } from 'react'
import axios from "axios";
import { Box, Button, TextField } from "@mui/material";

function Ai() {
  const [goalAnalysis, setGoalAnalysis] = useState("")

  const postGoal = (e) => {
    e.preventDefault();
    const msg = e.target[0].value;

    axios
      .get("api/forums/ai",  { params: { msg } })
      .then((x) => {
        console.log(x)
      })
      .catch((error) => {
        console.error(error, "Failed to create post");
      });
  }


  return (
    <div>
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
    <p>{goalAnalysis}</p>
  </Box>
  </div>
  )
}

export default Ai