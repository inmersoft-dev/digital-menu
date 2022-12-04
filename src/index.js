import React from "react";
import ReactDOM from "react-dom/client";

import "@fontsource/roboto";
import "@fontsource/poppins";

// styles
import "./index.css";

// context
import { ModeProvider } from "./context/ModeProvider";
import { LanguageProvider } from "./context/LanguageProvider";
import { NotificationProvider } from "./context/NotificationProvider";

import App from "./App";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <LanguageProvider>
    <ModeProvider>
      <NotificationProvider>
        <App />
      </NotificationProvider>
    </ModeProvider>
  </LanguageProvider>
);
