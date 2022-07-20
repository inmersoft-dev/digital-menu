import { useForm, Controller } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

// imagekitio
import { IKContext, IKUpload } from "imagekitio-react";

// sito components
import SitoContainer from "sito-container";
import SitoImage from "sito-image";

// own components
import Loading from "../../components/Loading/Loading";
import BackButton from "../../components/BackButton/BackButton";
import NotConnected from "../../components/NotConnected/NotConnected";

// @mui
import { useTheme, Button, TextField, Typography, Paper } from "@mui/material";

// contexts
import { useLanguage } from "../../context/LanguageProvider";
import { useNotification } from "../../context/NotificationProvider";

// utils
import { userLogged, getUserName } from "../../utils/auth";

// services
import { saveProfile } from "../../services/profile";
import { fetchMenu } from "../../services/menu.js";

import config from "../../config";

const Settings = () => {
  const theme = useTheme();
  const navigate = useNavigate();

  const { languageState } = useLanguage();
  const { setNotificationState } = useNotification();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [photo, setPhoto] = useState("");

  const { control, handleSubmit, reset } = useForm({
    defaultValues: {
      menu: "",
      description: "",
    },
  });

  const onError = (err) => {
    console.log("Error", err);
  };

  const onSuccess = (res) => {
    console.log("Success", res);
  };

  const fetch = async () => {
    setLoading(true);
    setError(false);
    try {
      const response = await fetchMenu(getUserName());
      const data = await response.data;
      if (data) {
        setPhoto(data.ph);
        reset({ menu: data.m, description: data.d });
      }
    } catch (err) {
      console.log(err);
      setNotificationState({
        type: "set",
        ntype: "error",
        message: languageState.texts.Errors.NotConnected,
      });
      setError(true);
    }
    setLoading(false);
  };

  const retry = () => {
    fetch();
  };

  const onSubmit = async (data) => {
    setLoading(true);
    const { menu, description } = data;
    try {
      const response = await saveProfile(getUserName(), menu, description);
    } catch (err) {
      console.log(err);
      setNotificationState({
        type: "set",
        ntype: "error",
        message: languageState.texts.Errors.SomeWrong,
      });
    }
    setLoading(false);
  };

  useEffect(() => {
    if (!userLogged()) navigate("/");
    const textarea = document.getElementById("description");
    if (textarea !== null) textarea.setAttribute("maxlength", 255);
    retry();
  }, []);

  return (
    <Paper
      sx={{
        alignItems: "center",
        display: "flex",
        width: "400px",
        padding: "1rem",
        borderRadius: "1rem",
      }}
    >
      <BackButton />
      {!error ? (
        <form onSubmit={handleSubmit(onSubmit)}>
          <Loading
            visible={loading}
            sx={{
              position: "absolute",
              width: "100%",
              height: "100%",
              top: 0,
              left: 0,
              backdropFilter: "blur(4px)",
              background: `${theme.palette.background.paper}ec`,
              borderRadius: "1rem",
              zIndex: loading ? 99 : -1,
            }}
          />
          <Typography variant="h3">
            {languageState.texts.Settings.Title}
          </Typography>
          <SitoContainer sx={{ width: "100%" }} justifyContent="center">
            <IKContext
              publicKey={config.imagekitPublicKey}
              urlEndpoint={config.imagekitUrl}
              transformationPosition="path"
              authenticationEndpoint={config.imagekitAuthUrl}
            >
              <IKUpload
                id="product-photo"
                fileName="product-photo"
                onError={onError}
                onSuccess={onSuccess}
              />
            </IKContext>
            <SitoImage
              id="no-product"
              src={photo}
              alt="no-product"
              sx={{
                width: "100%",
                cursor: "pointer",
                height: "100%",
                borderRadius: "100%",
              }}
            />
          </SitoContainer>
          <Controller
            name="menu"
            control={control}
            render={({ field }) => (
              <TextField
                sx={{ width: "100%", marginTop: "20px" }}
                id="menu"
                label={languageState.texts.Settings.Inputs.Menu.Label}
                placeholder={
                  languageState.texts.Settings.Inputs.Menu.Placeholder
                }
                variant="outlined"
                {...field}
              />
            )}
          />
          <Controller
            name="description"
            control={control}
            render={({ field }) => (
              <TextField
                sx={{ width: "100%", marginTop: "20px" }}
                id="description"
                label={languageState.texts.Settings.Inputs.Description.Label}
                placeholder={
                  languageState.texts.Settings.Inputs.Description.Placeholder
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
          <SitoContainer
            justifyContent="flex-end"
            sx={{ width: "100%", marginTop: "20px" }}
          >
            <Button type="submit" variant="contained">
              {languageState.texts.Insert.Buttons.Save}
            </Button>
          </SitoContainer>
        </form>
      ) : (
        <NotConnected onRetry={retry} />
      )}
    </Paper>
  );
};

export default Settings;
