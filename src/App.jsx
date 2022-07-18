import { BrowserRouter, Routes, Route } from "react-router-dom";

// sito components
import SitoContainer from "sito-container";

// own components
import Notification from "./components/Notification/Notification";

// @mui
import { ThemeProvider, CssBaseline } from "@mui/material";

// theme
import dark from "./assets/theme/dark";

// layouts
import View from "./layouts/View/View";

// views
import Login from "./views/Auth/Login";
import Logout from "./views/Auth/Logout";
import Register from "./views/Auth/Register";
import Watch from "./views/Menu/Watch";
import Edit from "./views/Menu/Edit";

const App = () => {
  return (
    <SitoContainer
      sx={{ width: "100vw", height: "100vh" }}
      alignItems="center"
      justifyContent="center"
    >
      <Notification />
      <ThemeProvider theme={dark}>
        <CssBaseline />
        <BrowserRouter basename={process.env.PUBLIC_URL}>
          <Routes>
            <Route path="/" element={<View />} />
            <Route exact path="/auth" element={<View />}>
              <Route index element={<Login />} />
              <Route exact path="/auth/register" element={<Register />} />
              <Route exact path="/auth/logout" element={<Logout />} />
            </Route>
            <Route exact path="/menu" element={<View />}>
              <Route index element={<Watch />} />
              <Route exact path element={<Edit />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </ThemeProvider>
    </SitoContainer>
  );
};

export default App;
