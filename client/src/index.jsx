import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./components/App";

// Import styles
import "./styles.css";

// Create Root file that will append to html element attribute with id:root
// eslint-disable-next-line no-undef
const container = document.getElementById("root");
const root = createRoot(container);

root.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>,
);
