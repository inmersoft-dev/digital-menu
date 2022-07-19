import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";

// context
import { NotificationProvider } from "./context/NotificationProvider";
import { LanguageProvider } from "./context/LanguageProvider";

import App from "./App";
import { ScrollProvider } from "./context/ScrollProvider";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <LanguageProvider>
      <NotificationProvider>
        <ScrollProvider>
          <App />
        </ScrollProvider>
      </NotificationProvider>
    </LanguageProvider>
  </React.StrictMode>
);
