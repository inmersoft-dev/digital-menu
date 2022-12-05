/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect, useReducer, useCallback } from "react";
import { Link, useLocation } from "react-router-dom";

import inViewport from "in-viewport";

// @mui components
import {
  Box,
  Tooltip,
  useTheme,
  IconButton,
  Typography,
  Link as MUILink,
} from "@mui/material";

// @mui/icons-material
import MapIcon from "@mui/icons-material/Map";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";

// sito components
import SitoContainer from "sito-container";
import SitoImage from "sito-image";

// own components
import Error from "../../components/Error/Error";
import Loading from "../../components/Loading/Loading";
import Modal from "../../components/Modal/Modal";
import Empty from "../../components/Empty/Empty";
import NotFound from "../../views/NotFound/NotFound";
import TabView from "../../components/TabView/TabView";
import BackButton from "../../components/BackButton/BackButton";
import FabButtons from "../../components/FabButtons/FabButtons";
import InViewComponent from "../../components/InViewComponent/InViewComponent";

// icons
import { socialMediaIcons, placeTypeIcons } from "./icons";

// services
import { fetchMenu } from "../../services/menu.js";
import {
  sendQrCookie,
  sendVisitCookie,
  sendDescriptionCookie,
  sendHowToGoCookie,
} from "../../services/analytics";

// contexts
import { useMode } from "../../context/ModeProvider";
import { useLanguage } from "../../context/LanguageProvider";
import { useNotification } from "../../context/NotificationProvider";

// components
import ProductCard from "../../components/ProductCard/ProductCard";

// images
import noProduct from "../../assets/images/no-product.webp";

// functions
import { dashesToSpace } from "../../utils/functions";

// utils
import { parserAccents } from "../../utils/parser";
import { scrollTo, spaceToDashes } from "../../utils/functions";

// styles
import {
  typeBoxCss,
  productImageBox,
  productImage,
  headerBox,
  productList,
  mainContent,
  mainWindow,
} from "../../assets/styles/styles";

const Watch = () => {
  const theme = useTheme();
  const location = useLocation();

  const { languageState } = useLanguage();
  const { modeState, setModeState } = useMode();
  const { setNotificationState } = useNotification();

  const toggleMode = () => setModeState({ type: "toggle" });

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

  useEffect(() => {
    sendDescriptionCookie(currentMenu, selected);
  }, [selected]);

  const [visible, setVisible] = useState(false);

  const onModalClose = () => setVisible(false);

  const [loading, setLoading] = useState(1);
  const [error, setError] = useState(false);
  const [currentMenu, setCurrentMenu] = useState("");
  const [menu, setMenu] = useState("");
  const [phone, setPhone] = useState("");
  const [socialMedia, setSocialMedia] = useState([]);
  const [business, setBusiness] = useState([]);
  const [photo, setPhoto] = useState("");
  const [description, setDescription] = useState("");
  const [geolocation, setGeoLocation] = useState({});

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
        setPhone(data.phone);
        setBusiness(data.business);
        setSocialMedia(data.socialMedia);
        if (data.location) setGeoLocation(data.location);
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

  const onScroll = useCallback(
    (e) => {
      let firstTrue = -1;
      for (let i = 0; i < productTypes.length; i += 1) {
        const elem = document.getElementById(`title-${productTypes[i].name}`);
        const isInViewport = inViewport(elem);
        if (isInViewport && firstTrue === -1) firstTrue = i;
        if (
          isInViewport &&
          document.documentElement.scrollTop >=
            Math.floor(elem.offsetTop - elem.getBoundingClientRect().top)
        )
          setTab(i);
      }
    },
    [productTypes]
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

  const [qr, setQr] = useState(-1);

  useEffect(() => {
    let menuName = "";
    let thereIsQr = -1;
    if (location.pathname) {
      const splitPath = location.pathname.split("/");
      if (splitPath.length > 2) {
        menuName = location.pathname.split("/")[2];
        if (menuName) setCurrentMenu(menuName);
        else setNotFound(true);
      } else setNotFound(true);
    }
    if (location.search) {
      const queryParams = location.search.substring(1);
      const params = queryParams.split("&");
      params.forEach((item) => {
        const [paramName, paramValue] = item.split("=");
        if (paramValue)
          switch (paramName) {
            case "visited":
              if (menuName.length) {
                sendQrCookie(menuName);
                thereIsQr = 1;
              }
              break;
            default:
              setTimeout(() => {
                const product = document.getElementById(`obj-${paramValue}`);
                if (product !== null) scrollTo(product.offsetTop);
              }, 1000);
              break;
          }
      });
    }
    if (thereIsQr === -1) thereIsQr = 0;
    setQr(thereIsQr);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentMenu, location]);

  useEffect(() => {
    if (qr === 0) sendVisitCookie(currentMenu);
  }, [qr, currentMenu]);

  const [tab, setTab] = useState(0);

  const changeTab = (e, value) => {
    setTab(value);
    const type = document.getElementById(`title-${productTypes[value].name}`);
    if (type !== null) scrollTo(type.offsetTop);
  };

  const parseI = (start, i) => {
    let toReturn = start;
    for (let j = 0; j < i; j += 1) toReturn += 0.2;
    return toReturn;
  };

  const clickedMap = () => sendHowToGoCookie();

  const hasProducts = useCallback(
    (item) => {
      const lProducts = products.filter((jtem) => jtem.type === item.name);
      if (lProducts.length > 0) return true;
      return false;
    },
    [products]
  );

  return (
    <SitoContainer sx={mainWindow} flexDirection="column">
      <BackButton flat to="/" />
      <FabButtons />
      {selected && (
        <Modal visible={visible} item={selected} onClose={onModalClose} />
      )}
      <Loading
        visible={loading === 1}
        sx={{
          zIndex: loading === 1 ? 99 : -1,
        }}
      />
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
              sx={{ fontWeight: "bold", fontSize: "1.5rem", marginTop: "10px" }}
            >
              {menu}
            </Typography>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexWrap: "wrap",
              }}
            >
              {business.map((item) => (
                <Tooltip key={item.url} title={item.name}>
                  <Link
                    to={`/?business=${parserAccents(
                      spaceToDashes(item.name)
                    ).toLowerCase()}`}
                  >
                    <IconButton color="primary">
                      {
                        placeTypeIcons[
                          languageState.texts.Settings.Inputs.CenterTypes.Types.find(
                            (jtem) => jtem.id === item.id
                          ).icon
                        ]
                      }
                    </IconButton>
                  </Link>
                </Tooltip>
              ))}
            </Box>
            <Typography variant="body1" sx={{ textAlign: "center" }}>
              {description}
            </Typography>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexWrap: "wrap",
              }}
            >
              {phone.length > 0 ? (
                <InViewComponent delay="0s">
                  <Tooltip
                    title={
                      languageState.texts.Settings.Inputs.Contact.SocialMedia
                        .WhatsApp
                    }
                  >
                    <MUILink
                      href={`https://wa.me/${phone}`}
                      rel="noopener"
                      target="_blank"
                    >
                      <IconButton color="primary">
                        <WhatsAppIcon />
                      </IconButton>
                    </MUILink>
                  </Tooltip>
                </InViewComponent>
              ) : null}
              {socialMedia.map((item, i) => (
                <InViewComponent delay={`${parseI(0.1, i)}s`} key={item.url}>
                  <Tooltip
                    title={
                      languageState.texts.Settings.Inputs.Contact.SocialMedia
                        .Icons[item.icon]
                    }
                  >
                    <MUILink href={item.url} rel="noopener" target="_blank">
                      <IconButton color="primary">
                        {socialMediaIcons[item.icon]}
                      </IconButton>
                    </MUILink>
                  </Tooltip>
                </InViewComponent>
              ))}
              {geolocation.latitude && geolocation.longitude ? (
                <InViewComponent delay={`${parseI(0.1, socialMedia.length)}s`}>
                  <Tooltip title={languageState.texts.Map.Tooltip}>
                    <MUILink
                      onClick={clickedMap}
                      href={`https://www.google.com/maps/dir//${geolocation.latitude},${geolocation.longitude}/@${geolocation.latitude},${geolocation.longitude},21z`}
                    >
                      <IconButton color="primary">
                        <MapIcon />
                      </IconButton>
                    </MUILink>
                  </Tooltip>
                </InViewComponent>
              ) : null}
            </Box>
          </Box>
          <Box
            sx={{
              width: "100%",
              display: "flex",
              alignItems: "center",
            }}
          >
            <TabView
              sx={{
                width: "100%",
                position: "fixed",
                top: 0,
                left: 0,
                background: theme.palette.background.paper,
                zIndex: 15,
              }}
              tabsContainerSx={{
                width: "calc(100% - 40px)",
                paddingLeft: "40px",
              }}
              value={tab}
              onChange={changeTab}
              tabs={productTypes
                .filter((item) => hasProducts(item))
                .map((item, i) => item.name)}
              content={[]}
            />
            <IconButton
              color="inherit"
              sx={{ position: "fixed", top: "3px", right: 0, zIndex: 40 }}
              onClick={toggleMode}
            >
              {modeState.mode === "light" ? (
                <DarkModeIcon />
              ) : (
                <LightModeIcon />
              )}
            </IconButton>
          </Box>
          {error && !currentMenu && loading === -1 && <Error onRetry={retry} />}
          {loading === -1 && !error && !currentMenu && <Empty />}
          {!error && (
            <Box sx={productList}>
              {!loading &&
                productTypes
                  .filter((item) => hasProducts(item))
                  .map((item) => (
                    <Box key={item.name} sx={typeBoxCss}>
                      <Box id={`title-${item.name}`} sx={headerBox}>
                        <Typography sx={{ fontSize: "1.5rem" }} variant="h3">
                          {item.name}
                        </Typography>
                      </Box>
                      <Box>
                        {products
                          .filter((jtem) => jtem.type === item.name)
                          .map((jtem, j) => (
                            <InViewComponent
                              key={jtem.id}
                              id={`obj-${spaceToDashes(
                                parserAccents(jtem.name)
                              )}`}
                              delay={`${parseI(0.1, j)}s`}
                              sx={{
                                display: "flex",
                                justifyContent: "center",
                                width: "100%",
                              }}
                            >
                              <ProductCard
                                item={jtem}
                                onClick={() => {
                                  setVisible(true);
                                  setSelected(jtem);
                                }}
                              />
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
