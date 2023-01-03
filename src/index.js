import React from "react";
import ReactDOM from "react-dom/client";

import "@fontsource/roboto";
import "@fontsource/poppins";

// sito components
import ErrorBoundary from "sito-mui-error-component";

// styles
import "./index.css";

// animations
import "./assets/animations/shake.css";

// context
import { ModeProvider } from "./context/ModeProvider";
import { HistoryProvider } from "./context/HistoryProvider";
import { LanguageProvider } from "./context/LanguageProvider";

import App from "./App";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <LanguageProvider>
    <ModeProvider>
      <HistoryProvider>
        <App />
      </HistoryProvider>
    </ModeProvider>
  </LanguageProvider>
);
