import { BrowserRouter, Routes, Route } from "react-router-dom";

// sito components
import SitoContainer from "sito-container";

// @mui hooks
import { ThemeProvider, CssBaseline } from "@mui/material";

// theme
import dark from "./assets/theme/dark";

// views
import Home from "./views/Home/Home";
import NotFound from "./views/NotFound/NotFound";

const App = () => {
  return (
    <SitoContainer
      sx={{ minWidth: "100vw", minHeight: "100vh" }}
      alignItems="center"
      justifyContent="center"
    >
      <ThemeProvider theme={dark}>
        <CssBaseline />
        <BrowserRouter basename={process.env.PUBLIC_URL}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </ThemeProvider>
    </SitoContainer>
  );
};

export default App;
