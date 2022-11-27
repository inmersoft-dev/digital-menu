import React from "react";
import ReactDOM from "react-dom/client";

import "@fontsource/roboto";
import "@fontsource/poppins";

// styles
import "./index.css";

// context
import { NotificationProvider } from "./context/NotificationProvider";
import { LanguageProvider } from "./context/LanguageProvider";

import App from "./App";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <LanguageProvider>
      <NotificationProvider>
        <App />
      </NotificationProvider>
    </LanguageProvider>
  </React.StrictMode>
);
