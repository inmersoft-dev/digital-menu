/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect, useReducer, useCallback } from "react";
import { useLocation } from "react-router-dom";

// @mui/material
import { Box, Typography, Button, Tooltip, Badge } from "@mui/material";

// @mui/icons-material
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";

// sito components
import SitoContainer from "sito-container";
import { useNotification } from "sito-mui-notification";

// own components
import Error from "../../components/Error/Error";
import Modal from "../../components/Modal/Modal";
import Empty from "../../components/Empty/Empty";
import MainContent from "./components/MainContent";
import NotFound from "../../views/NotFound/NotFound";
import Loading from "../../components/Loading/Loading";
import CookieBox from "../../components/CookieBox/CookieBox";
import WatchAppBar from "../../components/AppBar/WatchAppBar";
import FabButtons from "../../components/FabButtons/FabButtons";
import InViewComponent from "../../components/InViewComponent/InViewComponent";

// services
import { fetchMenu } from "../../services/menu.js";
import {
  sendQrCookie,
  sendVisitCookie,
  sendDescriptionCookie,
} from "../../services/analytics";

// contexts
import { useHistory } from "../../context/HistoryProvider";
import { useLanguage } from "../../context/LanguageProvider";

// components
import OrderModal from "../../components/OrderModal/OrderModal";
import ProductCard from "../../components/ProductCard/ProductCard";

// functions
import { dashesToSpace } from "../../utils/functions";

// utils
import { parserAccents, parseI } from "../../utils/parser";
import { scrollTo, spaceToDashes } from "../../utils/functions";

// styles
import {
  typeBoxCss,
  productList,
  mainWindow,
  responsiveGrid,
} from "../../assets/styles/styles";

const Watch = () => {
  const location = useLocation();

  const { languageState } = useLanguage();
  const { setHistoryState } = useHistory();

  const orderReducer = (orderStates, action) => {
    const { type } = action;
    switch (type) {
      case "set": {
        const { newArray } = action;
        if (newArray.length) newArray[0].active = true;
        return newArray;
      }
      case "delete": {
        const { index } = action;
        const newArray = [...orderStates];
        newArray.splice(index, 1);
        return newArray;
      }
      case "add": {
        const { newProduct } = action;
        const findIndex = orderStates.findIndex(
          (item) => item.productId === newProduct.productId
        );
        if (findIndex > -1) {
          orderStates[findIndex].count += newProduct.count;
          orderStates[findIndex].cost += newProduct.cost;
        } else orderStates.push(newProduct);
        return [...orderStates];
      }
      default:
        return [];
    }
  };

  const [toOrder, setToOrder] = useReducer(orderReducer, []);

  const [shake, setShake] = useState(false);

  useEffect(() => {
    if (toOrder.length > 0) {
      setShake(true);
      setTimeout(() => {
        setShake(false);
      }, 100);
    }
  }, [toOrder]);

  const addToOrder = (count, product) => {
    setToOrder({
      type: "add",
      newProduct: {
        count,
        productId: product.id,
        product: product.name,
        price: product.price,
        cost: product.price * count,
        photo: product.photo,
      },
    });
  };

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
      } else {
        setError(true);
        setLoading(-1);
        setNotFound(true);
      }
    } catch (err) {
      if (String(err).indexOf(422)) setNotFound(true);
      else {
        showNotification("error", String(err));
        setError(true);
        setLoading(-1);
      }
    }
  };

  const retry = () => fetch();

  const onKeyDown = useCallback(
    (e) => {
      if (e.key === "Escape") {
        if (visible) setVisible(false);
      }
    },
    [visible, setVisible]
  );

  useEffect(() => {
    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [onKeyDown]);

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
            case "search": {
              const exist = localStorage.getItem("search-history");
              if (exist !== null && exist !== "")
                setHistoryState({
                  type: "set",
                  newArray: JSON.parse(exist).filter(
                    (item) => item !== null && item.trim().length > 0
                  ),
                });
              if (paramValue.length > 0)
                setHistoryState({ type: "add", newHistory: paramValue });
              break;
            }
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

  const hasProducts = useCallback(
    (item) => {
      const lProducts = products.filter((jtem) => jtem.type === item.name);
      if (lProducts.length > 0) return true;
      return false;
    },
    [products]
  );

  const [showOrder, setShowOrder] = useState();
  const showOrderOff = () => setShowOrder(false);

  const toggleOrder = () => setShowOrder(!showOrder);

  const cleanOrder = () => setToOrder({ type: "clean" });

  return (
    <SitoContainer sx={mainWindow} flexDirection="column">
      {!notFound ? <CookieBox /> : null}
      {!notFound ? <FabButtons /> : null}
      {toOrder.length ? (
        <OrderModal
          menu={menu}
          phone={phone}
          visible={showOrder}
          order={toOrder}
          onClose={showOrderOff}
          cleanOrder={cleanOrder}
        />
      ) : null}
      {toOrder.length > 0 ? (
        <Tooltip
          title={languageState.texts.Settings.Inputs.Contact.Count.CartTooltip}
          placement="right"
        >
          <Button
            onClick={toggleOrder}
            className={shake ? "shake" : ""}
            variant="contained"
            sx={{
              borderRadius: "100%",
              padding: "5px",
              minWidth: 0,
              zIndex: 20,
              position: "fixed",
              bottom: "10px",
              left: "10px",
            }}
          >
            <Badge badgeContent={toOrder.length} color="error">
              <ShoppingCartIcon />
            </Badge>
          </Button>
        </Tooltip>
      ) : null}
      {selected && (
        <Modal
          addCount={addToOrder}
          visible={visible}
          item={selected}
          onClose={onModalClose}
        />
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
          <WatchAppBar productTypes={productTypes} hasProducts={hasProducts} />
          <MainContent
            menu={menu}
            phone={phone}
            photo={photo}
            business={business}
            socialMedia={socialMedia}
            description={description}
            geolocation={geolocation}
          />
          {error && !currentMenu && loading === -1 && <Error onRetry={retry} />}
          {loading === -1 && !error && !currentMenu && <Empty />}
          {!error && (
            <Box sx={productList}>
              {!loading &&
                productTypes
                  .filter((item) => hasProducts(item))
                  .map((item) => (
                    <Box key={item.name} sx={typeBoxCss}>
                      <Box id={`title-${item.name}`} sx={{ width: "100%" }}>
                        <Typography
                          sx={{ fontSize: "1.5rem", textAlign: "left" }}
                          variant="h3"
                        >
                          {item.name}
                        </Typography>
                      </Box>
                      <Box sx={responsiveGrid}>
                        {products
                          .filter(
                            (jtem) => jtem.type === item.name && jtem.visibility
                          )
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
                                width: { md: "350px", xs: "100%" },
                              }}
                            >
                              <ProductCard
                                addToOrder={addToOrder}
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
