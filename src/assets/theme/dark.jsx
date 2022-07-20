import { createTheme } from "@mui/material/styles";

import darkScrollbar from "./scroll";

const dark = createTheme({
  palette: {
    type: "dark",
    primary: {
      main: "#2196f3",
      light: "#4dabf5",
      dark: "#1769aa",
      contrastText: "#ffffff",
    },
    secondary: {
      main: "#405163",
      light: "#405163",
      dark: "#405163",
      contrastText: "#ffffff",
    },
    error: {
      main: "#f44336",
      light: "#f6685e",
      dark: "#aa2e25",
      contrastText: "#ffffff",
    },
    warning: {
      main: "#ff9800",
      light: "#ffac33",
      dark: "#b26a00",
      contrastText: "rgba(0,0,0,0.87)",
    },
    info: {
      main: "#2196f3",
      light: "#4dabf5",
      dark: "#1769aa",
      contrastText: "#ffffff",
    },
    success: {
      main: "#4caf50",
      light: "#6fbf73",
      dark: "#357a38",
      contrastText: "rgba(0,0,0,0.87)",
    },
    divider: "rgba(0,0,0,0.12)",
    background: {
      default: "#fafafa",
      paper: "#fff",
    },
    text: {
      main: "rgba(0, 0, 0, 0.87)",
      primary: "rgba(0, 0, 0, 0.54)",
      secondary: "rgba(0, 0, 0, 0.54)",
      disabled: "rgba(0, 0, 0, 0.38)",
      hint: "rgba(0, 0, 0, 0.38)",
    },
  },
  typography: {
    fontSize: 14,
    fontWeightLight: 300,
    fontWeightRegular: 400,
    fontWeightMedium: 500,
    fontWeightBold: 700,
    htmlFontSize: 16,
    h1: {
      fontSize: "6rem",
      fontWeight: "bold",
      lineHeight: 1.16,
      letterSpacing: "-0.01em",
    },
    h2: {
      fontSize: "3.7rem",
      fontWeight: "bold",
      lineHeight: 1.2,
      letterSpacing: "0.01em",
    },
    h3: {
      fontSize: "3rem",
      fontWeight: "bold",
      lineHeight: 1.16,
      letterSpacing: "0em",
    },
    h4: {
      fontSize: "2.1rem",
      fontWeight: "bold",
      lineHeight: 1.23,
      letterSpacing: "0.02em",
    },
    h5: {
      fontSize: "1.5rem",
      fontWeight: 400,
      lineHeight: 1.33,
      letterSpacing: "0em",
    },
    h6: {
      fontSize: "1.3rem",
      fontWeight: 500,
      lineHeight: 1.6,
      letterSpacing: "0.02em",
    },
    subtitle1: {
      fontSize: "1rem",
      fontWeight: 400,
      lineHeight: 1.75,
      letterSpacing: "0.01em",
    },
    subtitle2: {
      fontSize: "0.8rem",
      fontWeight: 500,
      lineHeight: 1.57,
      letterSpacing: "0.01em",
    },
    body1: {
      fontSize: "1rem",
      fontWeight: 400,
      lineHeight: 1.5,
      letterSpacing: "0.01em",
    },
    body2: {
      fontSize: "0.8rem",
      fontWeight: 400,
      lineHeight: 1.43,
      letterSpacing: "0.01em",
    },
    button: {
      fontSize: "0.8rem",
      fontWeight: 500,
      lineHeight: 1.75,
      letterSpacing: "0.02em",
    },
    caption: {
      fontSize: "0.8rem",
      fontWeight: 400,
      lineHeight: 1.66,
      letterSpacing: "0.03em",
    },
    overline: {
      fontSize: "0.8rem",
      fontWeight: 400,
      lineHeight: 2.66,
      letterSpacing: "0.08em",
    },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: darkScrollbar({
          track: "#FFFFFF00",
          thumb: "#405163",
          active: "#405163",
        }),
      },
    },
  },
});

export default dark;
