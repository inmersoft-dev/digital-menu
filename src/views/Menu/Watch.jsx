/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect, useReducer, useCallback } from "react";
import { useLocation } from "react-router-dom";

// @mui components
import { useTheme, Paper, Box, Button, Typography } from "@mui/material";

// sito components
import SitoContainer from "sito-container";
import SitoImage from "sito-image";

// own components
import Error from "../../components/Error/Error";
import Loading from "../../components/Loading/Loading";
import Modal from "../../components/Modal/Modal";
import Empty from "../../components/Empty/Empty";
import ToLogin from "../../components/ToLogin/ToLogin";
import NotFound from "../../views/NotFound/NotFound";
import InViewComponent from "../../components/InViewComponent/InViewComponent";

// services
import { fetchMenu } from "../../services/menu.js";

// contexts
import { useLanguage } from "../../context/LanguageProvider";
import { useNotification } from "../../context/NotificationProvider";

// images
import noProduct from "../../assets/images/no-product.webp";

// functions
import { dashesToSpace } from "../../utils/functions";

// utils
import { scrollTo } from "../../utils/functions";

// styles
import {
  typeBoxCss,
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

  const { languageState } = useLanguage();
  const { setNotificationState } = useNotification();

  const typesReducer = (typesStates, action) => {
    const { type } = action;
    switch (type) {
      case "set": {
        const { newArray } = action;
        if (newArray.length) newArray[0].active = true;
        return newArray;
      }
      case "set-active": {
        const { index } = action;
        typesStates.forEach((item, i) => {
          if (index === i) typesStates[i].active = true;
          else typesStates[i].active = false;
        });
        return [...typesStates];
      }
      case "delete": {
        const { index } = action;
        const newArray = [...typesStates];
        newArray.splice(index, 1);
        return newArray;
      }
      case "add": {
        const { newType } = action;
        return [...typesStates, newType];
      }
      default:
        return [];
    }
  };

  const [productTypes, setProductTypes] = useReducer(typesReducer, []);

  const [products, setProducts] = useState([]);
  const [notFound, setNotFound] = useState(false);

  const showNotification = (ntype, message) =>
    setNotificationState({
      type: "set",
      ntype,
      message,
    });

  const [selected, setSelected] = useState({});

  const [visible, setVisible] = useState(false);

  const onModalClose = () => setVisible(false);

  const [loading, setLoading] = useState(1);
  const [error, setError] = useState(false);
  const [currentMenu, setCurrentMenu] = useState("");
  const [menu, setMenu] = useState("");
  const [photo, setPhoto] = useState("");
  const [description, setDescription] = useState("");

  const fetch = async () => {
    setLoading(1);
    setError(false);
    try {
      const realMenu = currentMenu;
      const response = await fetchMenu(dashesToSpace(realMenu));
      const data = await response.data;
      if (data) {
        if (data.photo) setPhoto(data.photo.url);
        setMenu(data.menu);
        setDescription(data.description);
        setProductTypes({
          type: "set",
          newArray: data.types
            ? data.types.map((item) => ({ name: item }))
            : [],
        });
        setProducts(data.list ? data.list : []);
        setLoading(0);
      }
    } catch (err) {
      console.error(err);
      showNotification("error", String(err));
      setError(true);
      setLoading(-1);
    }
  };

  const retry = () => fetch();

  const onScroll = useCallback((e) => {}, []);

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
    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [onScroll, onKeyDown]);

  useEffect(() => {
    if (currentMenu.length) retry();
  }, [currentMenu]);

  useEffect(() => {
    setLoading(-1);
  }, [notFound]);

  useEffect(() => {
    if (location.pathname) {
      const splitPath = location.pathname.split("/");
      if (splitPath.length > 2) {
        const menuName = location.pathname.split("/")[2];
        if (menuName) setCurrentMenu(menuName);
        else setNotFound(true);
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
            <Typography
              variant="h3"
              sx={{ fontWeight: "bold", fontSize: "1.5rem", margin: "10px 0" }}
            >
              {menu}
            </Typography>
            <Typography variant="body1" sx={{ textAlign: "justify" }}>
              {description}
            </Typography>
          </Box>
          <Paper
            elevation={1}
            sx={{
              width: "100%",
              height: "36px",
              display: "flex",
              alignItems: "center",
              position: "fixed",
              top: 0,
              left: 0,
              borderRadius: 0,
              background: theme.palette.background.paper,
              zIndex: 15,
            }}
          >
            {productTypes.map((item, i) => (
              <Button
                key={item.name}
                onClick={() => {
                  const type = document.getElementById(`title-${item.name}`);
                  if (type !== null) scrollTo(type.offsetTop);
                  setProductTypes({ type: "set-active", index: i });
                }}
                color={item.active ? "primary" : "inherit"}
                sx={{
                  borderRadius: 0,
                  borderBottom: item.active
                    ? `2px solid ${theme.palette.primary.main}`
                    : "",
                }}
              >
                {item.name}
              </Button>
            ))}
            {productTypes.length === 0 ? (
              <Typography sx={{ marginLeft: "20px" }}>
                {languageState.texts.Insert.Categories}
              </Typography>
            ) : null}
          </Paper>
          {error && !currentMenu && loading === -1 && <Error onRetry={retry} />}
          {loading === -1 && !error && !currentMenu && <Empty />}
          {!error && (
            <Box sx={productList}>
              {!loading &&
                productTypes.map((item) => (
                  <Box key={item.name} sx={typeBoxCss}>
                    <Box id={`title-${item.name}`} sx={headerBox}>
                      <Typography sx={{ fontSize: "1.5rem" }} variant="h3">
                        {item.name}
                      </Typography>
                    </Box>
                    <Box>
                      {products
                        .filter((jtem) => jtem.type === item.name)
                        .map((jtem) => (
                          <InViewComponent
                            key={jtem.id}
                            delay={`0.${1 * (jtem.index + 1)}s`}
                            sx={{
                              display: "flex",
                              justifyContent: "center",
                              width: "100%",
                            }}
                          >
                            <Paper
                              id={`obj-${jtem.id}`}
                              elevation={1}
                              sx={{
                                position: "relative",
                                marginTop: "20px",
                                width: { md: "800px", sm: "630px", xs: "100%" },
                                padding: "1rem",
                                borderRadius: "1rem",
                                background: theme.palette.background.paper,
                                alignItems: "center",
                              }}
                            >
                              <Box
                                sx={{ cursor: "pointer", display: "flex" }}
                                onClick={() => {
                                  setVisible(true);
                                  setSelected(jtem);
                                }}
                              >
                                <SitoContainer sx={{ marginRight: "20px" }}>
                                  <Box sx={productImageBox}>
                                    <SitoImage
                                      src={
                                        jtem.photo && jtem.photo.url !== ""
                                          ? jtem.photo.url
                                          : noProduct
                                      }
                                      alt={jtem.name}
                                      sx={productImage}
                                    />
                                  </Box>
                                </SitoContainer>
                                <Box sx={productContentBox}>
                                  <Typography
                                    variant="h3"
                                    sx={{
                                      fontWeight: "bold",
                                      fontSize: "1rem",
                                    }}
                                  >
                                    {jtem.name}
                                  </Typography>
                                  <Box sx={productDescriptionBox}>
                                    <Typography
                                      variant="body1"
                                      sx={{ textAlign: "justify" }}
                                    >
                                      {jtem.description}
                                    </Typography>
                                  </Box>
                                  <Typography
                                    variant="body2"
                                    sx={{ fontWeight: "bold", width: "75%" }}
                                  >
                                    {jtem.price} CUP
                                  </Typography>
                                </Box>
                              </Box>
                            </Paper>
                          </InViewComponent>
                        ))}
                    </Box>
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
