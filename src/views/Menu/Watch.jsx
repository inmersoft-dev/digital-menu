import { useState, useEffect, useCallback } from "react";
import { useLocation } from "react-router-dom";
import inViewport from "in-viewport";

// @mui components
import { useTheme, Paper, Box, Typography } from "@mui/material";

// sito components
import SitoContainer from "sito-container";
import SitoImage from "sito-image";

// own components
import Loading from "../../components/Loading/Loading";
import TabView from "../../components/TabView/TabView";
import Modal from "../../components/Modal/Modal";
import Empty from "../../components/Empty/Empty";
import NotConnected from "../../components/NotConnected/NotConnected";

// services
import { fetchMenu } from "../../services/menu.js";

// contexts
import { useLanguage } from "../../context/LanguageProvider";
import { useNotification } from "../../context/NotificationProvider";

const Watch = () => {
  const theme = useTheme();
  const location = useLocation();
  const { languageState } = useLanguage();
  const { setNotificationState } = useNotification();

  const [selected, setSelected] = useState();

  const [visible, setVisible] = useState(false);

  const onModalClose = () => {
    setVisible(false);
  };

  const [types, setTypes] = useState([]);

  const [tab, setTab] = useState(0);
  const [tabs, setTabs] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [currentOwner, setCurrentOwner] = useState("");
  const [currentMenu, setCurrentMenu] = useState("");
  const [photo, setPhoto] = useState("");
  const [description, setDescription] = useState("");

  const [allData, setAllData] = useState([]);
  const [shouldScroll, setShouldScroll] = useState(false);

  const fetch = async (user = undefined, menu = undefined) => {
    setLoading(true);
    setError(false);
    try {
      const response = await fetchMenu(
        user || currentOwner,
        menu || currentMenu
      );
      const data = await response.data;
      if (data && data.t && data.l) {
        setPhoto(data.ph);
        setDescription(data.d);
        const tabsByType = [];
        data.t.forEach((item, i) => {
          tabsByType.push([]);
        });
        data.l.forEach((item, i) => {
          tabsByType[item.t].push(
            <SitoContainer
              key={item.i}
              justifyContent="center"
              sx={{ width: "100%" }}
            >
              <Paper
                onClick={() => {
                  setVisible(true);
                  setSelected(data.l[i]);
                }}
                id={`obj-${i}`}
                elevation={1}
                sx={{
                  cursor: "pointer",
                  marginTop: "20px",
                  display: "flex",
                  width: { md: "800px", sm: "630px", xs: "100%" },
                  padding: "1rem",
                  borderRadius: "1rem",
                  background: theme.palette.background.paper,
                }}
              >
                <SitoContainer sx={{ marginRight: "20px" }}>
                  <Box
                    sx={{
                      width: { md: "160px", sm: "120px", xs: "80px" },
                      height: { md: "160px", sm: "120px", xs: "80px" },
                    }}
                  >
                    <SitoImage
                      src={item.ph}
                      alt={item.n}
                      sx={{
                        objectFit: "cover",
                        width: "100%",
                        height: "100%",
                        borderRadius: "100%",
                      }}
                    />
                  </Box>
                </SitoContainer>
                <Box
                  sx={{
                    flexDirection: "column",
                    justifyContent: "flex-start",
                    width: { md: "585px", sm: "350px", xs: "95%" },
                  }}
                >
                  <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
                    {item.n}
                  </Typography>
                  <Box
                    sx={{
                      height: { xs: "28px", sm: "50px", md: "100px" },
                      lineHeight: "20px",
                      wordBreak: "break-all",
                      display: "-webkit-box",
                      boxOrient: "vertical",
                      lineClamp: 5,
                      overflow: "hidden",
                    }}
                  >
                    <Typography variant="body1" sx={{ textAlign: "justify" }}>
                      {item.d}
                    </Typography>
                  </Box>
                  <Typography variant="body2" sx={{ fontWeight: "bold" }}>
                    {item.p}
                  </Typography>
                </Box>
              </Paper>
            </SitoContainer>
          );
        });
        setAllData(data.l);
        setTypes(data.t);
        setTabs(tabsByType);
      }
    } catch (err) {
      console.log(err);
      setNotificationState({
        type: "set",
        ntype: "error",
        message: languageState.texts.Errors.NotConnected,
      });
      setError(true);
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
      if (!shouldScroll && allData) {
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
    let user;
    let menu;
    if (location.search) {
      const [userParam, menuParam] = location.search.substring(1).split("&");
      user = userParam.split("=")[1];
      menu = menuParam.split("=")[1];
      if (user && menu) {
        setCurrentMenu(menu);
        setCurrentOwner(user);
      }
    }
    retry(user, menu);
  }, [currentOwner, currentMenu, location]);

  return (
    <SitoContainer
      sx={{ width: "100vw", height: "100vh" }}
      flexDirection="column"
    >
      {selected && (
        <Modal visible={visible} item={selected} onClose={onModalClose} />
      )}
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
      <Box
        sx={{
          width: { md: "800px", sm: "630px", xs: "100%" },
          flexDirection: "column",
          display: "flex",
          alignItems: "center",
          marginTop: "80px",
          margin: "auto",
        }}
      >
        <Box
          sx={{
            width: { md: "160px", sm: "120px", xs: "80px" },
            height: { md: "160px", sm: "120px", xs: "80px" },
          }}
        >
          <SitoImage
            src={photo}
            alt={currentMenu}
            sx={{
              objectFit: "cover",
              width: "100%",
              height: "100%",
              borderRadius: "100%",
            }}
          />
        </Box>
        <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
          {currentMenu}
        </Typography>
        <Typography variant="body1" sx={{ textAlign: "justify" }}>
          {description}
        </Typography>
      </Box>
      <TabView
        value={tab}
        tabs={types}
        content={[]}
        shouldScroll={shouldScroll}
      />
      {error && !currentOwner && !currentMenu && !loading && (
        <NotConnected onRetry={retry} />
      )}
      {!loading &&
        !error &&
        !allData.length &&
        !currentOwner &&
        !currentMenu && <Empty />}
      {!error && !loading && currentOwner && currentMenu && allData.length && (
        <Box
          sx={{
            margin: "20px 20px",
            flexDirection: "column",
          }}
        >
          {tabs.map((item, i) => (
            <Box
              key={i}
              sx={{
                flexDirection: "column",
                marginTop: i === 0 ? 0 : "20px",
                alignItems: "center",
                display: "flex",
              }}
            >
              <Box
                id={`title-${i}`}
                sx={{ width: { md: "800px", sm: "630px", xs: "100%" } }}
              >
                <Typography variant="h5">{types[i]}</Typography>
              </Box>
              {item}
            </Box>
          ))}
        </Box>
      )}
    </SitoContainer>
  );
};

export default Watch;
