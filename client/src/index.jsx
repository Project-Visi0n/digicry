//ths way to use React may be deprecated for React 19
import React from 'react'
import { createRoot } from 'react-dom/client';
import App from './components/App.jsx';

// Import styles
import './styles.css';

//create Root file that will append to html element attribute with id:root
const container = document.getElementById('root');

const root = createRoot(container);

root.render(<App />);