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

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
