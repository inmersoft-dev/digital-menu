/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable jsx-a11y/anchor-has-content */
/* eslint-disable no-undef */
import { useState, useEffect, useCallback } from "react";
import useOnclickOutside from "react-cool-onclickoutside";

import PropTypes from "prop-types";

// sito components
import { useNotification } from "sito-mui-notification";

// @mui/material
import {
  useTheme,
  useMediaQuery,
  Box,
  Button,
  Typography,
  IconButton,
  Divider,
  TextField,
  FormControlLabel,
  Checkbox,
} from "@mui/material";

// @mui/icons-material
import CloseIcon from "@mui/icons-material/Close";

// components
import Map from "../Map/Map";
import Loading from "../Loading/Loading";

// sito components
import SitoImage from "sito-image";

// styles
import {
  modal,
  modalContent,
  productImage,
  productImageBox,
} from "../../assets/styles/styles";

// context
import { useLanguage } from "../../context/LanguageProvider";

// utils
import { findFirstLowerLetter, findFirstUpperLetter } from "../../utils/auth";

// services
import { saveOrder } from "../../services/menu";
import { sendOrderCookie } from "../../services/analytics";

// images
import noProduct from "../../assets/images/no-product.webp";

const OrderModal = (props) => {
  const theme = useTheme();
  const biggerThanMD = useMediaQuery("(min-width:900px)");

  const { languageState } = useLanguage();
  const [loading, setLoading] = useState(false);
  const { order, visible, onClose, cleanOrder, menu, phone } = props;

  const [show, setShow] = useState(visible);

  const ref = useOnclickOutside(() => {
    onClose();
    setShow(false);
  });

  useEffect(() => {
    setShow(visible);
  }, [visible]);

  const onShowOff = () => {
    onClose();
    setShow(false);
  };

  const [remote, setRemote] = useState(false);
  const [customerName, setCustomerName] = useState("");
  const [nameHelperText, setNameHelperText] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [phoneHelperText, setPhoneHelperText] = useState("");

  const handlePhone = (e) => {
    const { value } = e.target;
    if (value) {
      if (findFirstLowerLetter(value) > -1 || findFirstUpperLetter(value) > -1)
        setPhoneHelperText(languageState.texts.Errors.InvalidPhone);
      else setPhoneHelperText("");
    }
    setCustomerPhone(value);
  };

  const onChangeMap = (which, value) => {
    if (which === "lng") return setLng(value);
    return setLat(value);
  };

  const [lng, setLng] = useState(-75.82956791534245);
  const [lat, setLat] = useState(20.022421136021567);

  const lngLatSelected = (point, lngLat) => {
    setLng(lngLat.lng);
    setLat(lngLat.lat);
  };

  useEffect(() => {
    const name = document.getElementById("name");
    if (name !== null && show) name.focus();
    if (show) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "inherit";
  }, [show]);

  const totalCost = useCallback(() => {
    let total = 0;
    order.forEach((item) => (total += item.cost));
    return total;
  }, [order]);

  const { setNotificationState } = useNotification();

  const showNotification = (ntype, message) =>
    setNotificationState({
      type: "set",
      ntype,
      message,
    });

  const [ok, setOk] = useState(1);

  const validate = () => setOk(true);

  const invalidate = (e) => {
    e.preventDefault();
    if (ok) {
      const { id } = e.target;
      e.target.focus();
      setOk(false);
      switch (id) {
        case "phone":
          setPhoneHelperText(languageState.texts.Errors.PhoneRequired);
          return showNotification(
            "error",
            languageState.texts.Errors.PhoneRequired
          );
        default:
          setNameHelperText(languageState.texts.Errors.NameRequired);
          return showNotification(
            "error",
            languageState.texts.Errors.NameRequired
          );
      }
    }
  };

  const [messageContent, setMessageContent] = useState("");

  const [active, setActive] = useState(false);

  const executeOrder = useCallback(
    async (e) => {
      e.preventDefault();
      setLoading(true);
      const date = new Date();
      try {
        let message = `${menu} ${
          languageState.texts.Settings.Inputs.Contact.Count.ToWhatsapp.order
        } ${date.getHours()}:${date.getMinutes()} ${date.getDate()}/${
          date.getMonth() + 1
        }/${date.getFullYear()}\n`;
        order.forEach((item) => {
          message += `${item.count} x ${item.product} ${item.cost} CUP\n`;
        });
        message += `${languageState.texts.Settings.Inputs.Contact.Count.CustomerName.Short}: ${customerName} \n${languageState.texts.Settings.Inputs.Contact.Phone.Short}: ${customerPhone}\n`;
        if (remote)
          message += `${languageState.texts.Map.Short}: https://www.google.com/maps/dir//${lat},${lng}/@${lat},${lng},21z`;
        setMessageContent(message);
        setActive(true);
      } catch (err) {
        console.error(err);
        showNotification("error", String(err));
      }
    },
    [remote]
  );

  const toWhatsapp = async () => {
    if (messageContent.length && active) {
      const link = document.getElementById("to-wa.me");
      if (link) {
        await saveOrder(menu, order);
        await sendOrderCookie(
          menu,
          customerName,
          customerPhone,
          order.map((item) => item.productId)
        );
        setLoading(false);
        cleanOrder();
        link.click();
      }
      setActive(false);
    }
  };

  useEffect(() => {
    toWhatsapp();
  }, [messageContent]);

  return (
    <Box
      sx={{
        ...modal,

        top: 0,
        minHeight: "100vh",
        height: "auto",
        zIndex: show ? 100 : -1,
        opacity: show ? 1 : -1,
      }}
    >
      <Loading visible={loading} sx={{ zIndex: loading ? 1000 : -1 }} />
      <Box
        ref={ref}
        sx={{
          ...modalContent,
          overflow: "auto",
          width: "100%",
          height: "100%",
          alignItems: "center",
          opacity: show ? 1 : -1,
          background: theme.palette.background.paper,
        }}
      >
        {console.log("pinga phone", phone)}
        <a
          href={`https://wa.me/${phone.replace(
            /\s/g,
            ""
          )}?text=${encodeURIComponent(messageContent)}`}
          target="_blank"
          rel="noreferrer"
          id="to-wa.me"
        />
        <IconButton
          sx={{ position: "absolute", top: "10px", right: "10px" }}
          color="error"
          onClick={onShowOff}
        >
          <CloseIcon />
        </IconButton>
        <Box
          sx={{
            gap: "20px",
            display: "flex",
            marginTop: "40px",
            alignItems: "center",
            justifyContent: "center",
            width: { sm: "630px", xs: "100%" },
          }}
        >
          <Typography
            variant="h3"
            sx={{
              fontWeight: "bold",
              fontSize: "2rem",
              textAlign: "center",
            }}
          >
            {languageState.texts.Settings.Inputs.Contact.Count.Order.Title}
          </Typography>
          <Divider sx={{ flex: 1 }} />
          <Box>
            <Typography variant="caption">
              {languageState.texts.Settings.Inputs.Contact.Count.Order.Total}
            </Typography>
            <Typography>{totalCost()} CUP</Typography>
          </Box>
        </Box>

        {order.map((item) => (
          <Box
            key={item.productId}
            sx={{
              position: "relative",
              width: { sm: "630px", xs: "100%" },
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexDirection: "column",
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                width: "100%",
                marginTop: "20px",
                gap: "20px",
              }}
            >
              <Box>
                <Box
                  sx={{ ...productImageBox, width: "100px", height: "100px" }}
                >
                  <SitoImage
                    src={
                      item.photo && item.photo.url !== ""
                        ? item.photo.url
                        : noProduct
                    }
                    alt={item.name}
                    sx={productImage}
                  />
                </Box>
              </Box>
              <Box sx={{ flex: 1 }}>
                <Box
                  sx={{
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <Typography>
                    {item.count} x {item.product}
                  </Typography>
                  {biggerThanMD ? (
                    <Typography>{item.cost} CUP</Typography>
                  ) : null}
                </Box>
                <Divider sx={{ width: "100%" }} />
                <Box
                  sx={{
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <Typography variant="caption" sx={{ color: "gray" }}>
                    {item.price} CUP
                  </Typography>
                  {!biggerThanMD ? (
                    <Typography>{item.cost} CUP</Typography>
                  ) : null}
                </Box>
              </Box>
            </Box>
          </Box>
        ))}
        {order.length > 5 ? (
          <Box
            sx={{
              gap: "20px",
              display: "flex",
              marginTop: "40px",
              alignItems: "center",
              justifyContent: "center",
              width: { sm: "630px", xs: "100%" },
            }}
          >
            <Typography
              variant="h3"
              sx={{
                fontWeight: "bold",
                fontSize: "2rem",
                textAlign: "center",
              }}
            >
              {languageState.texts.Settings.Inputs.Contact.Count.Order.Title}
            </Typography>
            <Divider sx={{ flex: 1 }} />
            <Box>
              <Typography variant="caption">
                {languageState.texts.Settings.Inputs.Contact.Count.Order.Total}
              </Typography>
              <Typography>{totalCost()} CUP</Typography>
            </Box>
          </Box>
        ) : null}
        <Box
          component="form"
          onSubmit={executeOrder}
          display="flex"
          flexDirection="column"
          gap="20px"
          sx={{
            marginTop: "40px",
            alignItems: "center",
            justifyContent: "flex-start",
            width: { sm: "630px", xs: "100%" },
          }}
        >
          <TextField
            required
            id="name"
            color={nameHelperText.length > 0 ? "error" : "primary"}
            onInput={validate}
            onInvalid={invalidate}
            sx={{ width: "100%" }}
            type="text"
            label={
              languageState.texts.Settings.Inputs.Contact.Count.CustomerName
                .Label
            }
            placeholder={
              languageState.texts.Settings.Inputs.Contact.Count.CustomerName
                .Placeholder
            }
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
          />
          <TextField
            required
            id="phone"
            onInput={validate}
            onInvalid={invalidate}
            sx={{ width: "100%" }}
            color={phoneHelperText.length > 0 ? "error" : "primary"}
            helperText={phoneHelperText}
            type="tel"
            label={languageState.texts.Settings.Inputs.Contact.Phone.Label}
            placeholder={
              languageState.texts.Settings.Inputs.Contact.Phone.Placeholder
            }
            value={customerPhone}
            onChange={handlePhone}
          />
          <FormControlLabel
            sx={{ width: "100%" }}
            control={
              <Checkbox
                checked={remote}
                onChange={(e) => setRemote(e.target.checked)}
              />
            }
            label={languageState.texts.Settings.Inputs.Contact.Count.Remote}
          />
          {remote ? (
            <Box sx={{ width: "100%" }}>
              <Map
                sx={{ width: "100%" }}
                noButton
                onMapClick={lngLatSelected}
                lat={lat}
                lng={lng}
                point={{ lat, lng }}
                onChange={onChangeMap}
                onChangeLat={(newValue) => setLat(newValue)}
                onChangeLng={(newValue) => setLng(newValue)}
              />
            </Box>
          ) : null}
          <Box
            display="flex"
            alignItems="center"
            sx={{ width: "100%", gap: "20px" }}
          >
            <Button variant="contained" type="submit">
              {languageState.texts.Settings.Inputs.Contact.Count.Submit}
            </Button>
            <Button
              variant="outlined"
              onClick={cleanOrder}
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {languageState.texts.Settings.Inputs.Contact.Count.Clean}
            </Button>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

OrderModal.propTypes = {
  order: PropTypes.arrayOf(
    PropTypes.shape({
      count: PropTypes.number,
      productId: PropTypes.string,
      product: PropTypes.string,
      price: PropTypes.number,
      cost: PropTypes.number,
      photo: PropTypes.string,
    })
  ),
  menu: PropTypes.string,
  phone: PropTypes.string,
  visible: PropTypes.bool,
  onClose: PropTypes.func,
  cleanOrder: PropTypes.func,
};

export default OrderModal;
