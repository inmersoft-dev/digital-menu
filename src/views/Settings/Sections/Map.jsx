/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect, useCallback } from "react";

// @mui components
import { Box } from "@mui/material";

// components
import AMap from "../../../components/Map/Map";
import Error from "../../../components/Error/Error";
import Loading from "../../../components/Loading/Loading";

// services
import { saveLocation } from "../../../services/profile";
import { fetchMenu } from "../../../services/menu.js";

// utils
import { getUserName } from "../../../utils/auth";

// contexts
import { useLanguage } from "../../../context/LanguageProvider";
import { useSettings } from "../../../context/SettingsProvider";
import { useNotification } from "../../../context/NotificationProvider";

const Map = () => {
  const { languageState } = useLanguage();
  const { setNotificationState } = useNotification();
  const { settingsState, setSettingsState } = useSettings();

  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  const showNotification = (ntype, message) =>
    setNotificationState({
      type: "set",
      ntype,
      message,
    });

  const [lng, setLng] = useState(0); // useState(-75.82956791534245);
  const [lat, setLat] = useState(0); //  useState(20.022421136021567);

  const onChangeMap = (which, value) => {
    if (which === "lng") return setLng(value);
    return setLat(value);
  };

  const lngLatSelected = (point, lngLat) => {
    setLng(lngLat.lng);
    setLat(lngLat.lat);
  };

  const saveRLocation = useCallback(async () => {
    try {
      await saveLocation(getUserName(), lng, lat);
      showNotification("success", languageState.texts.Messages.SaveSuccessful);
      setSettingsState({
        type: "set-map",
        location: { latitude: lat, longitude: lng },
      });
    } catch (err) {
      console.error(err);
      showNotification("error", String(err));
    }
    setLoading(false);
  }, [lng, lat]);

  const fetch = async () => {
    setLoading(true);
    setError(false);
    try {
      const response = await fetchMenu(getUserName());
      const data = await response.data;
      console.log(data);
      if (data && data.location) {
        setLng(data.location.longitude);
        setLat(data.location.latitude);
        setSettingsState({
          type: "set-map",
          location: data.location,
        });
      } else {
        setLng(-75.8287579);
        setLat(20.0210691);
        setSettingsState({
          type: "set-map",
          location: data.location,
        });
      }
    } catch (err) {
      setError(true);
      console.error(err);
      showNotification("error", String(err));
    }
    setLoading(false);
  };

  const retry = () => fetch();

  const init = () => {
    setLng(settingsState.location.longitude);
    setLat(settingsState.location.latitude);
    setLoading(false);
  };

  useEffect(() => {
    if (!settingsState.location) retry();
    else init();
  }, []);

  return (
    <Box
      sx={{
        marginTop: "20px",
        position: "relative",
        width: "100%",
        height: "100%",
      }}
    >
      <Loading
        visible={loading}
        sx={{
          position: "absolute",
          borderRadius: 0,
          marginTop: lat !== 0 && lng !== 0 ? "-10px" : 0,
          height: lat !== 0 && lng !== 0 ? "103%" : "100%",
          zIndex: loading ? 99 : -1,
        }}
      />
      {console.log(error, lat, lng)}
      {!error ? (
        <Box sx={{ width: "100%", height: "100%" }}>
          {lat !== 0 && lng !== 0 ? (
            <AMap
              onSave={saveRLocation}
              noButton
              onMapClick={lngLatSelected}
              lat={lat}
              lng={lng}
              point={{ lat, lng }}
              onChange={onChangeMap}
              onChangeLat={(e) =>
                setLat(e && e.target ? Number(e.target.value) : e)
              }
              onChangeLng={(e) =>
                setLng(e && e.target ? Number(e.target.value) : e)
              }
            />
          ) : null}
        </Box>
      ) : (
        <Error onRetry={retry} />
      )}
    </Box>
  );
};

export default Map;
