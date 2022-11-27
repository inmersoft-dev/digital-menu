/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect, useCallback } from "react";
import { useForm, Controller } from "react-hook-form";

import PropTypes from "prop-types";

// imagekitio-react
import { IKContext, IKUpload } from "imagekitio-react";

// sito components
import SitoContainer from "sito-container";
import SitoImage from "sito-image";

// own components
import Loading from "../Loading/Loading";

// @mui icons
import CloseIcon from "@mui/icons-material/Close";

// @mui components
import {
  useTheme,
  Box,
  Button,
  IconButton,
  TextField,
  Autocomplete,
  createFilterOptions,
} from "@mui/material";

// image
import noProduct from "../../assets/images/no-product.webp";

// contexts
import { useNotification } from "../../context/NotificationProvider";
import { useLanguage } from "../../context/LanguageProvider";

// styles
import {
  modal,
  modalContent,
  productImage,
  productImageBox,
  loadingPhotoSpinner,
} from "../../assets/styles/styles";

// services
import { removeImage } from "../../services/photo";

import config from "../../config";

const { imagekitUrl, imagekitPublicKey, imagekitAuthUrl } = config;

const filter = createFilterOptions();

const Modal = (props) => {
  const theme = useTheme();
  const { languageState } = useLanguage();
  const { setNotificationState } = useNotification();

  const { visible, onClose, onSubmit, item, types } = props;

  const [loadingPhoto, setLoadingPhoto] = useState(true);
  const [show, setShow] = useState(visible);

  const [ok, setOk] = useState(1);

  const [type, setType] = useState(null);
  const [photo, setPhoto] = useState("");
  const [preview, setPreview] = useState("");
  const { control, handleSubmit, reset, getValues, setValue } = useForm({
    defaultValues: {
      id: "",
      price: "",
      name: "",
      description: "",
    },
  });

  useEffect(() => {
    const textarea = document.getElementById("description");
    if (textarea !== null) textarea.setAttribute("maxlength", 255);
    const { id, name, price, description, photo, type } = item;
    setType({ name: type });
    if (photo) setPreview(photo.url);
    else setPreview(noProduct);
    setPhoto(photo);
    setLoadingPhoto(false);
    reset({
      id,
      name,
      price,
      description,
      type,
      photo,
    });
  }, [item]);

  useEffect(() => {
    setShow(visible);
  }, [visible]);

  const onShowOff = () => {
    onClose();
    setShow(false);
  };

  const validate = () => setOk(true);

  const showNotification = (ntype, message) =>
    setNotificationState({
      type: "set",
      ntype,
      message,
    });

  const invalidate = (e) => {
    e.preventDefault();
    if (ok) {
      const { id } = e.target;
      e.target.focus();
      setOk(false);
      let message = "";
      switch (id) {
        case "types":
          message = languageState.texts.Errors.TypeRequired;
          break;
        case "description":
          message = languageState.texts.Errors.DescriptionRequired;
          break;
        case "price":
          message = languageState.texts.Errors.PriceRequired;
          break;
        default:
          message = languageState.texts.Errors.NameRequired;
          break;
      }
      return showNotification("error", message);
    }
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
  }, [uploadPhoto, loadingPhoto]);

  const onLoading = () => setLoadingPhoto(true);

  const onSuccess = async (res) => {
    const { url, fileId } = res;
    if (photo) await removeImage(photo.fileId);
    setPhoto({ fileId, url });
    setValue("photo", { fileId, url });
    setPreview(url);
    setLoadingPhoto(false);
  };

  const onError = (e) => {
    console.error(e);
    showNotification("error", languageState.texts.Errors.SomeWrong);
    setLoadingPhoto(false);
  };

  const onLocalSubmit = (d) => {
    const { id, name, description, price } = d;
    onSubmit(id, name, type.name, description, price, photo);
  };

  useEffect(() => {
    if (!ok)
      setTimeout(() => {
        setOk(true);
      }, 100);
  }, [ok]);

  return (
    <Box
      sx={{
        ...modal,
        zIndex: show ? 20 : -1,
        opacity: show ? 1 : -1,
      }}
    >
      <Box
        sx={{
          ...modalContent,
          background: theme.palette.background.paper,
          opacity: show ? 1 : -1,
        }}
      >
        <SitoContainer
          sx={{ width: "96%", position: "absolute", marginTop: "-10px" }}
          justifyContent="flex-end"
          alignItems="center"
        >
          <IconButton color="error" disabled={loadingPhoto} onClick={onShowOff}>
            <CloseIcon />
          </IconButton>
        </SitoContainer>
        <SitoContainer
          sx={{ width: "100%" }}
          alignItems="center"
          justifyContent="center"
        >
          <Box sx={productImageBox}>
            <IKContext
              publicKey={imagekitPublicKey}
              urlEndpoint={imagekitUrl}
              authenticationEndpoint={imagekitAuthUrl}
              transformationPosition="path"
            >
              <IKUpload
                id="product-photo"
                fileName={getValues("id")}
                onChange={onLoading}
                onError={onError}
                onSuccess={onSuccess}
              />
              {loadingPhoto ? (
                <Loading
                  visible={loadingPhoto}
                  sx={{
                    ...loadingPhotoSpinner,
                    background: theme.palette.background.default,
                  }}
                />
              ) : (
                <SitoImage
                  id="no-product"
                  src={preview && preview !== "" ? preview : noProduct}
                  alt={getValues("name")}
                  sx={{ ...productImage, cursor: "pointer" }}
                />
              )}
            </IKContext>
          </Box>
        </SitoContainer>

        <SitoContainer
          flexDirection="column"
          alignItems="center"
          sx={{ width: "100%" }}
        >
          <form onSubmit={handleSubmit(onLocalSubmit)}>
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
                  inputProps={{ min: 0 }}
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
            <Autocomplete
              value={type}
              onChange={(event, newValue) => {
                if (typeof newValue === "string") {
                  setType({
                    name: newValue,
                  });
                } else if (newValue && newValue.inputValue) {
                  // Create a new value from the user input
                  setType({
                    name: newValue.inputValue,
                  });
                } else {
                  setType(newValue);
                }
              }}
              filterOptions={(options, params) => {
                const filtered = filter(options, params);

                const { inputValue } = params;
                // Suggest the creation of a new value
                const isExisting = options.some(
                  (option) => inputValue === option.name
                );
                if (inputValue !== "" && !isExisting) {
                  filtered.push({
                    inputValue,
                    name: `${languageState.texts.Insert.Inputs.Type.Add} "${inputValue}"`,
                  });
                }

                return filtered;
              }}
              selectOnFocus
              clearOnBlur
              handleHomeEndKeys
              id="types"
              options={types}
              getOptionLabel={(option) => {
                // Value selected with enter, right from the input
                if (typeof option === "string") {
                  return option;
                }
                // Add "xxx" option created dynamically
                if (option.inputValue) {
                  return option.inputValue;
                }
                // Regular option
                return option.name;
              }}
              renderOption={(props, option) => (
                <li {...props}>{option.name}</li>
              )}
              sx={{ width: "100%", marginTop: "10px" }}
              freeSolo
              renderInput={(params) => (
                <TextField
                  {...params}
                  id="type"
                  required
                  onInput={validate}
                  onInvalid={invalidate}
                  label={languageState.texts.Insert.Inputs.Type.Label}
                  placeholder={
                    languageState.texts.Insert.Inputs.Type.Placeholder
                  }
                />
              )}
            />
            <Button
              type="submit"
              variant="contained"
              sx={{ marginTop: "10px" }}
              disabled={loadingPhoto}
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
  types: PropTypes.arrayOf(PropTypes.shape({ name: PropTypes.string })),
};

export default Modal;
