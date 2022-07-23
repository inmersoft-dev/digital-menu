import { useState, useEffect, useCallback } from "react";
import { useForm, Controller } from "react-hook-form";

import PropTypes from "prop-types";

// sito components
import SitoContainer from "sito-container";
import SitoImage from "sito-image";

// @mui icons
import CloseIcon from "@mui/icons-material/Close";

// @mui components
import { useTheme, Box, Button, IconButton, TextField } from "@mui/material";

// image
import noProduct from "../../assets/images/no-product.webp";

// contexts
import { useNotification } from "../../context/NotificationProvider";
import { useLanguage } from "../../context/LanguageProvider";

const Modal = (props) => {
  const theme = useTheme();
  const { languageState } = useLanguage();
  const { setNotificationState } = useNotification();

  const { visible, onClose, onSubmit, item, types } = props;

  const [show, setShow] = useState(visible);

  const [ok, setOk] = useState(1);

  const [image, setImage] = useState("");
  const [, setImageFile] = useState();

  const [photo, setPhoto] = useState({ edt: "", content: "" });
  const { control, handleSubmit, reset, getValues, setValue } = useForm({
    defaultValues: {
      id: "",
      price: "",
      name: "",
      description: "",
      type: "",
    },
  });

  useEffect(() => {
    const textarea = document.getElementById("description");
    if (textarea !== null) textarea.setAttribute("maxlength", 255);
    const { i, n, p, d, ph, t } = item;
    setPhoto(ph);
    reset({
      id: i,
      name: n,
      price: p,
      description: d,
      type: types[t],
      photo: ph,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [item]);

  useEffect(() => {
    setShow(visible);
  }, [visible]);

  const onShowOff = () => {
    onClose();
    setShow(false);
  };

  const validate = () => {
    setOk(true);
  };

  const invalidate = (e) => {
    e.preventDefault();
    if (ok) {
      const { id } = e.target;
      e.target.focus();
      setOk(false);
      let message = "";
      switch (id) {
        case "type":
          message = languageState.texts.Errors.PriceRequired;
          break;
        case "description":
          message = languageState.texts.Errors.PriceRequired;
          break;
        case "price":
          message = languageState.texts.Errors.PriceRequired;
          break;
        default:
          message = languageState.texts.Errors.NameRequired;
          break;
      }
      return setNotificationState({
        type: "set",
        ntype: "error",
        message,
      });
    }
  };

  const onUploadPhoto = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImage(e.target.value);
    setImageFile(file);
    const reader = new FileReader();
    reader.onload = async (e) => {
      const content = e.target.result;
      // the blob data is automatic received as base64
      setPhoto({ ext: file.type.split("/")[1], content });
      setValue("photo", { ext: file.type.split("/")[1], content });
    };
    reader.readAsDataURL(file);
  };

  const uploadPhoto = useCallback((e) => {
    const file = document.getElementById("product-photo");
    if (file !== null) file.click();
  }, []);

  useEffect(() => {
    const image = document.getElementById("no-product");
    if (image !== null) image.onclick = uploadPhoto;
    return () => {
      if (image !== null) image.onclick = undefined;
    };
  }, [uploadPhoto]);

  return (
    <Box
      sx={{
        position: "fixed",
        left: 0,
        bottom: 0,
        right: 0,
        zIndex: show ? 20 : -1,
        opacity: show ? 1 : -1,
        width: "100vw",
        height: "100vh",
        display: "flex",
        alignItems: "flex-end",
        justifyContent: "center",
        background: "#4e464652",
        backdropFilter: "blur(4px)",
        transition: "all 500ms ease",
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          width: { md: "800px", sm: "630px", xs: "100%" },
          height: "540px",
          padding: "1rem",
          borderRadius: "1rem",
          background: theme.palette.background.paper,
          position: "relative",
          transition: "all 500ms ease",
          opacity: show ? 1 : -1,
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
          <Box
            sx={{
              width: { md: "160px", sm: "160px", xs: "160px" },
              height: { md: "160px", sm: "160px", xs: "160px" },
            }}
          >
            <input
              id="product-photo"
              type="file"
              accept=".jpg, .png, .webp, .gif"
              value={image}
              onChange={onUploadPhoto}
            />
            {photo && photo.content === "" ? (
              <SitoImage
                id="no-product"
                src={noProduct}
                alt="no-product"
                sx={{
                  width: "100%",
                  cursor: "pointer",
                  height: "100%",
                  borderRadius: "100%",
                }}
              />
            ) : (
              <SitoImage
                src={photo && photo.content !== "" ? photo.content : noProduct}
                alt={getValues("name")}
                sx={{
                  width: "100%",
                  height: "100%",
                  borderRadius: "100%",
                  objectFit: "cover",
                }}
              />
            )}
          </Box>
        </SitoContainer>

        <SitoContainer
          flexDirection="column"
          alignItems="center"
          sx={{ width: "100%" }}
        >
          <form onSubmit={handleSubmit(onSubmit)}>
            <Controller
              name="price"
              control={control}
              render={({ field }) => (
                <TextField
                  sx={{
                    width: "100%",
                    marginTop: "10px",
                  }}
                  id="price"
                  type="number"
                  required
                  onInput={validate}
                  onInvalid={invalidate}
                  label={languageState.texts.Insert.Inputs.Price.Label}
                  placeholder={
                    languageState.texts.Insert.Inputs.Price.Placeholder
                  }
                  {...field}
                />
              )}
            />
            <Controller
              name="name"
              control={control}
              render={({ field }) => (
                <TextField
                  sx={{
                    width: "100%",
                    marginTop: "10px",
                  }}
                  id="name"
                  required
                  onInput={validate}
                  onInvalid={invalidate}
                  label={languageState.texts.Insert.Inputs.Product.Label}
                  placeholder={
                    languageState.texts.Insert.Inputs.Product.Placeholder
                  }
                  {...field}
                />
              )}
            />
            <Controller
              name="description"
              control={control}
              render={({ field }) => (
                <TextField
                  sx={{
                    width: "100%",
                    marginTop: "10px",
                  }}
                  id="description"
                  required
                  multiline
                  maxLength="255"
                  maxRows={3}
                  minRows={3}
                  onInput={validate}
                  onInvalid={invalidate}
                  label={languageState.texts.Insert.Inputs.Description.Label}
                  placeholder={
                    languageState.texts.Insert.Inputs.Description.Placeholder
                  }
                  {...field}
                />
              )}
            />
            <Controller
              name="type"
              control={control}
              render={({ field }) => (
                <TextField
                  sx={{
                    width: "100%",
                    marginTop: "10px",
                  }}
                  id="type"
                  required
                  onInput={validate}
                  onInvalid={invalidate}
                  label={languageState.texts.Insert.Inputs.Type.Label}
                  placeholder={
                    languageState.texts.Insert.Inputs.Type.Placeholder
                  }
                  {...field}
                />
              )}
            />
            <Button
              type="submit"
              variant="contained"
              sx={{ marginTop: "10px" }}
            >
              {languageState.texts.Insert.Buttons.Save}
            </Button>
          </form>
        </SitoContainer>
      </Box>
    </Box>
  );
};

Modal.propTypes = {
  visible: PropTypes.bool,
  onClose: PropTypes.func,
  onSubmit: PropTypes.func,
  item: PropTypes.object,
  types: PropTypes.arrayOf(PropTypes.string),
};

export default Modal;
