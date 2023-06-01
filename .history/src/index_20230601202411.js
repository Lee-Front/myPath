import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { BrowserRouter } from "react-router-dom";
import axios from "axios";

const root = ReactDOM.createRoot(document.getElementById("root"));
axios.interceptors.request.use((config) => {
  if (config.url.startsWith("/api")) {
    const apiUrl =
      process.env.NODE_ENV === "development"
        ? "http://localhost:8080"
        : "http://";
    config.url = apiUrl + config.url;
  }
  return config;
});
root.render(
  <BrowserRouter basename={process.env.PUBLIC_URL}>
    <App />
  </BrowserRouter>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
