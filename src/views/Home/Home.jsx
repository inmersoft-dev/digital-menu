import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

// framer-motion
import { motion } from "framer-motion";

// @emotion/css
import { css } from "@emotion/css";

// @mui components
import { useTheme, Paper, Box, Typography } from "@mui/material";

// sito components
import SitoContainer from "sito-container";
import SitoImage from "sito-image";

// own components
import Loading from "../../components/Loading/Loading";
import Empty from "../../components/Empty/Empty";
import ToLogout from "../../components/ToLogout/ToLogout";
import ToLogin from "../../components/ToLogin/ToLogin";
import NotConnected from "../../components/NotConnected/NotConnected";

// services
import { fetchAll } from "../../services/menu.js";

// contexts
import { useLanguage } from "../../context/LanguageProvider";
import { useNotification } from "../../context/NotificationProvider";
import { getUserName, userLogged } from "../../utils/auth";

// image
import noProduct from "../../assets/images/no-product.webp";

// animations
import {
  motionUlContainer,
  motionUlCss,
  motionLiAnimation,
  motionLiCss,
} from "../../assets/animations/motion";

// styles
import {
  mainWindow,
  productContentBox,
  productDescriptionBox,
  productImage,
  productImageBox,
  productPaper,
} from "../../assets/styles/styles";

// utils
import { spaceToDashes } from "../../utils/functions";

const Home = () => {
  const linkStyle = css({
    width: "100%",
    textDecoration: "none",
    display: "flex",
    justifyContent: "center",
  });

  const theme = useTheme();
  const { languageState } = useLanguage();
  const { setNotificationState } = useNotification();

  const [loading, setLoading] = useState(1);
  const [error, setError] = useState(false);

  const [, setAllData] = useState([]);
  const [list, setList] = useState([]);

  const fetch = async () => {
    setLoading(1);
    setError(false);
    try {
      const response = await fetchAll();
      const data = await response.data;
      if (data && data.u) {
        const newList = [];
        const arrayData = Object.values(data.u);
        for (const item of arrayData.filter((item) => {
          if (item.m && item.m !== "admin") return item;
          return null;
        })) {
          let parsedPhoto = item.u;
          if (item.ph) parsedPhoto = item.ph.url;
          newList.push(
            <motion.li
              key={item.u}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={motionLiAnimation}
              className={motionLiCss}
            >
              <Link
                to={
                  userLogged() && item.u === getUserName()
                    ? "/menu/edit"
                    : `/menu/${spaceToDashes(item.m)}`
                }
                className={linkStyle}
              >
                <Paper
                  id={`obj-${item.u}`}
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
                        alt={item.m}
                        sx={productImage}
                      />
                    </Box>
                  </SitoContainer>
                  <Box sx={productContentBox}>
                    <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
                      {item.m}
                    </Typography>
                    <Box sx={productDescriptionBox}>
                      <Typography variant="body1" sx={{ textAlign: "justify" }}>
                        {item.d}
                      </Typography>
                    </Box>
                  </Box>
                </Paper>
              </Link>
            </motion.li>
          );
        }
        setList(newList);
        setAllData(Object.keys(data.u));
        setLoading(0);
      } else {
        setLoading(-1);
        setNotificationState({
          type: "set",
          ntype: "error",
          message: languageState.texts.Errors.NotConnected,
        });
      }
    } catch (err) {
      console.log(err);
      setNotificationState({
        type: "set",
        ntype: "error",
        message: languageState.texts.Errors.NotConnected,
      });
      setError(true);
      setLoading(-1);
    }
  };

  const retry = () => fetch();

  useEffect(() => {
    retry();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <SitoContainer sx={mainWindow} flexDirection="column">
      <Loading
        visible={loading === 1}
        sx={{
          zIndex: loading === 1 ? 99 : -1,
        }}
      />

      {userLogged() ? <ToLogout /> : <ToLogin />}
      {error && loading === -1 && <NotConnected onRetry={retry} />}
      {loading === -1 && !error && <Empty />}
      {!error && loading === 0 && (
        <Box
          sx={{
            flexDirection: "column",
          }}
        >
          {list.map((item, i) => (
            <motion.ul
              key={i}
              variants={motionUlContainer}
              className={motionUlCss}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              {item}
            </motion.ul>
          ))}
        </Box>
      )}
    </SitoContainer>
  );
};

export default Home;
