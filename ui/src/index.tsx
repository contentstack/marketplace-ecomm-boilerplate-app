/* Import React modules */
import React from "react";
import ReactDOM from "react-dom";
/* Import other node modules */
import reportWebVitals from "./reportWebVitals";
/* Import our modules */
import App from "./containers/App";
/* Import node module CSS */
/* Import our CSS */
import "./index.css";
// eslint-disable-next-line import/order
import { BrowserRouter } from "react-router-dom";

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

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
