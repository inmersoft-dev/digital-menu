/* eslint-disable react-hooks/exhaustive-deps */
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

// components
import AppBar from "../../components/AppBar/AppBar";
import TabView from "../../components/TabView/TabView";
import FabButtons from "../../components/FabButtons/FabButtons";

// @mui/material
import { Box, Paper } from "@mui/material";

// contexts
import { useLanguage } from "../../context/LanguageProvider";

// utils
import { userLogged } from "../../utils/auth";

// sections
import QR from "./Sections/QR";
import Map from "./Sections/Map";
import Socials from "./Sections/Socials";
import Generals from "./Sections/Generals";
import Security from "./Sections/Security";
import Schedule from "./Sections/Schedule";

const Settings = () => {
  const navigate = useNavigate();

  const { languageState } = useLanguage();

  const [tab, setTab] = useState(0);

  useEffect(() => {
    if (!userLogged()) navigate("/");
  }, []);

  return (
    <Box
      sx={{
        minWidth: "100vw",
        minHeight: "100vh",
        padding: "50px 0 70px 0",
        display: "flex",
        justifyContent: "center",
      }}
    >
      <AppBar />
      <FabButtons location="settings" />
      <Paper
        sx={{
          display: "flex",
          width: { md: "800px", sm: "630px", xs: "100%" },
          padding: "1rem",
          marginTop: "40px",
          borderRadius: "1rem",
        }}
      >
        <TabView
          sx={{
            width: "100%",
            height: "100%",
          }}
          value={tab}
          onChange={(e, newTab) => setTab(newTab)}
          tabs={languageState.texts.Settings.Tabs}
          content={[
            <Generals />,
            <Schedule />,
            <Socials />,
            <Map />,
            <Security />,
            <QR />,
          ]}
        />
      </Paper>
    </Box>
  );
};

export default Settings;
