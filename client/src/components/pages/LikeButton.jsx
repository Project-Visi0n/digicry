import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import axios from "axios";
import SentimentSatisfiedAltIcon from '@mui/icons-material/SentimentSatisfiedAlt';
import SentimentVeryDissatisfiedIcon from '@mui/icons-material/SentimentVeryDissatisfied';
import IconButton from '@mui/material/IconButton';
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

function LikeButton({ post, selectedGoal }) {
  const [likes, setLikes] = useState(post.upVote);
  const [dislikes, setDislikes] = useState(post.downVote);
  const [liked, setLiked] = useState(false);
  const [disliked, setDisliked] = useState(false);
  const [chosen, setChosen] = useState(false);
  const [likeColor, setLikeColor] = useState("#7e90a3")

  
  // Increments/Decrements or does nothing depending on which button is clicked

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
        .then(() => {
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
        .then(() => {
        })
        .catch((error) => {
          console.error(error);
        });
    }
  };


  const handleLike = ({ target: { value } }) => {
    
    if (!liked && !chosen) {
      setLikes(likes + 1);
      setLikeColor("#00fc15")
      setLiked(true);
      setChosen(true)
      axios
        .post("api/forums/like", {
          postId: value,
          liked,
        })
        .then(() => {
        })
        .catch((error) => {
          console.error(error);
        });
    } else if (liked) {
      setChosen(false)
      setLikes(likes - 1);
      setLiked(false);
      setLikeColor("#7e90a3")
      axios
        .post("api/forums/like", {
          postId: value,
          liked,
        })
        .then(() => {
        })
        .catch((error) => {
          console.error(error);
        });
    }
  };


  return (
    <Grid container spacing={1}>
      <Grid item xs={2}>
        <Tooltip title="It's okay to love!" enterDelay={500} leaveDelay={200}>
          <IconButton
            id={selectedGoal}
            value={post._id}
            onClick={handleLike}
            sx={{ typography: { fontSize: 8 } }}
          >
            <SentimentSatisfiedAltIcon style={{ fill: "#00fc15"}}/>
            <h1 style={{ color: "#00fc15" }}>{likes}</h1>
          </IconButton>
        </Tooltip>
      </Grid>
      <Grid item xs={3}/>
      <Grid item xs={2}>
        <IconButton 
          style={{ fill: '#ea0000' }}
          value={post._id}
          onClick={handleDislike}
          sx={{ typography: { fontSize: 8 }}}
        >
          <SentimentVeryDissatisfiedIcon style={{ fill: '#ea0000' }}/>
          <h1 style={{ color: 'red' }}>{dislikes}</h1>
        </IconButton>
      </Grid>
 
    </Grid>
  );
}

LikeButton.propTypes = {
  post: PropTypes.shape.isRequired,
};

export default LikeButton;
