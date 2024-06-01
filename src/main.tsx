import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

const expandTg = () => {
  if ("Telegram" in window) {
    const tele = (window as any)?.Telegram;
    const webapp = (tele as any)?.WebApp;

    webapp?.expand();
  }
};

document.addEventListener("DOMContentLoaded", expandTg);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
