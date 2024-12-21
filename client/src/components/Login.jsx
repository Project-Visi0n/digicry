import React, { useState, useEffect } from 'react';
import axios from 'axios';


function Login({ }) {

  const handleClick = async() => {

    axios.get('auth/google')
  }

  return (
    <div>
    <h1>Sign in</h1>
    <a class="button google" onClick={handleClick} href="auth/google">
    Sign in with Google
    </a>
    </div>
  )
}

export default Login;
