/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState, useCallback, useReducer } from "react";
import { useNavigate, Link } from "react-router-dom";

import inViewport from "in-viewport";

import md5 from "md5";

// sito components
import SitoContainer from "sito-container";
import SitoImage from "sito-image";

// @mui components
import {
  Box,
  Paper,
  Button,
  Tooltip,
  useTheme,
  IconButton,
  Typography,
  Link as MUILink,
} from "@mui/material";

// @mui icons
import EditIcon from "@mui/icons-material/Edit";
import CloseIcon from "@mui/icons-material/Close";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";
// own components
import Error from "../../components/Error/Error";
import Empty from "../../components/Empty/Empty";
import Modal from "../../components/Modal/EditModal";
import TabView from "../../components/TabView/TabView";
import Loading from "../../components/Loading/Loading";
import FabButtons from "../../components/FabButtons/FabButtons";
import BackButton from "../../components/BackButton/BackButton";
import InViewComponent from "../../components/InViewComponent/InViewComponent";
// url
import MapIcon from "@mui/icons-material/Map";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";

// icons
import { socialMediaIcons, placeTypeIcons } from "./icons";

// functions
import { getUserName, userLogged } from "../../utils/auth";

// services
import { removeImage } from "../../services/photo";
import { fetchMenu, saveMenu } from "../../services/menu";
import { sendHowToGoCookie } from "../../services/analytics";

// contexts
import { useMode } from "../../context/ModeProvider";
import { useLanguage } from "../../context/LanguageProvider";
import { useNotification } from "../../context/NotificationProvider";

// images
import noProduct from "../../assets/images/no-product.webp";

// utils
import { scrollTo } from "../../utils/functions";

// styles
import {
  headerBox,
  mainWindow,
  mainContent,
  productContentBox,
  productDescriptionBox,
  productImage,
  productImageBox,
  productList,
  typeBoxCss,
} from "../../assets/styles/styles";

const Edit = () => {
  const theme = useTheme();
  const navigate = useNavigate();

  const { modeState, setModeState } = useMode();

  const [selected, setSelected] = useState();

  const toggleMode = () => setModeState({ type: "toggle" });

  const [visible, setVisible] = useState(false);

  const onModalClose = () => setVisible(false);

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

  const productsReducer = (productsState, action) => {
    const { type } = action;
    switch (type) {
      case "set": {
        const { newArray } = action;
        return newArray.map((item, i) => ({ ...item, index: i }));
      }
      case "delete": {
        const { index } = action;
        const newArray = [...productsState];
        newArray.splice(index, 1);
        return newArray.map((item, i) => ({ ...item, index: i }));
      }
      case "modify": {
        const { index, newProduct } = action;
        productsState[index] = newProduct;
        return [...productsState];
      }
      case "add": {
        const { newProduct } = action;
        return [
          ...productsState,
          { ...newProduct, index: productsState.length },
        ];
      }
      default:
        return [];
    }
  };
  const [products, setProducts] = useReducer(productsReducer, []);

  const [loading, setLoading] = useState(1);
  const [error, setError] = useState(false);

  const [menuName, setMenuName] = useState("");
  const [menu, setMenu] = useState("");
  const [phone, setPhone] = useState("");
  const [socialMedia, setSocialMedia] = useState([]);
  const [business, setBusiness] = useState([]);
  const [photo, setPhoto] = useState("");
  const [description, setDescription] = useState("");
  const [geolocation, setGeoLocation] = useState({});

  const { setNotificationState } = useNotification();

  const showNotification = (ntype, message) =>
    setNotificationState({
      type: "set",
      ntype,
      message,
    });

  const fetch = async () => {
    setLoading(1);
    setError(false);
    try {
      const response = await fetchMenu(getUserName());
      const data = await response.data;
      if (data) {
        setMenuName(data.menu);
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
        setProducts({ type: "set", newArray: data.list ? data.list : [] });
        setLoading(0);
      }
    } catch (err) {
      console.error(err);
      showNotification("error", String(err));
      setError(true);
      setLoading(-1);
    }
  };

  const { languageState } = useLanguage();

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
          setProductTypes({
            type: "set-active",
            index: i,
          });
      }
    },
    [productTypes]
  );

  const deleteProduct = async (index) => {
    setLoading(1);
    try {
      if (products[index].photo) await removeImage(productTypes.photo.fileId);
      const newProducts = [...products];
      newProducts.splice(index, 1);
      await saveMenu(
        getUserName(),
        menuName,
        newProducts,
        productTypes.map((item) => item.name)
      );
      setProducts({ type: "delete", index });
      setLoading(0);
    } catch (err) {
      console.error(err);
      showNotification("error", String(err));
    }
  };

  const onSubmit = async (id, name, type, description, price, photo) => {
    setLoading(1);
    try {
      const newProductTypes = [...productTypes.map((item) => item.name)];
      const typePosition = productTypes.find((item) => item.name === type);
      if (!typePosition) {
        setProductTypes({ type: "add", newType: { name: type } });
        newProductTypes.push(type);
      }
      const newProducts = [...products];
      if (!id || !id.length) {
        const parsedObj = {
          id: md5(name),
          name,
          type,
          description,
          price,
          photo,
        };
        setProducts({
          type: "add",
          newProduct: parsedObj,
        });
        newProducts.push(parsedObj);
      } else {
        const indexOf = products.findIndex((item) => item.id === id);
        const parsedObj = {
          id,
          name,
          type,
          description,
          price,
          photo,
        };
        if (indexOf > -1) {
          setProducts({
            type: "modify",
            index: indexOf,
            newProduct: parsedObj,
          });
          newProducts[indexOf] = parsedObj;
        }
      }
      const result = await saveMenu(
        getUserName(),
        menuName,
        newProducts,
        newProductTypes
      );
      if (result.status === 200) {
        showNotification(
          "success",
          languageState.texts.Messages.SaveSuccessful
        );
        setSelected({
          id: "",
          photo: "",
          name: "",
          description: "",
          price: "",
          type: "",
        });
        setVisible(false);
        setLoading(0);
      }
    } catch (err) {
      console.error(err);
      showNotification("error", String(err));
    }
  };

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
    if (!userLogged()) navigate("/auth/");
    retry();
  }, []);

  const clickedMap = () => sendHowToGoCookie();

  const hasProducts = useCallback(
    (item) => {
      const lProducts = products.filter((jtem) => jtem.type === item.name);
      if (lProducts.length > 0) return true;
      return false;
    },
    [products]
  );

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

  return (
    <Box sx={mainWindow} flexDirection="column">
      <BackButton flat to="/" />
      <FabButtons location="edit" />
      {selected && (
        <Modal
          visible={visible}
          item={selected}
          onClose={onModalClose}
          onSubmit={onSubmit}
          types={productTypes}
        />
      )}
      <Loading
        visible={loading === 1}
        sx={{
          zIndex: loading === 1 ? 99 : -1,
        }}
      />
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
          tabs={productTypes.map((item, i) => item.name)}
          content={[]}
        />
        <IconButton
          color="inherit"
          sx={{ position: "fixed", top: "3px", right: 0, zIndex: 40 }}
          onClick={toggleMode}
        >
          {modeState.mode === "light" ? <DarkModeIcon /> : <LightModeIcon />}
        </IconButton>
      </Box>
      <Box sx={mainContent}>
        <Box sx={productImageBox}>
          <SitoImage
            src={photo && photo !== "" ? photo : noProduct}
            alt={menu}
            sx={productImage}
          />
        </Box>
        <Box display="flex" alignItems="center" sx={{ marginTop: "10px" }}>
          <Typography
            variant="h3"
            sx={{ fontWeight: "bold", fontSize: "1.5rem", marginRight: "10px" }}
          >
            {menu}
          </Typography>
          <Link to="/settings">
            <IconButton color="primary">
              <EditIcon />
            </IconButton>
          </Link>
        </Box>

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
              <MUILink
                href={`${process.env.PUBLIC_URL}/?type=${item.id}`}
                rel="noopener"
                target="_blank"
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
              </MUILink>
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
                  languageState.texts.Settings.Inputs.Contact.SocialMedia.Icons[
                    item.icon
                  ]
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
      {/* shouldScroll */}
      <SitoContainer
        sx={{ width: "100%", marginTop: "65px" }}
        justifyContent="center"
      >
        <Button
          variant="contained"
          onClick={() => {
            setSelected({
              id: "",
              photo: "",
              name: "",
              description: "",
              price: "",
              type: "",
            });
            setVisible(true);
          }}
        >
          {languageState.texts.Insert.Buttons.Insert}
        </Button>
      </SitoContainer>
      {error && loading === -1 && <Error onRetry={retry} />}
      {loading === -1 && !error && <Empty />}
      {!error && loading === 0 && (
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
                  <Box sx={{ width: "100%" }}>
                    {products
                      .filter((jtem) => jtem.type === item.name)
                      .map((jtem, j) => (
                        <InViewComponent
                          key={jtem.id}
                          delay={`${parseI(0.1, j)}s`}
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
                              width: { sm: "630px", xs: "100%" },
                              padding: "1rem",
                              borderRadius: "1rem",
                              background: theme.palette.background.paper,
                              alignItems: "center",
                            }}
                          >
                            <IconButton
                              sx={{
                                position: "absolute",
                                top: "1px",
                                right: "1px",
                              }}
                              color="error"
                              onClick={() => deleteProduct(jtem.index)}
                            >
                              <CloseIcon />
                            </IconButton>
                            <Box
                              sx={{ cursor: "pointer", display: "flex" }}
                              onClick={() => {
                                setVisible(true);
                                setSelected(jtem);
                              }}
                            >
                              <Box
                                sx={{ marginRight: "20px", display: "flex" }}
                              >
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
                              </Box>
                              <Box sx={productContentBox}>
                                <Typography
                                  variant="h3"
                                  sx={{ fontWeight: "bold", fontSize: "1rem" }}
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
    </Box>
  );
};

export default Edit;
