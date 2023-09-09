/*
  Adam Karpovich 314080383
  Veronika Kovaleva 321777583
*/
import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App"; // Replace with the correct path to your App component
import "./styles.css";

const rootElement = document.getElementById("root");

// Use createRoot to render the app's root component
const root = createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
