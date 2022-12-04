// @mui/material
import { useTheme, Box, Typography, IconButton } from "@mui/material";

// @mui/icons-material
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";

// components
import BackButton from "../BackButton/BackButton";

// contexts
import { useMode } from "../../context/ModeProvider";
import { useLanguage } from "../../context/LanguageProvider";

const AppBar = () => {
  const theme = useTheme();

  const { languageState } = useLanguage();
  const { modeState, setModeState } = useMode();

  const toggleMode = () => setModeState({ type: "toggle" });

  return (
    <Box
      sx={{
        width: "100%",
        height: "60px",
        position: "fixed",
        borderBottom: "1px solid",
        borderColor: "rgba(87,87,87,0.5)",
        top: 0,
        left: 0,
        background: theme.palette.background.paper,
        zIndex: 15,
        display: "flex",
        alignItems: "center",
      }}
    >
      <BackButton
        flat
        to="/"
        sx={{ position: "relative", top: 0, left: 0, marginTop: "-2px" }}
      />
      <Typography
        sx={{ fontSize: { xs: "1.3rem", md: "1.5rem" }, width: "100%" }}
        variant="h3"
      >
        {languageState.texts.AppName}
      </Typography>
      <IconButton color="inherit" onClick={toggleMode}>
        {modeState.mode === "light" ? <DarkModeIcon /> : <LightModeIcon />}
      </IconButton>
    </Box>
  );
};

export default AppBar;
