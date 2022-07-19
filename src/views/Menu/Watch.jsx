import { useState, useEffect, useCallback } from "react";
import inViewport from "in-viewport";

// @mui
import { Typography, useTheme } from "@mui/material";

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

  const [loading, setLoading] = useState(true);
  const [currentOwner, setCurrentOwner] = useState("admin");
  const [currentMenu, setCurrentMenu] = useState("menu");
  const [allData, setAllData] = useState([]);
  const [shouldScroll, setShouldScroll] = useState(false);

  const fetch = async () => {
    setLoading(true);
    try {
      const response = await fetchMenu(currentOwner, currentMenu);
      const data = await response.data;
      const tabsByType = [];
      types.forEach((item, i) => {
        tabsByType.push([]);
      });
      data.menu.forEach((item, i) => {
        tabsByType[item.t].push(
          <SitoContainer
            alignItems="top"
            sx={{
              marginTop: "20px",
              padding: "1rem",
              borderRadius: "1rem",
              background: theme.palette.background.paper,
            }}
            id={`obj-${i}`}
          >
            <SitoContainer sx={{ marginRight: "20px" }}>
              <SitoImage
                src={item.ph}
                alt={item.n}
                sx={{ width: "160px", height: "160px", borderRadius: "100%" }}
              />
            </SitoContainer>
            <SitoContainer flexDirection="column" justifyContent="flex-start">
              <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
                {item.n}
              </Typography>
              <Typography variant="body1">{item.d}</Typography>
              <Typography variant="body2" sx={{ fontWeight: "bold" }}>
                {item.p}
              </Typography>
            </SitoContainer>
          </SitoContainer>
        );
      });
      setAllData(data.menu);
      setTabs(tabsByType);
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

  const firstActive = (array) => {
    let i = 0;
    while (i < array.length) {
      if (array[i].visibility) return array[i];
      i += 1;
    }
    return -1;
  };

  const onScroll = useCallback(
    (e) => {
      if (!shouldScroll) {
        const visibilities = [];
        for (let i = 0; i < allData.length; i += 1) {
          const elem = document.getElementById(`obj-${i}`);
          const isInViewport = inViewport(elem);
          visibilities.push({
            index: i,
            visibility: isInViewport,
            type: allData[i].t,
          });
        }
        const localFirstActive = firstActive(visibilities);
        if (localFirstActive !== -1 && tab !== localFirstActive.type)
          setTab(localFirstActive.type);
      }
      setShouldScroll(false);
    },
    [tab, allData, shouldScroll]
  );

  const onClick = useCallback(
    (e) => {
      if (!shouldScroll && e.target.id && e.target.id.split("-").length > 2) {
        setTab(Number(e.target.id.split("-")[2]));
        setShouldScroll(true);
      }
    },
    [shouldScroll, setShouldScroll]
  );

  useEffect(() => {
    window.addEventListener("scroll", onScroll);
    window.addEventListener("click", onClick);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("click", onClick);
    };
  }, [onScroll, onClick]);

  useEffect(() => {
    retry();
  }, []);

  return (
    <SitoContainer
      sx={{ width: "100vw", height: "100vh" }}
      flexDirection="column"
    >
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
        tabs={types}
        content={[]}
        shouldScroll={shouldScroll}
      />
      <SitoContainer flexDirection="column" sx={{ margin: "20px 20px" }}>
        {tabs.map((item, i) => (
          <SitoContainer
            flexDirection="column"
            key={i}
            sx={{ marginTop: i === 0 ? "40px" : "20px" }}
          >
            <SitoContainer id={`title-${i}`}>
              <Typography variant="h5">{types[i]}</Typography>
            </SitoContainer>
            {item}
          </SitoContainer>
        ))}
      </SitoContainer>
    </SitoContainer>
  );
};

export default Watch;
