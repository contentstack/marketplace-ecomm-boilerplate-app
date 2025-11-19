import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom"; // Changed here
import reportWebVitals from "./reportWebVitals";
import App from "./containers/App";
import "./index.css";

document.addEventListener("DOMContentLoaded", () => {
  // @ts-ignore
  const root = ReactDOM.createRoot(document.getElementById("root"));
  root.render(
    <React.StrictMode>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </React.StrictMode>
  );
});

reportWebVitals();
