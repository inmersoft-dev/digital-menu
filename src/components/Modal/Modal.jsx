import { useState } from "react";

import PropTypes from "prop-types";

// sito components
import SitoContainer from "sito-container";
import SitoImage from "sito-image";

// @mui icons
import CloseIcon from "@mui/icons-material/Close";

// image
import noProduct from "../../assets/images/no-product.webp";

// @mui
import { useTheme, Box, Typography, IconButton } from "@mui/material";
import { useEffect } from "react";
import {
  modal,
  modalContent,
  productImageBox,
} from "../../assets/styles/styles";

import axios from "axios";

import config from "../../config";

const Modal = (props) => {
  const theme = useTheme();
  const { visible, onClose, item } = props;

  const [show, setShow] = useState(visible);

  const [preview, setPreview] = useState("");

  const getPhotoFromServer = (id) => {
    axios.get(`${config.apiUrl}get/photo?photo=${id}`).then((data) => {
      setPreview(`data:image/jpeg;base64,${data.data}`);
    });
  };

  useEffect(() => {
    setShow(visible);
    getPhotoFromServer(item.i);
  }, [visible, item]);

  const onShowOff = () => {
    onClose();
    setShow(false);
  };

  return (
    <Box
      onClick={onShowOff}
      sx={{
        ...modal,
        zIndex: show ? 20 : -1,
        opacity: show ? 1 : -1,
      }}
      onClose={onClose}
    >
      <Box
        sx={{
          ...modalContent,
          opacity: show ? 1 : -1,
          background: theme.palette.background.paper,
        }}
      >
        <SitoContainer
          sx={{ width: "96%", position: "absolute", marginTop: "-10px" }}
          justifyContent="flex-end"
          alignItems="center"
        >
          <IconButton color="error" onClick={onShowOff}>
            <CloseIcon />
          </IconButton>
        </SitoContainer>
        <SitoContainer
          sx={{ width: "100%" }}
          alignItems="center"
          justifyContent="center"
        >
          <Box sx={productImageBox}>
            <SitoImage
              src={preview ? preview : noProduct}
              alt={item.n}
              sx={{ width: "100%", height: "100%", borderRadius: "100%" }}
            />
          </Box>
        </SitoContainer>

        <SitoContainer
          flexDirection="column"
          alignItems="center"
          sx={{ width: "100%" }}
        >
          <Typography
            variant="h5"
            sx={{
              fontWeight: "bold",
              width: "100%",
              textAlign: "center",
              marginTop: "10px",
            }}
          >
            {item.p}
          </Typography>
          <Typography
            variant="h3"
            sx={{
              fontWeight: "bold",
              width: "100%",
              textAlign: "center",
              marginTop: "10px",
            }}
          >
            {item.n}
          </Typography>
          <Typography
            variant="body"
            sx={{ width: "100%", textAlign: "center", marginTop: "10px" }}
          >
            {item.d}
          </Typography>
        </SitoContainer>
      </Box>
    </Box>
  );
};

Modal.propTypes = {
  visible: PropTypes.bool,
  onClose: PropTypes.func,
  item: PropTypes.object,
};

export default Modal;
