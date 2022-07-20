import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";

import inViewport from "in-viewport";

// sito components
import SitoContainer from "sito-container";
import SitoImage from "sito-image";

// @mui components
import {
  useTheme,
  Paper,
  Box,
  Button,
  IconButton,
  Typography,
} from "@mui/material";

// @mui icons
import CloseIcon from "@mui/icons-material/Close";

// own components
import Loading from "../../components/Loading/Loading";
import TabView from "../../components/TabView/TabView";
import NotConnected from "../../components/NotConnected/NotConnected";
import Empty from "../../components/Empty/Empty";
import Modal from "../../components/Modal/EditModal";

// functions
import { getUserName, userLogged } from "../../utils/auth";

// services
import { fetchMenu, saveMenu } from "../../services/menu";

// contexts
import { useNotification } from "../../context/NotificationProvider";
import { useLanguage } from "../../context/LanguageProvider";

const Edit = () => {
  const theme = useTheme();
  const navigate = useNavigate();

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

  const [allData, setAllData] = useState([]);
  const [shouldScroll, setShouldScroll] = useState(false);

  const justGetData = async () => {
    const response = await fetchMenu(getUserName(), getUserName());
    const data = await response.data;
    return data;
  };

  const fetch = async () => {
    setLoading(true);
    setError(false);
    try {
      const data = await justGetData();
      if (data && data.t && data.l) {
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
                id={`obj-${i}`}
                elevation={1}
                sx={{
                  position: "relative",
                  marginTop: "20px",
                  width: { md: "800px", sm: "630px", xs: "100%" },
                  padding: "1rem",
                  borderRadius: "1rem",
                  background: theme.palette.background.paper,
                }}
              >
                <Box
                  sx={{
                    width: { xs: "95%", md: "98%" },
                    position: "absolute",
                    marginTop: "-10px",
                    justifyContent: "flex-end",
                    display: "flex",
                    cursor: "pointer",
                  }}
                >
                  <IconButton color="error" onClick={() => deleteProduct(i)}>
                    <CloseIcon />
                  </IconButton>
                </Box>
                <Box
                  sx={{ cursor: "pointer", display: "flex" }}
                  onClick={() => {
                    setVisible(true);
                    setSelected(data.l[i]);
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
                </Box>
              </Paper>
            </SitoContainer>
          );
        });
        setAllData(data.l);
        setTypes(data.t);
        setTabs(tabsByType);
      } else
        setNotificationState({
          type: "set",
          ntype: "error",
          message: languageState.texts.Errors.NotConnected,
        });
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

  const { setNotificationState } = useNotification();
  const { languageState } = useLanguage();

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

  const deleteProduct = async (index) => {
    setLoading(true);
    const data = await justGetData();
    const newAllData = data.l;
    const newTypes = data.t;
    const deletionType = newTypes.indexOf(newAllData[index].t);
    newAllData.splice(index, 1);
    let found = false;
    for (let i = 0; i < newAllData.length && !found; i += 1)
      if (newAllData[i].t === deletionType) found = true;
    if (!found) newTypes.splice(deletionType, 1);
    saveMenu(getUserName(), getUserName(), newAllData, newTypes);
    retry();
  };

  const onSubmit = async (data) => {
    setVisible(false);
    setLoading(true);
    const { name, type, description, price } = data;
    let typePosition = types.indexOf(type);
    const newAllData = allData;
    const newTypes = types;
    if (typePosition === -1) newTypes.push(type);
    typePosition = types.indexOf(type);
    const parsedData = {
      i: allData.length,
      n: name,
      t: typePosition,
      d: description,
      p: price,
      ph: "",
    };
    newAllData.push(parsedData);
    saveMenu(getUserName(), getUserName(), newAllData, newTypes);
    retry();
  };

  useEffect(() => {
    window.addEventListener("scroll", onScroll);
    window.addEventListener("click", onClick);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("click", onClick);
    };
  }, [onScroll, onClick]);

  useEffect(() => {
    if (!userLogged()) navigate("/auth/");
    retry();
  }, []);

  return (
    <SitoContainer
      sx={{ width: "100vw", height: "100vh" }}
      flexDirection="column"
    >
      {selected && (
        <Modal
          visible={visible}
          item={selected}
          onClose={onModalClose}
          onSubmit={onSubmit}
          types={types}
        />
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
      <TabView
        value={tab}
        tabs={types}
        content={[]}
        shouldScroll={shouldScroll}
      />
      <SitoContainer
        sx={{ width: "100%", marginTop: "65px" }}
        justifyContent="center"
      >
        <Button
          variant="contained"
          onClick={() => {
            setSelected({
              ph: "",
              n: "",
              d: "",
              p: "",
              t: "",
            });
            setVisible(true);
          }}
        >
          {languageState.texts.Insert.Buttons.Insert}
        </Button>
      </SitoContainer>
      {error && !loading && <NotConnected />}
      {!loading && !error && !allData.length && <Empty />}
      {!error && !loading && allData.length && (
        <Box
          sx={{
            margin: "0 20px 0 20px",
            flexDirection: "column",
          }}
        >
          {tabs.map((item, i) => (
            <Box
              key={i}
              sx={{
                flexDirection: "column",
                marginTop: "20px",
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

export default Edit;
