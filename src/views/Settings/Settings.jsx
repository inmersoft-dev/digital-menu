import { useState, useEffect, useCallback } from "react";
import { useForm, Controller } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { QRCode } from "react-qrcode-logo";

// imagekitio-react
import { IKContext, IKUpload } from "imagekitio-react";

// sito components
import SitoContainer from "sito-container";
import SitoImage from "sito-image";

// own components
import Error from "../../components/Error/Error";
import Loading from "../../components/Loading/Loading";
import BackButton from "../../components/BackButton/BackButton";
import ToLogout from "../../components/ToLogout/ToLogout";
import RegisterNewUser from "../../components/RegisterNewUser/RegisterNewUser";

// @emotion
import { css } from "@emotion/css";

// @mui icons
import DownloadIcon from "@mui/icons-material/Download";

// @mui components
import {
  useTheme,
  Paper,
  Box,
  Button,
  TextField,
  Typography,
  Autocomplete,
} from "@mui/material";

// contexts
import { useLanguage } from "../../context/LanguageProvider";
import { useNotification } from "../../context/NotificationProvider";

// utils
import { userLogged, getUserName, isAdmin } from "../../utils/auth";
import { spaceToDashes } from "../../utils/functions";

// services
import { saveProfile } from "../../services/profile";
import { fetchMenu } from "../../services/menu.js";
import { removeImage } from "../../services/photo";

// images
import noProduct from "../../assets/images/no-product.webp";

import config from "../../config";

const { imagekitUrl, imagekitPublicKey, imagekitAuthUrl } = config;

const Settings = () => {
  const theme = useTheme();
  const navigate = useNavigate();

  const { languageState } = useLanguage();
  const { setNotificationState } = useNotification();

  const [oldName, setOldName] = useState("");
  const [menuNameError, setMenuNameError] = useState(false);

  const [loadingPhoto, setLoadingPhoto] = useState(false);

  const [showLogoOnQr, setShowLogoOnQr] = useState(true);

  const showNotification = (ntype, message) =>
    setNotificationState({
      type: "set",
      ntype,
      message,
    });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [photo, setPhoto] = useState("");
  const [preview, setPreview] = useState("");

  const [types, setTypes] = useState([]);
  const handleTypes = (event, newValue) => setTypes(newValue);

  const { control, handleSubmit, reset, getValues } = useForm({
    defaultValues: {
      menu: "",
      description: "",
    },
  });

  const uploadPhoto = useCallback((e) => {
    const file = document.getElementById("menu-photo");
    if (file !== null) file.click();
  }, []);

  const fetch = async () => {
    setLoading(true);
    setError(false);
    try {
      const response = await fetchMenu(getUserName());
      const data = await response.data;
      if (data) {
        if (data.ph) {
          setPhoto(data.ph);
          setPreview(data.ph.url);
        }
        if (data.types) setTypes(data.types);
        setOldName(data.m);
        reset({ menu: data.m, description: data.d });
      }
    } catch (err) {
      console.error(err);
      showNotification("error", err);
      setError(true);
    }
    setLoading(false);
  };

  const retry = () => fetch();

  const [ok, setOk] = useState(1);

  const validate = () => setOk(true);

  const invalidate = (e) => {
    e.preventDefault();
    if (ok) {
      const { id } = e.target;
      e.target.focus();
      setOk(false);
      switch (id) {
        default:
          setMenuNameError(true);
          return showNotification(
            "error",
            languageState.texts.Errors.NameRequired
          );
      }
    }
  };

  const onSubmit = async (data) => {
    setMenuNameError(false);
    setLoading(true);
    const { menu, description } = data;
    try {
      const response = await saveProfile(
        getUserName(),
        oldName,
        menu,
        description || "",
        photo || "",
        types || []
      );
      if (response.status === 200) {
        showNotification(
          "success",
          languageState.texts.Messages.SaveSuccessful
        );
        setLoading(false);
        return true;
      } else {
        const { error } = response.data;
        if (error.indexOf("menu") > -1) {
          setMenuNameError(true);
          document.getElementById("menu").focus();
          showNotification("error", languageState.texts.Errors.MenuNameTaken);
        } else showNotification("error", languageState.texts.Errors.SomeWrong);
      }
    } catch (err) {
      console.log(err);
      showNotification("error", languageState.texts.Errors.SomeWrong);
    }
    setLoading(false);
    return false;
  };

  useEffect(() => {
    const image = document.getElementById("no-image");
    if (image !== null) {
      image.onclick = uploadPhoto;
    }
    return () => {
      if (image !== null) {
        image.onclick = undefined;
      }
    };
  }, [uploadPhoto, loading, loadingPhoto]);

  useEffect(() => {
    if (!userLogged()) navigate("/");
    const textarea = document.getElementById("description");
    if (textarea !== null) textarea.setAttribute("maxlength", 255);
    retry();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onQrDownload = () => {
    const canvas = document.getElementById("QRCode");
    if (canvas) {
      const pngUrl = canvas
        .toDataURL("image/png")
        .replace("image/png", "image/octet-stream");
      let downloadLink = document.createElement("a");
      downloadLink.href = pngUrl;
      downloadLink.download = `your_name.png`;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
    }
  };

  const onLoading = () => setLoadingPhoto(true);

  const onSuccess = async (res) => {
    const { url, fileId } = res;
    if (photo) await removeImage(photo.fileId);
    setPhoto({ fileId, url });
    setPreview(url);
    setLoadingPhoto(false);
  };

  const onError = (e) => {
    showNotification("error", languageState.texts.Errors.SomeWrong);
    setLoadingPhoto(false);
  };

  const goToEdit = async () => {
    if (getValues("menu") && getValues("menu").length) {
      const value = await onSubmit({
        menu: getValues("menu"),
        description: getValues("description"),
      });
      if (value) navigate("/menu/edit/");
    } else {
      setMenuNameError(true);
      if (document.getElementById("menu"))
        document.getElementById("menu").focus();
      return showNotification("error", languageState.texts.Errors.NameRequired);
    }
  };

  return (
    <Box
      sx={{
        minWidth: "100vw",
        minHeight: "100vh",
        padding: "50px 0 70px 0",
        display: "flex",
        justifyContent: "center",
      }}
    >
      <ToLogout />
      {isAdmin() && <RegisterNewUser />}
      <BackButton to="/menu/edit" />
      <Paper
        sx={{
          display: "flex",
          width: { md: "800px", sm: "630px", xs: "100%" },
          padding: "1rem",
          borderRadius: "1rem",
        }}
      >
        {!error ? (
          <form
            onSubmit={handleSubmit(onSubmit)}
            className={css({ width: "100%" })}
          >
            <Loading
              visible={loading}
              sx={{
                zIndex: loading ? 99 : -1,
              }}
            />
            <Typography variant="h3">
              {languageState.texts.Settings.Title}
            </Typography>
            <SitoContainer
              sx={{ width: "100%", marginTop: "10px", flexWrap: "wrap" }}
              justifyContent="center"
              alignItems="center"
            >
              <Box
                sx={{
                  width: { md: "160px", sm: "120px", xs: "80px" },
                  height: { md: "160px", sm: "120px", xs: "80px" },
                  borderRadius: "100%",
                }}
              >
                {!loading && (
                  <IKContext
                    publicKey={imagekitPublicKey}
                    urlEndpoint={imagekitUrl}
                    authenticationEndpoint={imagekitAuthUrl}
                    transformationPosition="path"
                  >
                    <IKUpload
                      id="menu-photo"
                      fileName={`${getUserName()}`}
                      onChange={onLoading}
                      onError={onError}
                      onSuccess={onSuccess}
                    />
                    {loadingPhoto ? (
                      <Loading
                        visible={loadingPhoto}
                        sx={{
                          position: "relative",
                          backdropFilter: "none",
                          borderRadius: "1rem",
                          boxShadow: "1px 1px 15px -4px",
                          background: theme.palette.background.default,
                        }}
                      />
                    ) : (
                      <SitoImage
                        id="no-image"
                        src={preview && preview !== "" ? preview : noProduct}
                        alt="user"
                        sx={{
                          width: "100%",
                          height: "100%",
                          borderRadius: "1rem",
                          cursor: "pointer",
                          objectFit: "cover",
                        }}
                      />
                    )}
                  </IKContext>
                )}
              </Box>
              <Typography sx={{ marginLeft: "20px", maxWidth: "200px" }}>
                {languageState.texts.Settings.ImageSuggestion}
              </Typography>
            </SitoContainer>
            <SitoContainer sx={{ marginTop: "10px" }}>
              <Controller
                name="menu"
                control={control}
                render={({ field }) => (
                  <TextField
                    color={menuNameError ? "error" : "primary"}
                    sx={{ width: "100%", marginTop: "20px" }}
                    id="menu"
                    required
                    onInput={validate}
                    onInvalid={invalidate}
                    label={languageState.texts.Settings.Inputs.Menu.Label}
                    placeholder={
                      languageState.texts.Settings.Inputs.Menu.Placeholder
                    }
                    variant="outlined"
                    {...field}
                  />
                )}
              />
            </SitoContainer>
            <SitoContainer sx={{ width: "100%" }}>
              <Autocomplete
                sx={{ marginTop: "20px", width: "100%" }}
                multiple
                id="places"
                onChange={handleTypes}
                options={languageState.texts.Settings.Inputs.CenterTypes.Types}
                getOptionLabel={(option) => option.name}
                defaultValue={[]}
                filterSelectedOptions
                value={types || []}
                ChipProps={{ color: "primary" }}
                renderInput={(params) => (
                  <TextField
                    color="primary"
                    {...params}
                    label={
                      languageState.texts.Settings.Inputs.CenterTypes.Label
                    }
                    placeholder={
                      languageState.texts.Settings.Inputs.CenterTypes
                        .Placeholder
                    }
                  />
                )}
              />
            </SitoContainer>
            <SitoContainer sx={{ marginTop: "10px" }}>
              <Controller
                name="description"
                control={control}
                render={({ field }) => (
                  <TextField
                    sx={{ width: "100%", marginTop: "20px" }}
                    id="description"
                    label={
                      languageState.texts.Settings.Inputs.Description.Label
                    }
                    placeholder={
                      languageState.texts.Settings.Inputs.Description
                        .Placeholder
                    }
                    multiline
                    maxLength="255"
                    maxRows={3}
                    minRows={3}
                    variant="outlined"
                    {...field}
                  />
                )}
              />
            </SitoContainer>
            <SitoContainer
              justifyContent="flex-end"
              sx={{ width: "100%", marginTop: "20px" }}
            >
              <Button
                type="submit"
                variant="contained"
                sx={{ marginRight: "10px" }}
              >
                {languageState.texts.Insert.Buttons.Save}
              </Button>
              <Button type="button" variant="outlined" onClick={goToEdit}>
                {languageState.texts.Insert.Buttons.Edit}
              </Button>
            </SitoContainer>
            <Typography variant="h4" sx={{ marginTop: "20px" }}>
              {languageState.texts.Settings.Qr}
            </Typography>
            <Box
              sx={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                flexDirection: "column",
                marginTop: "20px",
              }}
            >
              <QRCode
                value={`${config.url}menu/${spaceToDashes(getValues("menu"))}`} // here you should keep the link/value(string) for which you are generation promocode
                size={256} // the dimension of the QR code (number)
                logoImage={preview} // URL of the logo you want to use, make sure it is a dynamic url
                logoHeight={60}
                logoWidth={60}
                logoOpacity={1}
                enableCORS={true} // enabling CORS, this is the thing that will bypass that DOM check
                id="QRCode"
              />
              <Button
                onClick={onQrDownload}
                variant="contained"
                sx={{
                  minWidth: 0,
                  marginTop: "20px",
                  padding: "10px",
                  borderRadius: "100%",
                }}
              >
                <DownloadIcon />
              </Button>
            </Box>
          </form>
        ) : (
          <Error onRetry={retry} />
        )}
      </Paper>
    </Box>
  );
};

export default Settings;
