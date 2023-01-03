/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// some-javascript-utils
import { getUserLanguage } from "some-javascript-utils/browser";

// sito components
import SitoContainer from "sito-container";
import ErrorBoundary from "sito-mui-error-component";
import NotificationContext from "sito-mui-notification";

// @mui
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { useMediaQuery, ThemeProvider, CssBaseline } from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";

// themes
import dark from "./assets/theme/dark";
import light from "./assets/theme/light";

// views
import Home from "./views/Home/Home";
import Login from "./views/Auth/Login";
import Logout from "./views/Auth/Logout";
import Register from "./views/Auth/Register";
import Watch from "./views/Menu/Watch";
import Edit from "./views/Menu/Edit";
import Settings from "./views/Settings/Settings";
import NotFound from "./views/NotFound/NotFound";

// utils
import { userLogged, logoutUser } from "./utils/auth";

// components
import MUIPrinter from "./components/MUIPrinter/MUIPrinter";

// contexts
import { useMode } from "./context/ModeProvider";
import { useLanguage } from "./context/LanguageProvider";
import { SettingsProvider } from "./context/SettingsProvider";

// services
import { validateBasicKey } from "./services/auth";
import { sendMobileCookie, sendPcCookie } from "./services/analytics";

import config from "./config";

const App = () => {
  const biggerThanMD = useMediaQuery("(min-width:900px)");

  const { modeState } = useMode();
  const { languageState, setLanguageState } = useLanguage();

  useEffect(() => {
    document.body.style.overflowX = "hidden";
    document.body.style.transition = "all 200ms ease";
  }, []);

  useEffect(() => {
    try {
      setLanguageState({ type: "set", lang: getUserLanguage(config.language) });
    } catch (err) {
      console.error(err);
    }
  }, []);

  const fetch = async () => {
    try {
      const value = await validateBasicKey();
      if (!value) {
        logoutUser();
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      } else sessionStorage.setItem("user", value);
    } catch (err) {
      logoutUser();
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    }
  };

  useEffect(() => {
    if (userLogged()) fetch();
  }, []);

  useEffect(() => {
    if (biggerThanMD) sendPcCookie();
    else sendMobileCookie();
  }, []);

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <SitoContainer
        sx={{ minHeight: "100vh" }}
        alignItems="center"
        justifyContent="center"
      >
        <ThemeProvider theme={modeState.mode === "light" ? light : dark}>
          <CssBaseline />
          <NotificationContext>
            <BrowserRouter basename={process.env.PUBLIC_URL}>
              <Routes>
                <Route
                  path="/"
                  element={
                    <ErrorBoundary>
                      <Home />
                    </ErrorBoundary>
                  }
                />
                <Route
                  exact
                  path="/auth/"
                  element={
                    <ErrorBoundary>
                      <Login />
                    </ErrorBoundary>
                  }
                />
                <Route
                  exact
                  path="/auth/register-user"
                  element={
                    <ErrorBoundary>
                      <Register />
                    </ErrorBoundary>
                  }
                />
                <Route
                  exact
                  path="/auth/logout"
                  element={
                    <ErrorBoundary>
                      <Logout />
                    </ErrorBoundary>
                  }
                />
                <Route
                  exact
                  path="/settings/"
                  element={
                    <SettingsProvider>
                      <Settings />
                    </SettingsProvider>
                  }
                />
                <Route
                  exact
                  path="/menu/*"
                  element={
                    <ErrorBoundary>
                      <Watch />
                    </ErrorBoundary>
                  }
                />
                <Route
                  exact
                  path="/menu/edit"
                  element={
                    <ErrorBoundary>
                      <Edit />
                    </ErrorBoundary>
                  }
                />
                <Route
                  exact
                  path="/cookie-policy"
                  element={
                    <ErrorBoundary>
                      <MUIPrinter text={languageState.texts.CookiePolicy} />
                    </ErrorBoundary>
                  }
                />
                <Route
                  exact
                  path="/terms-conditions"
                  element={
                    <ErrorBoundary>
                      <MUIPrinter text={languageState.texts.Terms} />
                    </ErrorBoundary>
                  }
                />
                <Route
                  path="*"
                  element={
                    <ErrorBoundary>
                      <NotFound />
                    </ErrorBoundary>
                  }
                />
              </Routes>
            </BrowserRouter>
          </NotificationContext>
        </ThemeProvider>
      </SitoContainer>
    </LocalizationProvider>
  );
};

export default App;
