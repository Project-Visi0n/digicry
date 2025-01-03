import React, { useState } from 'react';

function LikeButton(props) {
  const [likes, setLikes] = useState(0);

  const handleLikeClick = () => {
    setLikes(likes + 1);
  };

  return (
    <button onClick={handleLikeClick}>
      Like ({likes})
    </button>
  );
}

export default LikeButton;