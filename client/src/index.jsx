//ths way to use React may be deprecated for React 19
import React from 'react'
import { createRoot } from 'react-dom/client';
import App from './components/App.jsx';

//create Root file that will append to html element attribute with id:root
const root = createRoot(document.getElementById('root'));
root.render(<App/>); 