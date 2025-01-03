import { useState, useEffect } from "react";
import PropTypes from "prop-types";
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
  const [liked, setLiked] = useState(false);
  const [disliked, setDisliked] = useState(false);
  const [chosen, setChosen] = useState(false);

  const handleDislike = ({ target: { value } }) => {
    if (!disliked && !chosen) {
      setDislikes(dislikes - 1);
      setDisliked(true);
      setChosen(true)
      axios
        .post("api/forums/dislike", {
          postId: value,
          disliked,
        })
        .then((data) => {
          console.log(data);
        })
        .catch((error) => {
          console.error(error);
        });
    } else if(disliked){
      setChosen(false)
      setDislikes(dislikes + 1);
      setDisliked(false);
      axios
        .post("api/forums/dislike", {
          postId: value,
          disliked,
        })
        .then((data) => {
          console.log(data);
        })
        .catch((error) => {
          console.error(error);
        });
    }
  };

  const handleLike = ({ target: { value } }) => {
    if (!liked && !chosen) {
      setLikes(likes + 1);
      setLiked(true);
      setChosen(true)
      axios
        .post("api/forums/like", {
          postId: value,
          liked,
        })
        .then((data) => {
          console.log(data);
        })
        .catch((error) => {
          console.error(error);
        });
    } else if (liked) {
      setChosen(false)
      setLikes(likes - 1);
      setLiked(false);
      axios
        .post("api/forums/like", {
          postId: value,
          liked,
        })
        .then((data) => {
          console.log(data);
        })
        .catch((error) => {
          console.error(error);
        });
    }
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

LikeButton.propTypes = {
  post: PropTypes.shape.isRequired,
};

export default LikeButton;
