import { useState, useEffect } from "react";

// @mui
import { useTheme } from "@mui/material";

// sito components
import SitoContainer from "sito-container";
import SitoImage from "sito-image";

// own components
import Loading from "../../components/Loading/Loading";
import TabView from "../../components/TabView/TabView";

// services
import { fetchMenu } from "../../services/menu.js";

// contexts
import { useLanguage } from "../../context/LanguageProvider";
import { useNotification } from "../../context/NotificationProvider";

const Watch = () => {
  const theme = useTheme();
  const { languageState } = useLanguage();
  const { setNotificationState } = useNotification();

  const types = ["Bebidas", "Entrantes"];

  const [tab, setTab] = useState(0);
  const [tabs, setTabs] = useState([]);

  const handleChange = (e, newTab) => {
    setTab(newTab);
  };

  const scrollNavigate = (to) => {
    setTab(to);
  };

  const [loading, setLoading] = useState(true);
  const [currentOwner, setCurrentOwner] = useState("admin");
  const [currentMenu, setCurrentMenu] = useState("menu");

  const fetch = async () => {
    setLoading(true);
    try {
      const response = await fetchMenu(currentOwner, currentMenu);
      console.log(response);
    } catch (err) {
      console.log(err);
      setNotificationState({
        type: "set",
        ntype: "error",
        message: languageState.texts.Errors.NotConnected,
      });
    }
    setLoading(false);
  };

  const retry = () => {
    fetch();
  };

  useEffect(() => {
    retry();
  }, []);

  return (
    <SitoContainer sx={{ width: "100vw", height: "100vh" }}>
      <Loading
        visible={loading}
        sx={{
          position: "absolute",
          width: "100%",
          height: "100%",
          top: 0,
          left: 0,
          backdropFilter: "blur(4px)",
          background: `${theme.palette.background.paper}ec`,
          borderRadius: "1rem",
          zIndex: loading ? 99 : -1,
        }}
      />
      <TabView
        value={tab}
        onChange={handleChange}
        tabs={types}
        content={tabs}
      />
    </SitoContainer>
  );
};

export default Watch;
