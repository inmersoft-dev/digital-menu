import { useState, useEffect, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";

// in-viewport
import inViewport from "in-viewport";

// framer-motion
import { motion } from "framer-motion";

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
import ToLogin from "../../components/ToLogin/ToLogin";
import NotConnected from "../../components/NotConnected/NotConnected";
import NotFound from "../../views/NotFound/NotFound";

// services
import { fetchMenu } from "../../services/menu.js";

// contexts
import { useLanguage } from "../../context/LanguageProvider";
import { useNotification } from "../../context/NotificationProvider";

// images
import noProduct from "../../assets/images/no-product.webp";

// animations
import {
  motionUlContainer,
  motionUlCss,
  motionLiAnimation,
  motionLiCss,
} from "../../assets/animations/motion";

// functions
import { getIndexOfByAttribute } from "../../utils/functions";

// styles
import {
  typeBoxCss,
  productPaper,
  productImageBox,
  productImage,
  productContentBox,
  productDescriptionBox,
  headerBox,
  productList,
  mainContent,
  mainWindow,
} from "../../assets/styles/styles";

const Watch = () => {
  const theme = useTheme();
  const location = useLocation();
  const navigate = useNavigate();

  const { languageState } = useLanguage();
  const { setNotificationState } = useNotification();

  const [notFound, setNotFound] = useState(false);

  const showNotification = (ntype, message) =>
    setNotificationState({
      type: "set",
      ntype,
      message,
    });

  const [selected, setSelected] = useState({});

  const [visible, setVisible] = useState(false);

  const onModalClose = () => {
    setVisible(false);
  };

  const [types, setTypes] = useState([]);

  const [tab, setTab] = useState(0);
  const [tabs, setTabs] = useState([]);

  const [loading, setLoading] = useState(1);
  const [error, setError] = useState(false);
  const [currentMenu, setCurrentMenu] = useState("");
  const [menu, setMenu] = useState("");
  const [photo, setPhoto] = useState("");
  const [description, setDescription] = useState("");

  const [allData, setAllData] = useState([]);
  const [shouldScroll, setShouldScroll] = useState(false);

  const fetch = async (menu = undefined) => {
    setLoading(1);
    setError(false);
    try {
      console.log(menu, currentMenu);
      const response = await fetchMenu(menu || currentMenu);
      const data = await response.data;
      if (data && data.t && data.l) {
        if (data.ph) setPhoto(data.ph.url);
        setMenu(data.m);
        setDescription(data.d);
        const tabsByType = [];
        data.t.forEach((item, i) => {
          tabsByType.push([]);
        });
        for (const item of data.l) {
          let parsedPhoto = "";
          if (item.ph) parsedPhoto = item.ph.url;
          if (parsedPhoto) item.loaded = parsedPhoto;
          if (tabsByType[item.t])
            tabsByType[item.t].push(
              <motion.li
                key={item.i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={motionLiAnimation}
                className={motionLiCss}
              >
                <Paper
                  onClick={() => {
                    setVisible(true);
                    setSelected(
                      data.l[getIndexOfByAttribute(data.l, "i", item.i)]
                    );
                  }}
                  id={`obj-${item.i}`}
                  elevation={1}
                  sx={{
                    ...productPaper,
                    background: theme.palette.background.paper,
                  }}
                >
                  <SitoContainer sx={{ marginRight: "20px" }}>
                    <Box sx={productImageBox}>
                      <SitoImage
                        src={
                          item.ph && item.ph !== "" ? parsedPhoto : noProduct
                        }
                        alt={item.n}
                        sx={productImage}
                      />
                    </Box>
                  </SitoContainer>
                  <Box sx={productContentBox}>
                    <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
                      {item.n}
                    </Typography>
                    <Box sx={productDescriptionBox}>
                      <Typography variant="body1" sx={{ textAlign: "justify" }}>
                        {item.d}
                      </Typography>
                    </Box>
                    <Typography variant="body2" sx={{ fontWeight: "bold" }}>
                      {item.p} CUP
                    </Typography>
                  </Box>
                </Paper>
              </motion.li>
            );
        }
        setTypes(data.t);
        setAllData(data.l);
        setTabs(tabsByType);
        setLoading(0);
      } else setLoading(-1);
    } catch (err) {
      console.log(err);
      showNotification("error", languageState.texts.Errors.NotConnected);
      setError(true);
      setLoading(-1);
    }
  };

  const retry = () => fetch();

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
          const elem = document.getElementById(`obj-${allData[i].i}`);
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

  const onKeyDown = useCallback(
    (e) => {
      if (e.key === "Escape") {
        if (visible) setVisible(false);
      }
    },
    [visible, setVisible]
  );

  useEffect(() => {
    window.addEventListener("scroll", onScroll);
    window.addEventListener("click", onClick);
    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("click", onClick);
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [onScroll, onClick, onKeyDown]);

  useEffect(() => {
    if (location.pathname) {
      const splitPath = location.pathname.split("/");
      if (splitPath.length > 2) {
        const menuName = location.pathname.split("/")[2];
        if (menuName) {
          setCurrentMenu(menuName);
          retry(menuName);
        } else setNotFound(true);
      } else setNotFound(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentMenu, location]);

  return (
    <SitoContainer sx={mainWindow} flexDirection="column">
      {selected && (
        <Modal visible={visible} item={selected} onClose={onModalClose} />
      )}
      <Loading
        visible={loading === 1}
        sx={{
          zIndex: loading === 1 ? 99 : -1,
        }}
      />
      <ToLogin />
      {notFound ? (
        <NotFound />
      ) : (
        <>
          <Box sx={mainContent}>
            <Box sx={productImageBox}>
              <SitoImage
                src={photo && photo !== "" ? photo : noProduct}
                alt={menu}
                sx={productImage}
              />
            </Box>
            <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
              {menu}
            </Typography>
            <Typography variant="body1" sx={{ textAlign: "justify" }}>
              {description}
            </Typography>
          </Box>
          <TabView
            value={tab}
            tabs={types.filter((item, i) => {
              if (tabs[i].length) return item;
              return null;
            })}
            content={[]}
            shouldScroll={shouldScroll}
          />
          {error && !currentMenu && loading === -1 && (
            <NotConnected onRetry={retry} />
          )}
          {loading === -1 && !error && !currentMenu && <Empty />}
          {!error && (
            <Box sx={productList}>
              {tabs
                .filter((item) => {
                  if (item.length > 0) return item;
                  return null;
                })
                .map((item, i) => (
                  <Box key={i} sx={typeBoxCss}>
                    <Box id={`title-${i}`} sx={headerBox}>
                      <Typography variant="h5">
                        {
                          types.filter((item, i) => {
                            if (tabs[i].length) return item;
                            return null;
                          })[i]
                        }
                      </Typography>
                    </Box>
                    <motion.ul
                      variants={motionUlContainer}
                      className={motionUlCss}
                      initial="hidden"
                      whileInView="visible"
                      viewport={{ once: true }}
                    >
                      {item}
                    </motion.ul>
                  </Box>
                ))}
            </Box>
          )}
        </>
      )}
    </SitoContainer>
  );
};

export default Watch;
