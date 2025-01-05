import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import axios from "axios";
import SentimentSatisfiedAltIcon from "@mui/icons-material/SentimentSatisfiedAlt";
import SentimentVeryDissatisfiedIcon from "@mui/icons-material/SentimentVeryDissatisfied";
import IconButton from "@mui/material/IconButton";
import { Grid2, Tooltip } from "@mui/material";

function LikeButton({ post }) {
  const [likes, setLikes] = useState(post.upVote);
  const [dislikes, setDislikes] = useState(post.downVote);
  const [liked, setLiked] = useState(false);
  const [disliked, setDisliked] = useState(false);
  const [chosen, setChosen] = useState(false);

  // Increments/Decrements or does nothing depending on which button is clicked

  const handleDislike = ({ currentTarget: { value } }) => {
    if (!disliked && !chosen) {
      setDislikes(dislikes - 1);
      setDisliked(true);
      setChosen(true);
      axios
        .post("api/forums/dislike", {
          postId: value,
          disliked,
        })
        .catch((error) => {
          console.error(error);
        });
    } else if (disliked) {
      setChosen(false);
      setDislikes(dislikes + 1);
      setDisliked(false);
      axios
        .post("api/forums/dislike", {
          postId: value,
          disliked,
        })
        .catch((error) => {
          console.error(error);
        });
    }
  };

  useEffect(() => {
    setLikes(post.upVote);
    setDislikes(post.downVote);
  }, [post.upVote, post.downVote]);

  const handleLike = ({ currentTarget: { value } }) => {
    if (!liked && !chosen) {
      setLikes(likes + 1);
      setLiked(true);
      setChosen(true);
      axios
        .post("api/forums/like", {
          postId: value,
          liked,
        })
        .catch((error) => {
          console.error(error);
        });
    } else if (liked) {
      setChosen(false);
      setLikes(likes - 1);
      setLiked(false);
      axios
        .post("api/forums/like", {
          postId: value,
          liked,
        })
        .catch((error) => {
          console.error(error);
        });
    }
  };

  return (
    <Grid2 container spacing={6}>
      <Grid2 item xs={2}>
        <Tooltip title="It's okay to love!" enterDelay={500} leaveDelay={200}>
          <IconButton
            id={post._id}
            value={post._id}
            onClick={handleLike}
            sx={{ typography: { fontSize: 8 } }}
          >
            <SentimentSatisfiedAltIcon style={{ fill: "#00fc15" }} />
            <h1 style={{ color: "#00fc15" }}>{likes}</h1>
          </IconButton>
        </Tooltip>
      </Grid2>
      <Grid2 item xs={3} />
      <Grid2 item xs={6}>
        <IconButton
          style={{ fill: "#ea0000" }}
          value={post._id}
          onClick={handleDislike}
          sx={{ typography: { fontSize: 8 } }}
        >
          <SentimentVeryDissatisfiedIcon style={{ fill: "#ea0000" }} />
          <h1 style={{ color: "red" }}>{dislikes}</h1>
        </IconButton>
      </Grid2>
    </Grid2>
  );
}

LikeButton.propTypes = {
  post: PropTypes.shape.isRequired,
};

export default LikeButton;
