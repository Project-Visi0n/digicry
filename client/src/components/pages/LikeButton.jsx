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

function LikeButton({ post }) {
  const [likes, setLikes] = useState(post.upVote);
  const [dislikes, setDislikes] = useState(post.downVote);

  const handleDislike = ({ target: { value } }) => {
    setDislikes(dislikes - 1);
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
    setLikes(likes + 1);
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
    <Grid container spacing={5}>
      <Grid item xs={2}>
        <Tooltip title="It's okay to love!" enterDelay={500} leaveDelay={200}>
          <Button
            value={post._id}
            onClick={handleLike}
            sx={{ typography: { fontSize: 8 } }}
          >
            Motivational
          </Button>
        </Tooltip>
      </Grid>
      <Grid item xs={4}>
        <div>{likes} Moto Count</div>
      </Grid>
      <Grid item xs={2}>
        <Button
          value={post._id}
          onClick={handleDislike}
          sx={{ typography: { fontSize: 8 } }}
        >
          Unmotivating
        </Button>
      </Grid>
      <Grid item xs={4}>
        <div>{dislikes} Unmotivating Count</div>
      </Grid>
    </Grid>
  );
}

export default LikeButton;
