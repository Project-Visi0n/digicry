import React, { useState, useEffect } from 'react';
import axios from 'axios';


function Login({ }) {

  const handleClick = async() => {

    axios.get('http://localhost:5000/auth/google').then((result) => {
     console.log(result)
    });

  }

  return (
    <div>
    <h1>Sign in</h1>
    <a className="button google" onClick={handleClick} href="/auth/google">
    Sign in with Google
    </a>
    </div>
  )
}

export default Login;
