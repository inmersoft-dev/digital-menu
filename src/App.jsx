/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// sito components
import SitoContainer from "sito-container";

// own components
import Notification from "./components/Notification/Notification";

// @mui
import { useMediaQuery, ThemeProvider, CssBaseline } from "@mui/material";

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

// functions
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

const App = () => {
  const { modeState } = useMode();
  const biggerThanMD = useMediaQuery("(min-width:900px)");
  const { languageState, setLanguageState } = useLanguage();

  useEffect(() => {
    document.body.style.overflowX = "hidden";
    document.body.style.transition = "all 200ms ease";
  }, []);

  useEffect(() => {
    try {
      const userLang = navigator.language || navigator.userLanguage;
      if (userLang)
        setLanguageState({ type: "set", lang: userLang.split("-")[0] });
    } catch (err) {
      console.error(err);
    }
  }, []);

  const fetch = async () => {
    const value = await validateBasicKey();
    if (!value) {
      logoutUser();
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } else sessionStorage.setItem("user", value);
  };

  useEffect(() => {
    if (userLogged()) fetch();
  }, []);

  useEffect(() => {
    if (biggerThanMD) sendPcCookie();
    else sendMobileCookie();
  }, []);

  return (
    <SitoContainer
      sx={{ minHeight: "100vh" }}
      alignItems="center"
      justifyContent="center"
    >
      <ThemeProvider theme={modeState.mode === "light" ? light : dark}>
        <Notification />
        <CssBaseline />
        <BrowserRouter basename={process.env.PUBLIC_URL}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route exact path="/auth/" element={<Login />} />
            <Route exact path="/auth/register-user" element={<Register />} />
            <Route exact path="/auth/logout" element={<Logout />} />
            <Route
              exact
              path="/settings/"
              element={
                <SettingsProvider>
                  <Settings />
                </SettingsProvider>
              }
            />
            <Route exact path="/menu/*" element={<Watch />} />
            <Route exact path="/menu/edit" element={<Edit />} />
            <Route
              exact
              path="/cookie-policy"
              element={<MUIPrinter text={languageState.texts.CookiePolicy} />}
            />
            <Route
              exact
              path="/terms-conditions"
              element={<MUIPrinter text={languageState.texts.Terms} />}
            />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </ThemeProvider>
    </SitoContainer>
  );
};

export default App;
