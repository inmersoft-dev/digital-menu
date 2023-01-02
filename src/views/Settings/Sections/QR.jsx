/* eslint-disable react-hooks/exhaustive-deps */
import { QRCode } from "react-qrcode-logo";
import { useState, useEffect } from "react";

// sito components
import { useNotification } from "sito-mui-notification";

// @mui/material
import {
  Box,
  Switch,
  Button,
  Typography,
  FormControlLabel,
} from "@mui/material";

// @mui/icons-material
import DownloadIcon from "@mui/icons-material/Download";

// components
import Error from "../../../components/Error/Error";
import Loading from "../../../components/Loading/Loading";

// contexts
import { useLanguage } from "../../../context/LanguageProvider";
import { useSettings } from "../../../context/SettingsProvider";

// utils
import { getUserName, userLogged } from "../../../utils/auth";
import { spaceToDashes } from "../../../utils/functions";

// services
import { fetchMenu } from "../../../services/menu";

import config from "../../../config";

const QR = () => {
  const { languageState } = useLanguage();
  const { setNotificationState } = useNotification();
  const { settingsState, setSettingsState } = useSettings();

  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showLogoOnQr, setShowLogoOnQr] = useState(true);

  const [menu, setMenu] = useState("");

  const showNotification = (ntype, message) =>
    setNotificationState({
      type: "set",
      ntype,
      message,
    });

  const [preview, setPreview] = useState("");

  const fetch = async () => {
    if (userLogged()) {
      setLoading(true);
      setError(false);
      try {
        const response = await fetchMenu(getUserName(), ["photo", "menu"]);
        const data = await response.data;
        if (data) {
          setMenu(data.menu);
          if (data.photo) setPreview(data.photo.url);
          setSettingsState({
            type: "set-qr",
            menu: data.menu,
            preview: data.photo ? data.photo.url : "",
          });
        }
      } catch (err) {
        console.error(err);
        showNotification("error", String(err));
        setError(true);
      }
      setLoading(false);
    }
  };

  const retry = () => fetch();

  const init = () => {
    setPreview(settingsState.preview);
    setMenu(settingsState.menu);
    setLoading(false);
  };

  useEffect(() => {
    if (!settingsState.preview || !settingsState.menu) retry();
    else init();
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

  return (
    <Box>
      <Loading
        visible={loading}
        sx={{
          zIndex: loading ? 99 : -1,
        }}
      />
      {/* Qr */}
      {!error ? (
        <>
          <Box
            sx={{
              display: "flex",
              flexDirection: { md: "row", xs: "column" },
              alignItems: "center",
              justifyContent: "space-between",
              marginTop: "20px",
            }}
          >
            <Typography
              variant="h3"
              sx={{ fontWeight: "bold", fontSize: "1.5rem" }}
            >
              {languageState.texts.Settings.Qr}
            </Typography>
            <FormControlLabel
              control={
                <Switch
                  checked={showLogoOnQr}
                  onChange={(e) => setShowLogoOnQr(e.target.checked)}
                />
              }
              label={languageState.texts.Settings.ShowLogoOnQr}
            />
          </Box>
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
              value={`${config.url}menu/${spaceToDashes(menu)}?visited=qr`} // here you should keep the link/value(string) for which you are generation promocode
              size={256} // the dimension of the QR code (number)
              logoImage={showLogoOnQr ? preview : ""} // URL of the logo you want to use, make sure it is a dynamic url
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
          </Box>{" "}
        </>
      ) : (
        <Error onRetry={retry} />
      )}
    </Box>
  );
};

export default QR;
