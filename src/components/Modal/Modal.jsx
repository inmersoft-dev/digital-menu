/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect, useCallback } from "react";
import useOnclickOutside from "react-cool-onclickoutside";

import PropTypes from "prop-types";

// sito components
import SitoContainer from "sito-container";
import SitoImage from "sito-image";

// @mui/icons-material
import CloseIcon from "@mui/icons-material/Close";
import AddIcon from "@mui/icons-material/AddCircle";

// image
import noProduct from "../../assets/images/no-product.webp";

// @mui/material
import {
  useTheme,
  Box,
  Typography,
  IconButton,
  FormControl,
  OutlinedInput,
  InputAdornment,
  InputLabel,
} from "@mui/material";

// styles
import {
  imageTitleBox,
  modal,
  modalContent,
  productImage,
} from "../../assets/styles/styles";

// context
import { useLanguage } from "../../context/LanguageProvider";

const Modal = (props) => {
  const theme = useTheme();

  const ref = useOnclickOutside(() => {
    onClose();
    setShow(false);
  });

  const { visible, onClose, item, addCount } = props;

  const [show, setShow] = useState(visible);

  const [preview, setPreview] = useState("");

  const { languageState } = useLanguage();

  const handleMouseDownPassword = (event) => event.preventDefault();

  const [count, setCount] = useState(1);

  const localAddCount = useCallback(
    (e) => {
      e.preventDefault();
      addCount(count, item);
      onClose();
      setShow(false);
      setCount(1);
    },
    [count, addCount]
  );

  useEffect(() => {
    setShow(visible);
    if (item.photo) setPreview(item.photo.url);
  }, [visible, item]);

  const onShowOff = () => {
    onClose();
    setShow(false);
  };

  useEffect(() => {
    const countInput = document.getElementById("count");
    if (countInput !== null) countInput.focus();
    if (show) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "inherit";
  }, [show]);

  return (
    <Box
      sx={{
        ...modal,
        zIndex: show ? 20 : -1,
        opacity: show ? 1 : -1,
      }}
    >
      <Box
        ref={ref}
        sx={{
          ...modalContent,
          overflow: "hidden",
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
          <Box sx={imageTitleBox}>
            <SitoImage
              src={preview ? preview : noProduct}
              alt={item.name}
              sx={{ ...productImage, borderRadius: "100%" }}
            />
          </Box>
        </SitoContainer>

        <SitoContainer
          flexDirection="column"
          alignItems="center"
          sx={{ width: "100%" }}
        >
          <Typography
            variant="subtitle1"
            sx={{
              fontWeight: "bold",
              width: "100%",
              textAlign: "center",
              marginTop: "10px",
            }}
          >
            {item.price} CUP
          </Typography>
          <Typography
            variant="h3"
            sx={{
              fontWeight: "bold",
              width: "100%",
              textAlign: "center",
              marginTop: "10px",
              fontSize: "2rem",
            }}
          >
            {item.name}
          </Typography>
          <Typography
            variant="body"
            sx={{ width: "80%", textAlign: "center", marginTop: "10px" }}
          >
            {item.description}
          </Typography>
          <Box sx={{ width: "80%" }}>
            <Typography
              variant="h3"
              sx={{
                fontWeight: "bold",
                width: "100%",
                margin: "20px 10px 20px 10px",
                fontSize: "1.5rem",
              }}
            >
              {languageState.texts.Settings.Inputs.Contact.Count.Title}
            </Typography>
            <Box
              display="flex"
              alignItems="center"
              component="form"
              onSubmit={localAddCount}
            >
              <FormControl sx={{ width: "100%" }} variant="outlined">
                <InputLabel>
                  {languageState.texts.Settings.Inputs.Contact.Count.Label}
                </InputLabel>
                <OutlinedInput
                  onKeyDown={(event) =>
                    event.key === "." ? event.preventDefault() : ""
                  }
                  onInput={(event) => {
                    event.target.value = event.target.value.replace(
                      /[^0-9]*/g,
                      ""
                    );
                  }}
                  type="number"
                  id="count"
                  min={1}
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton
                        type="submit"
                        color="secondary"
                        tabIndex={-1}
                        aria-label="toggle password visibility"
                        onClick={localAddCount}
                        onMouseDown={handleMouseDownPassword}
                        edge="end"
                      >
                        <AddIcon />
                      </IconButton>
                    </InputAdornment>
                  }
                  label={
                    languageState.texts.Settings.Inputs.Contact.Count.Label
                  }
                  value={count}
                  onChange={(e) =>
                    Number(e.target.value) <= 0
                      ? setCount(1)
                      : setCount(e.target.value)
                  }
                />
              </FormControl>
              <Typography
                sx={{
                  marginLeft: `${String(count).length * 5 * 2 + 20}px`,
                  color: "gray",
                  maxWidth: "200px",
                  minWidth: "55px",
                  textAlign: "end",
                  position: "absolute",
                  marginTop: "1px",
                }}
              >
                ({count * item.price} CUP)
              </Typography>
            </Box>
          </Box>
        </SitoContainer>
      </Box>
    </Box>
  );
};

Modal.propTypes = {
  visible: PropTypes.bool,
  onClose: PropTypes.func,
  item: PropTypes.object,
  addCount: PropTypes.func,
};

export default Modal;
