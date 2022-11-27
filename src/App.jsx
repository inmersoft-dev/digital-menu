import { useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// sito components
import SitoContainer from "sito-container";

// own components
import ToTop from "./components/ToTop/ToTop";
import Notification from "./components/Notification/Notification";

// @mui
import { ThemeProvider, CssBaseline } from "@mui/material";

// theme
import dark from "./assets/theme/dark";

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

// services
import { validateBasicKey } from "./services/auth";

const App = () => {
  const fetch = async () => {
    const value = await validateBasicKey();
    if (!value) {
      logoutUser();
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    }
  };

  useEffect(() => {
    if (userLogged()) fetch();
  }, []);

  return (
    <SitoContainer
      sx={{ minWidth: "100vw", minHeight: "100vh" }}
      alignItems="center"
      justifyContent="center"
    >
      <ThemeProvider theme={dark}>
        <Notification />
        <ToTop />
        <CssBaseline />
        <BrowserRouter basename={process.env.PUBLIC_URL}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route exact path="/auth/" element={<Login />} />
            <Route exact path="/auth/register-user" element={<Register />} />
            <Route exact path="/auth/logout" element={<Logout />} />
            <Route exact path="/settings/" element={<Settings />} />
            <Route exact path="/menu/*" element={<Watch />} />
            <Route exact path="/menu/edit" element={<Edit />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </ThemeProvider>
    </SitoContainer>
  );
};

export default App;
