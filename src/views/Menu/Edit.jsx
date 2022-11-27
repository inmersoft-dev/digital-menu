/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState, useCallback, useReducer } from "react";
import { useNavigate } from "react-router-dom";

import md5 from "md5";

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
import Empty from "../../components/Empty/Empty";
import Modal from "../../components/Modal/EditModal";
import Loading from "../../components/Loading/Loading";
import ToLogin from "../../components/ToLogin/ToLogin";
import ToLogout from "../../components/ToLogout/ToLogout";
import NotConnected from "../../components/NotConnected/NotConnected";
import InViewComponent from "../../components/InViewComponent/InViewComponent";

// functions
import { getUserName, userLogged } from "../../utils/auth";

// services
import { fetchMenu, saveMenu } from "../../services/menu";
import { removeImage } from "../../services/photo";

// contexts
import { useNotification } from "../../context/NotificationProvider";
import { useLanguage } from "../../context/LanguageProvider";

// images
import noProduct from "../../assets/images/no-product.webp";

// utils
import { scrollTo } from "../../utils/functions";

// styles
import {
  headerBox,
  mainWindow,
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

  const [selected, setSelected] = useState();

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

  const { setNotificationState } = useNotification();

  const showNotification = (ntype, message) =>
    setNotificationState({
      type: "set",
      ntype,
      message,
    });

  const fetch = async () => {
    setLoading(0);
    setError(false);
    try {
      const response = await fetchMenu(getUserName());
      const data = await response.data;
      if (data && data.t && data.l) {
        setMenuName(data.m);
        setProductTypes({
          type: "set",
          newArray: data.t.map((item) => ({ name: item })),
        });
        setProducts({ type: "set", newArray: data.l });
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

  const onScroll = useCallback((e) => {}, []);

  const deleteProduct = async (index) => {
    setLoading(1);
    try {
      if (productTypes[index].photo)
        await removeImage(productTypes.photo.fileId);
      const newProducts = [...products];
      newProducts.splice(index, 1);
      await saveMenu(getUserName(), menuName, newProducts, productTypes);
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

  return (
    <SitoContainer sx={mainWindow} flexDirection="column">
      <ToLogout />
      <ToLogin />
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
      <Paper
        elevation={1}
        sx={{
          width: "100%",
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
      </Paper>
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
      {error && loading === -1 && <NotConnected onRetry={retry} />}
      {loading === -1 && !error && <Empty />}
      {!error && loading === 0 && (
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
    </SitoContainer>
  );
};

export default Edit;
