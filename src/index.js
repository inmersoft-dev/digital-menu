import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";

// context
import { LanguageProvider } from "./context/LanguageProvider";

import App from "./App";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <LanguageProvider>
      <App />
    </LanguageProvider>
  </React.StrictMode>
);
